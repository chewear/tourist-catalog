import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import AdminSidebar from '../components/AdminSidebar';
import UserList from '../components/admin/UserList';
import LocationList from '../components/admin/LocationList';
import ActivityList from '../components/admin/ActivityList';
import AdminReservationList from '../components/admin/AdminReservationList';
import UserPage from '../components/UserPage';

const AdminPage = () => {
    const [profileImage, setProfileImage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setProfileImage(data.profile_link || '');
                    setFirstName(data.firstName || '');  // Fetch first name
                    setLastName(data.lastName || '');    // Fetch last name
                });
            }
        };

        fetchUserData();
    }, [auth, db]);

    return (
        <div className="w-full h-screen flex overflow-hidden">
            <AdminSidebar />
            <div className="admin__render flex-grow p-4 overflow-y-auto">
                <div className="w-full flex justify-between items-center mb-4 px-2">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex flex-col items-end justify-center px-2">
                            <p className="font-extrabold text-blue-900">{firstName} {lastName}</p> {/* Display First and Last Name */}
                            <p className="text-[#0043A8]">Admin</p>
                        </div>
                        <img 
                            className="header__profile-icon w-12 h-12 bg-gray-500 rounded-full" 
                            src={profileImage || "https://avatar.iran.liara.run/public"} 
                            alt="Profile Icon"
                        />
                    </div>
                </div>
                <Routes>
                    <Route path="users" element={<UserList />} />
                    <Route path="locations" element={<LocationList />} />
                    <Route path="activities" element={<ActivityList />} />
                    <Route path="reservations" element={<AdminReservationList />} />
                    <Route path="user" element={<UserPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminPage;
