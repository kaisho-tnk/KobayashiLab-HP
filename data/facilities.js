/* ============================================================
   Facilities データ　← 拠点を追加・変更するときはこのファイルだけ編集
   ------------------------------------------------------------
   ここを直すだけで、ホームのプレビュー・facilities/index.html の一覧、
   両方に反映されます。

   ・id           … アンカー用の一意な文字列（location-1 など）。あとから変えない
   ・icon         … プレビューカードのアイコン。'building' / 'flame' / 'rocket' から選択
   ・badgeLabel   … カード上部のラベル（例: 'MAIN CAMPUS' / 'TEST FACILITY'）
   ・imgColor     … 仮画像の背景色（blue/yellow）
   ・photo        … 実際の写真パス（未配置ならプレースホルダーが自動で使われます）
   ・name / nameEn                 … 拠点名
   ・postal                        … 郵便番号（'〒xxx-xxxx'。無ければ空文字）
   ・addressLine / addressLineEn   … 郵便番号を除いた住所
   ・description / descriptionEn   … 拠点の紹介文
   ・canDo / canDoEn               … 「できること」欄（配列。読点区切りで表示）
   ・officialUrl                   … 公式ページのURL（無ければ空文字でリンクを省略）
   ・mapEmbedSrc                   … Googleマップの埋め込みURL（pb=形式。無ければ地図を省略）
   ・previewSummary / previewSummaryEn … ホームのプレビューカードで使う2行の説明
                                          （配列で2要素まで。改行して表示されます）
   ============================================================ */
window.FACILITIES = [
  {
    id: 'location-1',
    icon: 'building',
    badgeLabel: 'MAIN CAMPUS',
    imgColor: 'blue',
    photo: 'assets/img/facilities/sagamihara.jpg',
    name: 'JAXA相模原キャンパス',
    nameEn: 'JAXA Sagamihara Campus',
    postal: '〒252-5210',
    addressLine: '神奈川県相模原市中央区由野台3-1-1',
    addressLineEn: '3-1-1 Yoshinodai, Chuo-ku, Sagamihara, Kanagawa, Japan',
    description: '宇宙科学研究所（ISAS）の中核拠点。研究室としての日常的な活動拠点で、理論検討・数値解析・実験装置の設計や、ゼミ・研究打ち合わせをここで行っています。',
    descriptionEn: 'The core site of the Institute of Space and Astronautical Science (ISAS). This is our laboratory\u2019s day-to-day base, where we carry out theoretical studies, numerical analysis, experimental apparatus design, seminars, and research meetings.',
    canDo: ['理論・数値解析', '設計検討', 'ゼミ・研究打ち合わせ', '小規模な要素実験'],
    canDoEn: ['Theoretical & numerical analysis', 'Design studies', 'Seminars and meetings', 'Small-scale component experiments'],
    officialUrl: 'https://www.isas.jaxa.jp/about/facilities/sagamihara.html',
    mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3245.799163217521!2d139.3926426612716!3d35.55866197251285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018fdb9e79bf6f3%3A0xc900efb891e3e237!2zSkFYQSDlroflrpnnp5HlrabnoJTnqbbmiYAg55u45qih5Y6f44Kt44Oj44Oz44OR44K5!5e0!3m2!1sja!2sjp!4v1788026851239!5m2!1sja!2sjp',
    previewSummary: ['メインキャンパス・大型風洞設備', '基礎開発・要素試験'],
    previewSummaryEn: ['Main campus & large wind tunnel', 'Basic R&D and component testing']
  },
  {
    id: 'location-2',
    icon: 'flame',
    badgeLabel: 'TEST FACILITY',
    imgColor: 'blue',
    photo: 'assets/img/facilities/akiruno.jpg',
    name: 'あきる野実験施設',
    nameEn: 'Akiruno Experimental Facility',
    postal: '〒197-0801',
    addressLine: '東京都あきる野市菅生1918-1',
    addressLineEn: '1918-1 Sugao, Akiruno, Tokyo, Japan',
    description: 'ロケット・探査機搭載推進系に関わる基礎的・教育的実験研究を行う施設。耐爆試験室や真空燃焼試験設備を備え、固体・ハイブリッドロケットの燃焼実験など、小規模な要素実験を安全に実施できます。',
    descriptionEn: 'A facility for fundamental and educational research on propulsion systems for rockets and spacecraft. Equipped with an explosion-proof test chamber and vacuum combustion test equipment, it allows small-scale component experiments such as solid- and hybrid-rocket combustion tests to be carried out safely.',
    canDo: ['耐爆試験室での燃焼実験', '真空燃焼試験', '固体・ハイブリッドロケット要素実験'],
    canDoEn: ['Combustion experiments in the explosion-proof chamber', 'Vacuum combustion tests', 'Solid/hybrid rocket component experiments'],
    officialUrl: 'https://www.isas.jaxa.jp/about/facilities/akiruno.html',
    mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d729.5482401853915!2d139.26954456282036!3d35.75687123627215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601923becff6f293%3A0x85608fb90c679435!2z5a6H5a6Z56eR5a2m56CU56m25pys6YOo44GC44GN44KL6YeO5pa96Kit!5e0!3m2!1sja!2sjp!4v1788026908325!5m2!1sja!2sjp',
    previewSummary: ['耐火耐爆実験室・水素酸素ガス供給設備', '化学反応を伴う推進系基礎試験'],
    previewSummaryEn: ['Explosion-proof lab & H2/O2 gas supply', 'Basic propulsion tests with chemical reactions']
  },
  {
    id: 'location-3',
    icon: 'rocket',
    badgeLabel: 'TEST FACILITY',
    imgColor: 'yellow',
    photo: 'assets/img/facilities/noshiro.jpg',
    name: '能代ロケット実験場',
    nameEn: 'Noshiro Rocket Testing Center',
    postal: '〒016-0179',
    addressLine: '秋田県能代市浅内字下西山1',
    addressLineEn: '1 Shimonishiyama, Asanai, Noshiro, Akita, Japan',
    description: '固体ロケットモータの地上燃焼試験、液体酸素・液体水素ロケットエンジンの基礎実験に加え、再使用ロケット実験機（RV-X等）の離着陸試験を行っている実験場です。',
    descriptionEn: 'A test site for ground combustion tests of solid rocket motors and fundamental experiments with liquid oxygen/liquid hydrogen rocket engines, as well as takeoff-and-landing tests of reusable rocket demonstrators such as RV-X.',
    canDo: ['エンジン地上燃焼試験', '液体水素・液体酸素実験', '離着陸飛行実証実験'],
    canDoEn: ['Ground engine combustion tests', 'LH2/LOX experiments', 'Takeoff-and-landing flight demonstrations'],
    officialUrl: 'https://www.isas.jaxa.jp/about/facilities/noshiro.html',
    mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11795.253282056958!2d139.98073334598945!3d40.17051054332877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f9a9fe13a56c24b%3A0xcce83f30f10849ef!2zSkFYQe-9nOiDveS7o-ODreOCseODg-ODiOWun-mok-WgtA!5e0!3m2!1sja!2sjp!4v1788026942110!5m2!1sja!2sjp',
    previewSummary: ['耐火耐爆ピット・液化水素供給設備', 'エンジン地上燃焼・離着陸試験'],
    previewSummaryEn: ['Explosion-proof pit & liquid hydrogen supply', 'Ground engine combustion and takeoff/landing tests']
  }
];
