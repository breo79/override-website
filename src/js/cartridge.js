// src/js/cartridge.js
import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    // Extract the cartridge ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const cartridgeId = urlParams.get('c');

    if (!cartridgeId) {
        window.location.replace('hub.html');
        return;
    }

    try {
        // Fetch Cartridge Document
        const cartRef = doc(db, 'cartridges', cartridgeId);
        const cartSnap = await getDoc(cartRef);

        if (!cartSnap.exists()) {
            showError();
            return;
        }

        const data = cartSnap.data();
        
        // Fetch Author Data
        let authorName = "Unknown Operator";
        if (data.authorId) {
            const authorRef = doc(db, 'users', data.authorId);
            const authorSnap = await getDoc(authorRef);
            if (authorSnap.exists()) {
                authorName = authorSnap.data().displayName || "Anonymous Operator";
            }
        }

        // Populate the UI
        document.getElementById('cartTitle').innerText = data.title;
        document.getElementById('cartDesc').innerText = data.description;
        document.getElementById('cartTags').innerHTML = data.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('');
        
        document.getElementById('cartAuthor').innerText = authorName;
        document.getElementById('cartAuthor').href = `profile.html?id=${data.authorId}`;
        
        if (data.createdAt) {
            document.getElementById('cartDate').innerText = data.createdAt.toDate().toLocaleDateString();
        }

        // Handle Payload display and filename mocking
        const payloadText = data.payload || "";
        document.getElementById('cartPayload').innerText = payloadText;
        document.getElementById('cartFilename').innerText = (data.title.toLowerCase().replace(/\s+/g, '-') + '.txt').substring(0, 30);

        // Setup Copy Button
        document.getElementById('copyPayloadBtn').addEventListener('click', async (e) => {
            try {
                await navigator.clipboard.writeText(payloadText);
                const btn = e.target;
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                btn.style.borderColor = 'var(--accent)';
                btn.style.color = 'var(--accent)';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }, 2000);
            } catch (err) {
                alert("Clipboard access denied.");
            }
        });

        // Hide loading, show content
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('cartridgeContent').style.display = 'block';

    } catch (error) {
        console.error("Failed to retrieve cartridge:", error);
        showError();
    }
});

function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}