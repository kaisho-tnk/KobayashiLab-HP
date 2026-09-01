/* ============================================================
   Gallery ページ専用スクリプト
   ・正方形グリッドの生成（列数は表示幅により可変）
   ・複数枚投稿の手動スワイプ（ドラッグ／タッチ）
   ・ホバー時のタイトル／コメント表示
   通常編集は不要。写真の追加・変更は data/gallery.js だけでOK。
   ============================================================ */
(function () {
  'use strict';

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    var d = String(iso || '').split('-');
    return d.length === 3 ? d[0] + '.' + d[1] + '.' + d[2] : String(iso || '');
  }

  function lang() { return window.getSiteLang ? window.getSiteLang() : 'ja'; }

  // post[field] と post[field+'En'] のうち、現在の言語に応じた方を返す
  function T(post, field) {
    if (lang() === 'en') {
      var en = post[field + 'En'];
      if (en) return en;
    }
    return post[field] || '';
  }

  // 画像トラックを生成（先頭/末尾にループ用のクローンを仕込む）。
  // グリッドのサムネイルにも、拡大ポップアップにも同じものを使う。
  function buildTrack(images, altText) {
    var track = document.createElement('div');
    track.className = 'gallery-track';

    function makeImg(src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = altText || '';
      img.draggable = false;
      return img;
    }

    var loop = images.length > 1;
    if (loop) track.appendChild(makeImg(images[images.length - 1]));
    images.forEach(function (src) { track.appendChild(makeImg(src)); });
    if (loop) track.appendChild(makeImg(images[0]));
    return track;
  }

  function buildDots(images) {
    if (images.length <= 1) return null;
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'gallery-dots';
    images.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.className = 'gallery-dot' + (i === 0 ? ' is-active' : '');
      dotsWrap.appendChild(dot);
    });
    return dotsWrap;
  }

  function buildPost(post) {
    var el = document.createElement('div');
    el.className = 'gallery-post';
    el.id = post.id;

    var track = buildTrack(post.images, T(post, 'title'));
    el.appendChild(track);

    // 複数枚アイコン（Instagramの「重なった正方形」アイコン相当）
    if (post.images.length > 1) {
      var badge = document.createElement('div');
      badge.className = 'gallery-multi-badge';
      badge.setAttribute('aria-hidden', 'true');
      badge.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M2 15V5a2 2 0 012-2h10"/><rect x="7" y="7" width="15" height="15" rx="2"/></svg>';
      el.appendChild(badge);
    }

    // ホバー／タップで出てくるタイトル・コメント
    var overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML =
      '<p class="gallery-overlay-title">' + esc(T(post, 'title')) + '</p>' +
      (post.caption ? '<p class="gallery-overlay-caption">' + esc(T(post, 'caption')) + '</p>' : '');
    el.appendChild(overlay);

    // ドット（複数枚のときだけ）
    var dotsWrap = buildDots(post.images);
    if (dotsWrap) el.appendChild(dotsWrap);

    initSwipe(el, track, dotsWrap, post.images.length);
    return el;
  }

  /* ---------- スワイプ ----------
     ・タッチのスワイプ、マウスでのクリック&ドラッグは、ブラウザ標準の横スクロール＋
       scroll-snap（CSS側で設定）にそのまま任せる。「1枚ずつ確実に止まる」は
       mandatory スナップの標準動作。
     ・トラックパッドの2本指スワイプ（wheel）だけは、ネイティブスクロールに渡すと
       ブラウザ自身の慣性がついてしまい、勢いに応じて何枚も飛んでしまう。
       これだけは preventDefault で渡さず、自前で「1ジェスチャーにつき1枚だけ」
       進めるよう制御する。
     ・マウスでのクリック&ドラッグだけは、標準のスクロールで扱われないため
       最小限のJSで scrollLeft を直接動かす（離した瞬間はCSSスナップに委ねる）。
     ・先頭/末尾にクローン画像を仕込み、スライドは境目も含めて常に連続。
       スクロールが止まってクローンに着地したときだけ、瞬間的に本物の画像側へ
       ジャンプして辻褄を合わせる（同じ絵なので見た目は変わらない）。 */
  function initSwipe(container, track, dotsWrap, count) {
    if (count <= 1) return; // 1枚だけならスワイプ不要

    // 内部インデックスは 0=先頭クローン(=最後の複製) 〜 count+1=末尾クローン(=1枚目の複製)
    // 実画像は 1〜count に対応する
    function currentIndex() {
      var w = track.clientWidth;
      return w ? Math.round(track.scrollLeft / w) : 1;
    }

    function jumpTo(newIndex, animate) {
      if (animate) track.scrollTo({ left: track.clientWidth * newIndex, behavior: 'smooth' });
      else track.scrollLeft = track.clientWidth * newIndex;
    }

    function updateDots(newIndex) {
      if (!dotsWrap) return;
      var ri = (newIndex - 1 + count) % count;
      Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
        d.classList.toggle('is-active', di === ri);
      });
    }

    // スクロールが落ち着いたタイミングでクローンに着地していないか確認し、
    // 見えないうちに本物の画像側へ瞬間移動する（無限ループの実現）
    var settleTimer = null;
    track.addEventListener('scroll', function () {
      var idx = currentIndex();
      updateDots(idx);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function () {
        if (idx === count + 1) jumpTo(1, false);
        else if (idx === 0) jumpTo(count, false);
      }, 120);
    }, { passive: true });

    // --- トラックパッド（2本指スワイプ）：ネイティブスクロールに渡さず自前で1枚だけ進める ---
    // 一度の物理的なスワイプ動作は、連続した wheel イベントの「かたまり」として発火する。
    // 「一定時間 wheel イベントが来なくなった＝ジェスチャーが終わった」を検出してから
    // 次のジェスチャーを受け付けることで、動作の強さに関わらず必ず1枚だけ進むようにする。
    var wheelLock = false;
    var wheelIdleTimer = null;
    track.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // 縦方向はページスクロールに譲る
      e.preventDefault(); // ここでネイティブスクロールに渡さないことで、慣性による暴走を防ぐ
      if (Math.abs(e.deltaX) < 12) return; // 微小なノイズは無視

      clearTimeout(wheelIdleTimer);
      wheelIdleTimer = setTimeout(function () { wheelLock = false; }, 150);

      if (wheelLock) return;
      wheelLock = true;
      var idx = currentIndex();
      jumpTo(e.deltaX > 0 ? idx + 1 : idx - 1, true);
    }, { passive: false });

    // --- マウス／タッチでのドラッグ ---
    // タッチのスワイプも、ネイティブのタッチスクロールにそのまま渡すと
    // 端末側の慣性（フリックの勢いで指を離した後も動き続ける）がついてしまい、
    // wheelと同じ理屈で強さに応じて複数枚めくれてしまう。
    // マウスドラッグと同様に、こちらでも scrollLeft を直接動かし、ネイティブの
    // タッチスクロール自体を preventDefault で発生させないことで、慣性そのものを
    // 起こさせない（＝離した時点の位置に、スナップで1枚だけ吸着する）。
    var dragging = false;
    var moved = false;
    var startX = 0;
    var startScrollLeft = 0;

    function dragStart(clientX) {
      dragging = true;
      moved = false;
      startX = clientX;
      startScrollLeft = track.scrollLeft;
      track.style.scrollSnapType = 'none'; // ドラッグ中はスナップが邪魔をしないよう一時停止
    }
    function dragMove(clientX) {
      if (!dragging) return;
      var dx = clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScrollLeft - dx;
    }
    function dragEnd() {
      if (!dragging) return;
      dragging = false;
      track.style.scrollSnapType = 'x mandatory'; // スナップを再開し、最寄りの1枚に吸着させる
    }

    container.addEventListener('mousedown', function (e) {
      e.preventDefault(); // 画像のネイティブドラッグ／テキスト選択を防ぐ
      dragStart(e.clientX);
    });
    window.addEventListener('mousemove', function (e) { dragMove(e.clientX); });
    window.addEventListener('mouseup', dragEnd);

    container.addEventListener('touchstart', function (e) {
      dragStart(e.touches[0].clientX);
    }, { passive: true });
    container.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      e.preventDefault(); // ネイティブのタッチスクロール（＝慣性の発生源）に渡さない
      dragMove(e.touches[0].clientX);
    }, { passive: false });
    container.addEventListener('touchend', dragEnd);
    container.addEventListener('touchcancel', dragEnd);

    // ドラッグ後に意図しないクリック（タップ扱いのトグルなど）が
    // 発火しないよう、大きく動いた場合はクリックを打ち消す
    container.addEventListener('click', function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);

    window.addEventListener('resize', function () {
      jumpTo(currentIndex(), false);
    });

    // 初期位置（実画像1枚目）へ、アニメーションなしでセット
    // ※ buildPost() の実行時点ではまだ DOM に挿入されておらず幅が取れないため、
    //    挿入が完了する次フレームまで待ってから計測する
    requestAnimationFrame(function () {
      jumpTo(1, false);
      updateDots(1);
    });
  }

  /* ---------- ダブルクリックで開く拡大ポップアップ ---------- */
  function openModal(post) {
    var overlay = document.createElement('div');
    overlay.className = 'gallery-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', T(post, 'title') || (lang() === 'en' ? 'Enlarged photo view' : '写真の拡大表示'));

    var modal = document.createElement('div');
    modal.className = 'gallery-modal';

    var viewport = document.createElement('div');
    viewport.className = 'gallery-modal-viewport';
    var track = buildTrack(post.images, T(post, 'title'));
    viewport.appendChild(track);
    var dotsWrap = buildDots(post.images);
    if (dotsWrap) viewport.appendChild(dotsWrap);
    modal.appendChild(viewport);

    var info = document.createElement('div');
    info.className = 'gallery-modal-info';
    var bodyText = T(post, 'body') || T(post, 'caption') || '';
    info.innerHTML =
      (post.date ? '<time class="gallery-modal-date">' + esc(formatDate(post.date)) + '</time>' : '') +
      '<h3 class="gallery-modal-title">' + esc(T(post, 'title')) + '</h3>' +
      (bodyText ? '<p class="gallery-modal-body">' + esc(bodyText) + '</p>' : '');
    modal.appendChild(info);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'gallery-modal-close';
    closeBtn.setAttribute('aria-label', lang() === 'en' ? 'Close' : '閉じる');
    closeBtn.innerHTML = '&times;';
    modal.appendChild(closeBtn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    var scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';

    function close() {
      document.body.style.overflow = '';
      overlay.remove();
      document.removeEventListener('keydown', onKeydown);
      window.scrollTo(0, scrollY);
    }
    function onKeydown(e) {
      if (e.key === 'Escape') close();
    }

    document.addEventListener('keydown', onKeydown);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    // モーダル内でのダブルクリックは閉じる動作と衝突しないよう伝播を止める
    modal.addEventListener('dblclick', function (e) { e.stopPropagation(); });

    requestAnimationFrame(function () {
      initSwipe(viewport, track, dotsWrap, post.images.length);
    });

    closeBtn.focus();
  }

  // ホーム画面のプレビューなど、他のスクリプト（assets/js/site.js）からも
  // モーダルを開けるように公開しておく
  window.openGalleryModal = openModal;

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;
    var posts = window.GALLERY_POSTS || [];
    posts.forEach(function (post) {
      grid.appendChild(buildPost(post));
    });

    // タッチ端末：1タップで直接、拡大ポップアップを開く
    // （PC同様の「タップでオーバーレイ表示→もう一度で拡大」という二段階はやめ、
    //   スマホでは他の写真アプリ同様、一発で開く挙動に揃える）
    grid.addEventListener('click', function (e) {
      var postEl = e.target.closest('.gallery-post');
      if (!postEl) return;
      if (window.matchMedia('(hover: none)').matches) {
        var post = posts.filter(function (p) { return p.id === postEl.id; })[0];
        if (post) openModal(post);
      }
    });

    // ダブルクリック（PC・マウス操作向け）で拡大ポップアップを開く
    grid.addEventListener('dblclick', function (e) {
      var postEl = e.target.closest('.gallery-post');
      if (!postEl) return;
      var post = posts.filter(function (p) { return p.id === postEl.id; })[0];
      if (post) openModal(post);
    });

    // site.js の scrollToHashTarget は gallery.js より先に実行され、
    // その時点ではまだ投稿カードが存在しないため、書き込み完了後にここで改めて呼ぶ
    if (window.scrollToHashTarget) window.scrollToHashTarget();
  });
})();
