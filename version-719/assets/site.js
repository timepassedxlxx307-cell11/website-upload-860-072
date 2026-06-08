(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll(".site-search").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        var target = form.getAttribute("data-target") || form.getAttribute("action") || "./search.html";
        window.location.href = target + "?q=" + encodeURIComponent(query);
      });
    });

    var carousel = document.querySelector("[data-hero-carousel]");
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
      var prev = carousel.querySelector(".hero-prev");
      var next = carousel.querySelector(".hero-next");
      var index = 0;
      var timer;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }

      function restart() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-slide")) || 0);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      restart();
    }

    var liveInput = document.querySelector("[data-live-search]");
    var searchable = document.querySelector(".searchable-list");
    var empty = document.querySelector(".empty-state");
    var activeFilter = "all";

    function applyListFilter() {
      if (!searchable) {
        return;
      }
      var query = normalize(liveInput ? liveInput.value : "");
      var visible = 0;
      searchable.querySelectorAll(".movie-card, .rank-row").forEach(function (item) {
        var haystack = normalize([
          item.getAttribute("data-title"),
          item.getAttribute("data-region"),
          item.getAttribute("data-type"),
          item.getAttribute("data-year"),
          item.getAttribute("data-genre"),
          item.getAttribute("data-category"),
          item.textContent
        ].join(" "));
        var itemType = item.getAttribute("data-type") || "";
        var matchedText = !query || haystack.indexOf(query) !== -1;
        var matchedType = activeFilter === "all" || itemType.indexOf(activeFilter) !== -1;
        var showItem = matchedText && matchedType;
        item.hidden = !showItem;
        if (showItem) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (liveInput) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q) {
        liveInput.value = q;
      }
      liveInput.addEventListener("input", applyListFilter);
      applyListFilter();
    }

    document.querySelectorAll("[data-filter-bar]").forEach(function (bar) {
      bar.querySelectorAll("[data-filter]").forEach(function (button) {
        button.addEventListener("click", function () {
          activeFilter = button.getAttribute("data-filter") || "all";
          bar.querySelectorAll("[data-filter]").forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          applyListFilter();
        });
      });
    });
  });
})();
