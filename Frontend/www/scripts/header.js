window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 150) {
        header.style.backgroundColor = 'rgba(16,16,16,0.85)'; 
    } else {
        header.style.backgroundColor = 'var(--header-color)';
    }
});