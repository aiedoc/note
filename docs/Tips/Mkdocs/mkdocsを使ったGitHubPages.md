# mkdocsを使ったGitHub Pagesの作成方法

!!! tip "この記事で実現できること"
    - ✅ 完全無料でプロ級のドキュメントサイトを構築
    - ✅ 10分程度で基本サイトが完成
    - ✅ 自動デプロイでファイル更新だけでサイト反映
    - ✅ 独自ドメインも設定可能（オプション）

!!! success "実際の成果例"
    このサイト自体がMkDocs + GitHub Pagesで構築されており、多くの技術者に活用されています。

## 1. GitHub Pagesとは

GitHub Pagesとはレンタルサーバなど用意しなくても、無料で簡単にウェブサイトを作成できるGitHub機能の１つです。実はMicrosoft、Netflix、Meta（Facebook）などの大手企業もGitHub Pagesをオープンソースプロジェクトや技術ドキュメントサイトとして活用しています。

- https://opensource.microsoft.com/ (Microsoftオープンソースポータル)
- https://netflix.github.io/ (Netflixオープンソースプロジェクト)
- https://react.dev/ (React公式ドキュメント - Meta製)

このようにGitHub Pagesは使い方次第ではプロジェクト管理、ドキュメント管理または個人ブログなどにも活用することが可能です。

またウェブサイトの資産(HTML等)は全てGitHubのリポジトリで管理されるため、使い方次第ではサイトの版数管理や課題の管理、プルリクエストを使ったレビューなどもまとめて行えます。

ただ1つめんどうな点があるとすれば、それは**ウェブサイトなのでHTMLを書かなければならない**。(逆に言うとHTMLを書くだけでいい)

このページにたどり着いた方なら「HTML書くのめんどくさい」、「ドキュメントは全てmarkdownで版数管理したい」と考えている方も多いのではないでしょうか。

そんな皆さんの悩みを解決してくれるのが**Mkdocs**です。

## 2. Mkdocsとは

Mkdocsとは一言でいうと、markdownで書いたドキュメントを自動的にHTMLに変換し、静的なHTMLサイトを構築してくれる静的サイトジェネレータです。

開発者なら誰でもmarkdownで議事録や手順書などを書き、管理したいと考えていると思います。mkdocsを使えば、markdownで書かれたテキストを高速かつシンプルにウェブサイトとして構築することができます。

またmkdocsには様々な"theme"が存在し、そのthemeを選択することで自分好みのウェブサイトを作成することが可能です。またそのthemeをさらにカスタマイズし、オリジナルなるのページを作成することも可能です。

![MkDocs Material テーマのUI例](./images/1537438503367.png)

## 3. mkdocsでGitHub Pagesを作成する

では実際にGitHub Pagesをmkdocsで作成してみましょう。作成方法はとても簡単です。

以下の流れでGitHubページを作成していきます。

1. Mkdocsのインストール
2. GitHubリポジトリの作成し、ローカル環境へclone
3. MkdocsでGitHub Pagesを作成

### 事前準備

- **Python 3.8以上**のインストール（推奨：Python 3.9以上）
- GitHubアカウントの作成（無料）
- Gitがインストールされていること

## 4. Mkdocsのインストール

### ①Mkdocsのインストール

```bash
pip install mkdocs-material
```

### ②バージョン確認

```bash
mkdocs --version
```

!!! tip "うまくいかない場合"
    `pip`コマンドが見つからない場合は、`python3 -m pip install mkdocs-material`を試してください。

## 5. GitHubリポジトリの作成とクローン

### ①GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 「New repository」をクリック
3. Repository nameに好きな名前を入力（例：`my-docs`）
4. 「Public」を選択（GitHub Pages無料利用のため）
5. 「Create repository」をクリック

### ②ローカル環境にクローン

```bash
git clone https://github.com/ユーザー名/リポジトリ名.git
cd リポジトリ名
```

## 6. MkDocsサイトの作成

### ①MkDocsプロジェクトの初期化

```bash
mkdocs new .
```

### ②設定ファイルの編集

`mkdocs.yml`を以下のように編集：

```yaml
site_name: My Documentation
site_url: https://ユーザー名.github.io/リポジトリ名/

theme:
  name: material
  language: ja

nav:
  - ホーム: index.md
  - About: about.md
```

### ③ローカルで確認

```bash
mkdocs serve
```

http://127.0.0.1:8000 にアクセスして確認してください。

### ④GitHub Pagesにデプロイ

```bash
mkdocs gh-deploy
```

## よくある躓きポイントと解決法

### ❌ Python環境で躓く場合

**エラー例: `pip コマンドが見つからない`**

```bash
# 解決策: Python3を明示的に使用
python3 -m pip install mkdocs-material

# Macの場合、Homebrewでのインストールも推奨
brew install python
pip3 install mkdocs-material
```

### ❌ デプロイで躓く場合

**エラー例: `Permission denied` または `Authentication failed`**

```bash
# 解決策: GitHubの認証を再確認
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# SSHキーの設定確認
ssh -T git@github.com
```

### ❌ サイトが表示されない場合

1. **GitHub リポジトリの Settings → Pages を確認**
2. **Source が「Deploy from a branch: gh-pages」になっているか確認**
3. **数分待ってから再アクセス** (GitHub Pagesの反映には時間がかかる場合があります)
4. **ブラウザのキャッシュをクリア**

### ❌ 日本語が文字化けする場合

`mkdocs.yml`に以下を追加：

```yaml
theme:
  name: material
  language: ja  # 日本語設定
```

## 🎉 完成！あなたのサイトができました

デプロイが完了すると、以下のURLでサイトにアクセスできます：

```
https://ユーザー名.github.io/リポジトリ名/
```

**今すぐ確認してみましょう！**

## 次のステップ

基本サイトが完成したら、以下でさらに改善できます：

### サイトの見た目を改善
- **[📖 デザイン改善ガイド](./デザイン改善ガイド.md)** - より美しいサイトに
- **[📊 アナリティクス設定](./アナリティクス設定.md)** - サイトの成長を測定

### より高度な機能
- **[⚙️ 高度な設定](./高度な設定.md)** - プラグイン・多言語対応
- **[🚀 GitHub Actions自動デプロイ](./GitHub Actions自動デプロイ設定.md)** - CI/CD導入

### コンテンツを充実させる
- **[📚 サイト運用ガイド](./サイト運用ガイド.md)** - 複数ページ作成・更新ワークフロー

## まとめ

MkDocs + GitHub Pagesで、完全無料のプロ級ドキュメントサイトが簡単に作成できました。

**今回実現したこと:**
- ✅ Markdownでの記事作成
- ✅ 美しいMaterial Designテーマ
- ✅ 自動デプロイ機能
- ✅ 完全無料のホスティング

基本構築ができたら、ぜひコンテンツを充実させて素晴らしいサイトを作ってください！