import React, { useState, useEffect, useRef } from 'react';
import {
    getAuth,
    updateEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc
} from 'firebase/firestore';
import { supabase } from '../supabase';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const toast = useRef(null);

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setUser({ ...doc.data(), id: doc.id });
                    setProfileImage(doc.data().profile_link || null);
                });
            }
        };
        fetchUserData();
    }, [auth, db]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleUpdate = () => {
        if (!user) return;

        confirmDialog({
            message: 'Are you sure you want to update your information?',
            header: 'Confirm Information Update',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {
                const userRef = doc(db, 'users', user.id);
                const authUser = auth.currentUser;
                const isEmailChanged = authUser.email !== user.email;

                try {
                    await updateDoc(userRef, {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        contactNumber: user.contactNumber,
                        ...(isEmailChanged ? {} : { email: user.email })
                    });

                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'User information updated successfully!', life: 3000 });
                } catch (error) {
                    console.error('Error updating user information:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                }
            },
            reject: () => {
                toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'User information update cancelled', life: 3000 });
            }
        });
    };

    const handlePasswordUpdate = () => {
        const authUser = auth.currentUser;

        if (!password || !newPassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter your current and new password', life: 3000 });
            return;
        }

        // New password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'New password must meet the required format', life: 3000 });
            return;
        }

        const credential = EmailAuthProvider.credential(authUser.email, password);

        confirmDialog({
            message: 'Are you sure you want to update your password?',
            header: 'Confirm Password Update',
            icon: 'pi pi-lock',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await reauthenticateWithCredential(authUser, credential);
                    await updatePassword(authUser, newPassword);

                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password updated successfully', life: 3000 });
                    setPassword('');
                    setNewPassword('');
                } catch (error) {
                    console.error('Error updating password:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                }
            },
            reject: () => {
                toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'Password update cancelled', life: 3000 });
            }
        });
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const tempPreviewURL = URL.createObjectURL(file);
        setProfileImage(tempPreviewURL);

        setUploading(true);

        const filePath = `profiles/${user.id}/${file.name}`;
        const { data, error } = await supabase.storage.from('profiles').upload(filePath, file, { upsert: true });

        if (error) {
            console.error('Error uploading file:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
            setUploading(false);
            return;
        }

        const { data: urlData } = supabase.storage.from('profiles').getPublicUrl(filePath);
        const publicURL = urlData.publicUrl;

        if (!publicURL) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to get the uploaded image URL', life: 3000 });
            setUploading(false);
            return;
        }

        try {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { profile_link: publicURL });

            setUser({ ...user, profile_link: publicURL });
            setProfileImage(publicURL);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Profile picture updated successfully', life: 3000 });
        } catch (error) {
            console.error('Error updating profile picture:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        }

        setUploading(false);
    };

    // Handle password validation
    useEffect(() => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (passwordRegex.test(newPassword)) {
            setPasswordValidationMessage('Password is valid.');
            setIsPasswordValid(true);
        } else {
            setPasswordValidationMessage('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.');
            setIsPasswordValid(false);
        }
    }, [newPassword]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Picture and Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
                    {profileImage ? (
                        <div className="mb-4 flex justify-center">
                            <img src={profileImage} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full border" />
                        </div>
                    ) : (
                        <div className="mb-4 flex justify-center">
                            <img src="https://avatar.iran.liara.run/public" alt="Profile Preview" className="w-32 h-32 object-cover rounded-full border" />
                        </div>
                    )}

                    <label className="block w-full bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 cursor-pointer text-center">
                        {uploading ? 'Uploading...' : 'Choose File'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    
                    <h1 className="text-2xl font-bold my-4 ">User Information</h1>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">First Name:</label>
                            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} className="mt-1 p-3 w-full border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Last Name:</label>
                            <input type="text" name="lastName" value={user.lastName} onChange={handleChange} className="mt-1 p-3 w-full border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Contact Number:</label>
                            <input type="text" name="contactNumber" value={user.contactNumber} onChange={handleChange} className="mt-1 p-3 w-full border rounded" />
                        </div>
                        <button type="button" onClick={handleUpdate} className="w-full bg-blue-600 text-white py-3 rounded mt-4 hover:bg-blue-700">
                            Update Information
                        </button>
                    </form>
                </div>

                {/* User Information & Password Management Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mt-8 mb-4">Change Password</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Current Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-3 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 p-3 w-full border rounded"
                        />
                        <p className={`mt-2 text-sm ${isPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
                            {passwordValidationMessage}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handlePasswordUpdate}
                        className="w-full bg-red-600 text-white py-3 rounded mt-4 hover:bg-red-700"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
