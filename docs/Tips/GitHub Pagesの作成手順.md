# mkdocsを使ったGitHub Pagesの作成方法



##1. GitHub Pagesとは

GitHubのリポジトリを使ってウェブサイトを簡単に作成できるGitHub機能の１つです。

プロジェクト管理、ドキュメント管理または個人ブログなどにも活用することが可能です。

ウェブページとして公開しますが、サーバやデータベース等は一切用意する必要がありません！

またウェブサイトの資産(HTML等)は全てGitHubのリポジトリで管理されるため、サイトの版数管理や課題の管理、プルを使ったレビューなどもまとめて行えます。

ただ1つめんどうな点があります。それは**ウェブサイトなのでHTMLを書かなければならない**。(逆に言うとHTMLを書くだけでいい)

「HTML書くのめんどくさい」、「markdownしか書きたくない」

そんな開発者の悩みを解決するために存在するのが**Mkdocs**です。

## 2. Mkdocsとは

Mkdocsとは一言でいうと、markdownで書いたドキュメントを自動的にHTMLに変換し、静的なHTMLサイトを構築してくれる静的サイトジェネレータです。

開発者の皆さんはmarkdownで議事録や手順書などを書き、管理したいのではないでしょうか？mkdocsを使えば、markdownで書かれたテキストを高速かつシンプルにウェブサイトとして構築することができます。

またmkdocsには様々な"theme"があり、そのthemeを選択することで自分好みのウェブサイトを作成することが可能です。またそのthemeをさらにオリジナルのカスタマイズすることも可能です。

![1537438678422](C:\Users\akiyoshi.yusuke\AppData\Roaming\Typora\typora-user-images\1537438678422.png)



## 3. mkdocsでGitHub Pagesを作成する

では実際にGitHub Pagesをmkdocsで作成してみましょう。作成は驚くほど簡単です。

### 前提条件

- Mkdocs(無料)
- GitHubのアカウント(無料)

作業端末にMkdocsをインストールする必要があります。

インストール方法について公式サイトを参考して見てください。

Mkdocsの公式サイト※このサイトもGitHub Pagesで作られています。→https://www.mkdocs.org/

### ①GitHubリポジトリの作成する

**GitHub Pages専用**のリポジトリを作成する必要があります。

またこのリポジトリ名がサイト名(URL名)に使われることになります。

※あとから独自ドメインを設定することも可能です。

今回は test-pagesという名前でリポジトリ名を作成してみます。

### ②リポジトリをクローンする

リポジトリを作成したら、そのリポジトリをローカル端末にcloneします。

```
$ git clone git@bps-github.pstg.paas.cloud.global.fujitsu.com:akiyoshi-yusuke/test-pages.git
Cloning into 'test-pages'...
warning: You appear to have cloned an empty repository.
```

### ③mkdocsを実行する

以下のコマンドを実行し、プロジェクトを作成します。

```
$ mkdocs new test-pages/
INFO    -  Writing config file: test-pages/mkdocs.yml
INFO    -  Writing initial docs: test-pages/docs\index.md
```

リポジトリへ移動してみましょう。

```
$ cd test-pages/
```

中身を確認してみます。

```
$ ls
docs  mkdocs.yml

$ ls docs/
index.md
```

`docs`ディレクトリと`mkdocs.yml`ファイルが作成されていると思います。

`docs`ディレクトリ配下には`index.md`というファイルが作成されていると思います。

今後サイトに乗せたい記事、ドキュメント等はこの`docs`配下に入れていくことなります。

### ④GitHub Pagesを作成する

以下をコマンドを実施し、GitHub Pagesを作成します。

```
$ mkdocs gh-deploy
INFO    -  Cleaning site directory
INFO    -  Building documentation to directory: C:\git\test-pages\site
WARNING -  Version check skipped: No version specificed in previous deployment.
INFO    -  Copying 'C:\git\test-pages\site' to 'gh-pages' branch and pushing to GitHub.
INFO    -  Your documentation should be available shortly.
```

これでGitHub Pagesが作成されました。

以下がサイトのURLになります。

https://<GitHubホスト名>/pages/<ユーザ名 or org名>/<リポジトリ名>

実際にアクセスしてみましょう。

![1537442833904](C:\Users\akiyoshi.yusuke\AppData\Roaming\Typora\typora-user-images\1537442833904.png)

mkdocsで作成されたデフォルトのGitHub Pagesです。このページは先程作成したリポジトリ`test-page`の`gh-pages`ブランチに格納されている資産を表示しています。

`mkdocs gh-deploy`というコマンドを実行することによりmasterブランチに格納されているmarkdownの資産が、HTML形式でgh-pagesブランチへ格納されます。そしてgh-pagesブランチへ格納された資産をGitHub Pagesへデプロイし、表示しています。

つまりmasterブランチでmorkdownで書かれたドキュメントの資産を置いておくと、その資産をmkdocsがgh-pagesブランチへHTML形式で格納してくれ、そのHTMLをGitHub Pagesとして表示してくれてわけです。

※GitHub PagesのURLはリポジトリのsettings>GitHub Pagesから確認することができます。

![1537442804475](C:\Users\akiyoshi.yusuke\AppData\Roaming\Typora\typora-user-images\1537442804475.png)

## 3. GitHub Pages の活用事例







## 終わりに