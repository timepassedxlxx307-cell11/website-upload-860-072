(function () {
  var player = document.querySelector('.movie-player[data-stream]');

  if (!player) {
    return;
  }

  var video = player.querySelector('.movie-video');
  var cover = player.querySelector('.play-cover');
  var stream = player.getAttribute('data-stream');
  var ready = false;
  var hlsInstance = null;

  var attachStream = function () {
    if (ready || !video || !stream) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
    } else {
      video.src = stream;
    }

    video.controls = true;
    ready = true;
  };

  var play = function () {
    attachStream();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    var attempt = video.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  };

  if (cover) {
    cover.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
})();
