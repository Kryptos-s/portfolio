/*
====================================
gallery.js - Lightbox for photo cards
====================================
*/

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.js-open-lightbox');
    cards.forEach(card => {
        card.addEventListener('click', () => openLightbox(card));
    });

    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const fullImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    const thumb = element.querySelector('img');
    const descEl = element.querySelector('.desc');

    if (!(thumb && lightbox && fullImg)) return;

    lightbox.classList.add('is-open');

    const fullSrc = thumb.getAttribute('data-full') || thumb.src;
    fullImg.src = fullSrc;

    if (caption) {
        caption.textContent = '';
        const label = document.createElement('span');
        label.className = 'lightbox-label';
        label.textContent = '// RECORD:';
        caption.appendChild(label);
        caption.appendChild(document.createTextNode(' ' + (descEl ? descEl.textContent : 'Image Record')));
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    const fullImg = document.getElementById('lightbox-img');
    if (fullImg) fullImg.src = '';
}
