import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Location from './Location';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const LocationList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocationFormVisible, setLocationFormVisible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        const fetchLocations = async () => {
            const querySnapshot = await getDocs(collection(db, 'locations'));
            const locationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLocations(locationsData);
            setIsLoading(false);
        };

        fetchLocations();
    }, []);

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
        setLocationFormVisible(false);
    };

    const handleDeleteLocation = async (locationId) => {
        await deleteDoc(doc(db, 'locations', locationId));
        setLocations(locations.filter(location => location.id !== locationId));
        toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Location has been deleted', life: 3000 });
    };

    const confirmDeleteLocation = (locationId) => {
        confirmDialog({
            message: 'Do you want to delete this location?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger custom-accept-button', // Added custom class for the button
            rejectClassName: 'p-button-text custom-reject-button', // Added custom class for reject button
            accept: () => handleDeleteLocation(locationId),
            reject: () => toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'You have cancelled the delete action', life: 3000 })
        });
    };

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-white min-h-screen">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="mb-6 flex items-center space-x-6">
                <input 
                    type="text" 
                    placeholder="Search locations..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="p-3 w-5/6 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-600"
                />
                <button 
                    onClick={handleNewLocation} 
                    className="w-1/6 p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
                >
                    New Location
                </button>
            </div>
            {isLoading ? (
                <div className="text-xl text-gray-500">Loading...</div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLocations.map((location) => (
                        <li key={location.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="relative">
                                {location.imageUrl ? (
                                    <img 
                                        src={location.imageUrl} 
                                        alt={location.name} 
                                        className="w-full h-48 object-cover object-center"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-300 flex justify-center items-center">
                                        <span className="text-white">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-2xl font-semibold text-gray-800">{location.name}</h3>
                                <p className="max-h-[150px] min-h-[150px] text-gray-600 mt-2 overflow-y-auto">{location.description}</p>
                                <div className="mt-4 flex justify-end gap-4">
                                    <button 
                                        onClick={() => handleEditLocation(location)} 
                                        className="bg-yellow-500 text-white p-2 rounded-lg shadow-md hover:bg-yellow-400 transition duration-200"
                                    >
                                        <FaEdit className="text-xl" />
                                    </button>
                                    <button 
                                        onClick={() => confirmDeleteLocation(location.id)} 
                                        className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-400 transition duration-200"
                                    >
                                        <FaTrashAlt className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {isLocationFormVisible && <Location onClose={() => setLocationFormVisible(false)} onSave={handleSaveLocation} location={currentLocation} />}
        </div>
    );
};

export default LocationList;
