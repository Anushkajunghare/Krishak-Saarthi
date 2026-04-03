// Krishak Saarthi - Optimized Premium Logic

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    const body = document.body;
    
    // UI Elements
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    const progressBar = document.getElementById('scroll-progress-bar');
    
    // Performance Variables
    let tick = false;
    let mouseX = 0, mouseY = 0;
    
    // Check if mobile (Disable heavy effects)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
        body.style.cursor = 'auto';
    }

    // 0. Splash Screen Management
    body.classList.add('intro-active');
    
    const splashTimer = setTimeout(() => {
        body.classList.remove('intro-active');
        body.classList.add('loaded');
        
        setTimeout(() => {
            const observer = createObserver();
            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        }, 300);
    }, 2800);

    // 1. Reveal Elements on Scroll using Intersection Observer
    function createObserver() {
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve to save memory once shown
                    // entry.target.classList.contains('no-repeat') && observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    }

    // 2. Optimized Cursor Animation (RAF)
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!tick) {
                requestAnimationFrame(updateCursor);
                tick = true;
            }
        });

        function updateCursor() {
            cursor.style.transform = `translate3d(${mouseX - 5}px, ${mouseY - 5}px, 0)`;
            follower.style.transform = `translate3d(${mouseX - 20}px, ${mouseY - 20}px, 0)`;
            
            // Hero Parallax optimization
            if (hero && heroContent && window.scrollY < window.innerHeight) {
                const moveX = (mouseX - window.innerWidth / 2) * 0.015;
                const moveY = (mouseY - window.innerHeight / 2) * 0.015;
                heroContent.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            }
            
            tick = false;
        }
    }

    // 3. Magnetic Hover & Interaction Listeners
    const interactiveElements = document.querySelectorAll('a, button, .btn, .impact-card, .usp-card, .team-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => {
            body.classList.remove('cursor-hover');
            if (el.classList.contains('btn')) el.style.transform = 'translate3d(0, 0, 0)';
        });
        
        if (el.classList.contains('btn') && !isMobile) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
                el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        }
    });

    // 4. Throttled Scroll Listener
    let scrollTick = false;
    window.addEventListener('scroll', () => {
        if (!scrollTick) {
            requestAnimationFrame(updateScrollElements);
            scrollTick = true;
        }
    });

    function updateScrollElements() {
        const scrollY = window.scrollY;
        
        // Navbar State
        if (scrollY > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        // Progress Bar
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;
        
        scrollTick = false;
    }

    // 5. Native Smooth Scrolling enhancement
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - navbar.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
});
