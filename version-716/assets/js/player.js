(function () {
    function attachPlayer(shell) {
        var video = shell.querySelector('video[data-hls-src]');
        var trigger = shell.querySelector('[data-player-trigger]');
        var source = video ? video.getAttribute('data-hls-src') : '';
        var hlsInstance = null;
        var initialized = false;

        if (!video || !source) {
            return;
        }

        function hideOverlay() {
            if (trigger) {
                trigger.classList.add('is-hidden');
            }
        }

        function playVideo() {
            hideOverlay();

            if (!initialized) {
                initialized = true;

                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: false,
                        backBufferLength: 90
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
                        if (data && data.fatal && hlsInstance) {
                            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                                hlsInstance.startLoad();
                            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                                hlsInstance.recoverMediaError();
                            }
                        }
                    });
                } else {
                    video.src = source;
                }
            }

            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    video.controls = true;
                });
            }
        }

        if (trigger) {
            trigger.addEventListener('click', playVideo);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener('play', hideOverlay);
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]')).forEach(attachPlayer);
    });
})();
