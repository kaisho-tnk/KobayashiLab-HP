/* ============================================================
   サイト共通情報　← 研究室名・所属などを変えるときはここだけ編集
   ============================================================ */
window.SITE = {
  labName: 'JAXA宇宙科学研究所 宇宙飛翔工学研究系 小林研究室',
  labNameEn: 'Kobayashi Laboratory ISAS/JAXA',
  // ブラウザのタブに表示される名前（「ページ名 | tabTitle」の形で使われる）
  tabTitle: '小林研究室 JAXA宇宙科学研究所',
  tabTitleEn: 'Kobayashi Laboratory ISAS/JAXA',
  // ヘッダーで画面幅に応じて出し分ける、研究室名の3段階（それぞれ必ず2行で表示）。
  // 収まらなければ full → medium → short の順に切り替わり、それでも収まらなければロゴのみになる。
  headerName: {
    full:   { ja: ['JAXA宇宙科学研究所 宇宙飛翔工学研究系', '小林研究室'], en: ['Kobayashi Laboratory', 'Space Flight Systems, ISAS/JAXA'] },
    medium: { ja: ['JAXA宇宙科学研究所', '小林研究室'], en: ['Kobayashi Laboratory', 'ISAS/JAXA'] },
    short:  { ja: ['JAXA/ISAS', '小林研究室'], en: ['Kobayashi Lab.', 'ISAS/JAXA'] }
  },
  affiliation: '東京大学大学院 工学系研究科 航空宇宙工学専攻',
  affiliationEn: 'Department of Aeronautics and Astronautics, The University of Tokyo',
  copyrightText: 'Copyright \u00A9 Kobayashi Laboratory. All rights reserved.',
  contactEmail: '',                   // 例: 'info@example.u-tokyo.ac.jp'（空なら非表示）
  address: '',                        // 例: '東京都文京区本郷7-3-1 工学部〇号館 〇階'
  nav: [
    { key: 'about',    label: 'About Us',        href: 'about.html' },
    { key: 'research', label: 'Research', href: 'research/index.html' },
    { key: 'facilities', label: 'Facilities',    href: 'facilities/index.html' },
    { key: 'news',     label: 'News',            href: 'news.html' },
    { key: 'members',  label: 'Members',         href: 'members.html' },
    { key: 'gallery',  label: 'Gallery',         href: 'gallery.html' },
    { key: 'join',     label: 'Join Us',          href: 'join.html' }
  ],
  // フッター下部に並べる関連リンク（増減や書き換えはここだけでOK）
  relatedLinks: [
    // JAXAのマークは下側にサイン風の飾りが伸びる形状で、文字の「コア」部分は
    // 全体の上寄り(縦12.6%〜60.5%)にしかない。他ロゴと文字の大きさ・位置を
    // 揃えるため、全体を拡大した上で下にずらして表示する（数値は全体80%縮小後の値）。
    { label: 'JAXA', href: 'https://www.jaxa.jp/index_j.html', img: 'assets/img/links/jaxa.svg', heightPx: 36, offsetYPx: 5 },
    { label: '宇宙科学研究所', href: 'https://www.isas.jaxa.jp/', img: 'assets/img/links/isas.svg', heightPx: 17 },
    { label: '能代ロケット実験場', href: 'https://www.isas.jaxa.jp/about/facilities/noshiro.html', img: 'assets/img/links/noshiro.svg', heightPx: 30, offsetYPx: 6 },
    { label: '東京大学航空宇宙工学科', href: 'https://www.aerospace.t.u-tokyo.ac.jp/', img: 'assets/img/links/todai-aero.svg' }
    // SOKENDAIは一旦非表示（再度使う際はこのコメントを外す）
    // { label: 'SOKENDAI 先端学術院 宇宙科学コース', href: 'https://www.isas.jaxa.jp/sokendai/', img: 'assets/img/links/sokendai.svg' }
  ]
};
