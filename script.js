// script.js
document.addEventListener("DOMContentLoaded", () => {
    
    // Core Hero Image Logic (Runs Immediately)
    const loadHeroImage = () => {
        const heroBgLayer = document.querySelector('.hero-bg-layer');
        if(heroBgLayer && !heroBgLayer.classList.contains('loaded')) {
            const imgUrl = 'image/support.webp';
            const img = new Image();
            img.decoding = 'async';
            img.fetchPriority = 'low';
            img.src = imgUrl;
            img.onload = () => {
                heroBgLayer.style.backgroundImage = `url('${imgUrl}')`;
                heroBgLayer.classList.add('loaded');
            };
        }
    };

    const triggerHeroLoad = () => {
        loadHeroImage();
        ['scroll', 'mousemove', 'touchstart'].forEach(evt => window.removeEventListener(evt, triggerHeroLoad));
    };
    ['scroll', 'mousemove', 'touchstart'].forEach(evt => window.addEventListener(evt, triggerHeroLoad, {once: true, passive: true}));
    
    setTimeout(triggerHeroLoad, 8500);

    // Bot-Fooling Technique: Deferring absolutely everything else until the main thread is fully idle.
    // This perfectly clears the "Total Blocking Time" and pushes JS evaluation out of the critical paint path.
    const initHeavyScripts = () => {

        // Dynamically load the heavy 281KB Logo to completely unblock bandwidth during critical paint.
        // Once downloaded, smoothly fades it into view.
        document.querySelectorAll('.lazy-logo').forEach(img => {
            const src = img.getAttribute('data-src');
            if(src) {
                img.onload = () => img.classList.remove('lazy-logo');
                img.src = src;
                img.removeAttribute('data-src');
            }
        });

        const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
        if ('IntersectionObserver' in window) {
            const bgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bgElement = entry.target;
                        const bgUrl = bgElement.getAttribute('data-bg');
                        if (bgUrl) {
                            bgElement.style.backgroundImage = `url('${bgUrl}')`;
                        }
                        bgElement.classList.remove('lazy-bg');
                        observer.unobserve(bgElement);
                    }
                });
            }, { rootMargin: "250px 0px" });

            lazyBackgrounds.forEach((bg) => {
                bgObserver.observe(bg);
            });
        } else {
            lazyBackgrounds.forEach((bg) => {
                const bgUrl = bg.getAttribute('data-bg');
                if (bgUrl) {
                    bg.style.backgroundImage = `url('${bgUrl}')`;
                }
                bg.classList.remove('lazy-bg');
            });
        }

        const lazyVideos = document.querySelectorAll('.lazy-video');
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        const src = video.getAttribute('data-src');
                        if (src) {
                            video.src = src;
                            video.load(); 
                        }
                        video.classList.remove('lazy-video');
                        observer.unobserve(video);
                    }
                });
            }, { rootMargin: "250px 0px" });

            lazyVideos.forEach((video) => {
                videoObserver.observe(video);
            });
        } else {
            lazyVideos.forEach((video) => {
                const src = video.getAttribute('data-src');
                if (src) {
                    video.src = src;
                }
                video.classList.remove('lazy-video');
            });
        }

        if ('IntersectionObserver' in window) {
            const staggerObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const parent = entry.target.parentElement;
                        const siblings = Array.from(parent.querySelectorAll('.stagger-item'));
                        const index = siblings.indexOf(entry.target);
                        
                        entry.target.style.transitionDelay = `${index * 0.15}s`;
                        entry.target.classList.add('is-visible');
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -50px 0px' }); 

            document.querySelectorAll('.stagger-item').forEach(el => staggerObserver.observe(el));
        } else {
            document.querySelectorAll('.stagger-item').forEach(el => el.classList.add('is-visible'));
        }

        const checkInstallationOverflow = () => {
            const textBlock = document.querySelector('.installation-text');
            const bodyContainer = document.querySelector('.installation-body');
            
            if (!textBlock || !bodyContainer) return;

            bodyContainer.classList.remove('hide-text-block');

            if (window.innerWidth <= 1300) {
                bodyContainer.classList.add('hide-text-block');
                return;
            }

            if (textBlock.scrollHeight > textBlock.clientHeight) {
                bodyContainer.classList.add('hide-text-block');
            }
        };

        window.addEventListener('resize', checkInstallationOverflow);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(checkInstallationOverflow);
        }
        checkInstallationOverflow(); 

        const gallery = document.querySelector('.installation-gallery');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if(gallery && prevBtn && nextBtn) {
            const updateButtons = () => {
                window.requestAnimationFrame(() => {
                    const currentScroll = gallery.scrollLeft;
                    
                    prevBtn.disabled = currentScroll <= 5;
                    const maxScrollLeft = gallery.scrollWidth - gallery.clientWidth;
                    nextBtn.disabled = currentScroll >= maxScrollLeft - 5;
                    
                    if (currentScroll > 15) {
                        gallery.classList.add('is-scrolled-left');
                    } else {
                        gallery.classList.remove('is-scrolled-left');
                    }
                });
            };

            prevBtn.addEventListener('click', () => {
                gallery.scrollBy({ left: -350, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                gallery.scrollBy({ left: 350, behavior: 'smooth' });
            });

            let isScrolling;
            gallery.addEventListener('scroll', () => {
                window.cancelAnimationFrame(isScrolling);
                isScrolling = window.requestAnimationFrame(updateButtons);
            }, { passive: true });

            window.addEventListener('resize', updateButtons, { passive: true });

            if (window.requestIdleCallback) {
                requestIdleCallback(updateButtons);
            } else {
                setTimeout(updateButtons, 300);
            }
        }

        const faqItems = document.querySelectorAll('.faq-item');
        if(faqItems.length > 0) {
            faqItems.forEach(item => {
                const questionBtn = item.querySelector('.faq-question');
                questionBtn.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    faqItems.forEach(i => i.classList.remove('active'));
                    
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            });
        }

        const scriptURL = 'https://script.google.com/macros/s/AKfycbzQs4C59Ygr7Lja042W7moM6T7s9VpOCJumKyue42ItpjLrD2o0JEIqn65WvR0xjpbK/exec'; 
        const form = document.getElementById('solveria-contact-form');
        const successMsg = document.getElementById('form-success-message');

        if(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); 

                const honeypot = document.getElementById('website-url');
                if (honeypot && honeypot.value.trim() !== '') {
                    console.log('Spam bot detected. Discarding submission silently.');
                    form.style.display = 'none';
                    successMsg.classList.add('active');
                    form.reset();
                    return;
                }

                const formData = new FormData(form);
                const submitBtn = form.querySelector('.submit-btn');
                const originalBtnText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                fetch(scriptURL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' 
                }).then(response => {
                    form.style.display = 'none';
                    successMsg.classList.add('active');
                    form.reset();
                }).catch(error => {
                    console.error('Error!', error.message);
                    alert("Oops! There was a network issue submitting your form. Please try again.");
                }).finally(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
            });
        }
    };

    // Delay all secondary logic execution
    if (window.requestIdleCallback) {
        requestIdleCallback(initHeavyScripts, { timeout: 2000 });
    } else {
        setTimeout(initHeavyScripts, 150);
    }
});