# プライベートリポジトリでGitHub Pagesを公開する方法

![GitHub Pages Private](https://img.shields.io/badge/GitHub%20Pages-Private%20Repository-blue.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-lock: **プライベートリポジトリの保護**
    
    ソースコードを非公開にしながらサイト公開

-   :material-domain: **カスタムドメイン対応**
    
    独自ドメインでのプロフェッショナルな公開

-   :material-shield-check: **アクセス制御**
    
    組織内限定公開やIPアドレス制限

-   :material-currency-usd: **プラン別機能**
    
    無料・有料プランの違いを理解して最適化

</div>

## 📖 GitHub Pagesとプライベートリポジトリの基本

GitHub Pagesは静的サイトホスティングサービスですが、プライベートリポジトリでの利用には**特定の条件**があります。

### 重要な前提条件

!!! warning "プラン要件"
    
    プライベートリポジトリでGitHub Pagesを使用するには、以下のいずれかが必要です：
    
    - **GitHub Pro** (個人向け)
    - **GitHub Team** (組織向け)
    - **GitHub Enterprise** (企業向け)
    - **GitHub Free for organizations** (条件付き)

## 💰 GitHub プランの詳細比較

### 個人アカウントのプラン

| プラン | 月額料金 | Pages対応 | 主な特徴 |
|--------|----------|-----------|----------|
| **Free** | $0 | パブリックのみ | 基本機能、パブリックリポジトリ無制限 |
| **Pro** | $4 | **プライベート対応** | プライベートPages、高度な分析、Wiki |
| **GitHub Copilot付きPro** | $10〜 | **プライベート対応** | Pro + AI支援機能 |

### 組織アカウントのプラン

| プラン | 月額料金 | Pages対応 | 主な特徴 |
|--------|----------|-----------|----------|
| **Free for organizations** | $0 | パブリックのみ* | 基本的な組織機能 |
| **Team** | $4/ユーザー | **プライベート対応** | チーム管理、SAML SSO |
| **Enterprise** | $21/ユーザー | **プライベート対応** | 高度なセキュリティ、監査 |

*注: 教育機関や非営利団体は特別条件でプライベート対応可能

## 🔍 現在のプランの確認方法

### 1. 個人アカウントの場合

```bash
# ブラウザで確認
1. GitHubにログイン
2. 右上のプロフィール画像をクリック
3. "Settings" を選択
4. 左サイドバーの "Billing and plans" をクリック
5. "Current plan" セクションで確認
```

### 2. 組織アカウントの場合

```bash
# 組織の設定から確認
1. 組織のページへ移動
2. "Settings" タブをクリック
3. "Billing and plans" を選択
4. "Current plan" で確認
```

### 3. CLIで確認する方法

```bash
# GitHub CLIを使用
gh api user --jq '.plan.name'

# 組織の場合
gh api orgs/組織名 --jq '.plan.name'
```

## 🚀 プライベートリポジトリでのPages設定手順

### Step 1: プランのアップグレード（必要な場合）

```bash
# GitHub Proへのアップグレード手順
1. Settings → Billing and plans
2. "Upgrade" ボタンをクリック
3. "GitHub Pro" を選択
4. 支払い情報を入力
5. "Purchase" で確定
```

### Step 2: リポジトリの作成と設定

```bash
# 新規プライベートリポジトリの作成
gh repo create my-private-site --private

# 既存リポジトリをプライベートに変更
gh repo edit --visibility private
```

### Step 3: GitHub Pages の有効化

1. **リポジトリ設定へアクセス**
   ```
   リポジトリ → Settings → Pages
   ```

2. **ソースの選択**
   ```yaml
   Source: Deploy from a branch
   Branch: main (または gh-pages)
   Folder: / (root) または /docs
   ```

3. **公開設定の確認**
   
   !!! info "重要な設定オプション"
       
       プライベートリポジトリの場合、以下のオプションが表示されます：
       
       - **Visibility**: Public（デフォルト）
       - サイト自体は公開されますが、ソースコードは非公開のまま

### Step 4: カスタムドメインの設定（オプション）

```bash
# CNAMEファイルの作成
echo "www.example.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

## 🔒 セキュリティとアクセス制御

### 1. 基本的なアクセス制御

プライベートリポジトリでも、**GitHub Pagesサイト自体は公開**されることに注意！

```yaml
# 重要な理解ポイント
- リポジトリ: プライベート（ソースコード非公開）
- Pagesサイト: パブリック（誰でもアクセス可能）
```

### 2. 組織内限定公開（Enterprise限定）

GitHub Enterprise Cloudでは、組織内メンバーのみアクセス可能な設定が可能：

```yaml
# Settings → Pages → Access control
Visibility: Private
Access: Members of [組織名] only
```

### 3. 認証付きPages（代替手段）

標準のGitHub Pagesでは認証機能がないため、以下の代替手段を検討：

```javascript
// 簡易的なJavaScript認証（非推奨）
const password = prompt("パスワードを入力してください");
if (password !== "secret123") {
    window.location.href = "https://github.com";
}
```

より安全な方法：
- **Netlify** や **Vercel** の使用（認証機能付き）
- **GitHub Actions** + **AWS S3** の組み合わせ
- **Cloudflare Access** によるアクセス制御

## 📝 実践的な設定例

### 1. Jekyll を使用したプライベートサイト

```yaml
# _config.yml
title: My Private Documentation
description: Internal documentation site
baseurl: "/my-private-site"
url: "https://username.github.io"

# ビルド設定
markdown: kramdown
theme: minima

# プライベート設定
github: [metadata]
repository: username/my-private-site
```

### 2. GitHub Actions での自動デプロイ

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site
      - uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${% raw %}{{ steps.{% endraw %}deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. プライベートリポジトリからの依存関係

```yaml
# package.json での設定
{
  "dependencies": {
    "private-package": "git+https://${GITHUB_TOKEN}@github.com/org/private-repo.git"
  }
}

# GitHub Actions での環境変数設定
env:
  GITHUB_TOKEN: ${% raw %}{{ secrets.{% endraw %}GITHUB_TOKEN }}
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. "GitHub Pages is not available for private repositories"

**原因**: 無料プランを使用している
**解決策**: 
```bash
# プランのアップグレード
Settings → Billing → Change plan → Select "Pro"
```

#### 2. ページが404エラーになる

**原因**: ブランチやフォルダの設定ミス
**解決策**:
```bash
# 正しいブランチの確認
git branch -a

# gh-pagesブランチの作成
git checkout -b gh-pages
git push origin gh-pages
```

#### 3. ビルドエラーが発生する

**原因**: Jekyll設定やGemfileの問題
**解決策**:
```ruby
# Gemfile
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "webrick" # Ruby 3.0以降で必要

# ローカルでテスト
bundle install
bundle exec jekyll serve
```

## 💡 ベストプラクティス

### 1. セキュリティの確保

```yaml
# .gitignore
# 機密情報を含むファイルを除外
.env
secrets/
*.key
config/production.yml

# ビルド成果物
_site/
.sass-cache/
.jekyll-cache/
```

### 2. 効率的なワークフロー

```bash
# 開発用ブランチ戦略
main        → ソースコード（プライベート）
gh-pages    → ビルド済みサイト（Pages用）
develop     → 開発作業用
```

### 3. コスト最適化

```yaml
# 無料枠を活用
- パブリックリポジトリ: ドキュメントやデモ
- プライベートリポジトリ: 本番コードや機密情報
- GitHub Actions: 月間2,000分の無料枠を効率的に使用
```

## 📊 プラン選択の判断基準

### GitHub Pro が適している場合

- 個人開発者
- プライベートプロジェクトのポートフォリオ
- 小規模な商用サイト

### GitHub Team が適している場合

- チーム開発
- 社内ドキュメントサイト
- クライアント向けデモサイト

### Enterprise が必要な場合

- 大規模組織
- 厳格なセキュリティ要件
- 監査ログが必要
- SAML SSOが必須

## 🌟 代替ソリューション

GitHub Pagesの制限を回避する代替手段：

### 1. Netlify (推奨)

```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

# 認証設定
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin", "member"]}
```

### 2. Vercel

```json
// vercel.json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

### 3. AWS Amplify

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

## 🔗 関連リソース

- [GitHub Pages 公式ドキュメント](https://docs.github.com/en/pages)
- [GitHub 料金プラン比較](https://github.com/pricing)
- [GitHub Pages 制限事項](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#limits-on-use-of-github-pages)

---

