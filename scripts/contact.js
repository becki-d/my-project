document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('hcaptcha-modal');
    let formData;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form fields
        if (!validateForm()) {
            return;
        }
        
        // Store form data
        formData = new FormData(form);
        
        // Show hCaptcha modal
        modal.style.display = 'flex';
    });

    function validateForm() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const fileInput = document.getElementById('attachment');
        
        // Check required fields
        if (!firstName || !lastName || !email || !subject || !message) {
            showResponse('Please fill all required fields', 'error');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showResponse('Please enter a valid email address', 'error');
            return false;
        }
        
        // Check file size if file is selected
        if (fileInput.files[0] && fileInput.files[0].size > 5000000) {
            showResponse('File size must be less than 5MB', 'error');
            return false;
        }
        
        return true;
    }

    function showResponse(message, type) {
        const responseDiv = document.getElementById('form-response');
        responseDiv.textContent = message;
        responseDiv.className = `form-response ${type}`;
        setTimeout(() => {
            responseDiv.style.opacity = '1';
        }, 100);
        
        // Hide after 5 seconds
        setTimeout(() => {
            responseDiv.style.opacity = '0';
            setTimeout(() => {
                responseDiv.className = 'form-response';
            }, 300);
        }, 5000);
    }

    // Rest of your existing modal handling code...
    document.getElementById('submit-captcha').addEventListener('click', async () => {
        const captchaResponse = hcaptcha.getResponse();
        
        if (!captchaResponse) {
            showResponse('Please complete the hCaptcha', 'error');
            return;
        }

        // Add hCaptcha to form data
        formData.append('h-captcha-response', captchaResponse);
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                showResponse('Message sent successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            showResponse('Error: ' + error.message, 'error');
        } finally {
            modal.style.display = 'none';
            hcaptcha.reset();
        }
    });

    document.getElementById('cancel-captcha').addEventListener('click', () => {
        modal.style.display = 'none';
        hcaptcha.reset();
    });
});