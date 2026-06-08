(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 320) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    var show = function (nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };

    var restart = function () {
      window.clearInterval(timer);
      start();
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10));
        restart();
      });
    });

    start();
  }

  var params = new URLSearchParams(window.location.search);
  var requestedQuery = params.get('q') || '';
  var searchInput = document.querySelector('[data-search-input]');
  if (searchInput && requestedQuery) {
    searchInput.value = requestedQuery;
  }

  var filterTools = document.querySelector('[data-filter-tools]');
  if (filterTools) {
    var input = filterTools.querySelector('[data-search-input]');
    var category = filterTools.querySelector('[data-category-select]');
    var year = filterTools.querySelector('[data-year-select]');
    var items = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .ranking-item'));
    var noResult = document.querySelector('[data-no-result]');

    var normalize = function (value) {
      return String(value || '').toLowerCase().trim();
    };

    var matchYear = function (itemYear, selectedYear) {
      if (!selectedYear) {
        return true;
      }
      if (selectedYear === 'older') {
        var parsed = parseInt(itemYear, 10);
        return parsed && parsed < 2020;
      }
      return itemYear === selectedYear;
    };

    var apply = function () {
      var q = normalize(input && input.value);
      var selectedCategory = normalize(category && category.value);
      var selectedYear = year && year.value ? year.value : '';
      var visible = 0;

      items.forEach(function (item) {
        var haystack = normalize([
          item.getAttribute('data-title'),
          item.getAttribute('data-genre'),
          item.getAttribute('data-category'),
          item.getAttribute('data-tags'),
          item.getAttribute('data-year')
        ].join(' '));
        var itemCategory = normalize(item.getAttribute('data-category'));
        var itemYear = item.getAttribute('data-year') || '';
        var ok = (!q || haystack.indexOf(q) !== -1) && (!selectedCategory || itemCategory === selectedCategory) && matchYear(itemYear, selectedYear);
        item.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });

      if (noResult) {
        noResult.hidden = visible !== 0;
      }
    };

    ['input', 'change'].forEach(function (eventName) {
      if (input) {
        input.addEventListener(eventName, apply);
      }
      if (category) {
        category.addEventListener(eventName, apply);
      }
      if (year) {
        year.addEventListener(eventName, apply);
      }
    });

    filterTools.addEventListener('submit', function (event) {
      if (window.location.pathname.split('/').pop() !== 'search.html') {
        return;
      }
      event.preventDefault();
      apply();
    });

    apply();
  }

  window.initMoviePlayer = function (videoId, coverId, buttonId, sourceUrl) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var button = document.getElementById(buttonId);
    var started = false;
    var hls = null;

    if (!video || !sourceUrl) {
      return;
    }

    var attach = function () {
      if (started) {
        return;
      }
      started = true;
      if (cover) {
        cover.classList.add('hidden');
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        attach();
      });
    }
    if (cover) {
      cover.addEventListener('click', attach);
    }
    video.addEventListener('click', function () {
      if (!started) {
        attach();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
