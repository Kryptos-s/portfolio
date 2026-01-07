/*
====================================
contact.js - Contact Form Handler
====================================
*/

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    
    // If we are not on the contact page, stop running
    if (!form) return;

    // 1. Visual Validation (Green/Red border on typing)
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.checkValidity()) {
                input.style.borderColor = 'var(--color-accent)'; // Green/Teal
            } else {
                input.style.borderColor = '#FF4444'; // Red
            }
        });
    });

    // 2. Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Let the browser show standard HTML5 error bubbles if invalid
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Prepare data for the backend
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const btn = form.querySelector('button');
        const originalText = btn.textContent;

        try {
            // Visual Feedback
            btn.textContent = "TRANSMITTING...";
            btn.disabled = true;
            btn.style.opacity = "0.7";

            // Send to Server
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert(`// SUCCESS: ${result.message}\nReference ID: ${result.messageId}`);
                form.reset();
                // Reset border colors
                inputs.forEach(i => i.style.borderColor = 'var(--color-border)');
            } else {
                // Backend validation error (e.g. invalid email format)
                alert(`// ERROR: ${result.message}`);
                if (result.errors) {
                    console.error(result.errors);
                }
            }

        } catch (error) {
            console.error("Transmission Error:", error);
            alert("// SYSTEM ERROR: Connection to server failed.");
        } finally {
            // Restore button
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
        }
    });
});