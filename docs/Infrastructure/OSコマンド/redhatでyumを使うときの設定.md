# RHEL Subscription Manager設定

## 基本的なサブスクリプション登録

```bash
# システム登録
subscription-manager register --auto-attach

# 登録状況確認
subscription-manager status
subscription-manager list --installed

# サブスクリプション手動アタッチ
subscription-manager list --available
subscription-manager attach --pool=プールID
```

## プロキシ環境での設定

### Subscription Manager設定

設定ファイル: `/etc/rhsm/rhsm.conf`

```ini
[server]
# プロキシ設定
proxy_hostname = プロキシホスト
proxy_port = プロキシポート
proxy_user = プロキシユーザー
proxy_password = プロキシパスワード
```

### パッケージマネージャーのプロキシ設定

RHEL 8以降（/etc/dnf/dnf.conf）:
```ini
[main]
proxy=http://プロキシホスト:ポート/
proxy_username=ユーザー名
proxy_password=パスワード
```

RHEL 7以下（/etc/yum.conf）:
```ini
[main]
proxy=http://プロキシホスト:ポート/
proxy_username=ユーザー名
proxy_password=パスワード
```

## 接続確認

```bash
# リポジトリ確認
dnf repolist          # RHEL 8以降
yum repolist          # RHEL 7以下

# パッケージ検索テスト
dnf search vim        # RHEL 8以降
yum search vim        # RHEL 7以下

# メタデータ更新
dnf makecache         # RHEL 8以降
yum makecache         # RHEL 7以下
```

## トラブルシューティング

```bash
# キャッシュクリア
dnf clean all         # RHEL 8以降
yum clean all         # RHEL 7以下

# 接続テスト
curl -I --proxy プロキシ:ポート https://cdn.redhat.com

# ログ確認
tail -f /var/log/rhsm/rhsm.log
tail -f /var/log/dnf.log      # RHEL 8以降
tail -f /var/log/yum.log      # RHEL 7以下
```
