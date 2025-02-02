import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import Firebase configuration
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import Location from './Location';

const LocationListItems = ({ locations, onEdit }) => {
    return (
        <ul className="space-y-2">
            {locations.map((location) => (
                <li key={location.id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold">{location.name}</h3>
                        <p>{location.description}</p>
                    </div>
                    <button 
                        onClick={() => onEdit(location)} 
                        className="p-2 bg-yellow-500 text-white rounded-lg"
                    >
                        Edit
                    </button>
                </li>
            ))}
        </ul>
    );
};

const LocationList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocationFormVisible, setLocationFormVisible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            const querySnapshot = await getDocs(collection(db, 'locations'));
            const locationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLocations(locationsData);
            setIsLoading(false);
        };

        fetchLocations();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleNewLocation = () => {
        setCurrentLocation(null);
        setLocationFormVisible(true);
    };

    const handleEditLocation = (location) => {
        setCurrentLocation(location);
        setLocationFormVisible(true);
    };

    const handleSaveLocation = async (location) => {
        if (currentLocation) {
            const locationRef = doc(db, 'locations', currentLocation.id);
            await updateDoc(locationRef, location);
            setLocations(locations.map(loc => loc.id === currentLocation.id ? { ...loc, ...location } : loc));
        } else {
            const docRef = await addDoc(collection(db, 'locations'), location);
            setLocations([...locations, { id: docRef.id, ...location }]);
        }
    };

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-4 flex items-center space-x-4">
                <input 
                    type="text" 
                    placeholder="Search locations..." 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    className="p-2 border border-gray-300 rounded-lg flex-grow"
                />
                <button 
                    onClick={handleNewLocation} 
                    className="p-2 bg-blue-500 text-white rounded-lg"
                >
                    New Location
                </button>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <LocationListItems locations={filteredLocations} onEdit={handleEditLocation} />
            )}
            {isLocationFormVisible && (
                <Location 
                    onClose={() => setLocationFormVisible(false)} 
                    onSave={handleSaveLocation} 
                    location={currentLocation}
                />
            )}
        </div>
    );
};

export default LocationList;