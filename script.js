document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwp8vGsz_tXG8CwpAQr6wkYO1KdT5Q5iovzU_0hg91Maa06fLjc13UrqlpTnFkSsvis/exec';

    // 1. FORM HANDLING
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang kết nối...';
            if (formError) formError.style.display = 'none';

            const formData = new FormData(leadForm);
            const params = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                params.append(key, value);
            }

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    body: params.toString()
                });

                // Success Animation
                leadForm.style.transition = 'opacity 0.5s ease';
                leadForm.style.opacity = '0';
                setTimeout(() => {
                    leadForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.style.display = 'block';
                        formSuccess.style.opacity = '0';
                        formSuccess.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            formSuccess.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
                            formSuccess.style.opacity = '1';
                            formSuccess.style.transform = 'translateY(0)';
                        }, 50);
                    }
                }, 500);

            } catch (error) {
                console.error('Submission error:', error);
                if (formError) {
                    formError.textContent = 'Kết nối gián đoạn. Vui lòng thử lại hoặc nhắn tin Zalo.';
                    formError.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // 2. FAQ ACCORDION
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            const isOpen = question.classList.contains('open');
            
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('open');
                q.querySelector('i').className = 'fas fa-chevron-down';
            });
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.style.display = 'none';
            });
            
            if (!isOpen) {
                question.classList.add('open');
                icon.className = 'fas fa-chevron-up';
                answer.style.display = 'block';
            }
        });
    });

    // 3. BACKGROUND PARALLAX
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // 4. SCROLL REVEAL (WOW FACTOR)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal classes
    document.querySelectorAll('.rule-item, .pr-card, .bank-card, .faq-item, .hero-content, .hero-image-v2').forEach((item, index) => {
        item.classList.add('reveal');
        // Staggered delay logic
        item.style.transitionDelay = `${(index % 3) * 0.1}s`;
        observer.observe(item);
    });

    // Add required reveal styles dynamically to avoid layout shift before JS loads
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal-active {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});
