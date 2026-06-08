(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.site-nav');

    if (menuButton && nav) {
      menuButton.addEventListener('click', function () {
        var opened = nav.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    var heroIndex = 0;
    var heroTimer = null;

    function setHero(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === heroIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === heroIndex);
      });
    }

    function restartHero() {
      if (heroTimer) {
        window.clearInterval(heroTimer);
      }
      if (slides.length > 1) {
        heroTimer = window.setInterval(function () {
          setHero(heroIndex + 1);
        }, 5200);
      }
    }

    if (slides.length) {
      setHero(0);
      restartHero();
      if (prev) {
        prev.addEventListener('click', function () {
          setHero(heroIndex - 1);
          restartHero();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          setHero(heroIndex + 1);
          restartHero();
        });
      }
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          setHero(dotIndex);
          restartHero();
        });
      });
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    searchInputs.forEach(function (input) {
      var scopeSelector = input.getAttribute('data-search-scope') || 'body';
      var scope = document.querySelector(scopeSelector) || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));

      input.addEventListener('input', function () {
        var keyword = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var content = (
            (card.getAttribute('data-title') || '') + ' ' +
            (card.getAttribute('data-tags') || '')
          ).toLowerCase();
          card.classList.toggle('hidden-by-search', keyword && content.indexOf(keyword) === -1);
        });
      });
    });

    var selects = Array.prototype.slice.call(document.querySelectorAll('[data-category-filter]'));
    selects.forEach(function (select) {
      var scopeSelector = select.getAttribute('data-filter-scope') || 'body';
      var scope = document.querySelector(scopeSelector) || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-category]'));

      select.addEventListener('change', function () {
        var value = select.value;
        cards.forEach(function (card) {
          var match = !value || card.getAttribute('data-category') === value;
          card.classList.toggle('hidden-by-search', !match);
        });
      });
    });

    var player = document.querySelector('[data-m3u8]');
    var coverButton = document.querySelector('[data-play-button]');
    var hlsInstance = null;
    var playerReady = false;

    function preparePlayer() {
      if (!player || playerReady) {
        return;
      }

      var stream = player.getAttribute('data-m3u8');
      if (!stream) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(player);
      } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = stream;
      }

      playerReady = true;
    }

    function startPlayer() {
      preparePlayer();
      if (coverButton) {
        coverButton.classList.add('is-hidden');
      }
      if (player) {
        var playTask = player.play();
        if (playTask && typeof playTask.catch === 'function') {
          playTask.catch(function () {});
        }
      }
    }

    if (player) {
      player.addEventListener('click', function () {
        if (player.paused) {
          startPlayer();
        }
      });
      player.addEventListener('play', function () {
        if (coverButton) {
          coverButton.classList.add('is-hidden');
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }

    if (coverButton) {
      coverButton.addEventListener('click', startPlayer);
    }
  });
})();
