/* ============================================================
   共通スクリプト
   ・ヘッダー / フッターの生成（全ページ共通なので1箇所で管理）
   ・モバイルメニュー、スクロールアニメーション
   ・News の一覧描画・詳細描画
   ============================================================ */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var NAV = SITE.nav || [];

  /* ---------- ユーティリティ ---------- */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    var d = String(iso || '').split('-');
    return d.length === 3 ? d[0] + '.' + d[1] + '.' + d[2] : String(iso || '');
  }

  var BADGE = {
    'お知らせ': 'badge-news',
    '研究成果': 'badge-result',
    'メディア': 'badge-media',
    'イベント': 'badge-event'
  };
  function badgeClass(cat) { return BADGE[cat] || 'badge-default'; }

  /* ---------- ヘッダー / フッター ---------- */
  function renderChrome() {
    var current = document.body.getAttribute('data-page') || '';

    var pcNav = NAV.map(function (n) {
      var active = n.key === current;
      return '<a href="' + n.href + '" class="nav-link ' + (active ? 'active text-brand-blue' : 'text-gray-600 hover:text-brand-blue') +
        ' font-medium transition-colors"' + (active ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a>';
    }).join('');

    var spNav = NAV.map(function (n) {
      var active = n.key === current;
      return '<a href="' + n.href + '" class="block px-3 py-3 text-base font-medium rounded-md ' +
        (active ? 'text-brand-blue bg-blue-50' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50') + '">' + esc(n.label) + '</a>';
    }).join('');

    var header = document.getElementById('site-header');
    if (header) {
      header.className = 'fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm';
      header.innerHTML =
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
          '<div class="flex justify-between items-center h-20">' +
            '<a href="index.html" class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-brand-dark hover:opacity-80 transition-opacity">' +
              '<span class="text-brand-blue">' + esc(SITE.labShort || '') + '</span>研究室' +
            '</a>' +
            '<nav class="hidden md:flex space-x-8" aria-label="メインナビゲーション">' + pcNav + '</nav>' +
            '<button id="mobile-menu-btn" class="md:hidden text-gray-600 hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">' +
              '<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100">' +
          '<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">' + spNav + '</div>' +
        '</div>';

      var btn = document.getElementById('mobile-menu-btn');
      var menu = document.getElementById('mobile-menu');
      btn.addEventListener('click', function () {
        var open = menu.classList.toggle('hidden') === false;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var footer = document.getElementById('site-footer');
    if (footer) {
      var links = NAV.map(function (n) {
        return '<a href="' + n.href + '" class="hover:text-brand-yellow transition-colors">' + esc(n.label) + '</a>';
      }).join('');
      var extra = '';
      if (SITE.address) extra += '<p class="text-sm text-gray-400">' + esc(SITE.address) + '</p>';
      if (SITE.contactEmail) {
        extra += '<p class="text-sm text-gray-400">Contact: <a href="mailto:' + esc(SITE.contactEmail) +
          '" class="hover:text-brand-yellow underline">' + esc(SITE.contactEmail) + '</a></p>';
      }

      footer.className = 'bg-brand-dark text-white py-12 mt-auto';
      footer.innerHTML =
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">' +
          '<p class="text-xl font-bold mb-2 tracking-wider">' + esc(SITE.labName || '') + '</p>' +
          '<p class="text-sm text-gray-400 mb-4">' + esc(SITE.affiliation || '') + '</p>' +
          (extra ? '<div class="mb-6 space-y-1">' + extra + '</div>' : '') +
          '<nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-sm text-gray-400" aria-label="フッターナビゲーション">' +
            links +
            '<a href="https://www.u-tokyo.ac.jp/" target="_blank" rel="noopener" class="hover:text-brand-yellow transition-colors">東京大学公式サイト</a>' +
          '</nav>' +
          '<p class="text-gray-500 text-sm">&copy; ' + esc(SITE.copyrightYear || new Date().getFullYear()) + ' ' + esc(SITE.copyrightName || '') + '</p>' +
        '</div>';
    }
  }

  /* ---------- スクロールアニメーション ---------- */
  function initScrollAnimation() {
    var targets = document.querySelectorAll('.fade-up:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
    Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
  }

  /* ---------- News ---------- */
  function sortedNews() {
    var items = (window.NEWS_ITEMS || []).slice();
    items.sort(function (a, b) {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return String(b.date).localeCompare(String(a.date));
    });
    return items;
  }

  function linkFor(item) {
    if (item.url) return { href: item.url, external: true };
    if (item.page) return { href: item.page, external: false };
    if (item.body) return { href: 'news-detail.html?id=' + encodeURIComponent(item.id), external: false };
    return null;
  }

  function newsRowInner(item, opts) {
    var link = linkFor(item);
    var meta =
      '<div class="flex items-center gap-3 sm:w-44 flex-shrink-0">' +
        '<time datetime="' + esc(item.date) + '" class="text-gray-500 font-medium text-sm tabular-nums">' + formatDate(item.date) + '</time>' +
        '<span class="news-badge ' + badgeClass(item.category) + '">' + esc(item.category) + '</span>' +
      '</div>';
    var title =
      '<div class="min-w-0 flex-1">' +
        '<p class="text-gray-800 font-medium ' + (link ? 'group-hover:text-brand-blue transition-colors' : '') + '">' +
          esc(item.title) +
          (link && link.external ? '<span class="ml-1 text-xs text-gray-400">(外部リンク)</span>' : '') +
        '</p>' +
        (opts && opts.summary && item.summary ? '<p class="text-sm text-gray-500 mt-1">' + esc(item.summary) + '</p>' : '') +
      '</div>' +
      (link
        ? '<svg class="hidden sm:block w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>'
        : '');

    return '<div class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">' + meta + title + '</div>';
  }

  function newsRow(item, opts) {
    var link = linkFor(item);
    var inner = newsRowInner(item, opts);
    if (!link) return '<li class="border-b border-gray-100 last:border-0"><div class="news-item">' + inner + '</div></li>';
    return '<li class="border-b border-gray-100 last:border-0">' +
      '<a class="news-item group" href="' + esc(link.href) + '"' +
      (link.external ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a></li>';
  }

  /* トップページ用（最新 n 件） */
  function renderNewsPreview(el) {
    var limit = parseInt(el.getAttribute('data-limit') || '3', 10);
    var items = sortedNews().slice(0, limit);
    if (!items.length) {
      el.innerHTML = '<li class="py-6 text-gray-500">現在お知らせはありません。</li>';
      return;
    }
    el.innerHTML = items.map(function (i) { return newsRow(i, { summary: false }); }).join('');
  }

  /* 一覧ページ用（カテゴリ絞り込み + もっと見る） */
  function renderNewsList(el) {
    var PAGE_SIZE = parseInt(el.getAttribute('data-page-size') || '10', 10);
    var all = sortedNews();
    var filterEl = document.getElementById('news-filter');
    var moreWrap = document.getElementById('news-more-wrap');
    var moreBtn = document.getElementById('news-more');
    var countEl = document.getElementById('news-count');
    var current = 'all';
    var shown = PAGE_SIZE;

    function filtered() {
      return current === 'all' ? all : all.filter(function (i) { return i.category === current; });
    }

    function draw() {
      var list = filtered();
      if (!list.length) {
        el.innerHTML = '<li class="py-8 text-center text-gray-500">該当するお知らせはありません。</li>';
      } else {
        el.innerHTML = list.slice(0, shown).map(function (i) { return newsRow(i, { summary: true }); }).join('');
      }
      if (countEl) countEl.textContent = list.length + ' 件';
      if (moreWrap) moreWrap.classList.toggle('hidden', list.length <= shown);
    }

    if (filterEl) {
      var cats = [];
      all.forEach(function (i) { if (i.category && cats.indexOf(i.category) === -1) cats.push(i.category); });
      filterEl.innerHTML = ['all'].concat(cats).map(function (c) {
        var label = c === 'all' ? 'すべて' : c;
        return '<button type="button" data-cat="' + esc(c) + '" class="news-filter-btn px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ' +
          (c === 'all' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue') +
          '">' + esc(label) + '</button>';
      }).join('');
      filterEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.news-filter-btn');
        if (!btn) return;
        current = btn.getAttribute('data-cat');
        shown = PAGE_SIZE;
        Array.prototype.forEach.call(filterEl.querySelectorAll('.news-filter-btn'), function (b) {
          var on = b === btn;
          b.className = 'news-filter-btn px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ' +
            (on ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue');
        });
        draw();
      });
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', function () { shown += PAGE_SIZE; draw(); });
    }
    draw();
  }

  /* 詳細ページ用 */
  function renderNewsDetail(el) {
    var id = new URLSearchParams(window.location.search).get('id');
    var items = sortedNews().filter(function (i) { return i.body && !i.url && !i.page; });
    var idx = -1;
    for (var k = 0; k < items.length; k++) { if (items[k].id === id) { idx = k; break; } }

    if (idx === -1) {
      el.innerHTML =
        '<div class="text-center py-16">' +
          '<p class="text-2xl font-bold mb-4">記事が見つかりませんでした</p>' +
          '<p class="text-gray-600 mb-8">URL が正しいかご確認ください。</p>' +
          '<a href="news.html" class="inline-flex items-center px-6 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">News 一覧へ戻る</a>' +
        '</div>';
      return;
    }

    var item = items[idx];
    var prev = items[idx + 1]; // より古い記事
    var next = items[idx - 1]; // より新しい記事
    document.title = item.title + ' | ' + (SITE.labName || '');

    var navHtml = '';
    if (prev || next) {
      navHtml = '<nav class="mt-12 pt-8 border-t border-gray-200 grid gap-4 sm:grid-cols-2" aria-label="前後の記事">' +
        (prev
          ? '<a href="news-detail.html?id=' + encodeURIComponent(prev.id) + '" class="group block p-4 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors">' +
            '<span class="text-xs text-gray-500">前の記事</span>' +
            '<p class="font-medium text-gray-800 group-hover:text-brand-blue line-clamp-2">' + esc(prev.title) + '</p></a>'
          : '<span class="hidden sm:block"></span>') +
        (next
          ? '<a href="news-detail.html?id=' + encodeURIComponent(next.id) + '" class="group block p-4 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors sm:text-right">' +
            '<span class="text-xs text-gray-500">次の記事</span>' +
            '<p class="font-medium text-gray-800 group-hover:text-brand-blue line-clamp-2">' + esc(next.title) + '</p></a>'
          : '') +
        '</nav>';
    }

    el.innerHTML =
      '<article class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10">' +
        '<div class="flex flex-wrap items-center gap-3 mb-4">' +
          '<time datetime="' + esc(item.date) + '" class="text-gray-500 font-medium tabular-nums">' + formatDate(item.date) + '</time>' +
          '<span class="news-badge ' + badgeClass(item.category) + '">' + esc(item.category) + '</span>' +
        '</div>' +
        '<h1 class="text-2xl sm:text-3xl font-bold leading-snug mb-8">' + esc(item.title) + '</h1>' +
        '<div class="article-body">' + item.body + '</div>' +
        navHtml +
        '<div class="mt-10 text-center">' +
          '<a href="news.html" class="inline-flex items-center px-6 py-3 border border-brand-blue text-brand-blue font-bold rounded-lg hover:bg-brand-blue hover:text-white transition-colors">' +
            '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>' +
            'News 一覧へ戻る</a>' +
        '</div>' +
      '</article>';
  }

  /* ---------- 初期化 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderChrome();

    var preview = document.getElementById('news-preview');
    if (preview) renderNewsPreview(preview);

    var list = document.getElementById('news-list');
    if (list) renderNewsList(list);

    var detail = document.getElementById('news-detail');
    if (detail) renderNewsDetail(detail);

    initScrollAnimation();
  });
})();
