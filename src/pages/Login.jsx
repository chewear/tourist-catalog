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
                    navigate("/tourist/booking");
                } else if (userData.role === "admin") {
                    navigate("/admin/users");
                } else if (userData.role === "tour guide") {
                    navigate("/tour-guide/reservations");
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
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed animate-fadeIn" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
            <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-sm transform transition-all animate-slideUp">
                <h2 className="text-3xl font-bold text-center text-gray-800 animate-fadeInText">Welcome Back</h2>
                <p className="text-center text-gray-600 animate-fadeInText">Sign in to your account to continue</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all transform hover:scale-105 focus:scale-105" 
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all transform hover:scale-105 focus:scale-105" 
                            placeholder="Enter your password"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110"
                    >
                        Login
                    </button>
                </form>
                <div className="flex justify-between mt-4">
  <Link to="/signup" className="text-sm text-blue-950 hover:text-blue-600 hover:underline transition-all duration-200">Create an account</Link>
  <Link to="/forgot-password" className="text-sm text-blue-950 hover:text-blue-600 hover:underline transition-all duration-200">Forgot Password?</Link>
</div>

            </div>
        </div>
    );
};

export default Login;
