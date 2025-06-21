
# ディスク追加時の設定

## 事前確認

```bash
# ディスク使用量確認
df -h

# ブロックデバイス一覧
lsblk

# パーティション情報確認
fdisk -l

# マウント状況確認
mount -v
```

## パーティション作成

```bash
# fdiskでパーティション作成
fdisk /dev/sdb
# nコマンドで新しいパーティション作成
# wコマンドで保存

# パーティション確認
lsblk
```

## ファイルシステム作成

```bash
# ext4ファイルシステム作成
mkfs.ext4 /dev/sdb1

# xfsファイルシステム作成
mkfs.xfs /dev/sdb1

# ファイルシステム確認
blkid /dev/sdb1
```

## マウント設定

### 一時的なマウント
```bash
# マウントポイント作成
mkdir /mnt/newdisk

# マウント実行
mount /dev/sdb1 /mnt/newdisk

# マウント確認
df -h
```

### 永続的なマウント設定
```bash
# UUID確認
blkid /dev/sdb1

# /etc/fstab編集
vi /etc/fstab
# 以下を追記
# UUID=your-uuid-here /mnt/newdisk ext4 defaults 0 2

# 設定テスト
mount -a

# マウント確認
df -h
```
