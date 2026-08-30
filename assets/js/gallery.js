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

    var track = buildTrack(post.images, post.title);
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
      '<p class="gallery-overlay-title">' + esc(post.title || '') + '</p>' +
      (post.caption ? '<p class="gallery-overlay-caption">' + esc(post.caption) + '</p>' : '');
    el.appendChild(overlay);

    // ドット（複数枚のときだけ）
    var dotsWrap = buildDots(post.images);
    if (dotsWrap) el.appendChild(dotsWrap);

    initSwipe(el, track, dotsWrap, post.images.length);
    return el;
  }

  /* ---------- スワイプ（トラックパッド／タッチ／マウスドラッグ） ----------
     ・トラックパッドの2本指スワイプは wheel イベント（横方向の deltaX）で検出
     ・タッチ端末は touchstart/move/end
     ・マウスでのクリック&ドラッグも保険として利用可能
     ・先頭/末尾にクローン画像を仕込み、スライドは境目も含めて常に連続。
       クローンに着地した直後（transitionend）だけ、アニメーションなしで
       本物の画像側へ瞬間移動して辻褄を合わせる（同じ絵なので見た目は変わらない） */
  function initSwipe(container, track, dotsWrap, count) {
    if (count <= 1) return; // 1枚だけならスワイプ不要

    // 内部インデックスは 0=先頭クローン(=最後の複製) 〜 count+1=末尾クローン(=1枚目の複製)
    // 実画像は 1〜count に対応する
    var index = 1;
    var startX = 0;
    var deltaX = 0;
    var dragging = false;
    var moved = false;
    var width = 0;
    var wheelLock = false;

    function setTransform(px, animate) {
      track.style.transition = animate ? 'transform 0.3s ease' : 'none';
      track.style.transform = 'translate3d(' + px + 'px,0,0)';
    }

    function realIndex() {
      return (index - 1 + count) % count;
    }

    function updateDots() {
      if (!dotsWrap) return;
      var ri = realIndex();
      Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
        d.classList.toggle('is-active', di === ri);
      });
    }

    function goTo(newIndex, animate) {
      index = newIndex;
      setTransform(-index * width, animate !== false);
      updateDots();
    }

    // 現在位置へスナップ（ドラッグ量が閾値未満だったときなど）
    function settle() { goTo(index, true); }
    function next() { goTo(index + 1, true); }
    function prev() { goTo(index - 1, true); }

    // クローンに着地したら、見えないうちに本物の画像側へ瞬間移動
    track.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'transform') return;
      if (index === count + 1) {
        goTo(1, false);
      } else if (index === 0) {
        goTo(count, false);
      }
    });

    function start(clientX) {
      dragging = true;
      moved = false;
      startX = clientX;
      deltaX = 0;
      width = container.getBoundingClientRect().width;
    }

    function move(clientX) {
      if (!dragging) return;
      deltaX = clientX - startX;
      if (Math.abs(deltaX) > 4) moved = true;
      setTransform(-index * width + deltaX, false);
    }

    function end() {
      if (!dragging) return;
      dragging = false;
      var threshold = width * 0.15;
      if (deltaX < -threshold) next();
      else if (deltaX > threshold) prev();
      else settle();
      deltaX = 0;
    }

    // --- トラックパッド（2本指スワイプ） ---
    container.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // 縦方向はページスクロールに譲る
      e.preventDefault();
      if (wheelLock) return;
      if (Math.abs(e.deltaX) < 12) return; // 微小なノイズは無視
      wheelLock = true;
      if (e.deltaX > 0) next(); else prev();
      setTimeout(function () { wheelLock = false; }, 380);
    }, { passive: false });

    // --- マウス（クリック&ドラッグも保険として残す） ---
    container.addEventListener('mousedown', function (e) {
      e.preventDefault(); // 画像のネイティブドラッグ／テキスト選択を防ぐ
      width = container.getBoundingClientRect().width;
      start(e.clientX);
    });
    window.addEventListener('mousemove', function (e) {
      if (dragging) move(e.clientX);
    });
    window.addEventListener('mouseup', function () {
      end();
    });

    // --- タッチ（指でのスワイプ） ---
    container.addEventListener('touchstart', function (e) {
      width = container.getBoundingClientRect().width;
      start(e.touches[0].clientX);
    }, { passive: true });
    container.addEventListener('touchmove', function (e) {
      move(e.touches[0].clientX);
    }, { passive: true });
    container.addEventListener('touchend', function () {
      end();
    });

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
      width = container.getBoundingClientRect().width;
      setTransform(-index * width, false);
    });

    // 初期位置（実画像1枚目）へ、アニメーションなしでセット
    // ※ buildPost() の実行時点ではまだ DOM に挿入されておらず幅が取れないため、
    //    挿入が完了する次フレームまで待ってから計測する
    requestAnimationFrame(function () {
      width = container.getBoundingClientRect().width;
      setTransform(-index * width, false);
      updateDots();
    });
  }

  /* ---------- ダブルクリックで開く拡大ポップアップ ---------- */
  function openModal(post) {
    var overlay = document.createElement('div');
    overlay.className = 'gallery-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', post.title || '写真の拡大表示');

    var modal = document.createElement('div');
    modal.className = 'gallery-modal';

    var viewport = document.createElement('div');
    viewport.className = 'gallery-modal-viewport';
    var track = buildTrack(post.images, post.title);
    viewport.appendChild(track);
    var dotsWrap = buildDots(post.images);
    if (dotsWrap) viewport.appendChild(dotsWrap);
    modal.appendChild(viewport);

    var info = document.createElement('div');
    info.className = 'gallery-modal-info';
    var bodyText = post.body || post.caption || '';
    info.innerHTML =
      (post.date ? '<time class="gallery-modal-date">' + esc(formatDate(post.date)) + '</time>' : '') +
      '<h3 class="gallery-modal-title">' + esc(post.title || '') + '</h3>' +
      (bodyText ? '<p class="gallery-modal-body">' + esc(bodyText) + '</p>' : '');
    modal.appendChild(info);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'gallery-modal-close';
    closeBtn.setAttribute('aria-label', '閉じる');
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

    // タッチ端末：タップでオーバーレイ表示をトグル（ホバーが無い環境向け）
    grid.addEventListener('click', function (e) {
      var post = e.target.closest('.gallery-post');
      if (!post) return;
      if (window.matchMedia('(hover: none)').matches) {
        var wasOpen = post.classList.contains('is-tapped');
        Array.prototype.forEach.call(grid.querySelectorAll('.gallery-post.is-tapped'), function (p) {
          p.classList.remove('is-tapped');
        });
        if (!wasOpen) post.classList.add('is-tapped');
      }
    });

    // ダブルクリック（タッチ端末ではダブルタップ）で拡大ポップアップを開く
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
