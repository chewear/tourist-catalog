import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/landingLogo.png';
import { auth } from '../firebase';
import { FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa'; // Import icons

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
            console.log('Signed Out');
        }).catch((error) => {
            console.error('Sign Out Error', error);
        });
    };

    return (
        <div className="admin-sidebar w-56 bg-gray-900 text-white h-screen flex flex-col p-6 shadow-lg">
            <div className="logo text-3xl font-extrabold mb-8">
                <img className="w-48 mx-auto" src={logo} alt="Logo" />
            </div>
            <ul className="sidebar-options space-y-2">
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/users" className="flex items-center space-x-2">
                        <FaUsers className="text-xl" />
                        <span>Users</span>
                    </Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/locations" className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-xl" />
                        <span>Locations</span>
                    </Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/activities" className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-xl" />
                        <span>Activities</span>
                    </Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/reservations" className="flex items-center space-x-2">
                        <FaTicketAlt className="text-xl" />
                        <span>Reservations</span>
                    </Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/user" className="flex items-center space-x-2">
                        <FaUsers className="text-xl" />
                        <span>Profile</span>
                    </Link>
                </li>
            </ul>
            <button 
                onClick={handleLogout} 
                className="logout-button mt-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-300 ease-in-out">
                Logout
            </button>
        </div>
    );
};

export default AdminSidebar;