// Import the functions you need from the SDKs you need
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCUPXB2Nrg33p0IlxWPeWkd8XoNVf2M4o",
    authDomain: "brickbrack-63a8a.firebaseapp.com",
    projectId: "brickbrack-63a8a",
    storageBucket: "brickbrack-63a8a.firebasestorage.app",
    messagingSenderId: "911374170093",
    appId: "1:911374170093:web:75e7bf5ec5b4ecd4e6d9e4",
    measurementId: "G-0MBBK7CMZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app); // Để dành cho việc lưu điểm sau này
export default app; // QUAN TRỌNG: Phải có dòng này để file khác gọi được 'app'