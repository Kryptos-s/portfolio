/*
gallery.js — lightbox with carousel navigation.
*/

let galleryCards = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    galleryCards = Array.from(document.querySelectorAll('.js-open-lightbox'));
    galleryCards.forEach((card, i) => {
        card.addEventListener('click', () => openLightbox(i));
    });

    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev')?.addEventListener('click', () => navigate(-1));
    document.querySelector('.lightbox-next')?.addEventListener('click', () => navigate(1));

    document.getElementById('lightbox')?.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox?.classList.contains('is-open')) return;
        if (e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'Escape')     closeLightbox();
    });
});

function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    document.getElementById('lightbox')?.classList.add('is-open');
}

function navigate(dir) {
    currentIndex = (currentIndex + dir + galleryCards.length) % galleryCards.length;
    renderLightbox();
}

function renderLightbox() {
    const card    = galleryCards[currentIndex];
    const thumb   = card.querySelector('img');
    const descEl  = card.querySelector('.desc');
    const fullImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');

    if (!thumb || !fullImg) return;

    fullImg.src = thumb.getAttribute('data-full') || thumb.src;

    if (caption) {
        caption.textContent = '';
        const label = document.createElement('span');
        label.className = 'lightbox-label';
        label.textContent = '// RECORD:';
        caption.appendChild(label);
        caption.appendChild(document.createTextNode(' ' + (descEl ? descEl.textContent : 'Image Record')));
    }

    if (counter) {
        counter.textContent = `[ ${currentIndex + 1} / ${galleryCards.length} ]`;
    }

    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const show = galleryCards.length > 1;
    if (prevBtn) prevBtn.style.display = show ? '' : 'none';
    if (nextBtn) nextBtn.style.display = show ? '' : 'none';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    const fullImg = document.getElementById('lightbox-img');
    if (fullImg) fullImg.src = '';
}
