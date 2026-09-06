/* ============================================================
   Members Only ページ専用スクリプト
   ------------------------------------------------------------
   ・注意: このサイトはサーバーを持たない静的サイトのため、
     ここでの認証はあくまで「合言葉を知っている身内だけが
     気軽に入れる」程度の簡易的なものです。ここに書かれた
     ユーザー名・パスワードは、ブラウザの開発者ツール等から
     見ようと思えば誰でも見られる状態にあるため、本当に
     秘匿すべき情報の保護には使わないでください。

   ・ユーザー名・パスワードを変えたいときは、下の
     CREDENTIALS だけを書き換えればOKです。
   ============================================================ */
(function () {
  'use strict';

  // ここを書き換えれば、ログインに必要なユーザー名・パスワードを変更できる
  var CREDENTIALS = {
    username: 'kobayashi-lab',
    password: 'change-me'
  };

  // サイト訪問者カウンター（hits.seeyoufarm.com。無料・登録不要のカウントサービス）。
  // 識別子は data/site.js の SITE.visitorCounterNamespace で一元管理している
  // （トップページ側の /incr/ と、こちらの /keep/ で同じ値を使う必要があるため）。
  // トップページ（index.html）側で /incr/ を使ってカウントを増やし、
  // このページでは /keep/ を使って現在値を表示するだけ（増やさない）にしている
  var COUNTER_NAMESPACE = (window.SITE && window.SITE.visitorCounterNamespace) || 'kobayashi-lab-jaxa-isas.example';
  var COUNTER_BADGE_URL = 'https://hits.seeyoufarm.com/api/count/keep/badge.svg?url=' +
    encodeURIComponent(COUNTER_NAMESPACE) +
    '&title=visitors&count_bg=%234D9BC1&title_bg=%231e293b&edge_flat=false';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('login-form');
    var loginPanel = document.getElementById('login-panel');
    var memberContent = document.getElementById('member-content');
    var errorMsg = document.getElementById('login-error');
    var badge = document.getElementById('visitor-counter-badge');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var username = document.getElementById('login-username').value.trim();
      var password = document.getElementById('login-password').value;

      if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        errorMsg.classList.add('hidden');
        loginPanel.classList.add('hidden');
        memberContent.classList.remove('hidden');
        if (badge) badge.src = COUNTER_BADGE_URL;
      } else {
        errorMsg.classList.remove('hidden');
      }
    });
  });
})();
