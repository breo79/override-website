// --- 1. Theme Toggle Logic ---
const themeToggleBtn = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

function updateIcons(theme) {
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
}

// Set initial icon state
updateIcons(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcons(newTheme);
    });
}

// --- 2. 3D Tilt Effect for Code Window (Landing Page) ---
const tiltWindow = document.getElementById('tiltWindow');
if (tiltWindow && window.matchMedia("(hover: hover)").matches) {
    tiltWindow.addEventListener('mousemove', (e) => {
        const rect = tiltWindow.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        tiltWindow.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        tiltWindow.style.boxShadow = `0 30px 60px rgba(0,0,0,0.3)`;
    });

    tiltWindow.addEventListener('mouseleave', () => {
        tiltWindow.style.transform = `rotateX(0) rotateY(0) scale(1)`;
        tiltWindow.style.boxShadow = `0 20px 40px rgba(0,0,0,0.15)`;
    });
}

// --- 3. Sidebar Active State (Docs Page) ---
const sidebarLinks = document.querySelectorAll('aside a');
if (sidebarLinks.length > 0) {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}