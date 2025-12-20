import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Adeegga Login-ka

// Xogta hoos ku qoran ka soo koobi Firebase Console (Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyBarN5c2v7BUUno_JOtN_6fT9Ey-dmrYHE",
  authDomain: "pcare-project.firebaseapp.com",
  projectId: "pcare-project",
  storageBucket: "pcare-project.firebasestorage.app",
  messagingSenderId: "314828237124",
  appId: "1:314828237124:web:6ff3ae73b53f0f27938f11",
  measurementId: "G-D4XKZLW1NJ"
};

// Hubi in app-ku horay u furnaa iyo in kale si looga hortago cilladaha (Server-side)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Dhalinta adeegyada aan u baahannahay
const db = getFirestore(app);
const auth = getAuth(app);

// Inaan u dhiibno boggaga kale (Export)
export { db, auth };