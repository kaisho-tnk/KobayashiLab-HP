/* ============================================================
   Research ページ / ホームプレビュー 共通スクリプト
   ・research/index.html の3枚カード
   ・research/theme-N.html の詳細ページ
   ・index.html の Research プレビュー
   すべて data/research.js から描画する。通常編集は不要。
   ============================================================ */
(function () {
  'use strict';

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function lang() { return window.getSiteLang ? window.getSiteLang() : 'ja'; }
  function prefix() { return window.getPathPrefix ? window.getPathPrefix() : ''; }

  // t[field] と t[field+'En'] のうち、現在の言語に応じた方を返す
  function T(t, field) {
    if (lang() === 'en') {
      var en = t[field + 'En'];
      if (en) return en;
    }
    return t[field] || '';
  }
  // 配列版（keywords/approach など）
  function TA(t, field) {
    if (lang() === 'en' && Array.isArray(t[field + 'En']) && t[field + 'En'].length) return t[field + 'En'];
    return t[field] || [];
  }

  var ICONS = {
    flask: '<svg class="w-5 h-5 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5M19.8 15.3l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 20.25a48.25 48.25 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/></svg>',
    sun: '<svg class="w-5 h-5 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>',
    signal: '<svg class="w-5 h-5 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12z"/></svg>'
  };
  var CARD_COLOR = { blue: 'bg-brand-blue/10', yellow: 'bg-brand-yellow/20' };
  var PLACEHOLDER_COLOR = { blue: '4D9BC1', yellow: 'F2C75C' };

  function themes() { return window.RESEARCH_THEMES || []; }

  /* ---------- research/index.html：3枚カード ---------- */
  function renderResearchList(el) {
    el.innerHTML = themes().map(function (t, i) {
      var delay = i === 0 ? '' : ' style="transition-delay: ' + (i * 100) + 'ms;"';
      var kw = TA(t, 'keywords').join(', ');
      return '<a href="' + esc(t.id) + '.html" class="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:-translate-y-1 transition-all duration-300"' + delay + '>' +
        '<div class="aspect-[3/2] overflow-hidden ' + (CARD_COLOR[t.cardColor] || CARD_COLOR.blue) + '">' +
          '<img src="https://placehold.co/600x400/' + (PLACEHOLDER_COLOR[t.cardColor] || PLACEHOLDER_COLOR.blue) + '/ffffff?text=' + esc(t.id) + '" alt="' + esc(T(t, 'title')) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">' +
        '</div>' +
        '<div class="flex flex-col flex-grow p-6 sm:p-8">' +
          '<h2 class="text-lg sm:text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-blue transition-colors">' + (i + 1) + '. ' + esc(T(t, 'title')) + '</h2>' +
          '<p class="text-gray-600 mb-6 flex-grow">' + esc(T(t, 'summary')) + '</p>' +
          '<p class="text-gray-600 text-sm bg-gray-50 border border-gray-100 p-3 rounded-lg mt-auto"><strong class="text-gray-700">' + (lang() === 'en' ? 'Keywords: ' : 'キーワード：') + '</strong>' + esc(kw) + '</p>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  /* ---------- research/theme-N.html：詳細ページ ---------- */
  function renderThemeDetail(el, themeId) {
    var t = themes().filter(function (x) { return x.id === themeId; })[0];
    if (!t) return;

    document.title = T(t, 'pageTitle') + ' | ' + (window.SITE ? (lang() === 'en' ? (window.SITE.labNameEn || window.SITE.labName) : window.SITE.labName) : '');

    var breadcrumbLabel = document.getElementById('theme-breadcrumb-label');
    if (breadcrumbLabel) breadcrumbLabel.textContent = T(t, 'title');

    var approachHtml = TA(t, 'approach').map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');

    el.innerHTML =
      '<div class="aspect-[16/9] rounded-lg overflow-hidden mb-8 ' + (CARD_COLOR[t.cardColor] || CARD_COLOR.blue) + '">' +
        '<img src="https://placehold.co/1200x675/' + (PLACEHOLDER_COLOR[t.cardColor] || PLACEHOLDER_COLOR.blue) + '/ffffff?text=' + esc(t.id) + '" alt="' + esc(T(t, 'title')) + '" class="w-full h-full object-cover">' +
      '</div>' +
      '<h1 class="text-2xl sm:text-3xl font-bold text-brand-dark mb-6">' + esc(T(t, 'pageTitle')) + '</h1>' +
      '<div class="article-body">' +
        '<p>' + esc(T(t, 'intro')) + '</p>' +
        '<h2>' + (lang() === 'en' ? 'Background' : '研究の背景') + '</h2>' +
        '<p>' + esc(T(t, 'background')) + '</p>' +
        '<h2>' + (lang() === 'en' ? 'Approach' : 'アプローチ') + '</h2>' +
        '<ul>' + approachHtml + '</ul>' +
        '<h2>' + (lang() === 'en' ? 'Related Results' : '関連する成果') + '</h2>' +
        '<p>' + (lang() === 'en' ? 'For related papers or presentations, please also see the ' : '関連する論文や発表があれば ') +
          '<a href="' + prefix() + 'news.html">News</a>' +
          (lang() === 'en' ? ' page.' : ' ページも参照してください。') + '</p>' +
      '</div>';
  }

  /* ---------- index.html：Research プレビュー（sm:以上はグリッド、未満は1枚ずつのカルーセル） ---------- */
  function renderResearchPreview(el) {
    el.innerHTML = themes().map(function (t, i) {
      var delay = i === 0 ? '' : ' style="transition-delay: ' + (i * 50) + 'ms;"';
      return '<a href="' + prefix() + 'research/' + esc(t.id) + '.html" class="snap-center bg-brand-light rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"' + delay + '>' +
        (ICONS[t.icon] || ICONS.flask) +
        '<p class="text-sm font-semibold text-brand-dark mb-1">' + esc(T(t, 'title')) + '</p>' +
        '<p class="text-xs text-gray-500">' + esc(T(t, 'summary')) + '</p>' +
      '</a>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.getElementById('research-list');
    if (list) renderResearchList(list);

    var detail = document.getElementById('theme-detail');
    if (detail) renderThemeDetail(detail, document.body.getAttribute('data-theme-id'));

    var preview = document.getElementById('research-preview');
    if (preview) {
      renderResearchPreview(preview);
      if (window.initCardCarousel) {
        window.initCardCarousel(preview, document.getElementById('research-dots'), themes().length);
      }
    }

    if (window.scrollToHashTarget) window.scrollToHashTarget();
  });
})();
