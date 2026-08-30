/* ============================================================
   Members データ　← メンバーを追加・変更するときはこのファイルだけ編集
   ------------------------------------------------------------
   window.MEMBERS 直下に、教員・学生・スタッフ・卒業生を区別なくフラットに並べます。
   誰がどの区分（Faculty／Students／Staff／Alumni）で、学年欄に何と表示されるかは
   status の値だけで自動的に決まります。

   ・status … 以下のいずれかを指定（すべて略称なしのフル表記）

       【Faculty（教員）】
       'Professor'                    … 教授
       'Associate Professor'          … 准教授
       'Project Associate Professor'  … 特任准教授
       'Assistant Professor'          … 助教授
                                          ※「准教授」と英訳が被るため暫定の表記です。
                                             正式な英語呼称があれば差し替えてください。
       'Project Assistant Professor'  … 特任助教授

       【Students（学生）】… 'D1'〜'D3' / 'M1'〜'M2' / 'B1'〜'B4'
         例: 'D1' → 博士課程 1年 / 'M2' → 修士課程 2年 / 'B4' → 学部 4年
         （学生の学年は今まで通り略称で入力し、Studentsページ側で自動的にフル表記へ展開されます）

       【Staff（研究員・支援スタッフ等）】
       'Teaching Assistant'           … TA
       'Postdoctoral Researcher'      … ポスドク
       'Special Assistant Teacher'    … 特別補助教員（訳は仮。正式表記があれば差し替え可）
       'Academic Support Staff'       … 学術支援スタッフ（同上）
       'R&D Staff'                    … 研究開発員（同上）
       'Secretary'                    … 秘書

       【Alumni（卒業生）】
       'OB' / 'OG'

     ※ 上記以外の文字列を入れた場合は、その文字列がそのまま表示されます。

   ・id         … アンカーリンク用の一意な文字列（半角英数とハイフン推奨。あとから変えない）
                  ホームのプレビューからこの id を使って該当カードまで直接ジャンプします
   ・name       … 氏名
   ・photo      … 画像パス（assets/img/members/ 以下に置くのがおすすめ）
   ・graduation … 卒業(修了)予定年月 'YYYY-MM-X'（X は B=学部 / M=修士課程 / D=博士課程）。全員に入力可。
                  status を OB/OG にしたとき、Alumni欄に自動表示されます
                  例: '2027-03-M' → 「2027年3月 修士課程修了」
                      '2026-03-B' → 「2026年3月 学部卒業」
   ・role       … Faculty のみで使用。役職。複数あれば配列で改行表示されます
                  例: role: ['教授 (Professor)', '〇〇センター長']
   ・field/degree/contact/bio … Faculty のみで使用（不要なら省略・空文字でOK）
   ・theme/hobby              … Students のみで使用（不要なら省略・空文字でOK）
   ・note                     … Alumni のみで使用。graduation とあわせて表示される補足
                                 （例: '現 〇〇株式会社'）
   ・comment                  … 「ひとこと」欄（Faculty・Students・Staff共通、省略可）
   ============================================================ */
window.MEMBERS = [
  {
    id: 'member-000',
    status: 'OG',
    name: 'えきすいちゃん',
    graduation: '2023-08-D',
    photo: 'assets/img/members/ob_example.jpg',
    note: '現 能代ロケット実験場 公認キャラクター'
  },
  {
    id: 'member-001',
    status: 'Professor',
    name: '小林 弘明',
    graduation: '',
    role: [
      '国立研究開発法人宇宙航空研究開発機構 宇宙科学研究所 教授',
      '東京大学大学院 工学系研究科 航空宇宙工学専攻 教授 (2024年4月-兼任)',
      'クランフィールド大学 工学部 客員教授 (2025年7月-兼任)'
    ],
    photo: 'assets/img/members/professor_kobayashi.jpg',
    field: '',
    degree: '',
    contact: '',
    bio: '1972年、東京都生まれ。東京大学大学院工学系研究科航空宇宙工学専攻博士課程修了。博士（工学）。宇宙科学研究所助手、宇宙航空研究開発機構総合技術研究本部研究員、宇宙科学研究所特任准教授などを経て、2022年より現職。',
    comment: '目指すのは水素燃料の完全再使用ロケット。宇宙空間に出るまでは大気中の酸素を利用しようという、エアブリーザー型エンジンの開発に取り組んでいます。'
  },
  {
    id: 'member-002',
    status: 'Secretary',
    name: '米田 由香',
    graduation: '',
    photo: '',
    comment: ''
  },
  {
    id: 'member-003',
    status: 'D1',
    name: '澤井 響',
    graduation: '2029-03-D',
    photo: 'assets/img/members/r6_sawai.jpg',
    theme: 'コアンダ効果を利用したエアターボ・ロケット複合エンジンの推力偏向',
    hobby: '',
    note: '',
    comment: ''
  },
  {
    id: 'member-004',
    status: 'M2',
    name: '松本 倭',
    graduation: '2027-03-M',
    photo: 'assets/img/members/r7_matsumoto.jpg',
    theme: 'スリーブ可動式ピントル型インジェクタの開発',
    hobby: '',
    comment: ''
  },
  {
    id: 'member-005',
    status: 'M2',
    name: 'Yuki Kaji',
    graduation: '2027-03-M',
    photo: 'assets/img/members/r7_kaji.jpg',
    theme: 'エアターボ・ロケット複合エンジンにおけるエアロスパイクノズルの概念検討',
    hobby: '',
    comment: ''
  },
  {
    id: 'member-006',
    status: 'M1',
    name: '岩崎 葵哉',
    graduation: '2026-03-M',
    photo: 'assets/img/members/r8_iwasaki.jpg',
    theme: 'ディフレクター設置によるピントル型インジェクタの微粒化性能向上',
    hobby: '',
    comment: ''
  },
  {
    id: 'member-007',
    status: 'M1',
    name: '田中 海翔',
    graduation: '2026-03-M',
    photo: 'assets/img/members/r8_tanaka.jpg',
    theme: '同軸二重円状超音速流れの地面衝突効果',
    hobby: '',
    comment: ''
  },
  {
    id: 'member-008',
    status: 'M1',
    name: '山本 格由',
    graduation: '2026-03-M',
    photo: 'assets/img/members/r8_yamamoto.jpg',
    theme: 'エアターボ・ロケット複合エンジンの新サイクル検討',
    hobby: '',
    comment: ''
  }
  // Staff（TA・ポスドク等）を追加する例:
  // ※ Staffは写真なしで表示されます。photo は空文字のままでOK。ホーム画面には表示されません
  // {
  //   id: 'member-008',
  //   status: 'Postdoctoral Researcher',
  //   name: '〇〇 〇〇',
  //   graduation: '',
  //   photo: '',
  //   comment: ''
  // }
  // //
  // OB/OGを追加する例:
  // {
  //   id: 'member-009',
  //   status: 'OB',
  //   name: '〇〇 〇〇',
  //   graduation: '2026-03-M',
  //   photo: 'assets/img/members/ob_example.jpg',
  //   note: '現 〇〇株式会社'
  // }
];
