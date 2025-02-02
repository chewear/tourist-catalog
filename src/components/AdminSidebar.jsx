import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { auth } from '../firebase'

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
        <div className="admin-sidebar w-56 bg-gray-900 text-white h-full flex flex-col p-6 shadow-lg">
            <div className="logo text-3xl font-extrabold mb-8">
                <img className="w-24 mx-auto" src={logo} alt="Logo" />
            </div>
            <ul className="sidebar-options space-y-2">
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/users" className="block w-full h-full">Users</Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/locations" className="block w-full h-full">Locations</Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/activities" className="block w-full h-full">Activities</Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/admin/reservations" className="block w-full h-full">Reservations</Link>
                </li>
            </ul>
            <button 
                onClick={handleLogout} 
                className="logout-button mt-auto bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition duration-300 ease-in-out">
                Logout
            </button>
        </div>
    )
}

export default AdminSidebar