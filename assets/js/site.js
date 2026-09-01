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

  // ヘッダー/フッターのナビは data/site.js に「ルート直下から見た相対パス」
  // （例: 'about.html', 'research/index.html'）で書かれている。
  // research/ や facilities/ のようにルートより1階層深いページで生成すると、
  // そのままではリンク切れになるため、現在地に応じて '../' を補う。
  function pathPrefix() {
    // ルートより深いフォルダを追加したら、ここにも追記する
    var nestedFolders = ['research/', 'facilities/'];
    var path = window.location.pathname;
    var inNested = nestedFolders.some(function (folder) {
      return path.indexOf('/' + folder) !== -1;
    });
    return inNested ? '../' : '';
  }
  var PATH_PREFIX = pathPrefix();
  window.getPathPrefix = pathPrefix; // research.js / facilities.js など他スクリプトからも参照できるように公開

  // 横スクロール可能な一覧の左右に、隠れている項目があることを示す
  // フェードグラデーションを出し分ける（スクロール位置に応じて自動更新）。
  // Members/Research/Facilities のホームプレビューなど、複数箇所から共通で使う。
  function initHorizontalScrollFade(scrollEl, leftFadeEl, rightFadeEl) {
    if (!scrollEl || !leftFadeEl || !rightFadeEl) return;

    function update() {
      var hasOverflow = scrollEl.scrollWidth > scrollEl.clientWidth + 1;
      var atStart = scrollEl.scrollLeft <= 1;
      var atEnd = scrollEl.scrollLeft >= scrollEl.scrollWidth - scrollEl.clientWidth - 1;
      leftFadeEl.style.opacity = hasOverflow && !atStart ? '1' : '0';
      rightFadeEl.style.opacity = hasOverflow && !atEnd ? '1' : '0';
    }

    scrollEl.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // レイアウト確定後（画像読み込み等で幅が変わる場合もあるため少し待って再計測）
    requestAnimationFrame(update);
    setTimeout(update, 300);
  }
  window.initHorizontalScrollFade = initHorizontalScrollFade;

  // 640px未満で「1枚ずつscroll-snapでめくれるカルーセル」になっているコンテナに、
  // 現在位置を示すドットを付ける（Research/Facilitiesのホームプレビューなどで使用）。
  // 640px以上（通常のグリッド表示）ではCSS側でドット自体を非表示にしている。
  function initCardCarousel(container, dotsWrap, count) {
    if (!container || !dotsWrap || count <= 1) return;

    dotsWrap.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', (i + 1) + ' / ' + count);
      dot.className = i === 0 ? 'is-active' : '';
      (function (idx) {
        dot.addEventListener('click', function () {
          container.scrollTo({ left: container.clientWidth * idx, behavior: 'smooth' });
        });
      })(i);
      dotsWrap.appendChild(dot);
    }

    function currentIndex() {
      var w = container.clientWidth;
      if (!w) return 0;
      return Math.max(0, Math.min(count - 1, Math.round(container.scrollLeft / w)));
    }

    function updateActive() {
      var idx = currentIndex();
      Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
        d.classList.toggle('is-active', di === idx);
      });
    }

    container.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    requestAnimationFrame(updateActive);

    // トラックパッドの2本指スワイプ（wheel）は、ネイティブスクロールに渡すと
    // ブラウザ自身の慣性がついて勢いに応じて複数枚進んでしまう（Galleryと同じ理由）。
    // ここだけ preventDefault で渡さず、1ジェスチャーにつき必ず1枚だけ進める。
    var wheelLock = false;
    var wheelIdleTimer = null;
    container.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // 縦方向はページスクロールに譲る
      e.preventDefault();
      if (Math.abs(e.deltaX) < 12) return; // 微小なノイズは無視

      clearTimeout(wheelIdleTimer);
      wheelIdleTimer = setTimeout(function () { wheelLock = false; }, 150);

      if (wheelLock) return;
      wheelLock = true;
      var idx = currentIndex();
      var nextIdx = Math.max(0, Math.min(count - 1, e.deltaX > 0 ? idx + 1 : idx - 1));
      container.scrollTo({ left: container.clientWidth * nextIdx, behavior: 'smooth' });
    }, { passive: false });

    // タッチのスワイプも、ネイティブのタッチスクロールにそのまま渡すと
    // 端末側の慣性（フリックの勢いで指を離した後も動き続ける）がついてしまい、
    // wheelと同じ理屈で強さに応じて複数カード分進んでしまう。
    // scrollLeft を自前で動かし、ネイティブのタッチスクロール自体を
    // preventDefault で発生させないことで、慣性そのものを起こさせない
    // （＝離した時点の位置に、スナップで1枚だけ吸着する）。
    var dragging = false;
    var moved = false;
    var startX = 0;
    var startScrollLeft = 0;

    container.addEventListener('touchstart', function (e) {
      dragging = true;
      moved = false;
      startX = e.touches[0].clientX;
      startScrollLeft = container.scrollLeft;
      container.style.scrollSnapType = 'none'; // ドラッグ中はスナップが邪魔をしないよう一時停止
    }, { passive: true });
    container.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      e.preventDefault(); // ネイティブのタッチスクロール（＝慣性の発生源）に渡さない
      var dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      container.scrollLeft = startScrollLeft - dx;
    }, { passive: false });
    function touchDragEnd() {
      if (!dragging) return;
      dragging = false;
      container.style.scrollSnapType = 'x mandatory'; // スナップを再開し、最寄りの1枚に吸着させる
    }
    container.addEventListener('touchend', touchDragEnd);
    container.addEventListener('touchcancel', touchDragEnd);

    // ドラッグ後に意図しないクリック（カードへの遷移）が発火しないよう、
    // 大きく動いた場合はクリックを打ち消す
    container.addEventListener('click', function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);
  }
  window.initCardCarousel = initCardCarousel;

  /* ---------- 言語切り替え（JP/EN） ----------
     ・localStorage に保存し、ページを跨いでも保持する
     ・切り替え時はページを再読み込みして、そのページの表示内容を
       まるごと選択中の言語で描画し直す（部分的な差し替えより確実） */
  // ページ遷移アイキャッチの表示しきい値。リンククリック（initPageTransitionLinks）と
  // 言語切り替え（setLang）の両方で共有するため、ここで定義しておく
  var TRANSITION_SHOW_DELAY = 200; // これより速く遷移が終われば何も表示しない（ms）

  // ページ遷移アイキャッチの「表示予約タイマー」のID。
  // 戻る/進むでbfcache復元されたとき、離脱前に仕掛けたこのタイマーが
  // キャンセルされずに残っていると、復元後に突然発火してスピナーが
  // 表示されたまま固まって見えるバグになるため、必ずここで一元管理する。
  var pendingTransitionTimer = null;

  var LANG_KEY = 'site_lang';
  function getLang() {
    return window.localStorage && localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ja';
  }
  function setLang(lang) {
    if (!window.localStorage) return;
    localStorage.setItem(LANG_KEY, lang);
    // 言語切り替えもページ全体の再読み込みを伴うため、リンククリック時と同じ
    // 「時間がかかりそうなときだけスピナーを見せる」挙動に揃える
    var overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
      pendingTransitionTimer = setTimeout(function () {
        overlay.classList.add('is-visible');
      }, TRANSITION_SHOW_DELAY);
    }
    window.location.reload();
  }
  var LANG = getLang();
  window.getSiteLang = getLang; // members.js / gallery.js など他スクリプトからも参照できるように公開

  // data-en="English text" を持つ要素は、英語表示のときだけ中身を差し替える。
  // 日本語表示のときは、HTMLに書かれた元の文章（日本語）がそのまま使われる。
  function applyStaticTranslations() {
    document.documentElement.lang = LANG;
    if (LANG !== 'en') return;
    var nodes = document.querySelectorAll('[data-en]');
    Array.prototype.forEach.call(nodes, function (el) {
      var en = el.getAttribute('data-en');
      if (en) el.textContent = en;
    });
  }

  function langSwitcherHtml() {
    return '<div class="flex items-center gap-1.5 text-xs font-medium" aria-label="言語切り替え / Language">' +
      '<button type="button" data-lang-btn="ja" class="' + (LANG === 'ja' ? 'text-brand-dark' : 'text-gray-400 hover:text-brand-dark') +
        ' transition-colors"' + (LANG === 'ja' ? ' aria-current="true"' : '') + '>JP</button>' +
      '<span class="text-gray-300">/</span>' +
      '<button type="button" data-lang-btn="en" class="' + (LANG === 'en' ? 'text-brand-dark' : 'text-gray-400 hover:text-brand-dark') +
        ' transition-colors"' + (LANG === 'en' ? ' aria-current="true"' : '') + '>EN</button>' +
    '</div>';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lang-btn]');
    if (!btn) return;
    var lang = btn.getAttribute('data-lang-btn');
    if (lang === LANG) return;
    setLang(lang);
  });

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
      return '<a href="' + PATH_PREFIX + n.href + '" class="nav-link ' + (active ? 'active text-brand-blue' : 'text-gray-600 hover:text-brand-blue') +
        ' font-medium transition-colors"' + (active ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a>';
    }).join('');

    var spNav = NAV.map(function (n) {
      var active = n.key === current;
      return '<a href="' + PATH_PREFIX + n.href + '" class="block px-3 py-3 text-base font-medium rounded-md ' +
        (active ? 'text-brand-blue bg-blue-50' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50') + '">' + esc(n.label) + '</a>';
    }).join('');

    var header = document.getElementById('site-header');
    if (header) {
      // ヘッダー用の2行表示ラボ名（フル/中間/短縮の3段階）を組み立てる
      function twoLineHtml(tierKey) {
        var tier = (SITE.headerName && SITE.headerName[tierKey]) || null;
        if (!tier) return '';
        var lines = tier[LANG === 'en' ? 'en' : 'ja'] || [];
        return lines.map(function (line) {
          return '<span class="block whitespace-nowrap">' + esc(line) + '</span>';
        }).join('');
      }
      var labNameFullHtml = twoLineHtml('full');
      var labNameMediumHtml = twoLineHtml('medium');
      var labNameShortHtml = twoLineHtml('short');

      header.className = 'fixed w-full top-0 z-50 bg-white border-b border-gray-200';
      header.innerHTML =
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
          '<div id="site-header-row" class="flex justify-between items-center h-20">' +
            '<a href="' + PATH_PREFIX + 'index.html" class="flex items-center gap-2.5 hover:opacity-70 transition-opacity flex-shrink-0">' +
              '<img src="' + PATH_PREFIX + 'assets/img/icon.png" alt="" class="h-8 w-8 sm:h-9 sm:w-9 object-contain flex-shrink-0" aria-hidden="true">' +
              '<span id="header-lab-name-full" class="text-base sm:text-lg md:text-xl font-semibold tracking-tight text-brand-dark leading-tight overflow-hidden">' + labNameFullHtml + '</span>' +
              '<span id="header-lab-name-medium" class="hidden text-base sm:text-lg md:text-xl font-semibold tracking-tight text-brand-dark leading-tight overflow-hidden">' + labNameMediumHtml + '</span>' +
              '<span id="header-lab-name-short" class="hidden text-base sm:text-lg md:text-xl font-semibold tracking-tight text-brand-dark leading-tight overflow-hidden">' + labNameShortHtml + '</span>' +
            '</a>' +
            '<div class="flex items-center gap-4 sm:gap-5 flex-shrink-0">' +
              '<nav id="pc-nav" class="hidden space-x-8" aria-label="メインナビゲーション">' + pcNav + '</nav>' +
              '<div id="header-lang-switcher" class="border-l border-gray-200 pl-4 sm:pl-5">' + langSwitcherHtml() + '</div>' +
              '<button id="mobile-menu-btn" class="hidden text-gray-600 hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">' +
                '<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div id="mobile-menu" class="hidden bg-white border-t border-gray-100">' +
          '<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">' + spNav + '</div>' +
          '<div id="mobile-lang-switcher" class="hidden px-5 pb-4 pt-1 border-t border-gray-100">' + langSwitcherHtml() + '</div>' +
        '</div>';

      // ヘッダーの中身（ロゴ＋ラボ名＋ナビ＋言語切替）が実際に1行に収まるかを測り、
      // 優先順位: ①言語切替・ハンバーガー(できる限り確保) → ②PCナビ(収まらなければハンバーガーへ)
      // → ③ラボ名を フル→中間→短縮 の順に切り替え → ④それでも収まらなければラボ名ごと非表示にし、ロゴだけ残す
      // → ⑤それでも収まらなければ、言語切替をハンバーガーメニューの中へ格納する
      function fitHeaderNav() {
        var row = document.getElementById('site-header-row');
        var nav = document.getElementById('pc-nav');
        var menuBtn = document.getElementById('mobile-menu-btn');
        var labTiers = [
          document.getElementById('header-lab-name-full'),
          document.getElementById('header-lab-name-medium'),
          document.getElementById('header-lab-name-short')
        ];
        var headerLang = document.getElementById('header-lang-switcher');
        var mobileLang = document.getElementById('mobile-lang-switcher');
        if (!row || !nav || !menuBtn) return;

        function showLabTier(index) {
          // index: 0=full, 1=medium, 2=short, -1=すべて非表示（ロゴのみ）
          labTiers.forEach(function (el, i) {
            if (!el) return;
            el.classList.toggle('hidden', i !== index);
          });
        }

        // 一旦「理想の状態」（ナビ表示・ラボ名フル表記・言語切替はヘッダー側）にしてから、
        // 収まらない要素を優先順位の低い順に諦めていく
        nav.classList.remove('hidden');
        nav.classList.add('flex');
        menuBtn.classList.add('hidden');
        showLabTier(0);
        if (headerLang) headerLang.classList.remove('hidden');
        if (mobileLang) mobileLang.classList.add('hidden');

        if (row.scrollWidth > row.clientWidth + 1) {
          // まずPCナビをハンバーガーに切り替える
          nav.classList.add('hidden');
          nav.classList.remove('flex');
          menuBtn.classList.remove('hidden');

          // それでも収まらなければ、ラボ名を フル→中間→短縮 の順に切り替えていく
          var tierIndex = 0;
          while (row.scrollWidth > row.clientWidth + 1 && tierIndex < labTiers.length - 1) {
            tierIndex++;
            showLabTier(tierIndex);
          }

          // それでも収まらなければ、短縮表記も諦めてロゴだけにする
          if (row.scrollWidth > row.clientWidth + 1) {
            showLabTier(-1);
          }

          // それでもまだ収まらなければ、言語切替をハンバーガーメニューの中へ移す
          if (headerLang && row.scrollWidth > row.clientWidth + 1) {
            headerLang.classList.add('hidden');
            if (mobileLang) mobileLang.classList.remove('hidden');
          }
        } else {
          // 収まる場合は、開いたままのモバイルメニューも念のため閉じておく
          var mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu) mobileMenu.classList.add('hidden');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }

      // ヘッダーの横幅が変わるたび（Tailwindの遅延スタイル適用・ウィンドウのリサイズ・
      // フォント読み込み完了による文字幅の変化など、理由を問わず）に自動で再判定する。
      // ResizeObserver は「サイズが変わったら教えてくれる」ブラウザ標準の仕組みなので、
      // 「何回・いつまで測り直すか」を自前で管理する必要がなくなる。
      // 仕様上 observe() 呼び出し直後に必ず1回コールバックが自動発火するため、
      // ここで手動で fitHeaderNav() を呼ぶ必要はない（呼ぶと初回だけ二重に測ることになる）。
      var headerRow = document.getElementById('site-header-row');
      if (headerRow) {
        if (window.ResizeObserver) {
          var settling = false;
          var ro = new ResizeObserver(function () {
            // fitHeaderNav 自身がクラスを切り替えて発火させる分の再発火は無視する
            // （無視しないと「表示→はみ出て非表示→縮んで発火→再度表示…」の無限ループになる）
            if (settling) return;
            settling = true;
            fitHeaderNav();
            requestAnimationFrame(function () { settling = false; });
          });
          ro.observe(headerRow); // ここで自動的に初回の判定も走る
        } else {
          // ResizeObserver 非対応の古いブラウザ向けの保険
          fitHeaderNav();
          var resizeTimer;
          window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(fitHeaderNav, 100);
          });
        }
      }

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
        return '<a href="' + PATH_PREFIX + n.href + '" class="hover:text-white transition-colors">' + esc(n.label) + '</a>';
      }).join('');
      var relatedLinks = (SITE.relatedLinks || []).map(function (l) {
        // heightPx: 通常のbox内containを上書きして高さを直接指定（箱からはみ出してもよい）
        // offsetYPx: 中央基準の位置から縦方向にずらす量（+で下へ）
        // marginRightPx: 次のロゴとの間隔を個別に広げたいときに指定
        var extraStyle = '';
        if (l.heightPx) {
          extraStyle = ' style="height:' + l.heightPx + 'px !important; max-height:none !important; width:auto !important;' +
            (l.offsetYPx ? ' transform:translateY(' + l.offsetYPx + 'px);' : '') +
            (l.marginRightPx ? ' margin-right:' + l.marginRightPx + 'px;' : '') + '"';
        }
        return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener" class="inline-flex items-center h-7 hover:opacity-80 transition-opacity">' +
          '<img src="' + PATH_PREFIX + esc(l.img) + '" alt="' + esc(l.label) + '" class="h-full w-auto object-contain"' + extraStyle + '>' +
        '</a>';
      }).join('');
      var extra = '';
      if (SITE.address) extra += '<p class="text-sm text-gray-500">' + esc(SITE.address) + '</p>';
      if (SITE.contactEmail) {
        extra += '<p class="text-sm text-gray-500">Contact: <a href="mailto:' + esc(SITE.contactEmail) +
          '" class="hover:text-white underline">' + esc(SITE.contactEmail) + '</a></p>';
      }

      footer.className = 'bg-brand-dark text-white py-14 mt-auto';
      footer.innerHTML =
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">' +
          '<p class="text-lg font-semibold mb-2 tracking-wide">' + esc(LANG === 'en' ? (SITE.labNameEn || SITE.labName) : SITE.labName) + '</p>' +
          '<p class="text-sm text-gray-500 mb-4">' + esc(LANG === 'en' ? (SITE.affiliationEn || SITE.affiliation) : SITE.affiliation) + '</p>' +
          (extra ? '<div class="mb-6 space-y-1">' + extra + '</div>' : '') +
          '<nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm text-gray-500" aria-label="フッターナビゲーション">' +
            links +
          '</nav>' +
          (relatedLinks
            ? '<nav class="w-full max-w-[328px] mx-auto flex justify-between items-center mb-8 pt-6 border-t border-white/10" aria-label="関連リンク">' +
                relatedLinks +
              '</nav>'
            : '') +
          '<p class="text-gray-600 text-sm">&copy; ' + esc(SITE.copyrightYear || new Date().getFullYear()) + ' ' + esc(SITE.copyrightName || '') + '</p>' +
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
  // item[field] と item[field+'En'] のうち、現在の言語に応じた方を返す
  function T(item, field) {
    if (LANG === 'en') {
      var en = item[field + 'En'];
      if (en) return en;
    }
    return item[field] || '';
  }

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
        '<span class="news-badge ' + badgeClass(item.category) + '">' + esc(T(item, 'category')) + '</span>' +
      '</div>';
    var title =
      '<div class="min-w-0 flex-1">' +
        '<p class="text-gray-800 font-medium ' + (link ? 'group-hover:text-brand-blue transition-colors' : '') + '">' +
          esc(T(item, 'title')) +
          (link && link.external ? '<span class="ml-1 text-xs text-gray-400">' + (LANG === 'en' ? '(External link)' : '(外部リンク)') + '</span>' : '') +
        '</p>' +
        (opts && opts.summary && item.summary ? '<p class="text-sm text-gray-500 mt-1">' + esc(T(item, 'summary')) + '</p>' : '') +
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
      el.innerHTML = '<li class="py-6 text-gray-500">' + (LANG === 'en' ? 'There are no news items at this time.' : '現在お知らせはありません。') + '</li>';
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
        el.innerHTML = '<li class="py-8 text-center text-gray-500">' + (LANG === 'en' ? 'No matching news items.' : '該当するお知らせはありません。') + '</li>';
      } else {
        el.innerHTML = list.slice(0, shown).map(function (i) { return newsRow(i, { summary: true }); }).join('');
      }
      if (countEl) countEl.textContent = list.length + (LANG === 'en' ? ' items' : ' 件');
      if (moreWrap) moreWrap.classList.toggle('hidden', list.length <= shown);
    }

    if (filterEl) {
      var cats = [];
      var catLabels = {}; // カテゴリ(日本語の値) -> 表示ラベル（言語に応じて）
      all.forEach(function (i) {
        if (i.category && cats.indexOf(i.category) === -1) {
          cats.push(i.category);
          catLabels[i.category] = T(i, 'category');
        }
      });
      filterEl.innerHTML = ['all'].concat(cats).map(function (c) {
        var label = c === 'all' ? (LANG === 'en' ? 'All' : 'すべて') : catLabels[c];
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
      el.innerHTML = LANG === 'en'
        ? '<div class="text-center py-16">' +
            '<p class="text-2xl font-bold mb-4">Article Not Found</p>' +
            '<p class="text-gray-600 mb-8">Please check that the URL is correct.</p>' +
            '<a href="news.html" class="inline-flex items-center px-6 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">Back to News</a>' +
          '</div>'
        : '<div class="text-center py-16">' +
            '<p class="text-2xl font-bold mb-4">記事が見つかりませんでした</p>' +
            '<p class="text-gray-600 mb-8">URL が正しいかご確認ください。</p>' +
            '<a href="news.html" class="inline-flex items-center px-6 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">News 一覧へ戻る</a>' +
          '</div>';
      return;
    }

    var item = items[idx];
    var prev = items[idx + 1]; // より古い記事
    var next = items[idx - 1]; // より新しい記事
    document.title = T(item, 'title') + ' | ' + (LANG === 'en' ? (SITE.labNameEn || SITE.labName) : SITE.labName || '');

    var navHtml = '';
    if (prev || next) {
      navHtml = '<nav class="mt-12 pt-8 border-t border-gray-200 grid gap-4 sm:grid-cols-2" aria-label="前後の記事">' +
        (prev
          ? '<a href="news-detail.html?id=' + encodeURIComponent(prev.id) + '" class="group block p-4 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors">' +
            '<span class="text-xs text-gray-500">' + (LANG === 'en' ? 'Previous' : '前の記事') + '</span>' +
            '<p class="font-medium text-gray-800 group-hover:text-brand-blue line-clamp-2">' + esc(T(prev, 'title')) + '</p></a>'
          : '<span class="hidden sm:block"></span>') +
        (next
          ? '<a href="news-detail.html?id=' + encodeURIComponent(next.id) + '" class="group block p-4 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors sm:text-right">' +
            '<span class="text-xs text-gray-500">' + (LANG === 'en' ? 'Next' : '次の記事') + '</span>' +
            '<p class="font-medium text-gray-800 group-hover:text-brand-blue line-clamp-2">' + esc(T(next, 'title')) + '</p></a>'
          : '') +
        '</nav>';
    }

    el.innerHTML =
      '<article class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10">' +
        '<div class="flex flex-wrap items-center gap-3 mb-4">' +
          '<time datetime="' + esc(item.date) + '" class="text-gray-500 font-medium tabular-nums">' + formatDate(item.date) + '</time>' +
          '<span class="news-badge ' + badgeClass(item.category) + '">' + esc(T(item, 'category')) + '</span>' +
        '</div>' +
        '<h1 class="text-2xl sm:text-3xl font-bold leading-snug mb-8">' + esc(T(item, 'title')) + '</h1>' +
        '<div class="article-body">' + T(item, 'body') + '</div>' +
        navHtml +
        '<div class="mt-10 text-center">' +
          '<a href="news.html" class="inline-flex items-center px-6 py-3 border border-brand-blue text-brand-blue font-bold rounded-lg hover:bg-brand-blue hover:text-white transition-colors">' +
            '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>' +
            (LANG === 'en' ? 'Back to News' : 'News 一覧へ戻る') + '</a>' +
        '</div>' +
      '</article>';
  }

  /* ---------- Gallery（ホームのプレビューのみ。一覧本体は assets/js/gallery.js） ---------- */
  function renderGalleryPreview(el) {
    var limit = parseInt(el.getAttribute('data-limit') || '3', 10);
    var posts = (window.GALLERY_POSTS || []).slice(0, limit);
    if (!posts.length) return;
    el.innerHTML = posts.map(function (p) {
      var thumb = p.images && p.images[0];
      return '<li>' +
        '<button type="button" data-gallery-id="' + esc(p.id) + '" class="group block w-full rounded-lg overflow-hidden aspect-square bg-gray-100 cursor-pointer">' +
          '<img src="' + esc(thumb) + '" alt="' + esc(p.title || '') + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">' +
        '</button>' +
      '</li>';
    }).join('');

    // クリックでモーダルを開く（一覧ページへは飛ばさない。assets/js/gallery.js が必要）
    el.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-gallery-id]');
      if (!btn) return;
      var id = btn.getAttribute('data-gallery-id');
      var post = posts.filter(function (p) { return p.id === id; })[0];
      if (post && window.openGalleryModal) window.openGalleryModal(post);
    });
  }

  /* ---------- URLハッシュへのスクロール（#member-3 等） ----------
     このページに members.js / gallery.js のような「カードを後から書き込む」
     スクリプトがある場合、site.js の DOMContentLoaded ハンドラの方が先に
     登録されて先に実行されてしまい、この時点ではまだ対象カードがDOMに
     存在しないことがある。そのため、この関数は site.js 側では自動実行せず
     window.scrollToHashTarget として公開し、実際にカードを書き込み終えた
     各スクリプト側（members.js 等）から、書き込み完了後に呼び出してもらう。 */
  function scrollToHashTarget(hashArg) {
    var hash = hashArg || window.location.hash;
    if (!hash) return;
    var target;
    try { target = document.querySelector(hash); } catch (e) { return; }
    if (!target) return;

    // 既定の余白（16px）。対象要素に data-scroll-gap="0" のような指定があれば、
    // そちらを優先する（例: セクション見出しは背景の境目にぴったり合わせたい、など）
    var DEFAULT_EXTRA_GAP = 16;
    var customGap = target.getAttribute('data-scroll-gap');
    var EXTRA_GAP = customGap !== null && customGap !== '' && !isNaN(customGap)
      ? Number(customGap)
      : DEFAULT_EXTRA_GAP;

    // スクロール先の要素（および、それを含む .fade-up な親）は、
    // フェードインアニメーションの完了を待たず、最初から本来の位置・見た目にしておく。
    // .fade-up には transition: transform 0.7s ... が付いているため、
    // is-visible を付けるだけだと「0.7秒かけてゆっくり動く」ことになり、
    // その間ずっと位置がズレて見え続けてしまう。transition を一瞬だけ無効化して
    // 瞬時に最終位置へ反映させる。
    var el = target;
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains('fade-up') && !el.classList.contains('is-visible')) {
        el.style.transition = 'none';
        el.classList.add('is-visible');
        void el.offsetHeight; // 強制リフローで即座に反映させる
        el.style.transition = '';
      }
      el = el.parentElement;
    }

    function doScroll() {
      var header = document.getElementById('site-header');
      var headerHeight = header ? header.getBoundingClientRect().height : 80;
      var targetTop = target.getBoundingClientRect().top + window.scrollY;
      var scrollTo = Math.max(0, targetTop - headerHeight - EXTRA_GAP);
      window.scrollTo({ top: scrollTo, behavior: 'auto' });

      target.classList.add('is-highlighted');
      var clearHighlight = function () {
        target.classList.remove('is-highlighted');
        target.removeEventListener('animationend', clearHighlight);
      };
      target.addEventListener('animationend', clearHighlight);
      setTimeout(clearHighlight, 2200); // アニメーション無効環境などの保険
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(doScroll);
    });
  }

  // members.js / gallery.js など、後からカードを書き込む側のスクリプトから
  // 呼び出せるように公開しておく
  window.scrollToHashTarget = scrollToHashTarget;

  // 同一ページ内の #アンカー リンク（例: ヒーローの「研究テーマを見る」）は、
  // クリックしてもページ遷移が起きずDOMContentLoadedが発火しないため、
  // このままだとブラウザ標準のジャンプ（scroll-margin-top基準）で動いてしまう。
  // クリックを横取りして、他のアンカーと同じ scrollToHashTarget に統一する。
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    var target;
    try { target = document.querySelector(hash); } catch (err) { return; }
    if (!target) return; // 対象が無ければブラウザの標準動作に任せる

    e.preventDefault();
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', window.location.pathname + window.location.search + hash);
    }
    scrollToHashTarget(hash);
  });

  /* ---------- ページ遷移アイキャッチ ----------
     毎回は出さない。リンクをクリックしてから一定時間（TRANSITION_SHOW_DELAY）経っても
     まだ次のページに切り替わっていない＝読み込みに時間がかかっている、
     と判断できたときだけスピナーを表示する。速く終われば一切表示しない。
     （しきい値は言語切り替えの setLang と共有。ファイル冒頭で定義済み） */

  function initPageTransitionLinks() {
    var overlay = document.getElementById('page-transition-overlay');
    if (!overlay) return;

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return; // 同ページ内アンカーは対象外（別処理に任せる）
      if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;

      var url;
      try { url = new URL(href, window.location.href); } catch (err) { return; }
      if (url.origin !== window.location.origin) return; // 外部サイトは対象外
      if (url.pathname === window.location.pathname && url.search === window.location.search) return; // 同じページ

      e.preventDefault();
      // 遷移はすぐに開始する。表示だけを TRANSITION_SHOW_DELAY だけ遅らせ、
      // それより先にページが切り替わってしまえばこのタイマーは意味を持たない
      // （＝速い遷移では一切見えない）。
      pendingTransitionTimer = setTimeout(function () {
        overlay.classList.add('is-visible');
      }, TRANSITION_SHOW_DELAY);
      window.location.href = href;
    });

    // ブラウザの「戻る/進む」でこのページに復帰したとき（bfcache）、
    // アイキャッチが表示されたまま固まって見えないようにリセットする。
    // 離脱前に仕掛けた「表示予約タイマー」が bfcache に凍結されたまま残っていて、
    // 復元後に突然発火することがあるため、表示を消すだけでなくタイマー自体も
    // 確実にキャンセルする。
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        clearTimeout(pendingTransitionTimer);
        overlay.classList.remove('is-visible');
      }
    });
  }

  /* ---------- 初期化 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderChrome();
    applyStaticTranslations();
    initPageTransitionLinks();

    var preview = document.getElementById('news-preview');
    if (preview) renderNewsPreview(preview);

    var list = document.getElementById('news-list');
    if (list) renderNewsList(list);

    var galleryPreview = document.getElementById('gallery-preview');
    if (galleryPreview) renderGalleryPreview(galleryPreview);

    var detail = document.getElementById('news-detail');
    if (detail) renderNewsDetail(detail);

    initScrollAnimation();
    scrollToHashTarget();
  });
})();
