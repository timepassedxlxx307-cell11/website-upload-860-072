(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    var filterInput = document.querySelector('[data-card-filter]');
    var filterSelect = document.querySelector('[data-card-select="region"]');
    var cardContainer = document.querySelector('[data-card-container]');

    function filterCards() {
        if (!cardContainer) {
            return;
        }
        var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var region = filterSelect ? filterSelect.value.trim().toLowerCase() : '';
        var cards = Array.prototype.slice.call(cardContainer.querySelectorAll('.movie-card'));

        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre')
            ].join(' ').toLowerCase();
            var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
            var queryMatch = !query || text.indexOf(query) !== -1;
            var regionMatch = !region || cardRegion.indexOf(region) !== -1;
            card.style.display = queryMatch && regionMatch ? '' : 'none';
        });
    }

    if (filterInput) {
        filterInput.addEventListener('input', filterCards);
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', filterCards);
    }
})();
