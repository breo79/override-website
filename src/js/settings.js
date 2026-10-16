// src/js/settings.js
import { auth, db } from './firebase.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settingsForm');
    const displayNameInput = document.getElementById('displayName');
    const bioInput = document.getElementById('bio');
    const btnLogout = document.getElementById('btnLogout');

    onAuthStateChanged(auth, async (user) => {
        if (!user) return; // guard.js handles the redirect

        // Pre-fill existing data
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            displayNameInput.value = userSnap.data().displayName || '';
            bioInput.value = userSnap.data().bio || '';
        }
    });

    // Save Updates
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveSettingsBtn');
            btn.innerText = 'Saving...';
            
            try {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {
                    displayName: displayNameInput.value,
                    bio: bioInput.value
                });
                btn.innerText = 'Configuration Saved';
                setTimeout(() => btn.innerText = 'Save Configuration', 2000);
            } catch (error) {
                alert("Error saving settings: " + error.message);
                btn.innerText = 'Save Configuration';
            }
        });
    }

    // Terminate Session
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await signOut(auth);
            window.location.replace('/auth');
        });
    }
});