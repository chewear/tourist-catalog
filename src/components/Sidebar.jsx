import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-700 p-6 shadow-md">
      <img className="w-full border" src="" alt="" />
      <ul className="list-none p-0">
        <li className="mb-4">
          <a href="/home" className="text-white hover:text-blue-500">Home</a>
        </li>
        <li className="mb-4">
          <a href="/packages" className="text-white hover:text-blue-500">Packages</a>
        </li>
        <li className="mb-4">
          <a href="/contact" className="text-white hover:text-blue-500">Contact</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
