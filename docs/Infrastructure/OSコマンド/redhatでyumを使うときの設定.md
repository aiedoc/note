# RHELについて、パッケージマネージャーを利用する

!!! info "バージョン別対応"
    - **RHEL 7以下**: `yum`を使用
    - **RHEL 8以降**: `dnf`を使用（yumは互換性のためのシンボリックリンク）

## 1. Subscription Managerを登録する

### 基本登録（プロキシなし環境）

```bash
# Red Hatカスタマーポータルに登録
subscription-manager register --auto-attach

# アカウント名、パスワードを入力
# 登録状況確認
subscription-manager status
subscription-manager list --installed
```

### プロキシ環境での登録

```bash
# プロキシ経由での登録
subscription-manager register --proxy=<プロキシホスト>:<プロキシポート> --auto-attach

# プロキシ認証が必要な場合
subscription-manager register \
  --proxy=<プロキシホスト>:<プロキシポート> \
  --proxyuser=<プロキシユーザー> \
  --proxypassword=<プロキシパスワード> \
  --auto-attach
```

### サブスクリプション手動アタッチ

```bash
# 利用可能なサブスクリプション確認
subscription-manager list --available

# 特定のプールをアタッチ
subscription-manager attach --pool=<プールID>

# すべての利用可能なサブスクリプションを自動アタッチ
subscription-manager attach --auto
```

## 2. rhsmのProxy設定

`/etc/rhsm/rhsm.conf`にProxyの設定を行う。

### 設定ファイル: /etc/rhsm/rhsm.conf

```ini
[server]
# HTTPプロキシ設定
proxy_hostname = <プロキシホスト>
proxy_port = <プロキシポート>

# HTTPSプロキシの場合
proxy_scheme = https

# プロキシ認証が必要な場合
proxy_user = <プロキシユーザー>
proxy_password = <プロキシパスワード>

# 特定のホストをプロキシから除外
no_proxy = localhost,127.0.0.1,.example.com
```

## 3. パッケージマネージャーのProxy設定

### RHEL 8以降（dnf）の設定

設定ファイル: `/etc/dnf/dnf.conf`

```ini
[main]
# HTTPプロキシ設定
proxy=http://<プロキシホスト>:<プロキシポート>/

# プロキシ認証が必要な場合
proxy_username=<プロキシユーザー>
proxy_password=<プロキシパスワード>

# HTTPSプロキシの場合
proxy=https://<プロキシホスト>:<プロキシポート>/
```

### RHEL 7以下（yum）の設定

設定ファイル: `/etc/yum.conf`

```ini
[main]
# HTTPプロキシ設定
proxy=http://<プロキシホスト>:<プロキシポート>/

# プロキシ認証が必要な場合
proxy_username=<プロキシユーザー>
proxy_password=<プロキシパスワード>
```

## 4. リポジトリの接続確認

### RHEL 8以降（dnf）

```bash
# リポジトリ一覧確認
dnf repolist
dnf repolist --enabled

# パッケージ検索テスト
dnf search vim

# メタデータ更新
dnf makecache
```

### RHEL 7以下（yum）

```bash
# リポジトリ一覧確認
yum repolist
yum repolist enabled

# パッケージ検索テスト
yum search vim

# メタデータ更新
yum makecache
```

## 5. トラブルシューティング

### よくあるエラーと対処法

#### サブスクリプション関連エラー

```bash
# エラー: "This system is not registered to Red Hat Subscription Management"
# 対処: システムを登録する
subscription-manager register

# エラー: "No subscriptions are attached to this system"
# 対処: サブスクリプションをアタッチする
subscription-manager attach --auto
```

#### プロキシ関連エラー

```bash
# 接続テスト
curl -I --proxy <プロキシホスト>:<プロキシポート> https://cdn.redhat.com

# プロキシ設定確認
subscription-manager config --list
```

#### リポジトリ接続エラー

```bash
# RHEL 8以降
dnf clean all
dnf makecache

# RHEL 7以下
yum clean all
yum makecache
```

### ログ確認

```bash
# サブスクリプション関連ログ
tail -f /var/log/rhsm/rhsm.log

# DNF/YUMログ
tail -f /var/log/dnf.log    # RHEL 8以降
tail -f /var/log/yum.log    # RHEL 7以下
```

## 6. セキュリティのベストプラクティス

### プロキシ認証情報の保護

```bash
# ファイル権限を制限
chmod 600 /etc/rhsm/rhsm.conf
chmod 600 /etc/dnf/dnf.conf
chmod 600 /etc/yum.conf

# 所有者を確認
chown root:root /etc/rhsm/rhsm.conf
```

### 環境変数での一時的な設定

```bash
# 一時的なプロキシ設定（セッション中のみ有効）
export http_proxy=http://<プロキシホスト>:<プロキシポート>
export https_proxy=https://<プロキシホスト>:<プロキシポート>

# パッケージマネージャー実行
dnf update
```

## 7. 参考情報

- [Red Hat Subscription Management](https://access.redhat.com/documentation/en-us/red_hat_subscription_management/)
- [DNF Command Reference](https://docs.fedoraproject.org/en-US/fedora/latest/system-administrators-guide/package-management/DNF/)
- [YUM Command Reference](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-yum)
