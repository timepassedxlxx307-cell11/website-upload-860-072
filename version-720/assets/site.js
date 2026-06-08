(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var next = hero.querySelector('[data-hero-next]');
    var prev = hero.querySelector('[data-hero-prev]');
    var active = 0;
    var timer = null;

    var show = function (index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    };

    var restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }

      start();
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        restart();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        restart();
      });
    }

    start();
  }

  var searchInput = document.querySelector('[data-search-input]');
  var clearButton = document.querySelector('[data-search-clear]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

  if (searchInput && cards.length) {
    var filter = function () {
      var query = searchInput.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        card.classList.toggle('is-hidden', query.length > 0 && text.indexOf(query) === -1);
      });
    };

    searchInput.addEventListener('input', filter);

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        searchInput.value = '';
        filter();
        searchInput.focus();
      });
    }
  }
})();
