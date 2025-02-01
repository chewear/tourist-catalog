import React from 'react';
import PackageListItem from '../components/PackageListItem';
// ...existing code...

const PackageList = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Packages</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <PackageListItem />
        <PackageListItem />
        <PackageListItem />
        {/* Add more PackageListItem components as needed */}
      </div>
    </div>
  );
};

export default PackageList;
