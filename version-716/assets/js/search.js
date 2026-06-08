(function () {
    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    function renderCard(item) {
        var tags = (item.tags || []).slice(0, 3).map(function (tag) {
            return '<span class="tag-pill">' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
            '<article class="movie-card group">',
            '  <a href="' + escapeHtml(item.url) + '" class="movie-card-link" aria-label="观看 ' + escapeHtml(item.title) + '">',
            '    <div class="movie-cover aspect-video relative overflow-hidden">',
            '      <img src="' + escapeHtml(item.poster) + '" alt="' + escapeHtml(item.title) + '" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">',
            '      <div class="cover-gradient"></div>',
            '      <span class="cover-category">' + escapeHtml(item.category) + '</span>',
            '      <span class="cover-play" aria-hidden="true">▶</span>',
            '    </div>',
            '    <div class="p-4">',
            '      <h3 class="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-rose-500 transition-colors">' + escapeHtml(item.title) + '</h3>',
            '      <p class="text-gray-600 text-sm mb-3 line-clamp-2">' + escapeHtml(item.description) + '</p>',
            '      <div class="card-tags">' + tags + '</div>',
            '      <div class="flex items-center justify-between text-sm text-gray-500 mt-3">',
            '        <span>' + escapeHtml(item.year) + '</span>',
            '        <span>' + Number(item.views || 0).toLocaleString() + ' 热度</span>',
            '      </div>',
            '    </div>',
            '  </a>',
            '</article>'
        ].join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.querySelector('.search-page-form');
        var input = document.querySelector('.search-page-input');
        var summary = document.querySelector('[data-search-summary]');
        var results = document.querySelector('[data-search-results]');
        var data = window.MOVIE_SEARCH_DATA || [];
        var initialQuery = getQuery();

        if (!input || !summary || !results) {
            return;
        }

        input.value = initialQuery;

        function search() {
            var query = normalize(input.value);
            if (!query) {
                summary.textContent = '输入关键词开始搜索。';
                results.innerHTML = '';
                return;
            }

            var matched = data.filter(function (item) {
                var haystack = normalize([
                    item.title,
                    item.description,
                    item.category,
                    item.year,
                    item.region,
                    item.type,
                    item.genre,
                    (item.tags || []).join(' ')
                ].join(' '));
                return haystack.indexOf(query) !== -1;
            }).slice(0, 120);

            summary.textContent = '搜索“' + input.value + '”找到 ' + matched.length + ' 个结果' + (matched.length === 120 ? '，已显示前 120 个' : '') + '。';
            results.innerHTML = matched.map(renderCard).join('');
        }

        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var url = new URL(window.location.href);
                url.searchParams.set('q', input.value);
                window.history.replaceState({}, '', url.toString());
                search();
            });
        }

        input.addEventListener('input', search);
        search();
    });
})();
