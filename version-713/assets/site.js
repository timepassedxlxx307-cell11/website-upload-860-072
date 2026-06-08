(function () {
  var menuButton = document.querySelector('.mobile-menu-button');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var opened = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var index = 0;
    var timer;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-slide')) || 0);
        start();
      });
    });

    show(0);
    start();
  }

  var lists = document.querySelectorAll('[data-filter-list]');
  lists.forEach(function (list) {
    var scope = list.closest('main') || document;
    var input = scope.querySelector('[data-filter-input]');
    var year = scope.querySelector('[data-filter-year]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    if (input && initial && !input.value) {
      input.value = initial;
    }

    function apply() {
      var term = input ? input.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      var cards = list.querySelectorAll('.movie-card');

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-type'),
          card.textContent
        ].join(' ').toLowerCase();
        var okTerm = !term || text.indexOf(term) !== -1;
        var okYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
        card.classList.toggle('is-hidden', !(okTerm && okYear));
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }
    if (year) {
      year.addEventListener('change', apply);
    }
    apply();
  });
})();

function startMoviePlayer(videoId, coverId, buttonId, streamUrl) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var button = document.getElementById(buttonId);
  var ready = false;
  var hlsInstance = null;

  if (!video || !streamUrl) {
    return;
  }

  function prepare() {
    if (ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    ready = true;
  }

  function play() {
    prepare();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    video.controls = true;
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', play);
  }
  if (cover) {
    cover.addEventListener('click', play);
  }
  video.addEventListener('click', function () {
    if (!ready) {
      play();
    }
  });
  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
