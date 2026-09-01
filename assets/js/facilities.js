/* ============================================================
   Facilities ページ / ホームプレビュー 共通スクリプト
   ・facilities/index.html の3枚カード（地図つき）
   ・index.html の Facilities プレビュー
   すべて data/facilities.js から描画する。通常編集は不要。
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

  function T(f, field) {
    if (lang() === 'en') {
      var en = f[field + 'En'];
      if (en) return en;
    }
    return f[field] || '';
  }
  function TA(f, field) {
    if (lang() === 'en' && Array.isArray(f[field + 'En']) && f[field + 'En'].length) return f[field + 'En'];
    return f[field] || [];
  }

  var ICONS = {
    building: '<svg class="w-5 h-5 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21"/></svg>',
    flame: '<svg class="w-5 h-5 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/></svg>',
    rocket: '<svg class="w-5 h-5 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>'
  };
  var IMG_BG = { blue: 'bg-brand-blue/10', yellow: 'bg-brand-yellow/20' };
  var PLACEHOLDER_COLOR = { blue: '4D9BC1', yellow: 'F2C75C' };

  function list() { return window.FACILITIES || []; }

  function photoSrc(f, pfx) {
    if (f.photo) return pfx + f.photo;
    return 'https://placehold.co/600x400/' + (PLACEHOLDER_COLOR[f.imgColor] || PLACEHOLDER_COLOR.blue) + '/ffffff?text=' + esc(f.id);
  }

  /* ---------- facilities/index.html：3枚カード（地図つき） ---------- */
  function renderFacilitiesList(el) {
    var pfx = prefix();
    el.innerHTML = list().map(function (f, i) {
      var delay = i === 0 ? '' : ' style="transition-delay: ' + (i * 100) + 'ms;"';
      var addressFull = (f.postal ? f.postal + ' ' : '') + T(f, 'addressLine');
      var canDoLabel = lang() === 'en' ? 'What we do here: ' : 'できること：';
      var canDoText = TA(f, 'canDo').join(lang() === 'en' ? ', ' : '、');
      var officialLink = f.officialUrl
        ? '<a href="' + esc(f.officialUrl) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1 mt-4 text-sm text-brand-blue font-medium hover:text-blue-700 transition-colors">' +
            '<span>' + (lang() === 'en' ? 'View official page' : '公式ページを見る') + '</span>' +
            '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>' +
          '</a>'
        : '';
      var mapHtml = f.mapEmbedSrc
        ? '<div class="border-t border-gray-100">' +
            '<iframe src="' + esc(f.mapEmbedSrc) + '" width="100%" height="200" style="border:0; display:block;" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="' + esc((lang() === 'en' ? 'Map: ' : '地図：') + T(f, 'name')) + '"></iframe>' +
          '</div>'
        : '';

      return '<article id="' + esc(f.id) + '" class="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:-translate-y-1 transition-all duration-300"' + delay + '>' +
        '<div class="aspect-[3/2] overflow-hidden ' + (IMG_BG[f.imgColor] || IMG_BG.blue) + '">' +
          '<img src="' + esc(photoSrc(f, pfx)) + '" alt="' + esc(T(f, 'name')) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">' +
        '</div>' +
        '<div class="flex flex-col flex-grow p-6 sm:p-8">' +
          '<p class="text-xs font-bold text-brand-blue tracking-widest mb-2">' + esc(f.badgeLabel || '') + '</p>' +
          '<h2 class="text-lg sm:text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-blue transition-colors">' + esc(T(f, 'name')) + '</h2>' +
          '<p class="text-gray-500 text-sm mb-4">' + esc(addressFull) + '</p>' +
          '<p class="text-gray-600 mb-6 flex-grow">' + esc(T(f, 'description')) + '</p>' +
          '<p class="text-gray-600 text-sm bg-gray-50 border border-gray-100 p-3 rounded-lg mt-auto"><strong class="text-gray-700">' + esc(canDoLabel) + '</strong>' + esc(canDoText) + '</p>' +
          officialLink +
        '</div>' +
        mapHtml +
      '</article>';
    }).join('');
  }

  /* ---------- index.html：Facilities プレビュー（3枚） ---------- */
  function renderFacilitiesPreview(el) {
    var pfx = prefix();
    el.innerHTML = list().map(function (f, i) {
      var delay = i === 0 ? '' : ' style="transition-delay: ' + (i * 50) + 'ms;"';
      var summary = TA(f, 'previewSummary');
      var addressLine = T(f, 'addressLine');
      return '<a href="' + pfx + 'facilities/index.html#' + esc(f.id) + '" class="snap-center bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"' + delay + '>' +
        (ICONS[f.icon] || ICONS.building) +
        '<p class="text-sm font-semibold text-brand-dark mb-1">' + esc(T(f, 'name')) + '</p>' +
        '<p class="text-xs text-gray-500">' + summary.map(esc).join('<br>') + '</p>' +
        (f.postal ? '<p class="text-xs text-gray-400 mt-1">' + esc(f.postal) + '</p>' : '') +
        '<p class="text-xs text-gray-400' + (f.postal ? '' : ' mt-1') + '">' + esc(addressLine) + '</p>' +
      '</a>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var listEl = document.getElementById('facilities-list');
    if (listEl) renderFacilitiesList(listEl);

    var preview = document.getElementById('facilities-preview');
    if (preview) {
      renderFacilitiesPreview(preview);
      if (window.initCardCarousel) {
        window.initCardCarousel(preview, document.getElementById('facilities-dots'), list().length);
      }
    }

    if (window.scrollToHashTarget) window.scrollToHashTarget();
  });
})();
