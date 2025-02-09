import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TourGuideSidebar from '../components/guide/TourGuideSidebar'
import TourGuideBio from '../components/guide/TourGuideBio'
import ReservationList from '../components/guide/ReservationList'
import LocationSelection from '../components/guide/LocationSelection'
import UserPage from '../components/UserPage'

const TourGuidePage = () => {
    
    return (
        <div className="w-full h-screen flex overflow-hidden">
            <TourGuideSidebar />
            <div className="tourguide__render flex-grow p-4 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Tour Guide Dashboard</h1>
                <Routes>
                    <Route path="reservations" element={<ReservationList />} />
                    <Route path="bio" element={<TourGuideBio />} />
                    <Route path="location" element={<LocationSelection />} />
                    <Route path="user" element={<UserPage />} />
                </Routes>
            </div>
        </div>
    )
}

export default TourGuidePage