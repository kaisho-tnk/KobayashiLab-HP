/* ============================================================
   サイト共通情報　← 研究室名・所属などを変えるときはここだけ編集
   ============================================================ */
window.SITE = {
  labShort: '〇〇',                   // ヘッダーロゴの色付き部分
  labName: '東京大学 〇〇研究室',
  affiliation: '大学院〇〇研究科 / 〇〇学部 〇〇学科',
  copyrightName: '〇〇 Laboratory, The University of Tokyo',
  copyrightYear: 2026,
  contactEmail: '',                   // 例: 'info@example.u-tokyo.ac.jp'（空なら非表示）
  address: '',                        // 例: '東京都文京区本郷7-3-1 工学部〇号館 〇階'
  nav: [
    { key: 'home',     label: 'Home',            href: 'index.html' },
    { key: 'news',     label: 'News',            href: 'news.html' },
    { key: 'research', label: 'Research Themes', href: 'research.html' },
    { key: 'members',  label: 'Members',         href: 'members.html' }
  ]
};
