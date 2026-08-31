/* ============================================================
   News データ　← ニュースを追加するときはこのファイルだけ編集
   ------------------------------------------------------------
   ・配列の先頭に新しい記事を1ブロック追加するだけでOK
     （並び順は date で自動ソートされるので、どこに足しても構いません）
   ・id … URL に使う一意な文字列（半角英数とハイフン推奨。あとから変えない）
   ・date … 'YYYY-MM-DD'
   ・category … 'お知らせ' / '研究成果' / 'メディア' / 'イベント' など自由
   ・categoryEn … 英語表示のときのカテゴリ名（省略時は category がそのまま表示）
   ・title / titleEn … 一覧に表示される記事タイトル（クリック対象）
   ・summary / summaryEn … 一覧のタイトル下に出る1行要約（省略可）
   ・body / bodyEn … 詳細ページの本文。HTML が書けます（省略可）
            省略した場合、その記事は詳細ページへリンクしません。
            bodyEn を省略した場合、英語表示でも body（日本語）がそのまま使われます。
   ・pinned: true … 日付に関係なく一覧の先頭に固定（省略可）
   ・url … 外部サイトへ直接リンクしたいとき（body より優先。別タブで開きます）
   ・page … 自分で用意した個別 HTML に飛ばしたいとき
            例: page: 'news/2026-04-01-welcome.html'
   ============================================================ */
window.NEWS_ITEMS = [
  {
    id: '2026-08-16-ginga-festival',
    date: '2026-08-16',
    category: 'イベント',
    categoryEn: 'Event',
    title: 'のしろ銀河フェスティバル2026に参加しました',
    titleEn: 'We Took Part in the Noshiro Ginga Festival 2026',
    body: `
      <p>
        秋田県能代市にて「のしろ銀河フェスティバル2026」が開催され、当研究室は8月15日（土）・16日（日）の2日間、能代ロケット実験場でブース出展および運営の補助を行いました。
      </p>
      <p>
        ブース出展では、研究室紹介ポスターの展示や、「ピントル型インジェクター」を模した体験コーナーを設置しました。
        ピントル型インジェクターは、燃焼室に推進剤を噴射するためのインジェクターの一種であり、構造のシンプルさ・推力変更の容易さなどの特徴から、特に再使用型ロケットのエンジンにて実用化が進められています。
        インジェクター先端の突起（ピントル）付近で酸化剤と燃料を衝突させることで、それらを微粒化させて燃焼効率を高める構造になっており、いかに微粒化を促進できるかという点も設計上の重要なポイントです。
      </p>
      <p>
        今回は、推進剤の代わりに水と空気を噴射する模型を用意し、ピントル型インジェクターの微粒化メカニズムをミストシャワーのように体験できるコーナーを用意しました。
        当日は30度を超える晴天だったこともあり、来場者の皆さんに涼んでもらいつつ、インジェクターの仕組みを体験していただくことができました。
        子どもから大人まで幅広い年齢層の方々に楽しんでいただけたようで、研究室メンバー一同、大変嬉しく思っています。
      </p>
      <figure>
        <img src="assets/img/news_20260816/img_1.jpg" alt="ピントル型インジェクター体験コーナーの様子">
        <figcaption>ピントル型インジェクター体験コーナーの様子</figcaption>
      </figure>
      <figure>
        <img src="assets/img/news_20260816/img_2.jpg" alt="インジェクター模型の断面図">
        <figcaption>インジェクター模型の断面図</figcaption>
      </figure>
      <p>
        また、再使用ロケット実験機「RV-X」の管制デモの体験コーナーも催されており、当研究室の学生は前日準備や当日の管制員役として参加しました。
        RV-Xは2026年7月11日に離着陸実験を実施したこともあり、来場者の方の関心が高く、目玉コンテンツの一つとして盛況でした。
      </p>
      <figure>
        <img src="assets/img/news_20260816/img_3.jpg" alt="RV-Xの管制デモの様子">
        <figcaption>RV-Xの管制デモの様子</figcaption>
      </figure>
      
    `,
    bodyEn: `
      <p>
        The "Noshiro Ginga Festival 2026" was held in Noshiro City, Akita Prefecture. Our laboratory set up a booth and helped with operations at the Noshiro Rocket Testing Center over two days, August 15 (Sat) and 16 (Sun).
      </p>
      <p>
        At our booth we displayed a poster introducing the laboratory and set up a hands-on corner simulating a "pintle-type injector." A pintle-type injector is a type of injector that sprays propellant into the combustion chamber; thanks to its simple structure and ease of thrust control, it is being put into practical use especially in reusable rocket engines. Oxidizer and fuel collide near the protrusion (the pintle) at the tip of the injector, atomizing them to improve combustion efficiency &mdash; and how well this atomization can be promoted is also a key point in the design.
      </p>
      <p>
        This time, we prepared a model that sprays water and air instead of propellant, letting visitors experience the atomization mechanism of a pintle-type injector like a mist shower. With clear skies and temperatures above 30&deg;C on the day, visitors were able to cool off while experiencing how the injector works. People of all ages, from children to adults, seemed to enjoy it, which made all of us in the lab very happy.
      </p>
      <figure>
        <img src="assets/img/news_20260816/img_1.jpg" alt="Pintle-type injector hands-on corner">
        <figcaption>The pintle-type injector hands-on corner</figcaption>
      </figure>
      <figure>
        <img src="assets/img/news_20260816/img_2.jpg" alt="Cross-section of the injector model">
        <figcaption>Cross-section of the injector model</figcaption>
      </figure>
      <p>
        A hands-on corner simulating mission control for the reusable rocket demonstrator "RV-X" was also held, and our students took part both in preparations the day before and as mock mission-control operators on the day. Since RV-X conducted a takeoff-and-landing test on July 11, 2026, visitor interest was high, and it was one of the most popular attractions.
      </p>
      <figure>
        <img src="assets/img/news_20260816/img_3.jpg" alt="RV-X mission control demonstration">
        <figcaption>The RV-X mission control demonstration</figcaption>
      </figure>
    `
  },
  {
    id: '2026-04-01-new-members',
    date: '2026-04-01',
    category: 'お知らせ',
    categoryEn: 'Notice',
    title: '新年度がスタートし、新たに〇名の学生が研究室に配属されました',
    titleEn: 'The New Academic Year Has Begun, With \u25cb New Students Joining Our Lab',
    summary: '学部4年〇名・修士〇名が新たに加わりました。',
    summaryEn: '\u25cb fourth-year undergraduates and \u25cb master\u2019s students have joined us.',
    body: `
      <p>2026年度がスタートしました。本年度は学部4年〇名、修士課程〇名が新たに当研究室に加わりました。</p>
      <h2>新メンバー</h2>
      <ul>
        <li>〇〇 〇〇（修士課程1年）</li>
        <li>〇〇 〇〇（学部4年）</li>
      </ul>
      <p>各自の研究テーマは <a href="research/index.html">Research Themes</a> のページも併せてご覧ください。</p>
      <figure>
        <img src="https://placehold.co/1200x675/f8fafc/4D9BC1?text=Photo" alt="歓迎会の様子">
        <figcaption>写真キャプションをここに書きます</figcaption>
      </figure>
    `,
    bodyEn: `
      <p>The 2026 academic year has begun. This year, \u25cb fourth-year undergraduates and \u25cb master's students have newly joined our laboratory.</p>
      <h2>New Members</h2>
      <ul>
        <li>\u25cb\u25cb \u25cb\u25cb (1st-year Master's student)</li>
        <li>\u25cb\u25cb \u25cb\u25cb (4th-year Undergraduate)</li>
      </ul>
      <p>Please also see the <a href="research/index.html">Research Themes</a> page for each member's research topic.</p>
      <figure>
        <img src="https://placehold.co/1200x675/f8fafc/4D9BC1?text=Photo" alt="Welcome gathering">
        <figcaption>Write your photo caption here</figcaption>
      </figure>
    `
  },
  {
    id: '2026-03-15-paper-accepted',
    date: '2026-03-15',
    category: '研究成果',
    categoryEn: 'Research Result',
    title: '〇〇に関する論文が国際学会「XXXX 2026」にて採択されました',
    titleEn: 'Our Paper on \u25cb\u25cb Was Accepted at the International Conference "XXXX 2026"',
    summary: '来月、現地にて口頭発表を行います。',
    summaryEn: 'We will give an oral presentation on-site next month.',
    body: `
      <p>当研究室の〇〇（修士課程2年）らによる論文が、国際学会「XXXX 2026」に採択されました。</p>
      <h2>論文情報</h2>
      <ul>
        <li><strong>タイトル：</strong> Title of the paper</li>
        <li><strong>著者：</strong> A. Author, B. Author, C. Author</li>
        <li><strong>会議：</strong> XXXX 2026（開催地・会期）</li>
        <li><strong>DOI：</strong> <a href="#">10.xxxx/xxxxx</a></li>
      </ul>
      <h2>概要</h2>
      <p>研究の概要をここに記載します。</p>
    `,
    bodyEn: `
      <p>A paper by \u25cb\u25cb (2nd-year Master's student) and co-authors from our laboratory has been accepted at the international conference "XXXX 2026."</p>
      <h2>Paper Information</h2>
      <ul>
        <li><strong>Title:</strong> Title of the paper</li>
        <li><strong>Authors:</strong> A. Author, B. Author, C. Author</li>
        <li><strong>Conference:</strong> XXXX 2026 (location and dates)</li>
        <li><strong>DOI:</strong> <a href="#">10.xxxx/xxxxx</a></li>
      </ul>
      <h2>Abstract</h2>
      <p>Write the research abstract here.</p>
    `
  },
  {
    id: '2026-01-20-media',
    date: '2026-01-20',
    category: 'メディア',
    categoryEn: 'Media',
    title: '〇〇教授のインタビュー記事が技術専門誌「〇〇ジャーナル 2月号」に掲載されました',
    titleEn: 'An Interview With Professor \u25cb\u25cb Was Featured in the February Issue of "\u25cb\u25cb Journal"',
    summary: '',
    body: `
      <p>〇〇教授へのインタビュー記事が「〇〇ジャーナル 2月号」に掲載されました。誌面では当研究室の〇〇に関する取り組みが紹介されています。</p>
    `,
    bodyEn: `
      <p>An interview with Professor \u25cb\u25cb has been featured in the February issue of "\u25cb\u25cb Journal." The article introduces our laboratory's work on \u25cb\u25cb.</p>
    `
  },
  {
    id: '2025-12-05-open-lab',
    date: '2025-12-05',
    category: 'イベント',
    categoryEn: 'Event',
    title: '研究室見学会を開催します（進学希望の学生の皆さんへ）',
    titleEn: 'We Are Holding a Lab Open House (For Prospective Students)',
    summary: '日程・申し込み方法はこちらから。',
    summaryEn: 'Details on dates and how to apply are here.',
    body: `
      <p>当研究室への進学を検討している学生の皆さんを対象に、研究室見学会を開催します。</p>
      <h2>開催概要</h2>
      <ul>
        <li><strong>日時：</strong> 〇月〇日（〇）〇:〇〇 -</li>
        <li><strong>場所：</strong> 工学部〇号館 〇階 セミナー室</li>
        <li><strong>申込：</strong> 事前申込不要／当日直接お越しください</li>
      </ul>
    `,
    bodyEn: `
      <p>We are holding a laboratory open house for students considering joining our lab.</p>
      <h2>Event Details</h2>
      <ul>
        <li><strong>Date &amp; Time:</strong> \u25cb/\u25cb (\u25cb) \u25cb:\u25cb0 &ndash;</li>
        <li><strong>Location:</strong> Seminar Room, Floor \u25cb, Building \u25cb, Faculty of Engineering</li>
        <li><strong>Registration:</strong> Not required &mdash; please come directly on the day</li>
      </ul>
    `
  }
];
