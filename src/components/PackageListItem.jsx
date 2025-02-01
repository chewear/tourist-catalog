import React from 'react'

const PackageListItem = () => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1 bg-white">
      <img src="https://placehold.co/600x400" alt="Package" className="w-full h-48 object-cover" />
      <div className="px-6 py-4">
        <h5 className="font-bold text-xl mb-2 text-gray-900">Package Title</h5>
        <p className="text-gray-700 text-base mb-4">This is a brief description of the package. It provides an overview of what to expect.</p>
        <div className="flex justify-between items-center">
          <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Learn More</a>
        </div>
      </div>
    </div>
  )
}

export default PackageListItem