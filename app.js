document.addEventListener("DOMContentLoaded", () => {
    /* ------------------------------
       HAMBURGER MENU
    --------------------------------*/
    const hamburger = document.querySelector(".hamburger");
    const navUl = document.querySelector(".nav ul");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navUl.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    /* ------------------------------
       ENHANCED SCROLL-TOP BUTTON
    --------------------------------*/
    const scrollBtn = document.querySelector(".scroll-top");
    
    if (scrollBtn) {
        let lastScrollTop = 0;
        
        window.addEventListener("scroll", () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show/hide based on scroll position
            if (scrollTop > 300) {
                scrollBtn.classList.add("visible");
                
                // Add subtle scale effect based on scroll direction
                if (scrollTop > lastScrollTop) {
                    // Scrolling down
                    scrollBtn.style.transform = "scale(0.95)";
                } else {
                    // Scrolling up
                    scrollBtn.style.transform = "scale(1.05)";
                }
            } else {
                scrollBtn.classList.remove("visible");
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            
            // Progress indicator
            updateScrollProgress(scrollTop);
        });

        // Click handler with enhanced feedback
        scrollBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Add click feedback
            scrollBtn.style.animation = "clickSquash 0.3s ease-in-out";
            
            // Scroll to top
            window.scrollTo({ 
                top: 0, 
                behavior: "smooth" 
            });
            
            // Reset animation after click
            setTimeout(() => {
                scrollBtn.style.animation = "";
            }, 300);
        });

        // Mouse enter/leave effects
        scrollBtn.addEventListener("mouseenter", () => {
            scrollBtn.setAttribute('data-hover', 'true');
        });

        scrollBtn.addEventListener("mouseleave", () => {
            scrollBtn.setAttribute('data-hover', 'false');
        });

        // Scroll progress indicator
        function updateScrollProgress(scrollTop) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (scrollTop / docHeight) * 100;
            
            // Create progress ring around the button
            scrollBtn.style.setProperty('--scroll-progress', `${scrollProgress}%`);
        }
    }

    /* ------------------------------
       CAROUSEL (if exists)
    --------------------------------*/
    const carousel = document.querySelector(".carousel");

    if (carousel) {
        const slides = document.querySelectorAll(".carousel-slide");
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove("active");
            current = (current + 1) % slides.length;
            slides[current].classList.add("active");
        }, 7000);
    }

    /* ------------------------------
       EVENT FILTER BUTTONS
    --------------------------------*/
    const filterBtns = document.querySelectorAll(".filter button");
    const eventCards = document.querySelectorAll(".event-card");

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.dataset.filter;

                eventCards.forEach(card => {
                    card.style.display =
                        filter === "all" || card.dataset.category === filter
                            ? "block"
                            : "none";
                });
            });
        });
    }

    /* ------------------------------
       ENHANCED GALLERY LIGHTBOX WITH NAVIGATION
    --------------------------------*/
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const lightboxTitle = document.querySelector(".lightbox-title");
    const lightboxDescription = document.querySelector(".lightbox-description");

    let currentImageIndex = 0;
    let galleryImages = [];

    // Initialize gallery
    function initGallery() {
        galleryImages = Array.from(document.querySelectorAll(".gallery-item"));
        
        galleryImages.forEach((item, index) => {
            const img = item.querySelector(".gallery-img");
            const title = item.querySelector(".gallery-title")?.textContent || img.alt || `Event ${index + 1}`;
            const description = item.querySelector(".gallery-description")?.textContent || '';
            
            // Store data
            item.setAttribute('data-index', index);
            item.setAttribute('data-title', title);
            item.setAttribute('data-description', description);
            
            // Add click event
            item.addEventListener("click", () => {
                openLightbox(index);
            });
        });
    }

    function openLightbox(index) {
        currentImageIndex = index;
        const item = galleryImages[index];
        const img = item.querySelector(".gallery-img");
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.classList.remove("zoomed");
        
        // Set title and description
        if (lightboxTitle && lightboxDescription) {
            lightboxTitle.textContent = item.getAttribute('data-title');
            lightboxDescription.textContent = item.getAttribute('data-description');
        }
        
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
        
        // Update navigation buttons state
        updateNavButtons();
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "auto";
        lightboxImg.classList.remove("zoomed");
    }

    function navigate(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }
        
        openLightbox(currentImageIndex);
    }

    function updateNavButtons() {
        if (prevBtn && nextBtn) {
            prevBtn.style.display = galleryImages.length > 1 ? 'flex' : 'none';
            nextBtn.style.display = galleryImages.length > 1 ? 'flex' : 'none';
        }
    }

    // Zoom functionality
    function toggleZoom() {
        lightboxImg.classList.toggle("zoomed");
    }

    // Initialize gallery if lightbox exists
    if (lightbox && lightboxImg) {
        initGallery();
        
        // Close lightbox
        closeBtn.addEventListener("click", closeLightbox);
        
        // Navigation
        if (prevBtn) prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navigate(-1);
        });
        if (nextBtn) nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navigate(1);
        });
        
        // Zoom on image click
        lightboxImg.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleZoom();
        });
        
        // Close on background click
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("active")) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigate(-1);
                    break;
                case 'ArrowRight':
                    navigate(1);
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    toggleZoom();
                    break;
            }
        });
    }

    /* ------------------------------
       PARTICLE BACKGROUND (if exists)
    --------------------------------*/
    const canvas = document.getElementById("particles");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        const mouse = { x: null, y: null };

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1.5 - 0.75;
                this.speedY = Math.random() * 1.5 - 0.75;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

                // Mouse repulsion
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x -= dx / 15;
                    this.y -= dy / 15;
                }
            }

            draw() {
                ctx.fillStyle = "#d500f9";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 150; i++) particles.push(new Particle());
        };

        const connectParticles = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(213,104,200, ${1 - distance / 120})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            connectParticles();
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };

        initParticles();
        animateParticles();

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });
    }

    /* ------------------------------
       MAP ANIMATIONS AND COUNTERS
    --------------------------------*/
    function initMapAnimations() {
        // Counter animation for stats
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const statNumber = entry.target;
                        const target = parseInt(statNumber.getAttribute('data-count'));
                        const duration = 2000; // 2 seconds
                        const step = target / (duration / 16); // 60fps
                        let current = 0;
                        
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                statNumber.textContent = target.toLocaleString();
                                clearInterval(timer);
                            } else {
                                statNumber.textContent = Math.floor(current).toLocaleString();
                            }
                        }, 16);
                        
                        observer.unobserve(statNumber);
                    }
                });
            }, { threshold: 0.5 });
            
            statNumbers.forEach(stat => observer.observe(stat));
        }
        
        // Map loading animation
        const mapIframe = document.querySelector('.map-iframe iframe');
        const mapWrapper = document.querySelector('.map-wrapper');
        
        if (mapIframe && mapWrapper) {
            // Create loading overlay
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'map-loading';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading Map...</div>
            `;
            
            mapWrapper.appendChild(loadingOverlay);
            
            // Remove loading overlay when iframe loads
            mapIframe.addEventListener('load', () => {
                loadingOverlay.style.opacity = '0';
                loadingOverlay.style.transform = 'translate(-50%, -50%) scale(0.8)';
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            });
        }
        
        // Interactive map pins animation
        createMapPins();
    }

    function createMapPins() {
        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) return;
        
        // Create floating pins/particles around the map
        for (let i = 0; i < 8; i++) {
            const pin = document.createElement('div');
            pin.className = 'map-pin';
            pin.style.cssText = `
                position: absolute;
                width: 30px;
                height: 30px;
                background: radial-gradient(circle, #e9c600ff, transparent);
                border-radius: 50%;
                z-index: 3;
                pointer-events: none;
                animation: pinFloat ${3 + i * 0.5}s ease-in-out infinite;
                animation-delay: ${i * 0.2}s;
                left: ${10 + (i * 10)}%;
                top: ${20 + (i * 7)}%;
            `;
            
            mapContainer.appendChild(pin);
        }
        
        // Add CSS for pin animation
        if (!document.querySelector('#pin-animation-style')) {
            const style = document.createElement('style');
            style.id = 'pin-animation-style';
            style.textContent = `
                @keyframes pinFloat {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                        opacity: 0.7;
                    }
                    50% {
                        transform: translateY(-20px) scale(1.1);
                        opacity: 0.9;
                    }
                }
                
                .map-pin::before {
                    content: '📍';
                    position: absolute;
                    font-size: 20px;
                    top: -10px;
                    left: -5px;
                    filter: drop-shadow(0 0 5px rgba(103, 2, 121, 0.7));
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ------------------------------
       FOOTER ANIMATIONS
    --------------------------------*/
    function initFooterParticles() {
        const particlesContainer = document.querySelector('.footer-particles');
        if (!particlesContainer) return;
        
        // Clear existing particles
        particlesContainer.innerHTML = '';
        
        // Create particles with random directions from center
        const particleCount = window.innerWidth < 768 ? 8 : 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random angle and distance for each particle
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.cssText = `
                --i: ${Math.random() * 10};
                --x: ${x}px;
                --y: ${y}px;
                animation-duration: ${Math.random() * 8 + 6}s;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    function initFooterAnimations() {
        // Animate year counter
        const yearElement = document.querySelector('.year');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = currentYear;
            yearElement.setAttribute('data-year', currentYear);
            
            // Restart pulse animation every 2 seconds
            setInterval(() => {
                yearElement.style.animation = 'none';
                setTimeout(() => {
                    yearElement.style.animation = 'yearPulse 2s ease-in-out infinite';
                }, 10);
            }, 2000);
        }
        
        // Social link hover effects
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const icon = link.querySelector('.social-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(15deg)';
                }
            });
            
            link.addEventListener('mouseleave', () => {
                const icon = link.querySelector('.social-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
        
        // Create particles for footer background
        initFooterParticles();
    }

    /* ------------------------------
       INITIALIZE ALL COMPONENTS
    --------------------------------*/
    
    // Initialize map animations
    initMapAnimations();
    
    // Initialize footer animations
    initFooterAnimations();
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reinitialize footer particles on resize
            initFooterParticles();
            
            // Resize canvas if exists
            const canvas = document.getElementById("particles");
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                // Reinitialize particles
                if (window.initParticles) {
                    window.initParticles();
                }
            }
        }, 250);
    });
    
    // Expose initParticles globally for resize handling
    if (canvas) {
        window.initParticles = () => {
            if (window.initParticlesFunc) {
                window.initParticlesFunc();
            }
        };
    }
});

// Helper function to check button styles (for debugging)
function checkButtonStyles() {
    const btn = document.querySelector('.event-card .btn');
    if (btn) {
        console.log('Button styles:', window.getComputedStyle(btn));
        console.log('Margin left:', window.getComputedStyle(btn).marginLeft);
        console.log('Margin right:', window.getComputedStyle(btn).marginRight);
        console.log('Display:', window.getComputedStyle(btn).display);
        console.log('Button is centered:', 
            window.getComputedStyle(btn).marginLeft === 'auto' && 
            window.getComputedStyle(btn).marginRight === 'auto'
        );
    }
}

// Run on page load to verify button centering
window.addEventListener('load', () => {
    // Check button centering after all styles are loaded
    setTimeout(checkButtonStyles, 500);
});