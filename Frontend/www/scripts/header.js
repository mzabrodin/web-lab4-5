window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 150) { // Можна змінити значення для активації на іншій висоті прокрутки
        header.style.backgroundColor = 'rgba(16,16,16,0.85)'; // Напівпрозорий фон
    } else {
        header.style.backgroundColor = 'var(--header-color)'; // Початковий фон
    }
});