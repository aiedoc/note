# OSの確認コマンド

## 基本的な確認コマンド

```bash
# OS情報の詳細確認
cat /etc/os-release

# カーネル情報
uname -a

# アーキテクチャ確認
arch
```

## ディストリビューション別

### Ubuntu/Debian
```bash
cat /etc/lsb-release
lsb_release -a
```

### CentOS/RHEL
```bash
cat /etc/redhat-release
```

### SUSE
```bash
cat /etc/SuSE-release
```

## システム情報確認

```bash
# システム稼働時間
uptime

# メモリ使用量
free -h

# ディスク使用量
df -h

# CPUの情報
cat /proc/cpuinfo | grep "model name" | head -1
```
