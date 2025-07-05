# GitHub Pagesで複数ページのWebサイトを作成する完全ガイド【2025年版】

GitHub Pagesで複数ページのWebサイトを作成する方法を、初心者にも分かりやすく解説します。静的サイトジェネレータを使った本格的なサイト構築から、シンプルなHTMLでの実装まで、あらゆるパターンを網羅しています。

!!! info "最終更新：2025年1月"
    この記事は2025年1月時点の最新情報に基づいています。GitHub Pagesの仕様は定期的に更新されるため、公式ドキュメントも併せてご確認ください。

## 📋 目次

1. [GitHub Pagesとは](#github-pagesとは)
2. [複数ページサイトの作成方法](#複数ページサイトの作成方法)
3. [静的サイトジェネレータを使う方法](#静的サイトジェネレータを使う方法)
4. [シンプルなHTMLで作る方法](#シンプルなhtmlで作る方法)
5. [よくあるトラブルと解決方法](#よくあるトラブルと解決方法)
6. [SEO対策とベストプラクティス](#seo対策とベストプラクティス)

## GitHub Pagesとは

GitHub Pagesは、GitHubが提供する無料の静的Webサイトホスティングサービスです。リポジトリに保存したHTMLファイルやMarkdownファイルを、そのままWebサイトとして公開できます。

### メリット

- ✅ **完全無料**で利用可能（1GB以下のリポジトリサイズ）
- ✅ **独自ドメイン**の設定も可能
- ✅ **HTTPS**が標準で有効
- ✅ **バージョン管理**ができる
- ✅ **自動デプロイ**で更新が簡単
- ✅ **GitHub Actions**による高度な自動化

### 制限事項

- ⚠️ **静的サイトのみ**対応（PHP、Ruby、Pythonなどのサーバーサイド言語は使用不可）
- ⚠️ **商用利用に制限**あり（eコマースサイトやSaaSサービスは不可）
- ⚠️ **リポジトリサイズ**は1GB以下推奨
- ⚠️ **帯域幅**は月間100GB以下
- ⚠️ **Private Pages**は有料プランのみ

## 複数ページサイトの作成方法

GitHub Pagesで複数ページのサイトを作成する方法は、大きく分けて3つあります。

### 1. 静的サイトジェネレータを使う（推奨）

最も効率的で保守しやすい方法です。

| ツール | 特徴 | 向いているサイト |
|--------|------|------------------|
| **Jekyll** | GitHub Pages標準対応 | ブログ、ドキュメント |
| **MkDocs** | Markdown特化 | 技術ドキュメント |
| **Hugo** | 高速ビルド | 大規模サイト |
| **Next.js** | React製 | 動的なWebアプリ |

### 2. シンプルなHTMLファイルで作る

小規模なサイトに最適な方法です。

### 3. SPAフレームワークを使う

モダンなWebアプリケーションを作成できます。

## 静的サイトジェネレータを使う方法

### MkDocsを使った複数ページサイトの作成

MkDocsは技術ドキュメントに特化した静的サイトジェネレータです。Markdownで書いたファイルを美しいWebサイトに変換できます。

#### 1. 環境構築

```bash
# Pythonのインストール確認
python --version

# MkDocsとテーマのインストール
pip install mkdocs mkdocs-material
```

#### 2. プロジェクトの初期化

```bash
# 新しいプロジェクトを作成
mkdocs new my-docs
cd my-docs

# ディレクトリ構造
my-docs/
├── docs/           # Markdownファイルを置くディレクトリ
│   └── index.md    # トップページ
└── mkdocs.yml      # 設定ファイル
```

#### 3. 複数ページの追加

```yaml
# mkdocs.yml
site_name: My Documentation
site_url: https://username.github.io/repository-name/
theme:
  name: material
  language: ja

nav:
  - ホーム: index.md
  - はじめに:
    - インストール: getting-started/installation.md
    - 設定: getting-started/configuration.md
  - ガイド:
    - 基本的な使い方: guides/basic-usage.md
    - 応用編: guides/advanced.md
  - APIリファレンス: api-reference.md
```

#### 4. ページの作成

```markdown
# docs/getting-started/installation.md
# インストールガイド

このページでは、インストール方法を説明します。

## 必要な環境

- Python 3.8以上
- pip

## インストール手順

1. パッケージのインストール
   ```bash
   pip install our-package
   ```

2. 初期設定
   ```bash
   our-package init
   ```
```

#### 5. GitHub Pagesへのデプロイ

##### 方法1: GitHub Actions（推奨）

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # git履歴を取得（更新日時表示用）
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install mkdocs-material
          pip install mkdocs-minify-plugin
      
      - name: Build and deploy
        run: mkdocs gh-deploy --force --clean --verbose
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

##### 方法2: 手動デプロイ

```bash
# ローカルでビルドしてデプロイ
mkdocs gh-deploy
```

### Jekyllを使った複数ページサイトの作成

JekyllはGitHub Pagesが標準でサポートしている静的サイトジェネレータです。

#### 1. _config.ymlの設定

```yaml
# _config.yml
title: My Awesome Site
description: 複数ページのサイトサンプル
baseurl: "/repository-name"
url: "https://username.github.io"

# ナビゲーション
navigation:
  - title: ホーム
    url: /
  - title: About
    url: /about/
  - title: ブログ
    url: /blog/
  - title: お問い合わせ
    url: /contact/
```

#### 2. レイアウトファイルの作成

```html
<!-- _layouts/default.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>{{ page.title }} - {{ site.title }}</title>
    <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
</head>
<body>
    <nav>
        <ul>
        {% for item in site.navigation %}
            <li><a href="{{ item.url | relative_url }}">{{ item.title }}</a></li>
        {% endfor %}
        </ul>
    </nav>
    
    <main>
        {{ content }}
    </main>
    
    <footer>
        <p>&copy; 2025 {{ site.title }}</p>
    </footer>
</body>
</html>
```

## シンプルなHTMLで作る方法

静的サイトジェネレータを使わずに、純粋なHTMLで複数ページサイトを作る方法です。

### ディレクトリ構造

```
repository-name/
├── index.html          # トップページ
├── about.html          # Aboutページ
├── products/
│   ├── index.html      # 製品一覧
│   └── product1.html   # 製品詳細
├── blog/
│   ├── index.html      # ブログ一覧
│   └── post1.html      # ブログ記事
├── css/
│   └── style.css       # スタイルシート
└── js/
    └── script.js       # JavaScript
```

### 基本的なHTMLテンプレート

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ホーム - My Website</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="index.html">ホーム</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="products/index.html">製品</a></li>
                <li><a href="blog/index.html">ブログ</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <h1>Welcome to My Website</h1>
        <p>これは複数ページのサンプルサイトです。</p>
    </main>
    
    <footer>
        <p>&copy; 2025 My Website</p>
    </footer>
</body>
</html>
```

### ナビゲーションの共通化（JavaScript使用）

```javascript
// js/navigation.js
const navigation = `
    <nav>
        <ul>
            <li><a href="/index.html">ホーム</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/products/index.html">製品</a></li>
            <li><a href="/blog/index.html">ブログ</a></li>
        </ul>
    </nav>
`;

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = navigation;
    }
});
```

## よくあるトラブルと解決方法

### 1. ページが404エラーになる

**原因と解決方法：**

- **パスの問題**: 相対パスではなく、リポジトリ名を含めた絶対パスを使用
  ```html
  <!-- ❌ 間違い -->
  <a href="/about.html">About</a>
  
  <!-- ✅ 正しい -->
  <a href="/repository-name/about.html">About</a>
  ```

- **ブランチの設定**: GitHub Pagesの設定でソースブランチを確認
  - Settings → Pages → Source で正しいブランチを選択
  - 2025年現在は「Deploy from a branch」と「GitHub Actions」の2つの選択肢

- **.nojekyll ファイル**: アンダースコアで始まるディレクトリを使用する場合は必須
  ```bash
  touch .nojekyll
  ```

- **デプロイの遅延**: 変更が反映されるまで数分〜数十分かかる場合がある

### 2. CSSやJavaScriptが読み込まれない

**解決方法：**

```html
<!-- ベースURLを設定 -->
<base href="/repository-name/">

<!-- または相対パスを使用 -->
<link rel="stylesheet" href="./css/style.css">
```

### 3. 更新が反映されない

**解決方法：**

1. キャッシュをクリア（Ctrl + F5）
2. GitHub Actionsの実行状況を確認
3. 数分待ってから再度アクセス

## SEO対策とベストプラクティス

### 1. メタタグの最適化

```html
<head>
    <!-- 基本的なメタタグ -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="GitHub Pagesで複数ページのWebサイトを作成する方法を解説">
    
    <!-- OGPタグ -->
    <meta property="og:title" content="GitHub Pages 複数ページサイトの作り方">
    <meta property="og:description" content="初心者でも簡単に作れる複数ページサイトの構築方法">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://username.github.io/repository/">
    
    <!-- 構造化データ -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "My GitHub Pages Site",
        "url": "https://username.github.io/repository/"
    }
    </script>
</head>
```

### 2. サイトマップの作成

```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://username.github.io/repository/</loc>
        <lastmod>2025-01-04</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://username.github.io/repository/about.html</loc>
        <lastmod>2025-01-04</lastmod>
        <priority>0.8</priority>
    </url>
</urlset>
```

### 3. パフォーマンス最適化

- 画像の最適化（WebP形式の使用）
- CSSとJavaScriptの最小化
- 遅延読み込みの実装
- CDNの活用

## まとめ

GitHub Pagesで複数ページのWebサイトを作成する方法は、プロジェクトの規模や要件によって選択できます。

- **小規模サイト**: シンプルなHTMLで十分
- **ドキュメントサイト**: MkDocsやJekyllがおすすめ
- **ブログサイト**: Jekyllが最適
- **モダンなWebアプリ**: Next.jsやVue.jsを検討

どの方法を選んでも、GitHub Pagesなら無料で高品質なWebサイトを公開できます。まずは簡単なサイトから始めて、徐々に機能を追加していくのがおすすめです。

## よくある質問（FAQ）

### Q: GitHub Pagesは本当に無料？
**A:** はい、個人利用であれば完全無料です。ただし、商用利用には制限があります。

### Q: 独自ドメインは使える？
**A:** はい、使えます。DNSの設定とGitHub側の設定が必要です。

### Q: PHPやPythonは使える？
**A:** いいえ、GitHub Pagesは静的サイトのみ対応しています。

### Q: 何ページまで作れる？
**A:** ページ数に制限はありませんが、リポジトリサイズは1GB以下が推奨されています。

### Q: アクセス解析はできる？
**A:** Google Analyticsなどの外部サービスを利用することで可能です。

## 関連記事

- [MkDocsを使ったGitHub Pages作成方法](../Mkdocs/mkdocsを使ったGitHubPages.md)
- [GitHub Actions自動デプロイ設定](../Mkdocs/GitHub Actions自動デプロイ設定.md)
- [SEO実践ガイド](../../SEO/index.md)

## 参考リンク

- [GitHub Pages公式ドキュメント](https://docs.github.com/ja/pages)
- [MkDocs公式サイト](https://www.mkdocs.org/)
- [Jekyll公式サイト](https://jekyllrb.com/)