import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/landingLogo.png';
import { auth } from '../firebase';
import { FaHome, FaList, FaSignOutAlt } from 'react-icons/fa'; // Import icons from react-icons

const Sidebar = () => {
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
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-6 shadow-lg sticky top-0">
      <div className="logo text-3xl font-extrabold mb-8">
        <img className="w-48 mx-auto" src={logo} alt="Logo" />
      </div>
      <ul className="sidebar-options space-y-4">
        <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
          <Link to="/tourist/booking" className="flex items-center space-x-3">
            <FaHome className="text-xl" /> {/* Home icon */}
            <span>Book a Guide</span>
          </Link>
        </li>
        <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
          <Link to="/tourist/reservations" className="flex items-center space-x-3">
            <FaList className="text-xl" /> {/* List icon */}
            <span>Reservation List</span>
          </Link>
        </li>
        <li className="hover:bg-gray-700 p-3 rounded-lg transition duration-300 ease-in-out cursor-pointer select-none">
          <Link to="/tourist/user" className="flex items-center space-x-3">
            <FaHome className="text-xl" /> {/* Home icon */}
            <span>Profile</span>
          </Link>
        </li>
      </ul>
      <button 
        onClick={handleLogout} 
        className="mt-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-3">
        <FaSignOutAlt className="text-xl" /> {/* Logout icon */}
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;