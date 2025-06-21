# yum/dnfコマンド

## 基本操作

```bash
# パッケージインストール
yum install パッケージ名
dnf install パッケージ名

# パッケージアップデート
yum update パッケージ名
dnf update パッケージ名

# システム全体アップデート
yum update
dnf update

# パッケージ削除
yum remove パッケージ名
dnf remove パッケージ名
```

## 検索・情報確認

```bash
# パッケージ検索
yum search キーワード
dnf search キーワード

# パッケージ情報表示
yum info パッケージ名
dnf info パッケージ名

# インストール済みパッケージ一覧
yum list installed
dnf list installed

# 利用可能なパッケージ一覧
yum list available
dnf list available
```

## リポジトリ管理

```bash
# リポジトリ一覧表示
yum repolist
dnf repolist

# アップデート対象確認
yum check-update
dnf check-update

# キャッシュクリア
yum clean all
dnf clean all
```

## グループ操作

```bash
# グループ一覧
yum grouplist
dnf grouplist

# グループインストール
yum groupinstall "Development Tools"
dnf groupinstall "Development Tools"
```
