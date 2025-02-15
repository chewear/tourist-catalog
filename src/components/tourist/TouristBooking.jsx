import React, { useState, useEffect, useRef } from 'react';
import { auth, db, createReservation } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const TouristBooking = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [guides, setGuides] = useState([]);
    const [date, setDate] = useState('');
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [locationImage, setLocationImage] = useState("");
    const [tourOption, setTourOption] = useState(''); // New state for tour option
    const toast = useRef(null);  // Reference for Toast

    useEffect(() => {
        const fetchLocations = async () => {
            const querySnapshot = await getDocs(collection(db, "locations"));
            setLocations(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        const fetchLocationDetails = async () => {
            if (!selectedLocation) return;

            const locationRef = doc(db, "locations", selectedLocation);
            const locationSnap = await getDoc(locationRef);

            if (locationSnap.exists()) {
                const locationData = locationSnap.data();
                setLocationImage(locationData.imageUrl || "");
                fetchActivities(locationData.activities || []);
            }
        };

        fetchLocationDetails();
    }, [selectedLocation]);

    const fetchActivities = async (activitiesArray) => {
        if (!activitiesArray.length) {
            setActivities([]);
            return;
        }

        const activitiesQuery = query(collection(db, "activities"), where("__name__", "in", activitiesArray));
        const querySnapshot = await getDocs(activitiesQuery);

        const filteredActivities = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        setActivities(filteredActivities);
    };

    useEffect(() => {
        if (!selectedLocation) return;

        setGuides([]);

        const fetchGuides = async () => {
            const guideLocationSnapshot = await getDocs(
                query(collection(db, "guide_location"), where("selectedLocations", "array-contains", selectedLocation))
            );

            const userUids = guideLocationSnapshot.docs.map(doc => doc.data().userId);

            if (userUids.length > 0) {
                const guidesSnapshot = await getDocs(
                    query(collection(db, "users"), where("uid", "in", userUids))
                );

                const guidesData = guidesSnapshot.docs.map(doc => {
                    const guideData = doc.data();
                    return {
                        id: doc.id,
                        firstName: guideData.firstName || "---",
                        lastName: guideData.lastName || "---",
                        fullName: guideData.fullName || `${guideData.firstName || "---"} ${guideData.lastName || "---"}`,
                        email: guideData.email || "---",
                        contactNumber: guideData.contactNumber || "---",
                        bio: guideData.bio || "---",
                        age: guideData.age || "---",
                        gender: guideData.gender || "---",
                        nationality: guideData.nationality || "---",
                        occupation: guideData.occupation || "---",
                        rate: guideData.rate || "---",
                        guideType: guideData.guideType || "---",
                        role: guideData.role || "---",
                        status: guideData.status || "---",
                        profile_link: guideData.profile_link,
                    };
                });

                setGuides(guidesData);
            }
        };
        fetchGuides();
    }, [selectedLocation]);

    const handleReservation = () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert("You must be logged in to make a reservation.");
            return;
        }

        if (!selectedGuide || !selectedLocation || selectedActivities.length === 0 || !date || !tourOption) {
            alert("Please select a location, activities, date, guide, and tour option.");
            return;
        }

        // Show confirmation dialog before proceeding with the reservation
        confirmDialog({
            message: 'Are you sure you want to make this reservation?',
            header: 'Confirm Reservation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    const usersRef = collection(db, "users");
                    const userQuery = query(usersRef, where("uid", "==", currentUser.uid));
                    const userSnapshot = await getDocs(userQuery);

                    if (userSnapshot.empty) {
                        alert("User not found in the database.");
                        return;
                    }

                    const userDocId = userSnapshot.docs[0].id;

                    await createReservation(
                        userDocId,
                        selectedLocation,
                        selectedActivities,
                        date,
                        selectedGuide,
                        tourOption // Include tour option in reservation
                    );

                    // Show success toast
                    toast.current.show({
                        severity: 'success',
                        summary: 'Reservation Successful',
                        detail: 'Your reservation has been made!',
                        life: 3000
                    });

                    // Reset the form
                    setSelectedLocation('');
                    setSelectedActivities([]);
                    setDate('');
                    setSelectedGuide(null);
                    setLocationImage('');
                    setActivities([]);
                    setGuides([]);
                    setTourOption('');
                } catch (error) {
                    console.error("Error creating reservation:", error);
                    alert("Something went wrong. Please try again.");
                }
            },
            reject: () => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Reservation Cancelled',
                    detail: 'You cancelled the reservation.',
                    life: 3000
                });
            }
        });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#0043A8' }}>Tourist Booking</h1>

            {/* Location Selection */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block" style={{ color: '#009E49' }}>Select Location:</label>
                    <select onChange={(e) => setSelectedLocation(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1">
                        <option value="">Select</option>
                        {console.log(locations)}
                        {locations.map(location => (
                            <option key={location.id} value={location.id}>{location.name}</option>
                        ))}
                    </select>
                </div>

                {locationImage && (
                    <div className="mt-4">
                        <img src={locationImage} alt="Location" className="w-full h-64 object-cover rounded-lg" />
                        {selectedLocation && (
                            <div className="my-4">
                                <p>{locations.find(location => location.id === selectedLocation)?.description}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Attractions Selection */}
            {selectedLocation && activities.length > 0 && (
                <div className="mt-4">
                    <label className="block" style={{ color: '#ED1C24' }}>Select Attractions (up to 3):</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {console.log(activities)}
                        {activities.map(activity => (
                            <div key={activity.id} className="flex flex-col items-center">
                                <input
                                    type="checkbox"
                                    value={activity.id}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedActivities(prev =>
                                            prev.includes(value)
                                                ? prev.filter(id => id !== value)
                                                : prev.length < 3
                                                    ? [...prev, value]
                                                    : prev
                                        );
                                    }}
                                    checked={selectedActivities.includes(activity.id)}
                                    className="mb-2"
                                    disabled={!selectedActivities.includes(activity.id) && selectedActivities.length >= 3}
                                />
                                <img src={activity.imageUrl || 'https://placehold.co/150x150'} alt={activity.name} className="h-24 w-24 rounded-lg mb-2 object-center object-cover" />
                                <p className="text-center text-sm font-bold">{activity.name}</p>
                                <p className="text-center text-xs">{activity.description}</p> {/* Render activity description */}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Date and Guide Selection */}
            {selectedLocation && (
                <div className="mt-4">
                    <label className="block text-gray-700">Select Date:</label>
                    <input type="date" onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
                </div>
            )}

            {selectedLocation && (
                <div className="mt-4">
                    <label className="block text-gray-700">Select Tour Guide Option:</label>
                    <select
                        value={tourOption}
                        onChange={(e) => setTourOption(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    >
                        <option value="">Select</option>
                        <option value="Tour Guide Only">Tour Guide Only</option>
                        <option value="Tour Guide and Translator">Tour Guide + Translator</option>
                        <option value="Tour Guide + Transportation">Tour Guide + Transportation</option>
                        <option value="Tour Guide + Transportation + Translator">Tour Guide + Transportation + Translator</option>
                    </select>
                </div>
            )}

            {selectedLocation && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#FFD200' }}>Available Guides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {guides.map(guide => (
                            <div key={guide.id} className="p-4 border border-gray-300 rounded hover:bg-gray-100">
                                {console.log(guides)}
                                <input
                                    type="radio"
                                    id={guide.id}
                                    name="guide"
                                    value={guide.id}
                                    checked={selectedGuide === guide.id}
                                    onChange={() => setSelectedGuide(guide.id)}
                                    className="mr-2"
                                />
                                <label htmlFor={guide.id} className="block">
                                    <div className="flex flex-col items-start">
                                        <div className="flex mb-3">
                                            <img src={guide.profile_link || "https://avatar.iran.liara.run/public"} className="w-20 h-20 rounded-full mr-4 object-center object-cover" alt="" />
                                            <div>
                                                <h3 className="font-semibold" style={{ color: '#0043A8' }}>{guide.fullName}</h3>
                                                <p className="text-sm"><strong>Rate:</strong> {guide.rate}</p>
                                                <p className="text-sm"><strong>Status:</strong> {guide.status}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <p><strong>Age:</strong> {guide.age}</p>
                                            <p><strong>Gender:</strong> {guide.gender}</p>
                                            <p><strong>Nationality:</strong> {guide.nationality}</p>
                                            <p><strong>Occupation:</strong> {guide.occupation}</p>
                                            <p><strong>Bio:</strong> {guide.bio}</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reservation Button */}
            <button onClick={handleReservation} className="mt-6 p-2 w-full bg-blue-500 text-white rounded-md">
                Confirm Reservation
            </button>
        </div>
    );
};

export default TouristBooking;
