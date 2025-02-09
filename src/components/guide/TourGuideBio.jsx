import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc, query, where, getDocs, collection } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const TourGuideBio = () => {
  const [tourGuideInfo, setTourGuideInfo] = useState({
    contactNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    uid: "",
    id: "",
    rate: "",
    guideType: "",
    fullName: "",
    age: "",
    gender: "",
    occupation: "",
    address: "",
    nationality: "",
    status: "",
    bio: "", // Add bio field
  });

  const toast = useRef(null); // Reference for Toast

  useEffect(() => {
    const fetchTourGuideInfo = async (uid) => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0]; // Get the first matching document
        setTourGuideInfo((prevState) => ({
          ...prevState,
          ...docSnap.data(),
          id: docSnap.id, // Store the document ID
        }));
      } else {
        console.log("No user document found for this UID.");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setTourGuideInfo((prevState) => ({
          ...prevState,
          uid: user.uid,
        }));
        fetchTourGuideInfo(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTourGuideInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!tourGuideInfo.id) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'User document not found!',
        life: 3000,
      });
      return;
    }

    try {
      const docRef = doc(db, "users", tourGuideInfo.id);
      await setDoc(docRef, { ...tourGuideInfo }, { merge: true }); // Merge to avoid overwriting existing fields

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Information saved successfully!',
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error saving information!',
        life: 3000,
      });
    }
  };

  const confirmSave = () => {
    confirmDialog({
      message: 'Are you sure you want to save your profile information?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: handleSave,
      reject: () => {
        toast.current.show({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Profile update cancelled',
          life: 3000,
        });
      }
    });
  };

  return (
    <div className="max-w-8xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <Toast ref={toast} />
      <ConfirmDialog />

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Guide Profile</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="firstName"
            value={tourGuideInfo.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            value={tourGuideInfo.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <input
            type="number"
            name="age"
            value={tourGuideInfo.age}
            onChange={handleChange}
            placeholder="Age"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
            min="18"
          />
        </div>
        <div>
          <select
            name="gender"
            value={tourGuideInfo.gender}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            name="occupation"
            value={tourGuideInfo.occupation}
            onChange={handleChange}
            placeholder="Occupation"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <input
            type="text"
            name="address"
            value={tourGuideInfo.address}
            onChange={handleChange}
            placeholder="Address"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <input
            type="text"
            name="nationality"
            value={tourGuideInfo.nationality}
            onChange={handleChange}
            placeholder="Nationality"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <input
            type="text"
            name="status"
            value={tourGuideInfo.status}
            onChange={handleChange}
            placeholder="Status"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={tourGuideInfo.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <input
            type="text"
            name="contactNumber"
            value={tourGuideInfo.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <input
            type="number"
            name="rate"
            value={tourGuideInfo.rate}
            onChange={handleChange}
            placeholder="Rate (PHP)"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div>
          <select
            id="guideType"
            name="guideType"
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
            value={tourGuideInfo.guideType}
            onChange={handleChange}
          >
            <option value="">Guide Type</option>
            <option value="Tour/Translator">Tour/Translator</option>
            <option value="Tour/Translator/Transportation">
              Tour/Translator/Transportation
            </option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <textarea
          name="bio"
          value={tourGuideInfo.bio}
          onChange={handleChange}
          placeholder="Bio/Description"
          className="border border-gray-300 p-2 rounded-md w-full text-sm min-h-[80px] max-h-[160px]"
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={confirmSave}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default TourGuideBio;
