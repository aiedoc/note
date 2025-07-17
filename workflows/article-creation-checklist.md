# Article Creation Checklist

## 📋 TodoWrite Template

記事作成時は以下のテンプレートを使用してTodoWriteでタスクを作成してください。

### Phase 1: 準備・調査段階

```json
{
  "content": "WebSearchで最新情報と既存記事を調査",
  "status": "pending", 
  "priority": "high",
  "id": "research-topic"
},
{
  "content": "既存コンテンツとの重複チェック",
  "status": "pending",
  "priority": "medium", 
  "id": "check-duplication"
},
{
  "content": "ターゲット読者層と記事構成を決定",
  "status": "pending",
  "priority": "high",
  "id": "define-structure"
}
```

### Phase 2: 執筆段階

```json
{
  "content": "日本語記事作成（標準テンプレート使用）",
  "status": "pending",
  "priority": "high",
  "id": "write-japanese-article"
},
{
  "content": "英語版記事作成（.en.mdファイル）",
  "status": "pending", 
  "priority": "high",
  "id": "write-english-article"
},
{
  "content": "全GitHub Actions変数をraw tagでエスケープ",
  "status": "pending",
  "priority": "critical",
  "id": "escape-yaml-variables"
},
{
  "content": "実用的なコード例とサンプルを追加",
  "status": "pending",
  "priority": "medium",
  "id": "add-code-examples"
},
{
  "content": "内部リンク設定と関連記事リンク追加",
  "status": "pending",
  "priority": "medium", 
  "id": "setup-internal-links"
}
```

### Phase 3: デプロイ段階

```json
{
  "content": "mkdocs.yml ナビゲーション更新（新記事追加時のみ）",
  "status": "pending",
  "priority": "high",
  "id": "update-navigation"
},
{
  "content": "意味のあるコミットメッセージでGit commit",
  "status": "pending",
  "priority": "high", 
  "id": "git-commit"
},
{
  "content": "git push origin master で自動デプロイ起動",
  "status": "pending",
  "priority": "high",
  "id": "git-push-auto-deploy"
}
```

### Phase 4: 検証段階 (🚨 最重要)

```json
{
  "content": "WebFetchでライブサイトURL確認（表示エラーなし）",
  "status": "pending",
  "priority": "critical",
  "id": "verify-live-site"
},
{
  "content": "全内部リンクの動作確認",
  "status": "pending",
  "priority": "high",
  "id": "test-internal-links"
},
{
  "content": "検索インデックス反映確認",
  "status": "pending",
  "priority": "medium",
  "id": "verify-search-indexing"
},
{
  "content": "モバイル表示とレスポンシブ確認",
  "status": "pending",
  "priority": "medium",
  "id": "test-responsive-design"
}
```

## ⚠️ Critical Gates (必須通過点)

各フェーズの**全タスクが completed** になるまで次フェーズに進めません：

- [ ] **Phase 1 Gate**: 調査・準備完了確認
- [ ] **Phase 2 Gate**: 執筆・品質確認完了  
- [ ] **Phase 3 Gate**: デプロイ完了確認
- [ ] **Phase 4 Gate**: ライブサイト検証完了 ← **絶対厳守**

## 🚫 Common Mistakes to Avoid

### ❌ 絶対禁止事項
1. **手動更新日時の追加** - `*最終更新: YYYY-MM-DD*` 等
2. **未エスケープのYAML変数** - `${{ secrets.* }}` 形式
3. **Phase 4検証の省略** - ライブサイト確認なしでの完了宣言
4. **TodoWrite更新忘れ** - 作業状況の未反映

### ✅ 必須チェック項目
1. **自動デプロイ**: GitHub Actionsで自動ビルド・デプロイ確認
2. **エラーフリー**: MkDocsビルド時にマクロエラーなし
3. **リンク有効性**: 全内部・外部リンクが正常動作
4. **レスポンシブ**: モバイル・タブレット表示確認
5. **SEO最適化**: タイトル・メタ記述・見出し構造

## 📝 Quick Commands

```bash
# ローカル確認
mkdocs serve

# 自動デプロイ（GitHub Actions経由）
git add . && git commit -m "記事タイトル" && git push origin master

# GitHub Actions実行状況確認
gh run list --limit 5

# エラーログ確認
tail -f ~/.claude/logs/error.log
```

## 🔗 Related Resources

- [Article Template](../templates/article-template.md) - 標準記事テンプレート
- [SEO Optimization Guide](./seo-optimization.md) - SEO最適化ガイド
- [Common Commands](./common-commands.md) - よく使うコマンド集

---

**重要**: このチェックリストの各項目を TodoWrite で管理し、段階的に complete していってください。Phase 4 の検証は特に重要で、ライブサイトでの正常表示確認は必須です。