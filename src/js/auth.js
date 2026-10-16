// src/js/auth.js
import { auth, db } from './firebase.js';
import { 
    GoogleAuthProvider, 
    OAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let authMode = 'login';

document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const authForm = document.getElementById('authForm');
    const btnGoogle = document.getElementById('btnGoogle');
    const btnApple = document.getElementById('btnApple');
    
    if (tabLogin) tabLogin.addEventListener('click', () => switchMode('login'));
    if (tabRegister) tabRegister.addEventListener('click', () => switchMode('register'));
    if (authForm) authForm.addEventListener('submit', handleEmailAuth);
    
    if (btnGoogle) btnGoogle.addEventListener('click', handleGoogleAuth);
    if (btnApple) btnApple.addEventListener('click', handleAppleAuth);
});

function switchMode(mode) {
    if (authMode === mode) return;
    authMode = mode;
    
    document.getElementById('tabLogin').classList.toggle('active', mode === 'login');
    document.getElementById('tabRegister').classList.toggle('active', mode === 'register');

    const transitionBox = document.getElementById('transitionBox');
    transitionBox.style.opacity = '0';
    transitionBox.style.transform = 'translateY(4px)';

    setTimeout(() => {
        const title = document.getElementById('authTitle');
        const subtitle = document.getElementById('authSubtitle');
        const submitBtn = document.getElementById('submitBtn');

        if (mode === 'login') {
            title.innerText = 'Welcome Back';
            subtitle.innerText = 'Enter your credentials to access the hub.';
            submitBtn.innerText = 'Initialize Session';
        } else {
            title.innerText = 'Create Override ID';
            subtitle.innerText = 'Register to save and share context cartridges.';
            submitBtn.innerText = 'Register System';
        }
        
        transitionBox.style.opacity = '1';
        transitionBox.style.transform = 'translateY(0)';
    }, 200);
}

// --- Auth Handlers ---

async function handleEmailAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitBtn');
    
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Processing...';
    submitBtn.disabled = true;

    try {
        if (authMode === 'login') {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await initializeUserProfile(userCredential.user);
        }
        window.location.replace('hub.html');
    } catch (error) {
        alert(`Authentication failed: ${error.message}`);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

async function handleGoogleAuth() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await initializeUserProfile(result.user);
        window.location.replace('hub.html');
    } catch (error) {
        console.error("Google Auth Error:", error);
        alert(`Google Auth failed: ${error.message}`);
    }
}

async function handleAppleAuth() {
    const provider = new OAuthProvider('apple.com');
    try {
        const result = await signInWithPopup(auth, provider);
        await initializeUserProfile(result.user);
        window.location.replace('hub.html');
    } catch (error) {
        console.error("Apple Auth Error:", error);
        alert(`Apple Auth failed: ${error.message}`);
    }
}

// Ensures every new user has a settings document in Firestore
async function initializeUserProfile(user) {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        await setDoc(userRef, {
            displayName: user.displayName || 'Anonymous Operator',
            bio: 'No system diagnostic provided.',
            joinedAt: new Date()
        });
    }
}