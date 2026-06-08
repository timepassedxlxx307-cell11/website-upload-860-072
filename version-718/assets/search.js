(function () {
    var formInput = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var status = document.querySelector('[data-search-status]');
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var movies = window.MOVIE_SEARCH_INDEX || [];

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function movieCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return '<span class="tag">' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
            '<article class="movie-card">',
            '    <a class="movie-cover" href="' + escapeHtml(movie.url) + '">',
            '        <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="cover-shade"></span>',
            '        <span class="play-chip">▶</span>',
            '    </a>',
            '    <div class="movie-card-body">',
            '        <div class="movie-meta-row"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '        <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p>' + escapeHtml(movie.oneLine) + '</p>',
            '        <div class="mini-tags">' + tags + '</div>',
            '    </div>',
            '</article>'
        ].join('');
    }

    function render(value) {
        var normalized = value.trim().toLowerCase();
        var filtered = movies.filter(function (movie) {
            if (!normalized) {
                return true;
            }
            var haystack = [
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                movie.category,
                (movie.tags || []).join(' '),
                movie.oneLine
            ].join(' ').toLowerCase();
            return haystack.indexOf(normalized) !== -1;
        }).slice(0, 120);

        if (status) {
            status.textContent = normalized ? '搜索结果' : '热门内容';
        }

        if (results) {
            results.innerHTML = filtered.map(movieCard).join('');
        }
    }

    if (formInput) {
        formInput.value = query;
        formInput.addEventListener('input', function () {
            render(formInput.value);
        });
    }

    render(query);
})();
