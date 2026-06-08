(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var active = 0;
        var timer = null;

        function showSlide(index) {
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
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(active - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(active + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        hero.addEventListener('mouseenter', stopTimer);
        hero.addEventListener('mouseleave', startTimer);
        showSlide(0);
        startTimer();
    }

    var searchGrid = document.querySelector('[data-search-grid]');
    if (searchGrid) {
        var params = new URLSearchParams(window.location.search);
        var query = (params.get('q') || '').trim().toLowerCase();
        var title = document.querySelector('[data-search-title]');
        var note = document.querySelector('[data-search-note]');
        var cards = Array.prototype.slice.call(searchGrid.querySelectorAll('.movie-card'));

        if (query) {
            if (title) {
                title.textContent = '搜索：' + query;
            }
            if (note) {
                note.textContent = '正在筛选与关键词匹配的影片内容。';
            }
            cards.forEach(function (card) {
                var text = card.getAttribute('data-search') || '';
                card.classList.toggle('is-hidden', text.indexOf(query) === -1);
            });
        }
    }

    var player = document.querySelector('[data-player]');
    if (player) {
        var video = player.querySelector('video');
        var trigger = player.querySelector('[data-play-trigger]');
        var started = false;

        function playVideo() {
            if (!video) {
                return;
            }
            var src = video.getAttribute('data-video-url');
            if (!src) {
                return;
            }
            if (!started) {
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 60
                    });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                } else {
                    video.src = src;
                }
                started = true;
            }
            if (trigger) {
                trigger.classList.add('is-hidden');
            }
            var playback = video.play();
            if (playback && typeof playback.catch === 'function') {
                playback.catch(function () {
                    if (trigger) {
                        trigger.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (trigger) {
            trigger.addEventListener('click', playVideo);
        }
        player.addEventListener('click', function (event) {
            if (event.target === video || event.target === player) {
                playVideo();
            }
        });
    }
})();
