
OS側での操作

#### 事前確認

```
df -h     #ディスク・ドライブの使用量を表示する
lsblk     #ブロックデバイスを一覧表示
fdisk -l  #マウントされているデバイスのパーティション情報を表示
mount -v  #現在のマウント状況を確認
```

#### パーティションの設定
※[パーティションとは](https://eng-entrance.com/linux-partition)
※[fdiskコマンドでパーティションを作成する](http://kazmax.zpp.jp/linux_beginner/fdisk.html)
```
fdisk <デバイス名>
```

#### ファイルシステムの作成

```
mkfs -t <ファイルシステム名> <デバイス名>
```

参考:[Linux パーティションにmkfsでファイルシステムを作る](http://kazmax.zpp.jp/linux_beginner/mkfs.html)

#### 手動でマウントする

```
mkdir <マウント先ディレクトリ名>
mount <デバイス名> <マウント先ディレクトリ名>
df -h
```

#### 自動マウント設定

```
blkid <デバイス名>
→UUID="XXXXXXXXXXXXXXXXXXXXXXXXX"をメモ

vi /etc/fstab

UUID=XXXXXXXXXXXXXXXXXXXXXXXXX   <マウント先ディレクトリ名>           xfs     defaults        0 0★追記
```
