import React, { useState, useEffect } from 'react';

const Activity = ({ onClose, onSave, activity }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (activity) {
            setName(activity.name);
            setDescription(activity.description);
        }
    }, [activity]);

    const handleSave = () => {
        onSave({ name, description });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-2xl mb-4">{activity ? 'Edit Activity' : 'New Activity'}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Activity Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Activity Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full max-h-64 min-h-24" 
                    />
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

export default Activity;