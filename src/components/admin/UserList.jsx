import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const UserListItem = ({ user }) => {
    return (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200">
            <span className="flex-1 text-left font-medium text-gray-800">{user.firstName} {user.lastName}</span>
            <span className="flex-1 text-left text-gray-600">{user.email}</span>
            <span className="flex-1 text-left text-gray-600">{user.contactNumber}</span>
            <span className={`text-sm font-semibold pl-40 ${user.role === "tour guide" ? "text-[#009E49]" : "text-[#0043A8]"} w-1/4 text-left`}>
                {user.role}
            </span>
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
        console.log(users);
    }, []);

    // Filter users (exclude admins)
    const filteredUsers = users
        .filter(user => user.role !== "admin")
        .filter(user => `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(user => roleFilter === "" || user.role === roleFilter);

    return (
        <div className="p-8 bg-[#FFFFFF] rounded-lg shadow-sm max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#0043A8]">User List</h1>
            </div>
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#0043A8] focus:border-transparent"
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#0043A8] focus:border-transparent"
                >
                    <option value="">All Roles</option>
                    <option value="tourist">Tourist</option>
                    <option value="tour guide">Tour Guide</option>
                </select>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#0043A8] rounded-t-lg font-bold text-white">
                <span className="flex-1 text-left">Name</span>
                <span className="flex-1 text-left">Email</span>
                <span className="flex-1 text-left">Contact Number</span>
                <span className="w-1/4 text-left pl-40 pr-4">Role</span> {/* Added padding to move the role slightly to the right */}
            </div>
            <div className="rounded-b-lg overflow-hidden shadow-sm">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <UserListItem
                            key={user.id}
                            user={user}
                        />
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500 bg-white">No users found</div>
                )}
            </div>
        </div>
    );
};

export default UserList;
