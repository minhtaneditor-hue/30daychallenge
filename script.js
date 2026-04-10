document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CORE ELEMENT REFERENCES ---
    const leadForm = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiDoAZOqbUOV1iClo63CfttF1lnX81qDp2lTHruOXZyFf-e_jV0OZyk4K695f_fRwC/exec';

    // --- 2. SMOOTH ACCORDION LOGIC ---
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const icon = trigger.querySelector('i');
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.faq-trigger i').forEach(i => i.className = 'fas fa-plus');

            // Toggle current if not previously active
            if (!isActive) {
                item.classList.add('active');
                icon.className = 'fas fa-minus';
            }
        });
    });

    // --- 3. STAGGERED REVEAL SYSTEM ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach((el, index) => {
        revealObserver.observe(el);
    });

    // --- 4. FORM SUBMISSION ---
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            const originalLabel = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> CONNECTING...';

            const data = {};
            formData.forEach((value, key) => data[key] = value);

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                // Transition to success
                leadForm.style.transition = 'all 0.5s var(--ease-out-expo)';
                leadForm.style.opacity = '0';
                leadForm.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    leadForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    // Trigger inner success animations if needed
                }, 500);

            } catch (err) {
                console.error(err);
                if (formError) {
                    formError.textContent = 'NETWORK ERROR. PLEASE MESSAGE ZALO.';
                    formError.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            }
        });
    }

    // --- 5. PARALLAX VISUALS ---
    const bgGlows = document.querySelectorAll('.mesh-glow');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        bgGlows.forEach((glow, i) => {
            const speed = (i + 1) * 0.1;
            glow.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Handle Parallax on Mouse (Desktop only)
    if (window.innerWidth > 1024) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 50;
            const y = (e.clientY / window.innerHeight - 0.5) * 50;
            
            bgGlows.forEach((glow, i) => {
                const multi = (i + 1) * 0.5;
                glow.style.transform += ` translate(${x * multi}px, ${y * multi}px)`;
            });
        });
    }
});
