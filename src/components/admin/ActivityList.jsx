import React, { useState, useEffect, useRef } from 'react';
import Activity from './Activity';
import { db } from '../../firebase'; // Import Firebase configuration
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const ActivityListItems = ({ activities, onEdit, onDelete }) => {
    if (activities.length === 0) {
        return <div className="text-center text-gray-500">No activities found</div>;
    }
    return (
        <div className="space-y-6">
            {activities.map((activity) => (
                <div key={activity.id} className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row transition-transform transform hover:scale-105">
                    <div className="w-full md:w-1/3">
                        <img 
                            src={activity.imageUrl || 'https://placehold.co/300x200'} 
                            alt={activity.name} 
                            className="w-full h-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                        />
                    </div>
                    <div className="p-6 flex flex-col justify-between w-full md:w-2/3">
                        <h3 className="text-2xl font-semibold text-gray-800">{activity.name}</h3>
                        <p className="min-h-[57px] max-h-[57px] text-gray-700 text-sm mt-1 overflow-y-auto">{activity.description}</p>
                        <div className="mt-4 flex gap-4 justify-start">
                            <button 
                                onClick={() => onEdit(activity)} 
                                className="py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-400 transition duration-200"
                            >
                                <FaEdit className="text-xl" />
                            </button>
                            <button 
                                onClick={() => onDelete(activity.id)} 
                                className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-400 transition duration-200"
                            >
                                <FaTrashAlt className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ActivityList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActivityFormVisible, setActivityFormVisible] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);
    const toast = useRef(null); // Reference for Toast
    const confirmDialogRef = useRef(null); // Reference for ConfirmDialog

    useEffect(() => {
        const fetchActivities = async () => {
            const querySnapshot = await getDocs(collection(db, 'activities'));
            const activitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActivities(activitiesData);
            setIsLoading(false);
        };

        fetchActivities();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleNewActivity = () => {
        setCurrentActivity(null);
        setActivityFormVisible(true);
    };

    const handleEditActivity = (activity) => {
        setCurrentActivity(activity);
        setActivityFormVisible(true);
    };

    const handleSaveActivity = async (activity) => {
        if (currentActivity) {
            const activityRef = doc(db, 'activities', currentActivity.id);
            await updateDoc(activityRef, activity);
            setActivities(activities.map(act => act.id === currentActivity.id ? { ...act, ...activity } : act));
            toast.current.show({ severity: 'success', summary: 'Activity Updated', detail: 'The activity has been updated successfully', life: 3000 });
        } else {
            const docRef = await addDoc(collection(db, 'activities'), activity);
            setActivities([...activities, { id: docRef.id, ...activity }]);
            toast.current.show({ severity: 'success', summary: 'Activity Created', detail: 'The activity has been created successfully', life: 3000 });
        }
        setActivityFormVisible(false);
    };

    const handleDeleteActivity = async (activityId) => {
        confirmDialog({
            message: 'Do you want to delete this activity?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-text',
            accept: async () => {
                await deleteDoc(doc(db, 'activities', activityId));
                setActivities(activities.filter(activity => activity.id !== activityId));
                toast.current.show({ severity: 'success', summary: 'Activity Deleted', detail: 'The activity has been deleted successfully', life: 3000 });
            },
            reject: () => {
                toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'You have cancelled the delete action', life: 3000 });
            }
        });
    };

    const filteredActivities = activities.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-white min-h-screen">
            <Toast ref={toast} />
            <ConfirmDialog ref={confirmDialogRef} />
            <div className="mb-6 flex items-center space-x-6">
                <input 
                    type="text" 
                    placeholder="Search activities..." 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    className="p-3 w-5/6 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-600"
                />
                <button 
                    onClick={handleNewActivity} 
                    className="w-1/6 p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
                >
                    New Activity
                </button>
            </div>
            {isLoading ? (
                <div className="text-xl text-gray-500">Loading...</div>
            ) : (
                <ActivityListItems 
                    activities={filteredActivities} 
                    onEdit={handleEditActivity} 
                    onDelete={handleDeleteActivity} 
                />
            )}
            {isActivityFormVisible && (
                <Activity 
                    onClose={() => setActivityFormVisible(false)} 
                    onSave={handleSaveActivity} 
                    activity={currentActivity}
                />
            )}
        </div>
    );
};

export default ActivityList;
