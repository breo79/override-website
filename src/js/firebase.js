import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBB9HfrB_xw0w_Ryt9jsGU6nd2iNc-XNaw",
    authDomain: "override-ai-6c58b.firebaseapp.com",
    projectId: "override-ai-6c58b",
    storageBucket: "override-ai-6c58b.firebasestorage.app",
    messagingSenderId: "1024364060292",
    appId: "1:1024364060292:web:4d590a1389563bf797acd1",
    measurementId: "G-5N417H22RL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };