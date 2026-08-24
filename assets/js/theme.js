/* Tailwind CDN 用の共通テーマ設定（全ページで tailwind CDN の直後に読み込む） */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: { sans: ['"Noto Sans JP"', 'sans-serif'] },
      colors: {
        brand: {
          blue: '#4D9BC1',
          yellow: '#F2C75C',
          dark: '#1e293b',
          light: '#f8fafc'
        }
      }
    }
  }
};
