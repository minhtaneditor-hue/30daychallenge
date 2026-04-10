document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    // Replace this with your Google Apps Script Web App URL after deployment
    const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if URL is configured
        if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            alert('Vui lòng cấu hình SCRIPT_URL trong file script.js để gửi dữ liệu.');
            return;
        }

        // UI State
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        formMessage.style.display = 'none';

        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Show Success UI
            leadForm.style.display = 'none';
            formSuccess.style.display = 'block';

        } catch (error) {
            console.error('Error!', error.message);
            formError.textContent = 'Có lỗi xảy ra. Vui lòng nhắn tin trực tiếp qua Zalo để được hỗ trợ.';
            formError.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Thử lại';
        }
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

    // Simple scroll animation for cards
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

    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});
