/* ============================================================
   Gallery データ　← 写真を追加・変更するときはこのファイルだけ編集
   ------------------------------------------------------------
   ・配列の先頭に新しい投稿を1ブロック追加するだけでOK（並び順はそのまま表示順）
   ・id       … アンカーリンク用の一意な文字列（半角英数とハイフン推奨。あとから変えない）
   ・date     … 投稿日 'YYYY-MM-DD'（ダブルクリックで開く拡大表示に表示されます。省略可）
   ・title / titleEn     … ホバー時、および拡大表示に出るタイトル
   ・caption / captionEn … グリッド上でホバーした時に出る一言コメント（省略可）
   ・body / bodyEn       … ダブルクリックで開く拡大表示の本文（省略可。省略時は caption を表示）
                            〜En を省略した項目は、英語表示でも日本語のまま表示されます。
   ・images   … 画像パスの配列。1枚でもOK、複数入れると手動スワイプできる投稿になる
   ============================================================ */
window.GALLERY_POSTS = [
  {
    id: 'g-noshiro-2026-day4',
    date: '2026-08-16',
    title: 'のしろ銀河フェスティバル2026',
    titleEn: 'Noshiro Ginga Festival 2026',
    caption: '4日目',
    captionEn: 'day4',
    body: 'のしろ銀河フェスティバル2026にて、ピントル型インジェクターの微粒化メカニズムを体験できるブースを出展しました。水と空気を使った模型で、来場者の方に仕組みを楽しく体験していただけました。',
    bodyEn: 'At the Noshiro Ginga Festival 2026, we ran a booth letting visitors experience the atomization mechanism of a pintle-type injector. Using a model that sprays water and air, visitors were able to enjoyably experience how it works.',
    images: [
      'assets/img/gallery/ginfes2026_day4/1.jpg',
      'assets/img/gallery/ginfes2026_day4/2.jpg',
      'assets/img/gallery/ginfes2026_day4/3.jpg',
      'assets/img/gallery/ginfes2026_day4/4.jpg',
      'assets/img/gallery/ginfes2026_day4/5.jpg',
    ]
  },
  {
    id: 'g-noshiro-2026-day3',
    date: '2026-08-15',
    title: 'のしろ銀河フェスティバル2026',
    titleEn: 'Noshiro Ginga Festival 2026',
    caption: '3日目',
    captionEn: 'day3',
    body: 'のしろ銀河フェスティバル2026にて、ピントル型インジェクターの微粒化メカニズムを体験できるブースを出展しました。水と空気を使った模型で、来場者の方に仕組みを楽しく体験していただけました。',
    bodyEn: 'At the Noshiro Ginga Festival 2026, we ran a booth letting visitors experience the atomization mechanism of a pintle-type injector. Using a model that sprays water and air, visitors were able to enjoyably experience how it works.',
    images: [
      'assets/img/gallery/ginfes2026_day3/1.jpg',
      'assets/img/gallery/ginfes2026_day3/2.jpg',
      'assets/img/gallery/ginfes2026_day3/3.jpg',
      'assets/img/gallery/ginfes2026_day3/4.jpg',
      'assets/img/gallery/ginfes2026_day3/5.jpg',
    ]
  },
  {
    id: 'g-noshiro-2026-day2',
    date: '2026-08-14',
    title: 'のしろ銀河フェスティバル2026',
    titleEn: 'Noshiro Ginga Festival 2026',
    caption: '2日目',
    captionEn: 'day2',
    body: 'のしろ銀河フェスティバル2026にて、ピントル型インジェクターの微粒化メカニズムを体験できるブースを出展しました。水と空気を使った模型で、来場者の方に仕組みを楽しく体験していただけました。',
    bodyEn: 'At the Noshiro Ginga Festival 2026, we ran a booth letting visitors experience the atomization mechanism of a pintle-type injector. Using a model that sprays water and air, visitors were able to enjoyably experience how it works.',
    images: [
      'assets/img/gallery/ginfes2026_day2/1.jpg',
      'assets/img/gallery/ginfes2026_day2/2.jpg',
      'assets/img/gallery/ginfes2026_day2/3.jpg',
      'assets/img/gallery/ginfes2026_day2/4.jpg',
      'assets/img/gallery/ginfes2026_day2/5.jpg',
    ]
  },
  {
    id: 'g-noshiro-2026-day1',
    date: '2026-08-13',
    title: 'のしろ銀河フェスティバル2026',
    titleEn: 'Noshiro Ginga Festival 2026',
    caption: '1日目',
    captionEn: 'day1',
    body: 'のしろ銀河フェスティバル2026にて、ピントル型インジェクターの微粒化メカニズムを体験できるブースを出展しました。水と空気を使った模型で、来場者の方に仕組みを楽しく体験していただけました。',
    bodyEn: 'At the Noshiro Ginga Festival 2026, we ran a booth letting visitors experience the atomization mechanism of a pintle-type injector. Using a model that sprays water and air, visitors were able to enjoyably experience how it works.',
    images: [
      'assets/img/gallery/ginfes2026_day1/1.jpg',
      'assets/img/gallery/ginfes2026_day1/2.jpg',
      'assets/img/gallery/ginfes2026_day1/3.jpg',
      'assets/img/gallery/ginfes2026_day1/4.jpg',
      'assets/img/gallery/ginfes2026_day1/5.jpg',
    ]
  },
  {
    id: 'g-members-2026',
    date: '2026-04-05',
    title: '研究室メンバー集合写真',
    titleEn: 'Laboratory Group Photo',
    caption: '2026年度 新歓の様子',
    captionEn: 'At the 2026 welcome gathering',
    body: '2026年度の新歓の際に撮影した集合写真です。新しく加わったメンバーを含め、研究室全体で記念撮影をしました。',
    bodyEn: 'A group photo taken at the 2026 welcome gathering. The whole laboratory, including our newly joined members, posed together for the photo.',
    images: [
      'https://placehold.co/800x800/F2C75C/ffffff?text=Photo+4'
    ]
  },
  {
    id: 'g-conference-2026',
    date: '2026-03-18',
    title: '学会発表',
    titleEn: 'Conference Presentation',
    caption: '日本航空宇宙学会にて口頭発表',
    captionEn: 'Oral presentation at JSASS',
    body: '日本航空宇宙学会の年次大会にて、研究室の学生が口頭発表を行いました。発表後は他大学・企業の研究者の方々と活発な議論を交わしました。',
    bodyEn: 'A student from our laboratory gave an oral presentation at the annual conference of the Japan Society for Aeronautical and Space Sciences (JSASS). After the talk, they had lively discussions with researchers from other universities and companies.',
    images: [
      'https://placehold.co/800x800/4D9BC1/ffffff?text=Photo+5',
      'https://placehold.co/800x800/3d7d9c/ffffff?text=Photo+6'
    ]
  },
  {
    id: 'g-facility-prep-2026',
    date: '2026-08-14',
    title: '能代ロケット実験場での実験準備',
    titleEn: 'Experiment Setup at the Noshiro Rocket Testing Center',
    caption: '燃焼試験に向けたセッティング',
    captionEn: 'Setting up for a combustion test',
    body: '能代ロケット実験場にて、燃焼試験に向けた実験装置のセッティングを行いました。当日は複数班に分かれて計測系・推進系それぞれの最終確認を実施しました。',
    bodyEn: 'We set up the experimental apparatus for a combustion test at the Noshiro Rocket Testing Center. On the day, we split into several teams to run final checks on the measurement and propulsion systems respectively.',
    images: [
      'https://placehold.co/800x800/F2C75C/ffffff?text=Photo+7'
    ]
  },
  {
    id: 'g-booth-2026',
    date: '2026-05-18',
    title: '展示ブースの様子',
    titleEn: 'Our Exhibition Booth',
    caption: '五月祭にて研究室紹介',
    captionEn: 'Introducing the lab at the May Festival',
    body: '五月祭にて研究室紹介ブースを出展しました。パネル展示や実験装置の模型展示に加え、研究室紹介動画の上映も行い、多くの方に興味を持っていただきました。',
    bodyEn: 'We set up a booth introducing our laboratory at the University of Tokyo\u2019s May Festival. In addition to panel displays and model exhibits of our experimental apparatus, we also screened a video introducing the lab, which drew a lot of interest.',
    images: [
      'https://placehold.co/800x800/4D9BC1/ffffff?text=Photo+8',
      'https://placehold.co/800x800/3d7d9c/ffffff?text=Photo+9',
      'https://placehold.co/800x800/2d5e77/ffffff?text=Photo+10',
      'https://placehold.co/800x800/1d4258/ffffff?text=Photo+11'
    ]
  },
  {
    id: 'g-equipment-2026',
    date: '2026-02-20',
    title: '実験装置の組み立て',
    titleEn: 'Assembling Experimental Apparatus',
    caption: '',
    body: '',
    images: [
      'https://placehold.co/800x800/F2C75C/ffffff?text=Photo+12'
    ]
  }
];
