import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { supabase } from '../../supabase';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const Location = ({ onClose, onSave, location }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const toast = useRef(null);

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
            if (location.imageUrl) {
                setImageUrl(location.imageUrl);
            }
        }
    }, [location]);
    
    const handleSave = async () => {
        confirmDialog({
            message: 'Do you want to save this location?',
            header: 'Save Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {
                let uploadedImageUrl = imageUrl;
    
                if (image) {
                    const filePath = `locations/${Date.now()}-${image.name}`;
                    const { data, error } = await supabase.storage.from('location_images').upload(filePath, image);
    
                    if (error) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Image upload failed', life: 3000 });
                        return;
                    }
    
                    uploadedImageUrl = supabase.storage.from('location_images').getPublicUrl(filePath).data.publicUrl;
                }
    
                if (!uploadedImageUrl) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No image URL generated', life: 3000 });
                    return;
                }
    
                onSave({
                    name,
                    description,
                    activities: selectedActivities,
                    imageUrl: uploadedImageUrl || ""
                });
    
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Location saved successfully', life: 3000 });
    
                // Adding delay before closing modal
                setTimeout(() => {
                    onClose(); // Close modal after toast message is shown
                }, 3000); // 3000 ms delay (3 seconds)
            },
            reject: () => {
                toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'Save action cancelled', life: 3000 });
            }
        });
    };
    
    

    const handleActivityChange = (activityId) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(id => id !== activityId)
                : [...prev, activityId]
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center px-4 sm:px-8">
            <Toast ref={toast} />
            <div className="bg-white p-6 rounded-2xl shadow-xl w-5/6 h-5/6 max-w-4xl overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">{location ? 'Edit Location' : 'New Location'}</h2>
                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-3 border border-gray-300 rounded-lg w-full min-h-[100px] focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location Image</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="mt-1 p-3 border border-gray-300 rounded-lg w-full cursor-pointer"
                        />
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Location"
                                className="mt-4 w-full h-64 object-center object-cover rounded-lg border border-gray-300"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Activities</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {activities.map(activity => (
                                <label key={activity.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedActivities.includes(activity.id)}
                                        onChange={() => handleActivityChange(activity.id)}
                                        className="form-checkbox text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>{activity.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
};

export default Location;
