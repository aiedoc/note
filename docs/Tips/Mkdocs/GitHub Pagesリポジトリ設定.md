# GitHub Pagesリポジトリ設定ガイド

## 概要

このサイトを `https://aiedoc.github.io/` でアクセス可能にするための設定手順です。

## 必要な設定

### 1. リポジトリ名の変更

組織のメインGitHub Pagesサイトとして機能させるには、リポジトリ名を以下のように変更する必要があります：

- **現在**: `note`
- **変更後**: `aiedoc.github.io`

### 2. リポジトリ名変更手順

1. GitHubリポジトリページの **Settings** タブに移動
2. **Repository name** セクションで `aiedoc.github.io` に変更
3. **Rename** ボタンをクリック

### 3. GitHub Pages設定

リポジトリ名変更後、GitHub Pages設定を確認：

1. **Settings** → **Pages** に移動
2. **Source** で **Deploy from a branch** を選択
3. **Branch** で `gh-pages` を選択
4. **Folder** で `/ (root)` を選択
5. **Save** をクリック

## 重要な注意点

### リポジトリ名とURL の関係

| リポジトリ名 | アクセス可能URL |
|-------------|-----------------|
| `aiedoc.github.io` | `https://aiedoc.github.io/` |
| `note` | `https://aiedoc.github.io/note/` |

### クローンURL の更新

リポジトリ名変更後、ローカルの設定更新が必要：

```bash
# リモートURL を更新
git remote set-url origin https://github.com/aiedoc/aiedoc.github.io.git

# 確認
git remote -v
```

## 代替案

リポジトリ名を変更したくない場合の選択肢：

### カスタムドメイン使用

1. 独自ドメインを設定
2. CNAMEファイルでドメイン指定
3. DNS設定でGitHub Pagesを指定

### リダイレクト設定

1. `aiedoc.github.io` リポジトリを作成
2. `index.html` でnoteリポジトリにリダイレクト

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=https://aiedoc.github.io/note/">
    <script>window.location.href = "https://aiedoc.github.io/note/";</script>
</head>
<body>
    <p>リダイレクト中... <a href="https://aiedoc.github.io/note/">こちらをクリック</a></p>
</body>
</html>
```

## 確認手順

設定完了後の確認：

1. `https://aiedoc.github.io/` にアクセス
2. サイトが正常に表示されることを確認
3. 内部リンクが正常に動作することを確認
4. 検索機能が正常に動作することを確認

## トラブルシューティング

### サイトが表示されない

- DNS反映に最大10分程度かかる場合があります
- ブラウザキャッシュをクリアしてください
- GitHub Actions のデプロイログを確認してください

### リンクが壊れている

- サイト内のハードコードされたURLを確認
- `mkdocs.yml` の `site_url` 設定を確認
- 相対パスを使用することを推奨

## 関連資料

- [GitHub Pages公式ドキュメント](https://docs.github.com/ja/pages)
- [MkDocsデプロイメントガイド](https://www.mkdocs.org/user-guide/deploying-your-docs/)