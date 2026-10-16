// src/js/profile.js
import { auth, db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profileName');
    const profileBio = document.getElementById('profileBio');
    const settingsBtn = document.getElementById('settingsBtn');

    // Listen for the automatic session persistence
    onAuthStateChanged(auth, async (user) => {
        // 1. Determine whose profile to show
        const urlParams = new URLSearchParams(window.location.search);
        const targetUid = urlParams.get('id') || (user ? user.uid : null);

        if (!targetUid) {
            window.location.replace('/auth');
            return;
        }

        // 2. Security Check: Only show settings button if viewing own profile
        if (user && user.uid === targetUid) {
            settingsBtn.style.display = 'inline-flex';
        } else {
            settingsBtn.style.display = 'none';
        }

        // 3. Fetch Profile Data
        try {
            const userRef = doc(db, 'users', targetUid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                profileName.innerText = data.displayName || 'Anonymous Operator';
                profileBio.innerText = data.bio || 'No system diagnostic provided.';
            } else {
                profileName.innerText = 'Operator Not Found';
                profileBio.innerText = 'This ID does not exist in the database.';
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            profileName.innerText = 'Database Error';
        }
    });
});