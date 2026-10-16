import { createCartridge } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('submitForm');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const btn = document.getElementById('submitBtn');
        btn.innerText = 'Deploying Payload...';
        btn.disabled = true;

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const payload = document.getElementById('xmlContent').value; 
        const rawTags = document.getElementById('tags').value;
        
        const tagsArray = rawTags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        try {
            // Push the cartridge document to Firestore using your helper
            await createCartridge(title, description, payload, tagsArray);
            
            // On success, redirect to the Hub
            window.location.replace('hub.html');
        } catch (error) {
            alert('Deployment failed: ' + error.message);
            btn.innerText = 'Deploy Cartridge';
            btn.disabled = false;
        }
    });
});