# mkdocs

## 参考サイト

- [カンタンにドキュメントが作れるmkdocsをはじめてみよう](https://qiita.com/wamisnet/items/ed725d74f945f7c06b91)
- [MkDocsによるドキュメント作成](https://qiita.com/mebiusbox2/items/a61d42878266af969e3c)

## Commands

- `mkdocs new [dir-name]` - Create a new project.
- `mkdocs serve` - Start the live-reloading docs server.
- `mkdocs build` - Build the documentation site.
- `mkdocs help` - Print this help message.

## 数式

$$
P\cdot Q = \|P\|\|Q\|\cos\alpha
$$

## Project layout

```none
mkdocs.yml    # The configuration file.
docs/
    index.md  # The documentation homepage.
    ...       # Other markdown pages, images and other files.
```

!!! Note
    これはノートです。

!!! Tip
    ヒントです。

!!! Warning
    これは警告です

!!! Danger
    これは危険です。

!!! Success
    これは成功です。

!!! Failure
    これは失敗です。

!!! Bug
    これはバグです。

!!! summary
    これは概要です。

Mkdocs とは静的サイトジェネレータです。
コンテンツは基本的に markdown[^1] 形式で記述したソースファイルになります。

[^1]: 文書を記述するための軽量マークアップ言語のひとつ

:fa-external-link: [MkDocs](http://www.mkdocs.org/)

定義語
:    ここに説明を書きます

:smale:

(c)

++ctrl+arl+delete++

```java
#include <iostream>
void main() {
    std::cout << "Hello world!" << std::endl;
}
```
