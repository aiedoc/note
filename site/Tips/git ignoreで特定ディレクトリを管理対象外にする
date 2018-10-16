# git ignoreで特定ディレクトリを管理対象外にする

## .gitignoreを作成する

`.git`と同じ場所に`.gitignore.`という名前でファイルを作成する

## 管理対象外にするディレクトリを記載する

```.gitignore

/site/

```

記法サンプル
```
# コメント。これは無視されます
*.a       # .a ファイルは無視
!lib.a    # しかし、lib.a ファイルだけは .a であっても追跡対象とします
/TODO     # ルートディレクトリの TODO ファイルだけを無視し、サブディレクトリの TODO は無視しません
build/    # build/ ディレクトリのすべてのファイルを無視します
doc/*.txt # doc/notes.txt は無視しますが、doc/server/arch.txt は無視しません
```