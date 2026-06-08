import { H as Hls } from './hls-module.js';

var video = document.getElementById('movie-player');
var button = document.querySelector('[data-play-button]');
var hlsInstance = null;
var initialized = false;

function hideButton() {
    if (button) {
        button.classList.add('is-hidden');
    }
}

function showButton() {
    if (button) {
        button.classList.remove('is-hidden');
    }
}

function attachSource() {
    if (!video || initialized) {
        return Promise.resolve();
    }

    var src = video.getAttribute('data-src');
    if (!src) {
        return Promise.resolve();
    }

    initialized = true;

    if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
                return;
            }
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hlsInstance.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hlsInstance.recoverMediaError();
            } else {
                hlsInstance.destroy();
                initialized = false;
                showButton();
            }
        });
        return Promise.resolve();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
    } else {
        video.src = src;
    }

    return Promise.resolve();
}

window.MoviePlayerPlay = function () {
    if (!video) {
        return;
    }

    attachSource().then(function () {
        hideButton();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                showButton();
            });
        }
    });
};

if (video) {
    video.addEventListener('play', hideButton);
    video.addEventListener('ended', showButton);
}
