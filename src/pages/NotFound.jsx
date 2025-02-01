import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl">Page Not Found</p>
        <Link to="/" className="mt-4 text-indigo-600 hover:underline">Go to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
