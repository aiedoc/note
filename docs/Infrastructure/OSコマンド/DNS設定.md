# DNS設定

## Ubuntu/Debian

### DNS設定確認
```bash
# 現在のDNS設定確認
cat /etc/resolv.conf
systemd-resolve --status
```

### DNS設定変更
```bash
# /etc/systemd/resolved.confを編集
sudo vi /etc/systemd/resolved.conf
# DNS設定例
# DNS=8.8.8.8 8.8.4.4
# FallbackDNS=1.1.1.1 1.0.0.1

# 設定反映
sudo systemctl restart systemd-resolved
```

## CentOS/RHEL

### DNS設定確認
```bash
cat /etc/resolv.conf
```

### DNS設定変更
```bash
# NetworkManagerを使用している場合
nmcli con show
nmcli con mod <接続名> ipv4.dns "8.8.8.8,8.8.4.4"
nmcli con up <接続名>

# 直接編集する場合
sudo vi /etc/resolv.conf
# nameserver 8.8.8.8
# nameserver 8.8.4.4
```

## DNS疎通確認
```bash
# DNS名前解決テスト
nslookup google.com
dig google.com
host google.com
```