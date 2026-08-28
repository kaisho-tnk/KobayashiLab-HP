/* ============================================================
   サイト共通情報　← 研究室名・所属などを変えるときはここだけ編集
   ============================================================ */
window.SITE = {
  labName: 'JAXA宇宙科学研究所 宇宙飛翔工学研究系 小林研究室',
  affiliation: '東京大学大学院 工学系研究科 航空宇宙工学専攻 / 〇〇学部 〇〇学科',
  copyrightName: '〇〇 Laboratory, The University of Tokyo',
  copyrightYear: 2026,
  contactEmail: '',                   // 例: 'info@example.u-tokyo.ac.jp'（空なら非表示）
  address: '',                        // 例: '東京都文京区本郷7-3-1 工学部〇号館 〇階'
  nav: [
    { key: 'home',     label: 'Home',            href: 'index.html' },
    { key: 'news',     label: 'News',            href: 'news.html' },
    { key: 'research', label: 'Research', href: 'research.html' },
    { key: 'facilities', label: 'Facilities',    href: 'facilities.html' },
    { key: 'members',  label: 'Members',         href: 'members.html' },
    { key: 'gallery',  label: 'Gallery',         href: 'gallery.html' },
    { key: 'join',     label: 'Join Us',          href: 'join.html' }
  ],
  // フッター下部に並べる関連リンク（増減や書き換えはここだけでOK）
  relatedLinks: [
    { label: 'JAXA', href: 'https://www.jaxa.jp/index_j.html', img: 'assets/img/links/jaxa.png' },
    { label: '宇宙科学研究所', href: 'https://www.isas.jaxa.jp/', img: 'assets/img/links/isas.png' },
    { label: 'あいさすGATE', href: 'https://www.isas.jaxa.jp/home/research-portal/navi/', img: 'assets/img/links/aisasu-gate.png' },
    { label: '東京大学航空宇宙工学科', href: 'https://www.aerospace.t.u-tokyo.ac.jp/', img: 'assets/img/links/todai-aero.png' },
    { label: 'SOKENDAI 先端学術院 宇宙科学コース', href: 'https://www.isas.jaxa.jp/sokendai/', img: 'assets/img/links/sokendai.png' }
  ]
};
