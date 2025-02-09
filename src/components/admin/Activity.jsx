import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Activity = ({ onClose, onSave, activity }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (activity) {
            setName(activity.name || '');
            setDescription(activity.description || '');
            setImagePreview(activity.imageUrl || '');
        }
    }, [activity]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
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

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-2xl mb-4">{activity ? 'Edit Attractions' : 'New Attractions'}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Attractions Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Attractions Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full max-h-64 min-h-24" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Attractions Image</label>
                    {<img src={imagePreview || 'https://placehold.co/50x50'} alt="Activity Preview" className="mt-2 h-32 w-32 mx-auto rounded-full object-center object-cover" />}
                    <input 
                        type="file" 
                        onChange={handleImageChange} 
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="p-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                    <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded-lg">Save</button>
                </div>
            </div>
        </div>
    );
};

export default Activity;
