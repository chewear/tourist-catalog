import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" name="email" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input type="password" name="password" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <input type="password" name="confirmPassword" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign Up</button>
        </form>
        <div className="flex justify-center mt-4">
          <Link to="/login" className="text-sm text-indigo-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
