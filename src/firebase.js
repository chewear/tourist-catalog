import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import Firebase storage

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage

const createReservation = async (userId, locationId, activityIds, date, guideId) => {
    try {
        const docRef = await addDoc(collection(db, "reservations"), {
            userId,
            locationId,
            activityIds,
            date,
            guideId, // Now storing the selected guide's document ID
            timestamp: new Date(),
            status: "pending",
        });
        console.log("Reservation created with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding reservation: ", e);
    }
};


export { db, auth, storage, createReservation };
