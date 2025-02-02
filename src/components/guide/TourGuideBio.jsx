import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, query, where, getDocs, collection } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

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
      alert("User document not found!");
      return;
    }

    const docRef = doc(db, "users", tourGuideInfo.id);
    await setDoc(docRef, { ...tourGuideInfo }, { merge: true }); // Merge to avoid overwriting existing fields
    alert("Information saved successfully!");
  };

  return (
    <div className="tour-guide-bio p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6">Tour Guide Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><strong>First Name:</strong> <input type="text" name="firstName" value={tourGuideInfo.firstName} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Last Name:</strong> <input type="text" name="lastName" value={tourGuideInfo.lastName} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Age:</strong> <input type="number" name="age" value={tourGuideInfo.age} onChange={handleChange} className="border p-2 rounded w-full" min="18" /></p>
        <p><strong>Gender:</strong> 
          <select
            name="gender"
            value={tourGuideInfo.gender}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </p>
        <p><strong>Occupation:</strong> <input type="text" name="occupation" value={tourGuideInfo.occupation} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Address:</strong> <input type="text" name="address" value={tourGuideInfo.address} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Nationality:</strong> <input type="text" name="nationality" value={tourGuideInfo.nationality} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Status:</strong> <input type="text" name="status" value={tourGuideInfo.status} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Email:</strong> <input type="email" name="email" value={tourGuideInfo.email} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Contact Number:</strong> <input type="text" name="contactNumber" value={tourGuideInfo.contactNumber} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Rate (PHP):</strong> <input type="number" name="rate" value={tourGuideInfo.rate} onChange={handleChange} className="border p-2 rounded w-full" /></p>
        <p><strong>Guide Type:</strong> 
          <select
            id="guideType"
            name="guideType"
            className="border p-2 rounded w-full"
            value={tourGuideInfo.guideType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Tour/Translator">Tour/Translator</option>
            <option value="Tour/Translator/Transportation">Tour/Translator/Transportation</option>
          </select>
        </p>
      </div>
      <div className="mt-4">
        <p><strong>Bio/Description:</strong> 
          <textarea
            name="bio"
            value={tourGuideInfo.bio}
            onChange={handleChange}
            className="border p-2 rounded w-full min-h-24 max-h-40"
          />
        </p>
      </div>
      <button 
        onClick={handleSave} 
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out">
        Save
      </button>
    </div>
  );
};

export default TourGuideBio;
