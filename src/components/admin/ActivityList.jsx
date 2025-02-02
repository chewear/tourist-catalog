import React, { useState, useEffect } from 'react';
import Activity from './Activity';
import { db } from '../../firebase'; // Import Firebase configuration
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

const ActivityListItems = ({ activities, onEdit }) => {
    if (activities.length === 0) {
        return <div>No activities found</div>;
    }
    return (
        <ul className="space-y-2">
            {activities.map((activity) => (
                <li key={activity.id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
                    {activity.name}
                    <button 
                        onClick={() => onEdit(activity)} 
                        className="p-2 bg-yellow-500 text-white rounded-lg"
                    >
                        Edit
                    </button>
                </li>
            ))}
        </ul>
    );
};

const ActivityList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActivityFormVisible, setActivityFormVisible] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);

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
        } else {
            const docRef = await addDoc(collection(db, 'activities'), activity);
            setActivities([...activities, { id: docRef.id, ...activity }]);
        }
    };

    const filteredActivities = activities.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-4 flex items-center space-x-4">
                <input 
                    type="text" 
                    placeholder="Search activities..." 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    className="p-2 border border-gray-300 rounded-lg flex-grow"
                />
                <button 
                    onClick={handleNewActivity} 
                    className="p-2 bg-blue-500 text-white rounded-lg"
                >
                    New Activity
                </button>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <ActivityListItems activities={filteredActivities} onEdit={handleEditActivity} />
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