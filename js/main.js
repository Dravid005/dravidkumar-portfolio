/* ============================================
   DRAVID KUMAR PORTFOLIO - JAVASCRIPT
   3D Effects, Animations, and Interactions
   ============================================ */

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('custom-cursor');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

document.querySelectorAll('a, button, .playbook-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// ============================================
// THREE.JS BACKGROUND PARTICLES
// ============================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas-3d'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance
camera.position.z = 5;

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = window.innerWidth < 768 ? 400 : 800; // Fewer particles on mobile
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: 0x00ff88,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// ============================================
// 3D CRICKET BALL (HERO SECTION)
// ============================================
let cricketBall = null;
const cricketBallContainer = document.getElementById('cricket-ball-container');

if (cricketBallContainer) {
    const ballScene = new THREE.Scene();
    const ballCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const ballRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    ballRenderer.setSize(150, 150);
    ballRenderer.setPixelRatio(window.devicePixelRatio);
    cricketBallContainer.appendChild(ballRenderer.domElement);
    
    // Create cricket ball
    const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b0000,
        shininess: 30,
        specular: 0x444444
    });
    
    cricketBall = new THREE.Mesh(ballGeometry, ballMaterial);
    ballScene.add(cricketBall);
    
    // Add cricket seam (white lines)
    const seamGeometry = new THREE.TorusGeometry(1.01, 0.02, 8, 50);
    const seamMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const seam = new THREE.Mesh(seamGeometry, seamMaterial);
    seam.rotation.x = Math.PI / 2;
    ballScene.add(seam);
    
    // Lighting
    const ballLight = new THREE.PointLight(0xffffff, 1, 100);
    ballLight.position.set(5, 5, 5);
    ballScene.add(ballLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    ballScene.add(ambientLight);
    
    ballCamera.position.z = 3;
    
    // Animate cricket ball
    function animateBall() {
        requestAnimationFrame(animateBall);
        
        if (cricketBall) {
            cricketBall.rotation.y += 0.01;
            cricketBall.rotation.x += 0.005;
        }
        
        ballRenderer.render(ballScene, ballCamera);
    }
    
    animateBall();
}

// ============================================
// PARTICLE ANIMATION
// ============================================
let mouseXNorm = 0, mouseYNorm = 0;

document.addEventListener('mousemove', (e) => {
    mouseXNorm = (e.clientX / window.innerWidth) * 2 - 1;
    mouseYNorm = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0003;

    // Mouse interaction
    particlesMesh.rotation.y += mouseXNorm * 0.0002;
    particlesMesh.rotation.x += mouseYNorm * 0.0002;

    renderer.render(scene, camera);
}

animate();

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));
document.querySelectorAll('.playbook-card').forEach(card => observer.observe(card));
document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
document.querySelectorAll('.stat-item').forEach(stat => observer.observe(stat));

// Observe cricket image
const cricketImageContainer = document.querySelector('.cricket-image-container');
if (cricketImageContainer) {
    observer.observe(cricketImageContainer);
}

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
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
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// PARALLAX EFFECT ON SCROLL
// ============================================
let ticking = false;
let lastScrollY = window.scrollY;

function updateParallax() {
    const scrollY = window.scrollY;
    
    // Parallax for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
    
    // Update particles based on scroll
    if (particlesMesh) {
        particlesMesh.rotation.z = scrollY * 0.0001;
    }
    
    ticking = false;
}

function onScroll() {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Reduce animations on mobile for better performance
const isMobile = window.innerWidth < 768;

if (isMobile) {
    // Disable custom cursor on mobile
    if (cursor) {
        cursor.style.display = 'none';
    }
    
    // Reduce particle count (already done in particle creation)
    // Disable parallax on mobile
    window.removeEventListener('scroll', onScroll);
}

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
            background: rgba(255, 215, 0, 0.9);
            color: #0a0e1a;
            padding: 30px 50px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            border: 3px solid #ffd700;
            font-family: 'Bebas Neue', sans-serif;
            letter-spacing: 2px;
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
            particlesMaterial.color.setHex(0x00ff88);
        }, 3000);
    }
});

// ============================================
// LOADING OPTIMIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical assets
    const preloadImages = () => {
        // Add any image preloading here when images are added
    };
    
    preloadImages();
    
    // Add loaded class to body
    document.body.classList.add('loaded');
});

// ============================================
// SCROLL TO TOP BUTTON (Optional Enhancement)
// ============================================
const createScrollToTop = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
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
        display: none;
    `;
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.display = 'block';
            setTimeout(() => scrollBtn.style.opacity = '1', 10);
        } else {
            scrollBtn.style.opacity = '0';
            setTimeout(() => scrollBtn.style.display = 'none', 300);
        }
    });
    
    document.body.appendChild(scrollBtn);
};

// Uncomment to enable scroll to top button
// createScrollToTop();

console.log('🏏 Portfolio loaded successfully! Built with discipline. Deployed with precision.');