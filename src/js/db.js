// src/js/db.js
import { db, auth } from './firebase.js';
// Add 'where' to your imports:
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cartridgesRef = collection(db, "cartridges");

export async function createCartridge(title, description, payload, tagsArray) {
    const docRef = await addDoc(cartridgesRef, {
        title: title,
        description: description,
        payload: payload,
        tags: tagsArray,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        moderated: null // <-- CRITICAL: Triggers the backend bot
    });
    
    return docRef;
}

export async function getCartridges() {
    try {
        // Add the where() filter to block unmoderated payloads
        const q = query(
            cartridgesRef, 
            where("moderated", "==", true), 
            orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        const cartridges = [];
        querySnapshot.forEach((doc) => {
            cartridges.push({ id: doc.id, ...doc.data() });
        });
        
        return cartridges;
    } catch (e) {
        console.error("Error fetching cartridges:", e);
        return [];
    }
}