import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { auth } from '../../firebase'

const TourGuideSidebar = () => {
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
        <div className="tourguide-sidebar w-56 bg-gray-900 text-white h-full flex flex-col p-6 shadow-lg">
            <div className="logo text-3xl font-extrabold mb-8">
                <img className="w-24 mx-auto" src={logo} alt="Logo" />
            </div>
            <ul className="sidebar-options space-y-2">
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/tour-guide/reservations" className="block w-full h-full">Reservations</Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/tour-guide/bio" className="block w-full h-full">Bio</Link>
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

export default TourGuideSidebar