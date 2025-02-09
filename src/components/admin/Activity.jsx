import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { db } from '../../firebase'; // Assuming you have a firebase.js file for Firebase configuration
import { doc, setDoc } from 'firebase/firestore';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const Activity = ({ onClose, onSave, activity }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        if (activity) {
            console.log("Activity data:", activity);
            setName(activity.name);
            setDescription(activity.description);
            setImagePreview(activity.imageUrl || 'https://placehold.co/50x50');
        }
    }, [activity]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async (file) => {
        if (!file) return '';

        const filePath = `activities/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
            .from('activity_images')
            .upload(filePath, file);

        if (error) {
            console.error("Image upload failed:", error.message);
            return '';
        }

        return supabase.storage.from('activity_images').getPublicUrl(filePath).data.publicUrl;
    };

    const handleSave = async () => {
        confirmDialog({
            message: 'Do you want to save this activity?',
            header: 'Save Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {
                let imageUrl = imagePreview;

                if (image) {
                    imageUrl = await uploadImage(image);
                }

                if (!imageUrl) {
                    console.warn("No image URL available, setting to an empty string.");
                }

                const activityData = {
                    name,
                    description,
                    imageUrl: imageUrl || ''
                };

                onSave(activityData);

                if (activity) {
                    await setDoc(doc(db, 'activities', activity.id), 
                        { imageUrl: imageUrl || '' }, 
                        { merge: true }
                    );
                }

                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Activity saved successfully', life: 3000 });

                // Close after the action
                setTimeout(() => {
                    onClose();
                }, 3000); // 3 seconds delay
            },
            reject: () => {
                toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'Save action cancelled', life: 3000 });
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center px-4 sm:px-8">
            <Toast ref={toast} />
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full sm:w-96 max-w-md overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">{activity ? 'Edit Activity' : 'New Activity'}</h2>
                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Activity Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Activity Description</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="mt-1 p-3 border border-gray-300 rounded-lg w-full min-h-[100px] focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Activity Image</label>
                        {imagePreview && (
                            <img 
                                src={imagePreview || 'https://placehold.co/50x50'} 
                                alt="Activity Preview" 
                                className="mt-2 w-full h-32 object-center object-cover rounded-lg mx-auto border border-gray-300"
                            />
                        )}
                        <input 
                            type="file" 
                            onChange={handleImageChange} 
                            className="mt-1 p-3 border border-gray-300 rounded-lg w-full cursor-pointer"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Activity;
