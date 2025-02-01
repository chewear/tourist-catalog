import React from 'react'
import { FaStar } from 'react-icons/fa'

const PackageDetails = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Package Details</h2>
      <img src="https://placehold.co/600x400" alt="Tour Package" className="w-full h-64 object-cover rounded-lg mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 relative w-full">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">Package Name</h3>
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-500" />
              <span className="text-gray-700">4.5</span>
            </div>
          </div>
          <p className="text-gray-700">Description of the package goes here. It includes all the details about the package.</p>
          <div className="space-y-4 mt-4">
            <h3 className="text-xl font-semibold">What's Included</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Accommodation</li>
              <li>Meals</li>
              <li>Transportation</li>
              <li>Guided Tours</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Tour Guide</h3>
        <p className="text-gray-700">Name: John Doe</p>
        <p className="text-gray-700">Email: johndoe@example.com</p>
        <p className="text-gray-700">Contact Number: (123) 456-7890</p>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Price</h3>
        <p className="text-gray-700">$999 per person</p>
      </div>
      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book Now</button>
    </div>
  )
}

export default PackageDetails