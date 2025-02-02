import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import UserList from '../components/admin/UserList'
import LocationList from '../components/admin/LocationList'
import ActivityList from '../components/admin/ActivityList'

const AdminPage = () => {
    return (
        <div className="w-full h-screen flex">
            <AdminSidebar />
            <div className="admin__render flex-grow p-4">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <Routes>
                    <Route path="users" element={<UserList />} />
                    <Route path="locations" element={<LocationList/>} />
                    <Route path="activities" element={<ActivityList />} />
                </Routes>
            </div>
        </div>
    )
}

export default AdminPage