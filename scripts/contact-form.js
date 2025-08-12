// hCaptcha Modal Logic
const hcaptchaModal = document.getElementById('hcaptcha-modal');
const verifyBtn = document.getElementById('verify-captcha');
const cancelBtn = document.getElementById('cancel-captcha');

document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Basic validation first
    if (!validateForm()) return;
    
    // Show hCaptcha modal instead of submitting directly
    hcaptchaModal.style.display = 'flex';
});

verifyBtn.addEventListener('click', async () => {
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    // Show loading state
    submitBtn.classList.add('is-submitting');
    submitBtn.disabled = true;
    hcaptchaModal.style.display = 'none';
    
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
        showResponse(error.message || 'An error occurred', 'error');
    } finally {
        submitBtn.classList.remove('is-submitting');
        submitBtn.disabled = false;
        hcaptcha.reset();
    }
});

cancelBtn.addEventListener('click', () => {
    hcaptchaModal.style.display = 'none';
    hcaptcha.reset();
});

function validateForm() {
    // Basic form validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !message) {
        showResponse('Please fill all required fields', 'error');
        return false;
    }
    
    // File validation
    const fileInput = document.getElementById('attachment');
    if (fileInput.files[0] && fileInput.files[0].size > 5000000) {
        showResponse('File size must be less than 5MB', 'error');
        return false;
    }
    
    return true;
}

// Rest of your existing JS (showResponse, etc.) remains the same






document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const modal = document.getElementById('hcaptcha-modal');
  let formData;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Store form data
    formData = new FormData(form);
    
    // Show hCaptcha modal
    modal.style.display = 'flex';
  });

  document.getElementById('submit-captcha').addEventListener('click', async () => {
    const captchaResponse = hcaptcha.getResponse();
    
    if (!captchaResponse) {
      alert('Please complete the hCaptcha');
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
        alert('Message sent successfully!');
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
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




// DOM Elements
const hcaptchaModal = document.getElementById('hcaptcha-modal');
const verifyBtn = document.getElementById('verify-captcha');
const cancelBtn = document.getElementById('cancel-captcha');
const contactForm = document.getElementById('contact-form');

// Form Submission Handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
        hcaptchaModal.style.display = 'flex';
    }
});

// Verify Captcha
verifyBtn.addEventListener('click', async () => {
    const submitBtn = contactForm.querySelector('#submit-btn');
    
    // Show loading state
    submitBtn.classList.add('is-submitting');
    submitBtn.disabled = true;
    hcaptchaModal.style.display = 'none';

    try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            showResponse('Message sent successfully!', 'success');
            contactForm.reset();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        showResponse(error.message || 'An error occurred', 'error');
    } finally {
        submitBtn.classList.remove('is-submitting');
        submitBtn.disabled = false;
        if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
    }
});

// Cancel Captcha
cancelBtn.addEventListener('click', () => {
    hcaptchaModal.style.display = 'none';
    if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
});

// Helper Functions
function validateForm() {
    // ... (previous validation code)
}

function showResponse(message, type) {
    // ... (previous response handler code)
}





