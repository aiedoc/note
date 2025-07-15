# 最新更新記事一覧

<style>
/* 最新更新記事スタイル */
.recent-updates {
  display: grid !important;
  gap: 0.8rem !important;
  margin: 1.5rem 0 !important;
}

.update-item {
  background: var(--md-default-bg-color) !important;
  border: 1px solid var(--md-default-fg-color--lightest) !important;
  border-radius: 8px !important;
  padding: 1rem !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.update-item:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}

.update-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  gap: 1rem !important;
  margin-bottom: 0.5rem !important;
}

.update-header h4 {
  margin: 0 !important;
  font-size: 1.1rem !important;
  line-height: 1.4 !important;
}

.update-header h4 a {
  color: var(--md-primary-fg-color) !important;
  text-decoration: none !important;
}

.update-header h4 a:hover {
  text-decoration: underline !important;
}

.update-badge {
  background: var(--md-primary-fg-color--light) !important;
  color: white !important;
  padding: 0.2rem 0.6rem !important;
  border-radius: 12px !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.update-meta {
  font-size: 0.85rem !important;
  color: var(--md-default-fg-color--light) !important;
}

.category-section {
  margin: 2rem 0 !important;
  border: 1px solid var(--md-default-fg-color--lightest) !important;
  border-radius: 12px !important;
  padding: 1.5rem !important;
}

.category-section h2 {
  margin-top: 0 !important;
  color: var(--md-primary-fg-color) !important;
  border-bottom: 2px solid var(--md-primary-fg-color) !important;
  padding-bottom: 0.5rem !important;
}

@media (max-width: 768px) {
  .update-header {
    flex-direction: column !important;
    gap: 0.5rem !important;
  }
  
  .update-badge {
    align-self: flex-start !important;
  }
}
</style>

## 📝 すべての最新更新

{{ recent_updates(limit=20, lang="ja") }}

---

## 📂 カテゴリ別最新更新

### 🤖 AI開発

{{ category_recent_updates("AI開発", limit=8, lang="ja") }}

### 🖥️ インフラ

{{ category_recent_updates("インフラ", limit=5, lang="ja") }}

### 🛠️ Tips

{{ category_recent_updates("Tips", limit=5, lang="ja") }}

### 🚀 SEO

{{ category_recent_updates("SEO", limit=3, lang="ja") }}

### 📚 情報・その他

{{ category_recent_updates("情報", limit=3, lang="ja") }}

---

## 📊 サイト情報

- **更新頻度**: 最新情報はファイルの更新日時に基づいて自動的に表示されます
- **カテゴリ**: AI開発、インフラ、Tips、SEO、情報の5つのカテゴリに分類
- **表示順**: 最新更新日時順で表示

!!! tip "記事の探し方"
    - **最新の情報**: このページで最新更新をチェック
    - **分野別検索**: 左サイドバーからカテゴリを選択
    - **キーワード検索**: 上部の検索ボックスを活用
    - **人気記事**: [ホームページ](./index.md)の「人気・注目コンテンツ」をチェック

---

*最終更新: このページは自動的に最新情報を表示します*