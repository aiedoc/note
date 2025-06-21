# SELinux基本操作

## 状態確認

```bash
# SELinuxの状態確認
getenforce
# Enforcing → SELinux有効
# Permissive → 警告のみ
# Disabled → SELinux無効

# 詳細状態確認
sestatus
```

## SELinux設定変更

```bash
# 一時的に無効化
setenforce 0

# 一時的に有効化
setenforce 1

# 永続的に無効化（/etc/selinux/configを編集）
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

## ファイルコンテキスト確認・修正

```bash
# ファイルのSELinuxコンテキスト確認
ls -Z ファイル名

# ファイルコンテキスト変更
chcon -t httpd_exec_t /path/to/file

# ファイルコンテキストを復元
restorecon -v /path/to/file

# ディレクトリ以下を再帰的に復元
restorecon -Rv /path/to/directory
```

## ログ確認

```bash
# SELinuxの拒否ログ確認
grep "denied" /var/log/audit/audit.log

# 最新のSELinux拒否ログ
sealert -a /var/log/audit/audit.log
```
