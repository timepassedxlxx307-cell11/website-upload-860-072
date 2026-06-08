(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function initMobileMenu() {
        var button = qs('[data-mobile-menu-button]');
        var panel = qs('[data-mobile-panel]');

        if (!button || !panel) {
            return;
        }

        button.addEventListener('click', function () {
            var isOpen = panel.classList.toggle('is-open');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    function initHeroCarousel() {
        var carousel = qs('[data-hero-carousel]');

        if (!carousel) {
            return;
        }

        var slides = qsa('[data-hero-slide]', carousel);
        var dots = qsa('[data-hero-dot]', carousel);
        var prev = qs('[data-hero-prev]', carousel);
        var next = qs('[data-hero-next]', carousel);
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initFilters() {
        qsa('[data-filter-panel]').forEach(function (panel) {
            var input = qs('[data-filter-input]', panel);
            var categorySelect = qs('[data-category-filter]', panel);
            var yearSelect = qs('[data-year-filter]', panel);
            var regionSelect = qs('[data-region-filter]', panel);
            var tags = qsa('[data-filter-value]', panel);
            var grid = panel.parentElement ? qs('[data-filter-grid]', panel.parentElement) : null;

            if (!grid) {
                return;
            }

            var cards = qsa('[data-title]', grid);
            var activeTag = '';

            function applyFilter() {
                var keyword = normalize(input ? input.value : '');
                var category = normalize(categorySelect ? categorySelect.value : activeTag);
                var year = normalize(yearSelect ? yearSelect.value : '');
                var region = normalize(regionSelect ? regionSelect.value : '');

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-category'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-region'),
                        card.textContent
                    ].join(' '));
                    var matched = true;

                    if (keyword && haystack.indexOf(keyword) === -1) {
                        matched = false;
                    }

                    if (category && normalize(card.getAttribute('data-category')).indexOf(category) === -1) {
                        matched = false;
                    }

                    if (year && normalize(card.getAttribute('data-year')) !== year) {
                        matched = false;
                    }

                    if (region && normalize(card.getAttribute('data-region')) !== region) {
                        matched = false;
                    }

                    card.classList.toggle('is-hidden-by-filter', !matched);
                });
            }

            if (input) {
                input.addEventListener('input', applyFilter);
            }
            if (categorySelect) {
                categorySelect.addEventListener('change', applyFilter);
            }
            if (yearSelect) {
                yearSelect.addEventListener('change', applyFilter);
            }
            if (regionSelect) {
                regionSelect.addEventListener('change', applyFilter);
            }

            tags.forEach(function (tag) {
                tag.addEventListener('click', function () {
                    activeTag = tag.getAttribute('data-filter-value') || '';
                    tags.forEach(function (item) {
                        item.classList.toggle('is-active', item === tag);
                    });
                    applyFilter();
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHeroCarousel();
        initFilters();
    });
})();
