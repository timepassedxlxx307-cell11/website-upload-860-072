(function () {
    var video = document.getElementById('movie-player');
    var button = document.querySelector('[data-play-button]');

    if (!video || !button) {
        return;
    }

    function nativePlay() {
        var src = video.getAttribute('data-src');
        if (src && !video.getAttribute('src')) {
            video.setAttribute('src', src);
        }
        button.classList.add('is-hidden');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    }

    button.addEventListener('click', function () {
        if (typeof window.MoviePlayerPlay === 'function') {
            window.MoviePlayerPlay();
        } else {
            nativePlay();
        }
    });

    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
            button.classList.remove('is-hidden');
        }
    });
})();
