import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, updateDoc, doc, query, where, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Toast } from 'primereact/toast'; // PrimeReact Toast component
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; // PrimeReact ConfirmDialog component

const LocationSelection = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useRef(null); // Reference for toast notifications

  useEffect(() => {
    // Fetch all available locations from Firestore
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'locations'));
        const locationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Fetch the user's previously selected locations
        await fetchUserSelectedLocations(user.uid);
      } else {
        setUserId(null);
        setSelectedLocations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserSelectedLocations = async (uid) => {
    try {
      const guideLocationQuery = query(collection(db, 'guide_location'), where('userId', '==', uid));
      const querySnapshot = await getDocs(guideLocationQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setSelectedLocations(userData.selectedLocations || []);
      }
    } catch (error) {
      console.error('Error fetching user selected locations:', error);
    }
  };

  const handleLocationToggle = (locationId) => {
    setSelectedLocations(prevSelected =>
      prevSelected.includes(locationId)
        ? prevSelected.filter(id => id !== locationId)
        : [...prevSelected, locationId]
    );
  };

  const handleSave = async () => {
    if (!userId) {
      console.error('No user is logged in');
      return;
    }

    try {
      // Save the selected locations under 'guide_location' collection with user's ID as doc ID
      const userDocRef = doc(db, 'guide_location', userId);
      await setDoc(userDocRef, {
        userId,
        selectedLocations,
        timestamp: new Date()
      });

      // Show success toast notification
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Locations saved successfully', life: 3000 });
    } catch (error) {
      console.error('Error saving selected locations:', error);
      // Show error toast notification
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save locations', life: 3000 });
    }
  };

  // Function to show confirmation dialog
  const confirmSave = () => {
    confirmDialog({
      message: 'Do you want to save the selected locations?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: handleSave, // Call handleSave if confirmed
      reject: () => {
        toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'Save cancelled', life: 3000 });
      },
    });
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Select Locations</h1>

      <Toast ref={toast} /> {/* PrimeReact Toast component */}

      <ConfirmDialog /> {/* PrimeReact ConfirmDialog component */}

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition duration-300 ease-in-out"
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <ul className="space-y-4">
          {filteredLocations.map(location => (
            <li
              key={location.id}
              className="p-4 bg-gray-50 hover:bg-gray-100 transition rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-700">{location.name}</h3>
                <p className="text-sm max-w-5/6 max-h-[60px] min-h-[60px] text-gray-500 overflow-y-auto">{location.description}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location.id)}
                  onChange={() => handleLocationToggle(location.id)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 text-right">
        <button
          onClick={confirmSave} // Trigger confirmation dialog
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition duration-300 ease-in-out"
        >
          Save Locations
        </button>
      </div>
    </div>
  );
};

export default LocationSelection;
