# 静的ルーティング設定

## Ubuntu 18.04以降 (Netplan)

### 設定ファイル: /etc/netplan/*.yaml

```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
      routes:
        - to: 10.0.0.0/8
          via: 192.168.1.254
```

### 設定反映
```bash
# 設定テスト
netplan try

# 設定適用
netplan apply
```

## Ubuntu 16.04以下 (interfaces)

### 設定ファイル: /etc/network/interfaces

```bash
auto eth0
iface eth0 inet static
address 192.168.1.100
netmask 255.255.255.0
gateway 192.168.1.1
dns-nameservers 8.8.8.8 8.8.4.4

# 静的ルート追加
up route add -net 10.0.0.0/8 gw 192.168.1.254
down route del -net 10.0.0.0/8 gw 192.168.1.254
```

### 設定反映
```bash
systemctl restart networking
```

## CentOS/RHEL

### NetworkManager使用
```bash
# 接続確認
nmcli con show

# IP設定
nmcli con mod eth0 ipv4.addresses 192.168.1.100/24
nmcli con mod eth0 ipv4.gateway 192.168.1.1
nmcli con mod eth0 ipv4.dns 8.8.8.8
nmcli con mod eth0 ipv4.method manual

# 静的ルート追加
nmcli con mod eth0 +ipv4.routes "10.0.0.0/8 192.168.1.254"

# 設定適用
nmcli con up eth0
```

## ルーティング確認

```bash
# ルーティングテーブル確認
ip route show
route -n

# 接続テスト
ping 宛先IP
traceroute 宛先IP
```

