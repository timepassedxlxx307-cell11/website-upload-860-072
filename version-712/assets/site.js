(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuToggle = document.querySelector("[data-menu-toggle]");
        if (menuToggle) {
            menuToggle.addEventListener("click", function () {
                var expanded = menuToggle.getAttribute("aria-expanded") === "true";
                menuToggle.setAttribute("aria-expanded", String(!expanded));
                document.body.classList.toggle("menu-open", !expanded);
            });
        }

        document.querySelectorAll("img").forEach(function (image) {
            image.addEventListener("error", function () {
                image.style.opacity = "0";
            });
        });

        initHeroSlider();
        initFilters();
        initPlayer();
        initHeaderSearch();
    });

    function initHeroSlider() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }

        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }

        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                restart();
            });
        });

        slider.addEventListener("mouseenter", function () {
            if (timer) {
                window.clearInterval(timer);
            }
        });

        slider.addEventListener("mouseleave", restart);
        show(0);
        restart();
    }

    function initFilters() {
        var form = document.querySelector("[data-filter-form]");
        var items = Array.prototype.slice.call(document.querySelectorAll("[data-search-item]"));
        if (!form || !items.length) {
            return;
        }

        var keyword = form.querySelector("[data-filter-keyword]");
        var region = form.querySelector("[data-filter-region]");
        var type = form.querySelector("[data-filter-type]");
        var year = form.querySelector("[data-filter-year]");
        var empty = document.querySelector("[data-empty-state]");

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function apply() {
            var keyValue = normalize(keyword && keyword.value);
            var regionValue = normalize(region && region.value);
            var typeValue = normalize(type && type.value);
            var yearValue = normalize(year && year.value);
            var visible = 0;

            items.forEach(function (item) {
                var haystack = normalize(item.getAttribute("data-title") + " " + item.getAttribute("data-genre") + " " + item.getAttribute("data-tags"));
                var matchesKeyword = !keyValue || haystack.indexOf(keyValue) !== -1;
                var matchesRegion = !regionValue || normalize(item.getAttribute("data-region")) === regionValue;
                var matchesType = !typeValue || normalize(item.getAttribute("data-type")) === typeValue;
                var matchesYear = !yearValue || normalize(item.getAttribute("data-year")) === yearValue;
                var isVisible = matchesKeyword && matchesRegion && matchesType && matchesYear;

                item.classList.toggle("is-filter-hidden", !isVisible);
                if (isVisible) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [keyword, region, type, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
    }

    function initPlayer() {
        var frames = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        if (!frames.length) {
            return;
        }

        frames.forEach(function (frame) {
            var video = frame.querySelector("video[data-video-src]");
            var button = frame.querySelector(".play-overlay");
            if (!video || !button) {
                return;
            }

            var started = false;

            function start() {
                var src = video.getAttribute("data-video-src");
                if (!src) {
                    return;
                }

                button.classList.add("is-hidden");

                if (!started) {
                    started = true;
                    if (window.Hls && window.Hls.isSupported()) {
                        var hls = new window.Hls({
                            enableWorker: true,
                            lowLatencyMode: true
                        });
                        hls.loadSource(src);
                        hls.attachMedia(video);
                        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            video.play().catch(function () {});
                        });
                        hls.on(window.Hls.Events.ERROR, function (event, data) {
                            if (data && data.fatal) {
                                hls.destroy();
                                video.src = src;
                                video.play().catch(function () {});
                            }
                        });
                    } else {
                        video.src = src;
                        video.play().catch(function () {});
                    }
                } else {
                    video.play().catch(function () {});
                }
            }

            button.addEventListener("click", function (event) {
                event.stopPropagation();
                start();
            });

            frame.addEventListener("click", function () {
                if (!started || video.paused) {
                    start();
                }
            });
        });
    }

    function initHeaderSearch() {
        var input = document.querySelector("[data-header-search]");
        if (!input) {
            return;
        }

        input.addEventListener("keydown", function (event) {
            if (event.key !== "Enter") {
                return;
            }
            var value = input.value.trim();
            if (value) {
                window.location.href = "./all.html?q=" + encodeURIComponent(value);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        var filter = document.querySelector("[data-filter-keyword]");
        if (query && filter) {
            filter.value = query;
            filter.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
})();
