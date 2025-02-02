import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyB5KI0eMEHYJEQ4ZMxcciHmCeZm5MZD-wM",
  authDomain: "local-lingua-2ba4c.firebaseapp.com",
  projectId: "local-lingua-2ba4c",
  storageBucket: "local-lingua-2ba4c.firebasestorage.app",
  messagingSenderId: "530993302524",
  appId: "1:530993302524:web:b7d7aa49058cf7bfc84079"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Add this line

export default app;
export { db }; // Add this line
