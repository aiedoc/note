# mkdocsを使ったGitHub Pagesの作成方法



##1. GitHub Pagesとは

GitHub Pagesとはレンタルサーバなど用意しなくても、無料で簡単にウェブサイトを作成できるGitHub機能の１つです。実はmicrosoftやyahooなどの大手企業もGitHub Pagesを自身の企業ページとして活用しています。

- https://opensource.microsoft.com/

- http://yahoo.github.io/

このようにGitHub Pagesは使い方次第ではプロジェクト管理、ドキュメント管理または個人ブログなどにも活用することが可能です。

またウェブサイトの資産(HTML等)は全てGitHubのリポジトリで管理されるため、使い方次第ではサイトの版数管理や課題の管理、プルリクエストを使ったレビューなどもまとめて行えます。

ただ1つめんどうな点があるとすれば、それは**ウェブサイトなのでHTMLを書かなければならない**。(逆に言うとHTMLを書くだけでいい)

このページにたどり着いた方なら「HTML書くのめんどくさい」、「ドキュメントは全てmarkdownで版数管理したい」と考えている方も多いのではないでしょうか。

そんな皆さんの悩みを解決してくれるのが**Mkdocs**です。

## 2. Mkdocsとは

Mkdocsとは一言でいうと、markdownで書いたドキュメントを自動的にHTMLに変換し、静的なHTMLサイトを構築してくれる静的サイトジェネレータです。

開発者なら誰でもmarkdownで議事録や手順書などを書き、管理したいと考えていると思います。mkdocsを使えば、markdownで書かれたテキストを高速かつシンプルにウェブサイトとして構築することができます。

またmkdocsには様々な"theme"が存在し、そのthemeを選択することで自分好みのウェブサイトを作成することが可能です。またそのthemeをさらにカスタマイズし、オリジナルなるのページを作成することも可能です。

![画像1](.\images\image1.png)

## 3. mkdocsでGitHub Pagesを作成する

では実際にGitHub Pagesをmkdocsで作成してみましょう。作成方法はとても簡単です。

以下の流れでGitHubページを作成していきます。

1. Mkdocsのインストール
2. GitHubリポジトリの作成し、ローカル環境へclone
3. MkdocsでGitHub Pagesを作成

### 事前準備

- pythonのインストール(2.7 or 3.4 ～ 3.7)
- GitHubアカウントの作成(無料)

事前準備として作業端末にpythonのインストール(2.7 or 3.4 ～ 3.7)と、GitHubアカウントを作成しておいてください。

### ①Mkdocsのインストール

最初に以下のコマンドを実施し、作業端末へMkdocsをインストールします。

```
$ pip install mkdocs
```

※もしpipにmkdocsが入っていない場合は以下のコマンドを実施し、pipをアップグレードしてください

```
$ pip install --upgrade pip
```

インストールが終わると以下のコマンドを実行し、mkdocsがインストールされていることを確認します

```
$  mkdocs --version
mkdocs, version 1.0.4 from /home/ubuntu/.pyenv/versions/3.6.6/lib/python3.6/site-packages/mkdocs (Python 3.6)
```

詳しいインストール方法について公式サイトを参考してください。

Mkdocsの公式サイト→https://www.mkdocs.org/

※ちなみにこのサイトもMkdocsを使ったGitHub Pagesで作られています。

### ②GitHubリポジトリの作成し、クローンする

次に**GitHub Pages専用**のリポジトリを作成します。

※このリポジトリ名がサイト名(URL名)に使われることになるため注意してください。

今回は test-pagesという名前でリポジトリ名を作成してみます。

![画像2](.\images\image2.png)

![画像3](.\images\image3.png)

リポジトリを作成したら、そのリポジトリをローカル環境へにgit cloneします。

```
git clone https://github.com/github-user-001/test-pages.git
<実行結果例>
Cloning into 'test-pages'...
warning: You appear to have cloned an empty repository.
Checking connectivity... done.
```

### ③mkdocsでGitHub Pagesを作成する

次に以下のコマンドを実行し、mkdocsプロジェクトを作成します。

```
mkdocs new test-pages/
<実行結果例>
INFO    -  Writing config file: test-pages/mkdocs.yml
INFO    -  Writing initial docs: test-pages/docs\index.md
```

リポジトリへ移動します。

```
cd test-pages/
```

test-pages配下にdocsディレクトリが作成され、その配下にindex.mdが作成されているので中身を確認してみましょう。

```
cat docs/index.md 
<実行結果例>
# Welcome to MkDocs

For full documentation visit [mkdocs.org](https://mkdocs.org).

## Commands

* `mkdocs new [dir-name]` - Create a new project.
* `mkdocs serve` - Start the live-reloading docs server.
* `mkdocs build` - Build the documentation site.
* `mkdocs help` - Print this help message.

## Project layout

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # The documentation homepage.
        ...       # Other markdown pages, images and other files.
```

このindex.mdはmkdocs で生成されるデフォルトページになります。

このデフォルトページでGitHub Pagesを作成してみます。

以下をコマンドを実施し、GitHub Pagesを作成します。

```
mkdocs gh-deploy
<実行結果例>
INFO    -  Cleaning site directory
INFO    -  Building documentation to directory: C:\git\test-pages\site
WARNING -  Version check skipped: No version specificed in previous deployment.
INFO    -  Copying 'C:\git\test-pages\site' to 'gh-pages' branch and pushing to GitHub.
INFO    -  Your documentation should be available shortly.
```

なんとたったこれだけ！これだけでGitHub Pagesが作成されました。

URLは https://【ユーザー名】.github.io/【リポジトリ名】/ となります。

以下が今回作成したGitHub PagesのURLになります。

https://github-user-001.github.io/test-pages/

## 4. GitHub Pagesの内容を更新する

### ①Home画面の更新

デフォルトページである index.mdを編集することでHome画面を好きな内容に変更することができます。

試しにindex.mdの最初の行を以下のように変更し、保存します。

```
vi docs/index.md
```

```
# Welcome to MkDocs
↓
# Welcome to GitHub Pages
```

保存し終わったら再びgh-deployコマンドを実行します。

```
mkdocs gh-deploy
```

先程のURLを更新して、画面を確認してみましょう

※反映には少し時間がかかることがあります

![画像4](.\images\image4.png)

### ② 別ページの作成

次はHome画面以外に別ページを作成してみます。

**docs配下に新しいディレクトリを作成し、その配下にmarkdownのテキスト格納する**ことで別ページを作成することができます。

今回はtest1というディレクトリ配下にhelloworld1.mdファイルを、test2というディレクトリ配下にhelloworld2.mdファイルを作成してみます。

```
mkdir docs/test1/
echo "# Hello world 1" > docs/test1/helloworld1.md
mkdir docs/test2/
echo "# Hello world 2" > docs/test2/helloworld2.md
```

ファイルを作成したら再びgh-deployコマンドを実行します。

```
mkdocs gh-deploy
```

これでtest1というタブにhelloworld1、test2というタブにhelloworld2というページが追加されていると思います。

https://github-user-001.github.io/test-pages/test2/helloworld2/

![画像5](./images/image5.png)

## 5. mkdocsとGitHub pagesの関係について

いかがでしたか？mkdocsを使えば、markdownのテキストをあっという間にGitHub Pagesとして公開することができることが分かったと思います。

mkdocs gh-deploy は mkdocsプロジェクト(今回だとtest-pages)をGitHub Pagesへ一発でデプロイしてくれるコマンドです。

test-pagesに置かれているmarkdown資産をHTML形式へ変換し、変換された資産がgh-pagesブランチへPushされます。

https://github.com/github-user-001/test-pages/tree/gh-pages

GitHub Pagesはそのgh-pagesブランチの資産を表示しています。

GitHub Pagesの設定はGitHub の setingsから確認できます。

![画像6](.\images\image6.png)

## 終わりに

今回はmkdocs を使ったGitHub Pagesの作成方法ついて紹介しました。

ページ作成から更新までの簡単な紹介でしたが、mkdocsにはまだまだ色々な設定を行うことができ、自分の好きなウェブページにカスタマイズすることができます。そのあたりは応用編として紹介できたらなと思っています。

GitHub Pagesは時間やコストをかけず簡単にウェブページを作成できるとても便利な機能です。私は過去に調べた技術メモやTips、勉強会での議事メモなどをGitHub Pagesで管理してます。

独自ドメインを取得してブログサイトとして運用したり、Mkdocsの公式サイトのように手順書やドキュメントの公開サイトして活用することも可能です。

もしこの記事を読んでGitHub Pagesのついて気になった方がいましたら、色々調べて活用してみてください！