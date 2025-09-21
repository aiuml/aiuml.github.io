// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Terminal theme doesn't need navbar scroll changes
// Navbar styles are handled by CSS

// Highlight active nav item based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    const navHeight = document.querySelector('.navbar').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 50;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-color)';
        }
    });
});

// Copy code blocks on click
document.querySelectorAll('pre code').forEach(block => {
    block.addEventListener('click', async () => {
        const text = block.textContent;
        try {
            await navigator.clipboard.writeText(text);

            // Show copied feedback
            const originalContent = block.innerHTML;
            const feedback = document.createElement('div');
            feedback.textContent = '✓ Copied to clipboard';
            feedback.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: var(--primary-color);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.875rem;
                font-family: var(--font-sans);
            `;

            block.style.position = 'relative';
            block.appendChild(feedback);

            setTimeout(() => {
                feedback.remove();
                block.style.position = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    });

    // Add hover effect
    block.style.cursor = 'pointer';
    block.addEventListener('mouseenter', () => {
        block.style.opacity = '0.9';
    });
    block.addEventListener('mouseleave', () => {
        block.style.opacity = '1';
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animation to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Apply animation to cards with delay
document.querySelectorAll('.concept-card, .feature-card, .use-case, .faq-item').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Mobile menu toggle (if needed in future)
function createMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';

    // Only show on mobile
    if (window.innerWidth <= 768) {
        menuButton.style.display = 'block';
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            menuButton.style.display = 'block';
        } else {
            menuButton.style.display = 'none';
        }
    });
}

// Typewriter effect for header
function typewriterEffect() {
    const header = document.getElementById('typewriter-header');
    if (!header) {
        console.log('Header element not found');
        return;
    }

    const text = header.getAttribute('data-text');
    if (!text) {
        console.log('No data-text attribute');
        return;
    }

    // For local files, use sessionStorage or just always show effect
    let hasSeenBefore = false;
    try {
        // Try to use sessionStorage (works better with file://)
        hasSeenBefore = sessionStorage.getItem('aiuml-header-seen');
    } catch(e) {
        // If storage fails, just show the effect
        console.log('Storage not available, showing typewriter');
    }

    // Check for reset parameter in URL (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
        try {
            sessionStorage.removeItem('aiuml-header-seen');
        } catch(e) {}
        hasSeenBefore = false;
    }

    // Always show typewriter on refresh (sessionStorage clears on new session)
    // Comment out these lines to always show typewriter effect
    // if (hasSeenBefore && urlParams.get('reset') !== 'true') {
    //     header.textContent = text;
    //     return;
    // }

    console.log('Starting typewriter effect for: ' + text);
    let index = 0;
    header.textContent = '';
    header.style.opacity = '1'; // Fade in
    header.style.transition = 'opacity 0.3s'; // Smooth transition
    header.style.minHeight = '1.2em'; // Match the HTML min-height

    function type() {
        if (index < text.length) {
            header.textContent = text.slice(0, index + 1);
            index++;
            setTimeout(type, 35); // Adjust speed here (ms per character)
        } else {
            // Don't mark as seen anymore - show effect every refresh
            // try {
            //     sessionStorage.setItem('aiuml-header-seen', 'true');
            // } catch(e) {}
            console.log('Typewriter complete');
        }
    }

    // Start typing immediately for local files
    console.log('Beginning to type...');
    type();
}

// Test if script is loading
console.log('Script.js loaded!');

// Initialize on page load - only run once
let typewriterStarted = false;

function startTypewriterOnce() {
    if (!typewriterStarted) {
        typewriterStarted = true;
        console.log('Starting typewriter effect');
        typewriterEffect();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded event fired');
    startTypewriterOnce();

    // Add tooltip to code blocks
    document.querySelectorAll('pre').forEach(pre => {
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Click to copy';
        tooltip.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-family: var(--font-sans);
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
        `;

        pre.style.position = 'relative';
        pre.appendChild(tooltip);

        pre.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });

        pre.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
});

// Add subtle parallax effect to hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;
    const rate = scrolled * -0.5;

    if (hero && scrolled < 500) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Typewriter effect for hero subtitle (optional, subtle)
function typewriterEffectSubtitle(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';
    element.style.opacity = '1';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Apply typewriter effect on load (optional - comment out if too flashy)
document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        // Uncomment the next line to enable typewriter effect
        // typewriterEffectSubtitle(subtitle, text);
    }
});