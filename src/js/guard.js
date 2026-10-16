// src/js/guard.js
import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname.toLowerCase();
    
    // Pages that require the user to be logged in
    const isProtectedPage = path.includes('/hub') || 
                            path.includes('/submit') || 
                            path.includes('/profile') || 
                            path.includes('/settings');

    // Pages that logged-in users shouldn't see
    const isAuthPage = path.includes('/auth');

    if (!user && isProtectedPage) {
        // Kick unauthenticated users to the auth page
        window.location.replace('/auth.html');
    } else if (user && isAuthPage) {
        // Kick authenticated users to the hub
        window.location.replace('/hub.html');
    }
});