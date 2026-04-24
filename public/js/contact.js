/*
contact.js — contact form handler.
*/

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-valid', 'is-invalid');
            input.classList.add(input.checkValidity() ? 'is-valid' : 'is-invalid');
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const btn = form.querySelector('button');
        const originalText = btn.textContent;

        try {
            btn.textContent = 'TRANSMITTING...';
            btn.disabled = true;
            btn.classList.add('is-busy');

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert(`// sent. ${result.message}\nref: ${result.messageId}`);
                form.reset();
                inputs.forEach(i => i.classList.remove('is-valid', 'is-invalid'));
            } else {
                alert(`// error: ${result.message || 'rejected.'}`);
            }
        } catch (error) {
            alert('// network error. server unreachable.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('is-busy');
        }
    });
});
