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
});