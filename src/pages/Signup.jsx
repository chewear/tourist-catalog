import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../firebaseConfig'; // Adjust the import path as necessary
import { collection, addDoc } from "firebase/firestore";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'tourist', // Default role
        contactNumber: '' // New field
    });
    const [errors, setErrors] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.firstName) tempErrors.firstName = "First Name is required";
        if (!formData.lastName) tempErrors.lastName = "Last Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
        if (!formData.password) tempErrors.password = "Password is required";
        if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
        if (!formData.contactNumber) tempErrors.contactNumber = "Contact Number is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const { firstName, lastName, email, password, role, contactNumber } = formData;

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await addDoc(collection(db, "users"), {
                uid: user.uid,
                firstName,
                lastName,
                email,
                role, // Save selected role
                contactNumber // Save contact number
            });

            alert("User created successfully");
        } catch (error) {
            console.error("Error creating user: ", error);
            alert("Error creating user");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Contact Number:</label>
                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                    {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Password:</label>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600">
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600">
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200">
                        <option value="tourist">Tourist</option>
                        <option value="tour guide">Tour Guide</option>
                    </select>
                </div>
                
                <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign Up</button>
            </form>
            <div className="flex justify-center mt-4">
                <Link to="/login" className="text-sm text-indigo-600 hover:underline">Login</Link>
            </div>
        </div>
        </div>
    );
};

export default Signup;
