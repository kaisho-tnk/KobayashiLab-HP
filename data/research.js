/* ============================================================
   Research データ　← 研究テーマを追加・変更するときはこのファイルだけ編集
   ------------------------------------------------------------
   ここを直すだけで、ホームのプレビュー・research/index.html の一覧・
   research/theme-N.html の詳細ページ、すべてに反映されます。

   ・id          … アンカー/URL用の一意な文字列（半角英数とハイフン推奨。あとから変えない）
                   research/theme-N.html というファイル名と対応させています
   ・icon        … カード上部に出すアイコン。'flask' / 'sun' / 'signal' から選択
                   （増やしたい場合は assets/js/research.js の ICONS に追記）
   ・cardColor   … カード画像の背景色。'blue' か 'yellow'
   ・title / titleEn         … 一覧・詳細ページ共通のテーマ名
   ・summary / summaryEn     … 一覧カード・ホームプレビューで使う短い説明
   ・keywords / keywordsEn   … キーワード（配列。カンマ区切りで表示）
   ・pageTitle / pageTitleEn … 詳細ページの大見出し（省略時は title を使用）
   ・intro / introEn         … 詳細ページ冒頭の説明文
   ・background / backgroundEn … 「研究の背景」セクション
   ・approach / approachEn      … 「アプローチ」の箇条書き（配列）
   ============================================================ */
window.RESEARCH_THEMES = [
  {
    id: 'theme-1',
    icon: 'flask',
    cardColor: 'blue',
    title: '〇〇に関する基礎研究',
    titleEn: 'Fundamental Research on XX',
    summary: 'ここに研究テーマ1の詳細が入ります。〇〇のメカニズムを解明するため、独自の計測システムを用いてデータの収集と解析を行っています。',
    summaryEn: 'Details of Research Theme 1 go here. To clarify the mechanism of XX, we collect and analyze data using our own original measurement system.',
    keywords: ['〇〇解析', '新規アルゴリズム', 'データモデリング'],
    keywordsEn: ['XX Analysis', 'Novel Algorithms', 'Data Modeling'],
    pageTitle: '研究テーマ1のタイトル',
    pageTitleEn: 'Research Theme 1 Title',
    intro: 'ここに研究テーマ1の詳しい説明を書きます。背景・目的、アプローチ、これまでの成果などを記載してください。',
    introEn: 'A detailed description of Research Theme 1 goes here. Please include the background, objectives, approach, and results so far.',
    background: 'なぜこの研究に取り組んでいるのか、社会的・学術的な意義を記載します。',
    backgroundEn: 'Describe why this research is being pursued, and its social and academic significance.',
    approach: ['アプローチ1の説明', 'アプローチ2の説明'],
    approachEn: ['Description of Approach 1', 'Description of Approach 2']
  },
  {
    id: 'theme-2',
    icon: 'sun',
    cardColor: 'yellow',
    title: '次世代〇〇システムの開発',
    titleEn: 'Development of Next-Generation XX Systems',
    summary: 'ここに研究テーマ2の詳細が入ります。AIや機械学習を活用し、効率的で精度の高い〇〇システムを開発しています。企業との共同研究も活発です。',
    summaryEn: 'Details of Research Theme 2 go here. Using AI and machine learning, we are developing efficient, high-precision XX systems, with active joint research alongside industry partners.',
    keywords: ['機械学習', '最適化システム', '産学連携'],
    keywordsEn: ['Machine Learning', 'Optimization Systems', 'Industry-Academia Collaboration'],
    pageTitle: '研究テーマ2のタイトル',
    pageTitleEn: 'Research Theme 2 Title',
    intro: 'ここに研究テーマ2の詳しい説明を書きます。背景・目的、アプローチ、これまでの成果などを記載してください。',
    introEn: 'A detailed description of Research Theme 2 goes here. Please include the background, objectives, approach, and results so far.',
    background: 'なぜこの研究に取り組んでいるのか、社会的・学術的な意義を記載します。',
    backgroundEn: 'Describe why this research is being pursued, and its social and academic significance.',
    approach: ['アプローチ1の説明', 'アプローチ2の説明'],
    approachEn: ['Description of Approach 1', 'Description of Approach 2']
  },
  {
    id: 'theme-3',
    icon: 'signal',
    cardColor: 'blue',
    title: '社会実装の検証',
    titleEn: 'Verification of Real-World Implementation',
    summary: 'ここに研究テーマ3の詳細が入ります。研究室で開発した技術を実際のフィールドで運用し、その効果や課題を検証します。',
    summaryEn: 'Details of Research Theme 3 go here. We deploy technologies developed in our lab in real-world settings to verify their effectiveness and identify remaining challenges.',
    keywords: ['社会実装', 'フィールドワーク', '実証実験'],
    keywordsEn: ['Real-World Implementation', 'Fieldwork', 'Demonstration Experiments'],
    pageTitle: '研究テーマ3のタイトル',
    pageTitleEn: 'Research Theme 3 Title',
    intro: 'ここに研究テーマ3の詳しい説明を書きます。背景・目的、アプローチ、これまでの成果などを記載してください。',
    introEn: 'A detailed description of Research Theme 3 goes here. Please include the background, objectives, approach, and results so far.',
    background: 'なぜこの研究に取り組んでいるのか、社会的・学術的な意義を記載します。',
    backgroundEn: 'Describe why this research is being pursued, and its social and academic significance.',
    approach: ['アプローチ1の説明', 'アプローチ2の説明'],
    approachEn: ['Description of Approach 1', 'Description of Approach 2']
  }
];
