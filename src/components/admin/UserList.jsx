import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const UserListItem = ({ user }) => {
    return (
        <div className="flex justify-between items-center p-4 border-b hover:bg-gray-100 transition duration-200">
            <span className="font-medium">{user.firstName} {user.lastName}</span>
            <span className="text-gray-600">{user.email}</span>
            <span className="text-gray-600">{user.role}</span>
        </div>
    );
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };
        fetchUsers();
    }, []);

    // Filter users (exclude admins)
    const filteredUsers = users
        .filter(user => user.role !== "admin")
        .filter(user => `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(user => roleFilter === "" || user.role === roleFilter);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User List</h1>
            </div>
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Roles</option>
                    <option value="tourist">Tourist</option>
                    <option value="tour guide">Tour Guide</option>
                </select>
            </div>
            <div className="flex justify-between items-center p-4 border-b font-bold text-gray-700">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
            </div>
            {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                    <UserListItem
                        key={user.id}
                        user={user}
                    />
                ))
            ) : (
                <div className="p-4 text-center text-gray-500">No users found</div>
            )}
        </div>
    );
};

export default UserList;
