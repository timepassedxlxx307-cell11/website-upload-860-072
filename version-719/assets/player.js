(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (shell) {
      var video = shell.querySelector("video");
      var cover = shell.querySelector(".player-cover");
      var stream = shell.getAttribute("data-stream");
      var attached = false;
      var hls;

      function attach() {
        if (!video || !stream || attached) {
          return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            autoStartLoad: true,
            capLevelToPlayerSize: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function start() {
        attach();
        if (cover) {
          cover.classList.add("is-hidden");
        }
        if (video) {
          var promise = video.play();
          if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
          }
        }
      }

      if (cover) {
        cover.addEventListener("click", start);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            start();
          }
        });
        video.addEventListener("play", function () {
          if (cover) {
            cover.classList.add("is-hidden");
          }
        });
      }
    });
  });
})();
