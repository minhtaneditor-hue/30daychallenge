document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwp8vGsz_tXG8CwpAQr6wkYO1KdT5Q5iovzU_0hg91Maa06fLjc13UrqlpTnFkSsvis/exec';

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // UI State
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
            if (formError) formError.style.display = 'none';

            const formData = new FormData(leadForm);
            
            // Convert FormData to URLSearchParams for better compatibility with Apps Script (no-cors)
            const params = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                params.append(key, value);
            }

            try {
                // Using fetch with 'no-cors'
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString()
                });

                // Show Success UI
                leadForm.style.display = 'none';
                if (formSuccess) formSuccess.style.display = 'block';

            } catch (error) {
                console.error('Submission error:', error);
                if (formError) {
                    formError.textContent = 'Có lỗi xảy ra. Vui lòng nhắn tin trực tiếp qua Zalo để được hỗ trợ.';
                    formError.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.textContent = 'Thử lại';
            }
        });
    }

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('open');
            
            // Close all others
            document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('open'));
            document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
            
            if (!isOpen) {
                question.classList.add('open');
                answer.style.display = 'block';
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple scroll animation for components
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .rule-item, .pr-card').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
});
