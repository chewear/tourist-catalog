import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LocationSelection from '../components/tourist/LocationSelection';
import ReservationList from '../components/tourist/ReservationList';
// ...existing code...

const TouristPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="tourist__render flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Tourist Dashboard</h1>
        <Routes>
          <Route path="locations" element={<LocationSelection />} />
          <Route path="reservations" element={<ReservationList />} />
        </Routes>
      </div>
    </div>
  );
};

export default TouristPage;
