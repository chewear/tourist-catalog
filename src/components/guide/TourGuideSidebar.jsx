import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/landingLogo.png'
import { auth } from '../../firebase'
import { FaCalendarAlt, FaUser, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa'; // Import icons from react-icons

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
                <img className="w-48 mx-auto" src={logo} alt="Logo" />
            </div>
            <ul className="sidebar-options space-y-2">
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/tour-guide/reservations" className="flex items-center space-x-3">
                        <FaCalendarAlt className="text-xl" /> {/* Calendar icon */}
                        <span>Reservations</span>
                    </Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/tour-guide/bio" className="flex items-center space-x-3">
                        <FaUser className="text-xl" /> {/* User icon */}
                        <span>Bio</span>
                    </Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/tour-guide/location" className="flex items-center space-x-3">
                        <FaMapMarkerAlt className="text-xl" /> {/* Map marker icon */}
                        <span>Location</span>
                    </Link>
                </li>
                <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
                    <Link to="/tour-guide/user" className="flex items-center space-x-3">
                        <FaCalendarAlt className="text-xl" /> {/* Calendar icon */}
                        <span>Profile</span>
                    </Link>
                </li>
            </ul>
            <button 
                onClick={handleLogout} 
                className="logout-button mt-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2">
                <FaSignOutAlt className="text-xl" /> {/* Logout icon */}
                <span>Logout</span>
            </button>
        </div>
    )
}

export default TourGuideSidebar;
