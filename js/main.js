/* ============================================
   DRAVID KUMAR PORTFOLIO - JAVASCRIPT (ENHANCED)
   3D Effects, Animations, and Interactions
   ============================================ */

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================
const isMobile = window.innerWidth < 768;
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// CUSTOM CURSOR
// ============================================
if (!isMobile) {
    const cursor = document.getElementById('custom-cursor');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Instant cursor follow (no lag)
    function animateCursor() {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }
    
    // Update on every mouse move for instant response
    document.addEventListener('mousemove', animateCursor);

    // Cursor hover effects
    document.querySelectorAll('a, button, .playbook-card, .project-card, .btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

// ============================================
// THREE.JS BACKGROUND PARTICLES
// ============================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas-3d'),
    alpha: true,
    antialias: !isMobile
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 5;

// Create particles with better distribution
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = isMobile ? 500 : 1200; // More particles for space feel!
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.025 : 0.02,
    color: 0x00ff88,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true // Makes closer particles bigger
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// ============================================
// ENHANCED SPACE PARTICLES - CREATE FLOATING EFFECT
// ============================================
// Add velocity to each particle for floating motion
const particleVelocities = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    particleVelocities[i] = (Math.random() - 0.5) * 0.02; // Random velocity
}

// ============================================
// PARTICLE ANIMATION (SPACE FLOATING)
// ============================================
let mouseXNorm = 0, mouseYNorm = 0;
let targetRotationY = 0, targetRotationX = 0;

document.addEventListener('mousemove', (e) => {
    mouseXNorm = (e.clientX / window.innerWidth) * 2 - 1;
    mouseYNorm = -(e.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

function animate() {
    requestAnimationFrame(animate);

    // Get particle positions
    const positions = particlesGeometry.attributes.position.array;
    
    // Create floating space effect
    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Apply velocity for floating motion
        positions[i3] += particleVelocities[i3] * 0.5; // X
        positions[i3 + 1] += particleVelocities[i3 + 1] * 0.5; // Y
        positions[i3 + 2] += particleVelocities[i3 + 2] * 0.5; // Z
        
        // Bounce particles back when they go too far (creates endless floating)
        if(Math.abs(positions[i3]) > 15) {
            particleVelocities[i3] *= -1;
        }
        if(Math.abs(positions[i3 + 1]) > 15) {
            particleVelocities[i3 + 1] *= -1;
        }
        if(Math.abs(positions[i3 + 2]) > 15) {
            particleVelocities[i3 + 2] *= -1;
        }
    }
    
    // Update particle positions
    particlesGeometry.attributes.position.needsUpdate = true;

    // Slow rotation for space feeling
    particlesMesh.rotation.y += 0.0003;
    particlesMesh.rotation.x += 0.0002;

    // Subtle mouse interaction
    particlesMesh.rotation.y += mouseXNorm * 0.00015;
    particlesMesh.rotation.x += mouseYNorm * 0.00015;

    renderer.render(scene, camera);
}

animate();

// ============================================
// SMOOTH SCROLLING FOR ALL ANCHOR LINKS (FIXED)
// ============================================
document.addEventListener('click', function(e) {
    // Check if clicked element or its parent is an anchor with hash
    const anchor = e.target.closest('a[href^="#"]');
    
    if (anchor) {
        const href = anchor.getAttribute('href');
        
        // Ignore empty hash or just #
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for any fixed header
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// ============================================
// SCROLL ANIMATIONS (OPTIMIZED)
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Unobserve after animation for better performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.timeline-item, .playbook-card, .project-card, .stat-item, .cricket-image-container').forEach(item => {
    observer.observe(item);
});

// ============================================
// ANIMATED COUNTER FOR STATS
// ============================================
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        let current;
        const endStr = end.toString();
        
        if (endStr.includes('+')) {
            current = Math.floor(progress * parseInt(end)) + '+';
        } else if (endStr.includes('%')) {
            current = Math.floor(progress * parseInt(end)) + '%';
        } else if (endStr.includes('/')) {
            const parts = endStr.split('/');
            current = Math.floor(progress * parseInt(parts[0])) + '/' + parts[1];
        } else if (endStr.includes('.')) {
            current = (progress * parseFloat(end)).toFixed(1);
        } else if (endStr.includes('K')) {
            current = Math.floor(progress * parseInt(end)) + 'K+';
        } else {
            current = Math.floor(progress * parseInt(end));
        }
        
        element.textContent = current;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const valueElement = entry.target.querySelector('.stat-value');
            const endValue = valueElement.dataset.target;
            valueElement.textContent = '0';
            
            setTimeout(() => {
                animateValue(valueElement, 0, endValue, 2000);
            }, 200);
            
            entry.target.dataset.animated = 'true';
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// IMPROVED PARALLAX EFFECT (SMOOTH)
// ============================================
if (!isMobile && !isReducedMotion) {
    let scrollY = window.scrollY;
    let targetScrollY = scrollY;
    let currentScrollY = scrollY;

    function smoothScroll() {
        targetScrollY = window.scrollY;
        currentScrollY += (targetScrollY - currentScrollY) * 0.1;
        
        // Apply subtle parallax to hero
        const hero = document.querySelector('.hero-content');
        if (hero && currentScrollY < window.innerHeight) {
            hero.style.transform = `translateY(${currentScrollY * 0.3}px)`;
            hero.style.opacity = 1 - (currentScrollY / window.innerHeight) * 0.5;
        }
        
        requestAnimationFrame(smoothScroll);
    }
    
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });
    
    smoothScroll();
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 250);
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const createScrollToTop = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--boundary-line);
        color: var(--stadium-dark);
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
    `;
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.pointerEvents = 'auto';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.pointerEvents = 'none';
        }
    }, { passive: true });
    
    document.body.appendChild(scrollBtn);
};

createScrollToTop();

// ============================================
// EASTER EGG: KONAMI CODE
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg: Change particle color to gold
        particlesMaterial.color.setHex(0xffd700);
        
        // Show message
        const message = document.createElement('div');
        message.textContent = '🏏 CENTURY! You found the easter egg!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 215, 0, 0.95);
            color: #0a0e1a;
            padding: 30px 50px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            border: 3px solid #ffd700;
            font-family: 'Bebas Neue', sans-serif;
            letter-spacing: 2px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5);
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.transition = 'opacity 0.5s';
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
                particlesMaterial.color.setHex(0x00ff88);
            }, 500);
        }, 2500);
    }
});

// ============================================
// PAGE LOAD OPTIMIZATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Preload profile image
    const profileImg = document.querySelector('.profile-image');
    if (profileImg && !profileImg.complete) {
        profileImg.addEventListener('load', () => {
            profileImg.style.opacity = '1';
        });
    }
    
    // Initialize scroll position
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
});

// ============================================
// ACTIVE SECTION HIGHLIGHTING (BONUS FEATURE)
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('a[href^="#"]');

const highlightNav = () => {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

if (!isMobile) {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(highlightNav, 50);
    }, { passive: true });
}

(function() {
    'use strict';
    
    // CONFIGURATION & FEATURES
    const FEATURES = { updateURLHash: true, hapticFeedback: false, keyboardNavigation: true, verboseLogging: false };
    const CONFIG = {
        scrollThreshold: 10,       // Lower threshold to detect 'up' movement faster
        sectionOffsetTop: 150,
        transitionDuration: 200,   // Faster animation (was 300)
        hapticDuration: 10,
        observerMargin: '-150px 0px'
    };
    
    // DOM ELEMENTS
    const hudNav = document.getElementById('hudNav');
    const hudContainer = document.querySelector('.hud-container');
    const hudItems = document.querySelectorAll('.hud-item');
    const sections = document.querySelectorAll('section[id]');
    
    if (!hudNav || !hudContainer || hudItems.length === 0) return;

    // STATE
    let lastScrollY = window.scrollY;
    let isScrolling = false;
    let isAutoScrolling = false;
    let activeSection = 'home';
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768;

    // UTILITIES
    const log = (...args) => FEATURES.verboseLogging && console.log('🎯 [HUD]', ...args);
    const triggerHaptic = () => { if (FEATURES.hapticFeedback && isMobile && 'vibrate' in navigator) navigator.vibrate(CONFIG.hapticDuration); };

    // SCROLL HANDLER (SMART HIDE)
    function handleScroll() {
        if (!isScrolling) {
            isScrolling = true;
            
            window.requestAnimationFrame(() => {
                // If we are auto-scrolling (from a click), DO NOT HIDE.
                if (isAutoScrolling) {
                    isScrolling = false;
                    return;
                }

                const currentY = window.scrollY;
                
                // Only hide if we scroll DOWN more than 10px
                const direction = currentY > lastScrollY + 10 ? 'down' : 'up';
                
                // Show if going UP or at the very TOP
                if (currentY < 50 || direction === 'up') {
                    hudNav.classList.remove('hidden');
                } 
                // Hide only if going DOWN and not at top
                else if (direction === 'down') {
                    hudNav.classList.add('hidden');
                }
                
                lastScrollY = currentY;
                isScrolling = false;
            });
        }
    }

    // ACTIVE ITEM UPDATER
    function updateActiveState(sectionId) {
        if (activeSection === sectionId) return;
        activeSection = sectionId;
        
        hudItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // 1. Lock the nav bar so it stays visible
                isAutoScrolling = true; 
                hudNav.classList.remove('hidden'); // Force show
                
                // 2. Scroll smoothly
                window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
                
                // 3. Unlock it after the scroll finishes (approx 1 second)
                setTimeout(() => {
                    isAutoScrolling = false;
                    // Optional: Reset lastScrollY so it doesn't jump
                    lastScrollY = window.scrollY; 
                }, 1000);
            }
        });
    });
        
        if (FEATURES.updateURLHash && history.replaceState) {
            history.replaceState(null, null, `#${sectionId}`);
        }
    }

    // INTERSECTION OBSERVER
    const observer = new IntersectionObserver((entries) => {
        let bestCandidate = null;
        let highestRatio = 0;

        entries.forEach(entry => {
            if (entry.intersectionRatio > highestRatio) {
                highestRatio = entry.intersectionRatio;
                bestCandidate = entry;
            }
        });

        if (bestCandidate && bestCandidate.isIntersecting) {
            updateActiveState(bestCandidate.target.id);
        }
    }, { rootMargin: CONFIG.observerMargin, threshold: [0, 0.25, 0.5, 0.75, 1] });

    sections.forEach(section => observer.observe(section));

    // CLICK HANDLER
    hudItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
                if (isMobile) setTimeout(() => hudNav.classList.add('hidden'), 1000);
            }
        });
    });

    // KEYBOARD NAV
    if (FEATURES.keyboardNavigation) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const currentIdx = Array.from(hudItems).findIndex(i => i.classList.contains('active'));
                const nextIdx = e.key === 'ArrowRight' ? (currentIdx + 1) % hudItems.length : (currentIdx - 1 + hudItems.length) % hudItems.length;
                hudItems[nextIdx].click();
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // INIT ANIMATION
    setTimeout(() => hudNav.classList.add('loaded'), 500);
})();

console.log('🏏 Portfolio loaded successfully! Built with discipline. Deployed with precision.');
console.log('💡 Tip: Try the Konami Code (↑↑↓↓←→←→BA) for a surprise!');
