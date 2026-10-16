// src/js/hub.js
import { getCartridges } from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('hubGrid');
    const loadingText = document.getElementById('hubLoading');
    if (!grid) return;

    const cartridges = await getCartridges();
    
    if (cartridges.length === 0) {
        loadingText.innerText = "No cartridges deployed yet. Be the first.";
        return;
    }

    loadingText.style.display = 'none';

// Render the grid with encoded payloads and view links
    grid.innerHTML = cartridges.map(c => `
        <div class="cartridge-card">
            <a href="cartridge.html?c=${c.id}" style="text-decoration: none; color: inherit;">
                <h3 style="transition: color 0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color=''">
                    ${escapeHTML(c.title)}
                </h3>
            </a>
            <p class="text-muted">${escapeHTML(c.description)}</p>
            <div class="tags">
                ${c.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
            </div>
            <div class="card-actions" style="display: flex; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm copy-btn" style="flex: 1;" data-payload="${encodeURIComponent(c.payload)}">Quick Copy</button>
                <a href="cartridge.html?c=${c.id}" class="btn btn-secondary btn-sm" style="flex: 1; text-align: center;">View</a>
            </div>
        </div>
    `).join('');
});

// Simple security measure for displaying text
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag]));
}