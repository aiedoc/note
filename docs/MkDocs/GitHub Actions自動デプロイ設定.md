# MkDocs GitHub Actions自動デプロイ設定ガイド

GitHub ActionsによるMkDocsの自動デプロイを実装するための完全ガイドです。手動デプロイから自動化CI/CDパイプラインへの移行方法を詳しく解説します。

## 実現できること

<div class="grid cards" markdown>

-   :fontawesome-solid-rocket:{ .lg .middle } __完全自動デプロイ__

    ---

    プッシュと同時にGitHub Pagesへ自動デプロイ

-   :fontawesome-solid-users:{ .lg .middle } __チーム開発対応__

    ---

    ローカル環境不要で統一された品質

-   :fontawesome-solid-shield:{ .lg .middle } __セキュリティ強化__

    ---

    適切な権限管理とトークン制御

-   :fontawesome-solid-bolt:{ .lg .middle } __高速ビルド__

    ---

    依存関係キャッシュで短時間デプロイ

-   :fontawesome-solid-check:{ .lg .middle } __品質保証__

    ---

    ビルドエラー時の自動停止機能

-   :fontawesome-solid-clock:{ .lg .middle } __デプロイ履歴管理__

    ---

    実行ログと履歴の完全追跡

</div>

## なぜGitHub Actions CI/CDが必要か

### 従来の手動デプロイの問題点

**`mkdocs gh-deploy`の限界:**
- ❌ デプロイ前のレビューができない
- ❌ ローカル環境依存でチーム開発に不向き
- ❌ ビルドエラーの見落としリスク
- ❌ セキュリティ制御が限定的
- ❌ 一貫性のない実行環境

### GitHub Actions CI/CDの利点

**プロフェッショナルな運用:**
- ✅ **自動化**: プッシュと同時に自動デプロイ
- ✅ **品質保証**: エラー時の自動停止
- ✅ **チーム協作**: 統一された実行環境
- ✅ **セキュリティ**: 適切な権限管理
- ✅ **効率性**: キャッシュによる高速化
- ✅ **監視**: 詳細なログと実行履歴

## 実装手順

### 1. ディレクトリ構造の準備

```bash
mkdir -p .github/workflows
```

### 2. GitHub Actionsワークフローファイルの作成

`.github/workflows/deploy-mkdocs.yml`:

```yaml
name: Deploy MkDocs to GitHub Pages

on:
  push:
    branches: [ "master" ]  # または "main"
    paths: [ "docs/**", "mkdocs.yml", "custom_theme/**" ]
  workflow_dispatch:  # 手動実行オプション

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Git履歴取得（revision dateプラグイン用）
      
      - name: Configure Git Credentials
        run: |
          git config user.name github-actions[bot]
          git config user.email 41898282+github-actions[bot]@users.noreply.github.com
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Cache dependencies
        run: echo "cache_id=$(date --utc '+%V')" >> $GITHUB_ENV
      
      - name: Cache MkDocs
        uses: actions/cache@v4
        with:
          key: mkdocs-material-${% raw %}{{ env.{% endraw %}cache_id }}
          path: .cache
          restore-keys: |
            mkdocs-material-
      
      - name: Install dependencies
        run: |
          pip install --upgrade pip
          pip install mkdocs-material
          pip install mkdocs-git-revision-date-localized-plugin
          pip install mkdocs-minify-plugin
          pip install mkdocs-static-i18n
      
      - name: Build and deploy to GitHub Pages
        run: mkdocs gh-deploy --force --clean --verbose
        env:
          GITHUB_TOKEN: ${% raw %}{{ secrets.{% endraw %}GITHUB_TOKEN }}
```

### 3. .gitignoreファイルの設定

`.gitignore`:

```gitignore
# MkDocs build output
site/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

!!! warning "重要: .gitignoreの正しい書き方"
    - `site/` が正しい書き方です
    - `×` `/site/` - これはルートディレクトリ直下のsite/のみを無視
    - `○` `site/` - どの階層にあるsite/ディレクトリも無視
    
    MkDocsのビルド出力は大量のファイルになるため、masterブランチにコミットすべきではありません。GitHub Actionsが自動的にgh-pagesブランチにデプロイします。

### 4. コミット・プッシュ

```bash
git add .
git commit -m "Implement GitHub Actions CI/CD for MkDocs deployment"
git push origin master
```

## ワークフロー詳細解説

### トリガー設定

```yaml
on:
  push:
    branches: [ "master" ]
    paths: [ "docs/**", "mkdocs.yml", "custom_theme/**" ]
```

**ポイント:**
- **branches**: 対象ブランチを指定
- **paths**: ドキュメント関連ファイル変更時のみ実行
- **workflow_dispatch**: 手動実行を可能にする

### 権限設定

```yaml
permissions:
  contents: write    # リポジトリ書き込み
  pages: write      # GitHub Pages書き込み
  id-token: write   # OIDC認証用
```

**セキュリティのポイント:**
- 最小権限の原則に従う
- `write-all`は使用しない
- 必要な権限のみ付与

### キャッシュ戦略

```yaml
- name: Cache MkDocs
  uses: actions/cache@v4
  with:
    key: mkdocs-material-${% raw %}{{ env.{% endraw %}cache_id }}
    path: .cache
    restore-keys: |
      mkdocs-material-
```

**効果:**
- ビルド時間を大幅短縮
- 依存関係の再ダウンロード回避
- 週単位でキャッシュ更新

## 高度な設定オプション

### マルチ言語サイト対応

```yaml
- name: Install dependencies
  run: |
    pip install --upgrade pip
    pip install mkdocs-material
    pip install mkdocs-static-i18n  # 多言語対応
```

### テスト統合

```yaml
- name: Run tests
  run: |
    # リンクチェック
    pip install pytest-check-links
    pytest --check-links docs/
    
    # Markdownリンティング
    pip install markdownlint-cli
    markdownlint docs/**/*.md
```

### 通知設定

```yaml
- name: Notify deployment status
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${% raw %}{{ secrets.{% endraw %}SLACK_WEBHOOK }}
```

## トラブルシューティング

### よくあるエラーと解決策

#### 1. 権限エラー

**エラー例:**
```
Error: Resource not accessible by integration
```

**解決策:**
1. リポジトリ設定 → Actions → General
2. "Workflow permissions"を"Read and write permissions"に変更

#### 2. ビルドエラー

**エラー例:**
```
ModuleNotFoundError: No module named 'mkdocs_material'
```

**解決策:**
- `requirements.txt`を作成して依存関係を明示
- ワークフローの依存関係インストール部分を確認

#### 3. キャッシュ問題

**症状:**
- ビルド時間が短縮されない
- 古い依存関係が使用される

**解決策:**
```yaml
- name: Clear cache (if needed)
  run: |
    rm -rf .cache
    pip cache purge
```

### デバッグ方法

```yaml
- name: Debug information
  run: |
    echo "Python version: $(python --version)"
    echo "MkDocs version: $(mkdocs --version)"
    echo "Working directory: $(pwd)"
    ls -la
```

## セキュリティベストプラクティス

### 1. 最小権限の原則

```yaml
permissions:
  contents: write  # 必要最小限
  pages: write     # GitHub Pages用
  id-token: write  # OIDC用
```

### 2. シークレット管理

```yaml
env:
  GITHUB_TOKEN: ${% raw %}{{ secrets.{% endraw %}GITHUB_TOKEN }}  # 自動生成トークン使用
```

**避けるべき:**
- 個人アクセストークンの使用
- ハードコードされた認証情報

### 3. 依存関係の固定化

```yaml
- name: Install dependencies
  run: |
    pip install mkdocs-material==9.6.14  # バージョン固定
```

## パフォーマンス最適化

### 1. 並列実行

```yaml
strategy:
  matrix:
    python-version: ["3.11"]
    os: [ubuntu-latest]
```

### 2. 条件付き実行

```yaml
- name: Deploy only on main branch
  if: github.ref == 'refs/heads/main'
  run: mkdocs gh-deploy --force --clean
```

### 3. 差分ビルド

```yaml
- name: Check for changes
  run: |
    if git diff --quiet HEAD~1 HEAD docs/; then
      echo "No documentation changes detected"
      exit 0
    fi
```

## 実運用のベストプラクティス

### 1. ブランチ戦略

```yaml
on:
  push:
    branches: [ "main", "develop" ]  # 複数ブランチ対応
  pull_request:
    branches: [ "main" ]             # PR時の検証
```

### 2. 環境別デプロイ

```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: mkdocs gh-deploy --config-file mkdocs-staging.yml

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: mkdocs gh-deploy --force --clean
```

### 3. バージョン管理

```yaml
- name: Install versioning tool
  run: pip install mike

- name: Deploy versioned docs
  run: |
    mike deploy --push --update-aliases ${% raw %}{{ github.{% endraw %}ref_name }} latest
    mike set-default --push latest
```

## まとめ

GitHub Actions CI/CDによるMkDocsの自動デプロイは、以下の価値を提供します：

### 🎯 導入効果
- **効率性**: 手動作業の完全自動化
- **品質**: 一貫したビルド環境
- **安全性**: 適切な権限とセキュリティ制御
- **可視性**: 詳細なログと実行履歴
- **チーム開発**: 環境差分の解消

### 🚀 今後の運用
1. **プッシュ**: `git push origin master`
2. **自動実行**: GitHub Actionsが起動
3. **自動デプロイ**: 数分後にサイト更新完了

この設定により、ドキュメントの更新がより簡単、安全、そして効率的になります。プロフェッショナルな開発チームには必須の設定と言えるでしょう。

## 関連記事

- [MkDocsメモ](./index.md)
- [GitHub Pages作成方法](./mkdocsを使ったGitHubPages.md)
- [多言語対応設定](./多言語対応設定.md)
- [高度な設定](./高度な設定.md)