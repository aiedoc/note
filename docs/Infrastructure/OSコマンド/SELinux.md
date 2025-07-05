# SELinux完全ガイド

!!! info "SELinuxとは"
    Security-Enhanced Linux（SELinux）は、Linuxカーネルに組み込まれたセキュリティ機能です。
    
    従来のLinuxのアクセス制御（ユーザー・グループ・パーミッション）に加えて、
    より細かいセキュリティポリシーを適用できます。

## 実現できること

<div class="grid cards" markdown>

-   :material-shield-check: **強化されたセキュリティ**

    ---

    プロセスとファイルアクセスを詳細に制御

-   :material-bug: **攻撃被害の最小化**

    ---

    不正アクセス時の被害範囲を限定

-   :material-server: **サーバー保護**

    ---

    WebサーバーやDBサーバーの安全性向上

-   :material-lock: **強制アクセス制御**

    ---

    rootユーザーでも制限可能な高度な制御

</div>

## SELinuxが必要な理由

### 従来のLinuxセキュリティの限界

**通常のLinux権限システム**
- ユーザー・グループ・その他の3段階
- rootユーザーは基本的に何でもできる
- アプリケーションが乗っ取られると、そのユーザー権限で何でも実行可能

**SELinuxによる改善**
- プロセスごとに細かく権限を制御
- rootでも必要最小限の権限のみ
- 攻撃者がアプリを乗っ取っても、被害を局所化

### 具体的な効果例

```bash
# 例：Webサーバーが乗っ取られた場合

# 従来のLinux
# → Webサーバープロセスのユーザー権限で何でも実行可能
# → システムファイルの読み取り、他のプロセスへの影響など

# SELinux有効時
# → Webサーバーは指定されたディレクトリ内のファイルのみアクセス可能
# → ネットワーク接続も制限された範囲のみ
# → システムファイルへのアクセスは拒否される
```

## SELinuxの動作モード

| モード | 動作 | 用途 |
|--------|------|------|
| **Enforcing** | ポリシー違反を拒否 | 本番環境での運用 |
| **Permissive** | 警告のみ（実行は許可） | テスト・デバッグ環境 |
| **Disabled** | SELinux無効 | 開発環境（非推奨） |

## 基本的な状態確認

```bash
# SELinuxの状態確認
getenforce
# Enforcing → SELinux有効
# Permissive → 警告のみ
# Disabled → SELinux無効

# 詳細状態確認
sestatus
```

## モード変更と設定

```bash
# 一時的に無効化
setenforce 0

# 一時的に有効化
setenforce 1

# 永続的に無効化（/etc/selinux/configを編集）
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

## SELinuxコンテキストの理解

### コンテキストとは
SELinuxでは、すべてのファイル・プロセス・ポートなどに「コンテキスト」という属性が付与されます。

**コンテキストの構造**
```
user:role:type:level
```

**例**
```bash
# Webサーバーの実行ファイル
system_u:object_r:httpd_exec_t:s0

# Webコンテンツファイル
system_u:object_r:httpd_t:s0

# 一般ユーザーファイル
unconfined_u:object_r:user_home_t:s0
```

### よく使われるタイプ（type）

| タイプ | 用途 |
|--------|------|
| `httpd_t` | Webサーバーコンテンツ |
| `httpd_exec_t` | Webサーバー実行ファイル |
| `mysqld_t` | MySQL関連ファイル |
| `ssh_t` | SSH関連ファイル |
| `user_home_t` | ユーザーホームディレクトリ |
| `admin_home_t` | 管理者ホームディレクトリ |

## ファイルコンテキストの操作

### コンテキスト確認
```bash
# ファイルのSELinuxコンテキスト確認
ls -Z /var/www/html/index.html
# system_u:object_r:httpd_t:s0 index.html

# ディレクトリ全体のコンテキスト確認
ls -Z /var/www/html/

# プロセスのコンテキスト確認
ps -eZ | grep httpd
```

### コンテキスト変更
```bash
# 一時的なコンテキスト変更
chcon -t httpd_t /var/www/html/newfile.html

# ユーザーコンテキストも変更
chcon -u system_u -r object_r -t httpd_t /var/www/html/file.html

# 再帰的にディレクトリ全体を変更
chcon -R -t httpd_t /var/www/html/
```

### コンテキスト復元
```bash
# デフォルトコンテキストに復元
restorecon -v /var/www/html/index.html

# ディレクトリ以下を再帰的に復元
restorecon -Rv /var/www/html/

# 復元内容を事前確認（実際には変更しない）
restorecon -Rvn /var/www/html/
```

## ポリシー管理

### デフォルトコンテキストの設定
```bash
# ファイルタイプのデフォルトコンテキストを設定
semanage fcontext -a -t httpd_t "/var/www/html(/.*)?" 

# 設定を適用
restorecon -Rv /var/www/html/

# 設定されているコンテキストルール確認
semanage fcontext -l | grep "/var/www"
```

### ポート管理
```bash
# HTTPdが使用可能なポート確認
semanage port -l | grep http

# 新しいポートを追加（例：8080番ポート）
semanage port -a -t http_port_t -p tcp 8080

# ポート設定を削除
semanage port -d -t http_port_t -p tcp 8080
```

## トラブルシューティング

### ログ確認
```bash
# SELinuxの拒否ログ確認
grep "denied" /var/log/audit/audit.log

# より詳細な分析
sealert -a /var/log/audit/audit.log

# リアルタイムでSELinux拒否を監視
tail -f /var/log/audit/audit.log | grep denied
```

### よくあるエラーと対処法

#### 1. Webサーバーでファイルアクセス拒否
```bash
# 症状: Webページが403 Forbiddenになる
# 確認
ls -Z /var/www/html/problem-file.html

# 対処
restorecon -v /var/www/html/problem-file.html
# または
chcon -t httpd_t /var/www/html/problem-file.html
```

#### 2. 非標準ディレクトリでのWebコンテンツ
```bash
# 症状: /home/user/website/ をドキュメントルートにしたいが403
# 対処
semanage fcontext -a -t httpd_t "/home/user/website(/.*)?" 
restorecon -Rv /home/user/website/
```

#### 3. データベース接続エラー
```bash
# 症状: WebアプリからDBに接続できない
# 確認
getsebool httpd_can_network_connect_db

# 対処
setsebool -P httpd_can_network_connect_db on
```

### ブール値設定
```bash
# 利用可能なブール値確認
getsebool -a | grep httpd

# よく使うブール値
setsebool -P httpd_can_network_connect on      # HTTP外部接続許可
setsebool -P httpd_can_network_connect_db on   # DB接続許可
setsebool -P httpd_enable_homedirs on          # ホームディレクトリアクセス許可
setsebool -P httpd_execmem on                  # 実行可能メモリ許可

# -P オプション: 永続化（再起動後も有効）
```

## 実践的な運用例

### Apache Webサーバーの設定
```bash
# 1. 基本的なWebコンテンツ設定
semanage fcontext -a -t httpd_t "/var/www/html(/.*)?" 
restorecon -Rv /var/www/html/

# 2. CGIスクリプト設定
semanage fcontext -a -t httpd_exec_t "/var/www/cgi-bin(/.*)?" 
restorecon -Rv /var/www/cgi-bin/

# 3. ログディレクトリ設定
semanage fcontext -a -t httpd_log_t "/var/log/httpd(/.*)?" 
restorecon -Rv /var/log/httpd/
```

### SSH設定
```bash
# 非標準ポートでSSH運用
semanage port -a -t ssh_port_t -p tcp 2222

# SSH鍵の適切なコンテキスト設定
restorecon -Rv ~/.ssh/
```

### MySQL/MariaDB設定
```bash
# データディレクトリのコンテキスト設定
semanage fcontext -a -t mysqld_db_t "/var/lib/mysql(/.*)?" 
restorecon -Rv /var/lib/mysql/

# ログファイルのコンテキスト
semanage fcontext -a -t mysqld_log_t "/var/log/mysql(/.*)?" 
restorecon -Rv /var/log/mysql/
```

## SELinux無効化（非推奨）

!!! warning "セキュリティリスク"
    SELinuxを無効化するとセキュリティが大幅に低下します。
    どうしても必要な場合のみ、一時的に無効化してください。

```bash
# 一時的に無効化（再起動で元に戻る）
setenforce 0

# 永続的に無効化（再起動後も無効）
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
# 再起動が必要
reboot
```

## チートシート

### 基本コマンド
```bash
# 状態確認
getenforce
sestatus

# モード変更
setenforce 0  # Permissive
setenforce 1  # Enforcing

# コンテキスト確認
ls -Z ファイル名
ps -eZ | grep プロセス名

# コンテキスト変更
chcon -t タイプ ファイル名
restorecon -v ファイル名

# ポリシー管理
semanage fcontext -l
semanage port -l
getsebool -a

# ログ確認
grep denied /var/log/audit/audit.log
sealert -a /var/log/audit/audit.log
```

### トラブル時の対処手順
1. **エラーログ確認**: `grep denied /var/log/audit/audit.log`
2. **コンテキスト確認**: `ls -Z 問題のファイル`
3. **復元試行**: `restorecon -v 問題のファイル`
4. **ポリシー確認**: `semanage fcontext -l | grep パス`
5. **ブール値確認**: `getsebool -a | grep 関連キーワード`

## 関連記事

- [ファイアウォール設定](firewalld設定.md) - システムセキュリティの他の側面
- [OSの確認](OSの確認.md) - システム情報の取得方法