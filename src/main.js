import { 
    themeToggle, 
    searchInput, 
    homeSection, 
    toolSection, 
    toolTitle, 
    toolDescription, 
    toolInterface 
} from './core/dom.js';
import { initTheme, toggleTheme } from './core/theme.js';
import { toolsData } from './tools/index.js';

// New DOM elements for dashboard
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const sidebarNav = document.getElementById('sidebarNav');
const allToolsGrid = document.getElementById('allToolsGrid');
const popularToolsGrid = document.getElementById('popularToolsGrid');
const popularSection = document.getElementById('popularSection');
const categoryTitle = document.getElementById('categoryTitle');

let currentCategory = 'All';
let favorites = JSON.parse(localStorage.getItem('mth_favorites')) || [];
let recentTools = JSON.parse(localStorage.getItem('mth_recent')) || [];

function trackRecentTool(toolId) {
    recentTools = recentTools.filter(id => id !== toolId);
    recentTools.unshift(toolId);
    if (recentTools.length > 12) recentTools.pop();
    localStorage.setItem('mth_recent', JSON.stringify(recentTools));
}

function toggleFavorite(e, toolId) {
    e.stopPropagation(); // Prevent opening the tool
    
    const index = favorites.indexOf(toolId);
    if (index === -1) {
        favorites.push(toolId);
        e.currentTarget.classList.add('active');
        e.currentTarget.innerHTML = '<i class="fa-solid fa-star"></i>';
    } else {
        favorites.splice(index, 1);
        e.currentTarget.classList.remove('active');
        e.currentTarget.innerHTML = '<i class="fa-regular fa-star"></i>';
    }
    
    localStorage.setItem('mth_favorites', JSON.stringify(favorites));
    
    // If we are currently viewing the Favorites category, re-render
    if (currentCategory === 'Favorites') {
        renderTools(toolsData.filter(t => favorites.includes(t.id)));
    }
}

// Ripple Effect
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple-effect");

    const existingRipple = button.querySelector(".ripple-effect");
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(circle);
}

function attachRipple() {
    document.querySelectorAll('.btn, .nav-item, .tool-card').forEach(btn => {
        if (!btn.classList.contains('ripple')) {
            btn.classList.add('ripple');
            btn.addEventListener('mousedown', createRipple);
        }
    });
}

// Initialize App
function init() {
    initTheme();
    renderPopularTools();
    renderTools(toolsData);
    
    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', handleSearch);
    
    // Mobile menu listeners
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
    
    // Sidebar category listeners
    const navItems = sidebarNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // Filter tools
            currentCategory = e.currentTarget.getAttribute('data-category');
            
            // Update title
            categoryTitle.innerHTML = e.currentTarget.innerHTML;
            
            // Hide popular section if not 'All'
            if (currentCategory === 'All') {
                popularSection.style.display = 'block';
                renderTools(toolsData);
            } else if (currentCategory === 'Favorites') {
                popularSection.style.display = 'none';
                renderTools(toolsData.filter(t => favorites.includes(t.id)));
            } else if (currentCategory === 'Recent') {
                popularSection.style.display = 'none';
                const recentToolsData = recentTools.map(id => toolsData.find(t => t.id === id)).filter(Boolean);
                renderTools(recentToolsData);
            } else {
                popularSection.style.display = 'none';
                const filtered = toolsData.filter(t => t.category === currentCategory);
                renderTools(filtered);
            }
            
            // Close sidebar on mobile
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
            
            // Ensure home section is visible
            if (homeSection.style.display === 'none') {
                closeTool();
            }
        });
    });
    
    attachRipple();
}

function toggleSidebar() {
    if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
            sidebarOverlay.classList.add('show');
        } else {
            sidebarOverlay.classList.remove('show');
        }
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

function highlightText(text, query) {
    if (!query) return text;
    // Escape regex special characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function createToolCard(tool, index, query = '') {
    const card = document.createElement('div');
    card.className = 'tool-card ripple';
    card.style.animationDelay = `${index * 0.05}s`;
    card.onclick = () => openTool(tool.id);
    card.addEventListener('mousedown', createRipple);
    
    const name = highlightText(tool.name, query);
    const desc = highlightText(tool.description, query);
    
    const isFav = favorites.includes(tool.id);
    const favIcon = isFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
    const favClass = isFav ? 'favorite-btn active' : 'favorite-btn';
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div class="tool-icon" style="margin-bottom: 0;">
                <i class="fa-solid ${tool.icon}"></i>
            </div>
            <button class="${favClass}" onclick="toggleFavorite(event, '${tool.id}')" aria-label="Toggle Favorite">
                <i class="${favIcon}"></i>
            </button>
        </div>
        <h3>${name}</h3>
        <p>${desc}</p>
    `;
    return card;
}

function renderPopularTools() {
    popularToolsGrid.innerHTML = '';
    // Select a few popular tools manually
    const popularIds = ['pdf-to-word', 'image-compressor', 'json-formatter', 'qr-generator'];
    const popularTools = toolsData.filter(t => popularIds.includes(t.id));
    
    popularTools.forEach((tool, index) => {
        popularToolsGrid.appendChild(createToolCard(tool, index));
    });
}

function renderTools(tools, query = '') {
    allToolsGrid.innerHTML = '';
    
    if (tools.length === 0) {
        allToolsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding: 2rem;">No tools found.</p>';
        return;
    }

    tools.forEach((tool, index) => {
        allToolsGrid.appendChild(createToolCard(tool, index, query));
    });
}

// Search Functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.trim() === '') {
        // Reset to current category
        if (currentCategory === 'All') {
            popularSection.style.display = 'block';
            renderTools(toolsData);
        } else {
            popularSection.style.display = 'none';
            renderTools(toolsData.filter(t => t.category === currentCategory));
        }
        categoryTitle.innerHTML = sidebarNav.querySelector('.active').innerHTML;
        return;
    }
    
    // Hide popular section during search
    popularSection.style.display = 'none';
    categoryTitle.innerHTML = `<i class="fa-solid fa-search"></i> Search Results for "${query}"`;
    
    const filteredTools = toolsData.filter(tool => 
        tool.name.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
    );
    
    renderTools(filteredTools, query);
    
    // Ensure home section is visible
    if (homeSection.style.display === 'none') {
        transitionSection(toolSection, homeSection);
    }
}

// Smooth Section Transitions
function transitionSection(hideEl, showEl, callback) {
    hideEl.classList.remove('fade-enter');
    hideEl.classList.add('fade-exit');
    
    setTimeout(() => {
        hideEl.style.display = 'none';
        hideEl.classList.remove('fade-exit');
        
        if (callback) callback();
        
        showEl.style.display = 'block';
        showEl.classList.add('fade-enter');
    }, 300); // match CSS animation duration
}

// Navigation
function openTool(toolId) {
    const tool = toolsData.find(t => t.id === toolId);
    if (!tool) return;

    trackRecentTool(toolId);

    transitionSection(homeSection, toolSection, () => {
        toolTitle.textContent = tool.name;
        toolDescription.textContent = tool.description;
        
        // Clear previous tool interface
        toolInterface.innerHTML = '';
        
        // Render new tool
        if (tool.render) {
            tool.render();
            // Re-attach ripple to newly rendered buttons
            setTimeout(attachRipple, 50);
        } else {
            renderPlaceholder(tool.name);
        }
        
        window.scrollTo(0, 0);
    });
}

function closeTool() {
    if (toolSection.style.display === 'none') return;
    
    transitionSection(toolSection, homeSection, () => {
        toolInterface.innerHTML = '';
        window.scrollTo(0, 0);
    });
}

function renderPlaceholder(toolName) {
    toolInterface.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; background: var(--bg-color); border-radius: 0.5rem; border: 2px dashed var(--border-color);">
            <i class="fa-solid fa-person-digging" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1.5rem;"></i>
            <h3 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">Under Construction</h3>
            <p style="color: var(--text-secondary);">The ${toolName} is currently being built. Check back soon!</p>
        </div>
    `;
}

// Expose globally for the back button in HTML
window.closeTool = closeTool;
window.toggleFavorite = toggleFavorite;

// Start the app
init();
