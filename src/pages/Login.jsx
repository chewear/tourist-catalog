import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Adjust the import path as necessary

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const q = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                if (userData.role === "tourist") {
                    navigate("/tourist");
                } else if (userData.role === "admin") {
                    navigate("/admin");
                } else if (userData.role === "tour guide") {
                    navigate("/tour-guide");
                }
            } else {
                console.error("No such document!");
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            alert("Error logging in");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
            </div>
            <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
            </div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Login</button>
            </form>
            <div className="flex justify-between mt-4">
            <Link to="/signup" className="text-sm text-indigo-600 hover:underline">Sign Up</Link>
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">Forgot Password?</Link>
            </div>
        </div>
        </div>
    );
};

export default Login;
