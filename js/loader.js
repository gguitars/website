document.addEventListener("DOMContentLoaded", function() {
    const components = [
        { targetId: "global-nav", file: "components/nav.html" },
        { targetId: "global-footer", file: "components/footer.html" }
    ];

    Promise.all(components.map(loadComponent))
        .then(() => {
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Setup mobile menu toggle
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuIcon = document.getElementById('menu-icon');

            if (mobileMenuButton && mobileMenu && menuIcon) {
                mobileMenuButton.addEventListener('click', function() {
                    mobileMenu.classList.toggle('hidden');
                    const isMenuOpen = !mobileMenu.classList.contains('hidden');
                    menuIcon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
                    lucide.createIcons();
                });
            }
            
            console.log("System: Components Loaded");
        });
});

async function loadComponent({ targetId, file }) {
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        element.innerHTML = html;
        if(targetId === 'global-nav') setActiveLink(element);
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
    }
}

function setActiveLink(navElement) {
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    const desktopLinks = navElement.querySelectorAll('.hidden.md\\:flex a');
    const mobileLinks = navElement.querySelectorAll('#mobile-menu a');

    [...desktopLinks, ...mobileLinks].forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.classList.remove('hover:text-blue-600', 'hover:text-slate-900', 'hover:bg-slate-50');
            link.classList.add('text-blue-600');
            if(mobileLinks.length > 0 && Array.from(mobileLinks).includes(link)) {
                link.classList.add('bg-slate-100');
            }
        }
    });
}
