/* ============================================================
   Sitemap ページ専用スクリプト
   ------------------------------------------------------------
   sitemap.html 自体は編集不要。ページ構成の元になるデータは
   すべて既存の data/*.js（site.js の SITE.nav、research.js、
   facilities.js、news.js、members.js）からその場で読み取って
   一覧を組み立てるため、研究テーマやNews記事、メンバーが
   増減しても、このファイル・sitemap.html のどちらも触らずに
   自動で反映される。
   ============================================================ */
(function () {
  'use strict';

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function lang() { return window.getSiteLang ? window.getSiteLang() : 'ja'; }

  // item[field] と item[field+'En'] のうち、現在の言語に応じた方を返す
  function T(item, field) {
    if (lang() === 'en') {
      var en = item[field + 'En'];
      if (en) return en;
    }
    return item[field] || '';
  }

  function ui(key) {
    var dict = {
      allPages: ['サイト内の全ページ', 'All Pages'],
      otherPages: ['その他のページ', 'Other Pages'],
      viewAll: ['一覧を見る', 'View list']
    };
    var pair = dict[key] || ['', ''];
    return lang() === 'en' ? pair[1] : pair[0];
  }

  // セクション（見出し + リンク + 任意のサブ項目リスト）を1つ作る
  function section(title, href, subItems) {
    var html = '<div class="sitemap-section">' +
      '<h2><a href="' + esc(href) + '">' + esc(title) + '</a></h2>';
    if (subItems && subItems.length) {
      html += '<ul>' + subItems.map(function (it) {
        return '<li><a href="' + esc(it.href) + '">' + esc(it.label) + '</a></li>';
      }).join('') + '</ul>';
    }
    html += '</div>';
    return html;
  }

  function build() {
    var el = document.getElementById('sitemap-content');
    if (!el) return;

    var SITE = window.SITE || {};
    var sections = [];

    (SITE.nav || []).forEach(function (n) {
      var subItems = null;

      if (n.key === 'research' && window.RESEARCH_THEMES) {
        subItems = window.RESEARCH_THEMES.map(function (t) {
          return { label: T(t, 'title'), href: 'research/' + t.id + '.html' };
        });
      } else if (n.key === 'facilities' && window.FACILITIES) {
        subItems = window.FACILITIES.map(function (f) {
          return { label: T(f, 'name'), href: 'facilities/index.html#' + f.id };
        });
      } else if (n.key === 'news' && window.NEWS_ITEMS) {
        // News一覧・詳細ページと同じ条件（本文があり、外部リンク／個別ページでない記事のみ）
        subItems = window.NEWS_ITEMS
          .filter(function (i) { return i.body && !i.url && !i.page; })
          .slice() // 元の配列を壊さないようコピーしてから日付の新しい順に並べる
          .sort(function (a, b) { return a.date < b.date ? 1 : -1; })
          .map(function (i) {
            return { label: T(i, 'title'), href: 'news-detail.html?id=' + encodeURIComponent(i.id) };
          });
      } else if (n.key === 'members' && window.MEMBERS) {
        subItems = window.MEMBERS.map(function (m) {
          return { label: T(m, 'name'), href: 'members.html#' + m.id };
        });
      }

      sections.push(section(n.label, n.href, subItems));
    });

    var html = '<div class="sitemap-group">' + sections.join('') + '</div>';

    var utilityLinks = (SITE.footerUtilityLinks || []).filter(function (l) {
      return l.href !== 'sitemap.html'; // 自分自身は載せない
    });
    if (utilityLinks.length) {
      html += '<h2 class="sitemap-group-title">' + esc(ui('otherPages')) + '</h2>' +
        '<div class="sitemap-group sitemap-group-utility">' +
        utilityLinks.map(function (l) {
          var label = lang() === 'en' && l.labelEn ? l.labelEn : l.label;
          return section(label, l.href, null);
        }).join('') +
        '</div>';
    }

    el.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', build);
  // JP/EN切り替えはページ全体を再読み込みする実装のため、
  // 言語変更後の再構築は特別に用意しなくても初回描画で対応済み
})();
