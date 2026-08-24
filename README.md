# 研究室HP 運用マニュアル

## ファイル構成

```
lab-site/
├ index.html          トップページ
├ news.html           News 一覧（記事タイトルの一覧・カテゴリ絞り込み）
├ news-detail.html    News 詳細ページ（1枚で全記事に対応。URLの ?id= で切り替え）
├ research.html       研究テーマ
├ members.html        メンバー
├ data/
│  ├ site.js          研究室名・所属・連絡先・ナビ項目（★まずここを編集）
│  └ news.js          ★ニュース記事のデータ（追加はここだけ）
└ assets/
   ├ css/style.css    全ページ共通のスタイル
   └ js/
      ├ theme.js      配色などのテーマ設定
      └ site.js       ヘッダー/フッター生成・News描画（通常編集不要）
```

## ニュースを1件追加する手順

`data/news.js` の `window.NEWS_ITEMS = [` の直後に、以下を貼り付けて中身を書き換えるだけです。
日付順に自動で並び替わるので、貼り付け位置は気にしなくて構いません。

```js
  {
    id: '2026-09-01-example',        // URL用の一意なID（あとから変更しない）
    date: '2026-09-01',              // YYYY-MM-DD
    category: 'お知らせ',             // お知らせ / 研究成果 / メディア / イベント（自由に追加可）
    title: '一覧に表示される記事タイトル',
    summary: '一覧のタイトル下に出る1行要約。不要なら空文字にする',
    body: `
      <p>詳細ページの本文。HTMLで書けます。</p>
      <h2>見出し</h2>
      <ul><li>箇条書き</li></ul>
      <figure>
        <img src="assets/img/xxx.jpg" alt="説明">
        <figcaption>キャプション</figcaption>
      </figure>
    `
  },
```

- カテゴリを新しく増やすと、News 一覧の絞り込みボタンも自動で増えます。
- `body` を書かない記事は、一覧でタイトルのみ表示され、詳細ページへはリンクしません。
- `pinned: true` を足すと、日付に関係なく一覧の先頭に固定されます。
- 外部サイトに飛ばしたいときは `url: 'https://...'`（別タブで開きます）。
- 自分で作った個別HTMLに飛ばしたいときは `page: 'news/2026-09-01-example.html'`。
- トップページの Recent News は最新3件を自動表示します（件数は `index.html` の
  `<ul id="news-preview" data-limit="3">` の数字で変更）。
- 一覧の1ページ表示件数は `news.html` の `data-page-size="10"` で変更（超過分は「さらに表示する」ボタン）。

## 研究室名などを変える

`data/site.js` の `labName` / `affiliation` / `contactEmail` / `address` などを書き換えると、
全ページのヘッダー・フッターに一括で反映されます（各HTMLの `<title>` は個別に修正してください）。

## 画像の置き場所

`assets/img/` フォルダを作ってそこに置き、`assets/img/ファイル名.jpg` で参照します。
現在は仮画像（placehold.co）を使っているので、差し替えてください。
写真は横1600px程度・JPEGに圧縮してから置くと表示が軽くなります。

## 公開時の注意

- 現状 Tailwind CSS を CDN（`https://cdn.tailwindcss.com`）から読み込んでいます。
  手軽ですが本番では表示が一瞬遅れることがあるため、大学サーバに置く際は
  ビルド済みCSSに差し替えるとより高速になります（動作自体はそのままでも問題ありません）。
- ファイルをローカルでダブルクリックして開いた場合（file://）でも動作します。
