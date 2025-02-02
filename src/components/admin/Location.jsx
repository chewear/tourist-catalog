import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import Firebase configuration
import { collection, getDocs } from 'firebase/firestore';

const Location = ({ onClose, onSave, location }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const querySnapshot = await getDocs(collection(db, 'activities'));
            const activitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActivities(activitiesData);
        };

        fetchActivities();
    }, []);

    useEffect(() => {
        if (location) {
            setName(location.name);
            setDescription(location.description);
            setSelectedActivities(location.activities || []);
        }
    }, [location]);

    const handleSave = () => {
        onSave({ name, description, activities: selectedActivities });
        onClose();
    };

    const handleActivityChange = (activityId) => {
        setSelectedActivities(prev => 
            prev.includes(activityId) 
                ? prev.filter(id => id !== activityId) 
                : [...prev, activityId]
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-2xl mb-4">{location ? 'Edit Location' : 'New Location'}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Location Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Location Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full max-h-64 min-h-24" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Activities</label>
                    <div className="mt-1 space-y-2">
                        {activities.map(activity => (
                            <div key={activity.id} className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={selectedActivities.includes(activity.id)} 
                                    onChange={() => handleActivityChange(activity.id)} 
                                    className="mr-2"
                                />
                                <span>{activity.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-gray-500 text-white rounded-lg"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="p-2 bg-blue-500 text-white rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Location;