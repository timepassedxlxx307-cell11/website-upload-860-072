(() => {
  const navButton = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');

  if (navButton && navLinks) {
    navButton.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
    });
  }

  const searchInputs = document.querySelectorAll('[data-search-input]');
  const applySearch = (input) => {
    const scope = input.closest('[data-search-scope]') || document;
    const cards = scope.querySelectorAll('[data-search-card]');
    const value = input.value.trim().toLowerCase();

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.classList.toggle('hidden-by-search', value && !text.includes(value));
    });
  };

  searchInputs.forEach((input) => {
    input.addEventListener('input', () => applySearch(input));
  });

  const filterGroups = document.querySelectorAll('[data-filter-group]');
  filterGroups.forEach((group) => {
    const scope = group.closest('[data-search-scope]') || document;
    const cards = scope.querySelectorAll('[data-search-card]');
    const buttons = group.querySelectorAll('[data-filter-value]');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const field = group.getAttribute('data-filter-group');
        const value = button.getAttribute('data-filter-value');
        buttons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        cards.forEach((card) => {
          const cardValue = card.getAttribute(`data-${field}`) || '';
          const visible = value === 'all' || cardValue === value;
          card.classList.toggle('hidden-by-search', !visible);
        });
      });
    });
  });

  const players = document.querySelectorAll('[data-player]');
  players.forEach((player) => {
    const video = player.querySelector('video');
    const button = player.querySelector('[data-play-button]');
    const url = player.getAttribute('data-video');
    let started = false;

    const start = () => {
      if (!video || !url || started) {
        if (video) {
          video.play().catch(() => {});
        }
        return;
      }

      started = true;
      player.classList.add('is-playing');
      video.controls = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }

      const playNow = () => video.play().catch(() => {});
      if (video.readyState >= 1) {
        playNow();
      } else {
        video.addEventListener('loadedmetadata', playNow, { once: true });
        playNow();
      }
    };

    if (button) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        start();
      });
    }

    player.addEventListener('click', () => {
      if (!started) {
        start();
      }
    });
  });
})();
