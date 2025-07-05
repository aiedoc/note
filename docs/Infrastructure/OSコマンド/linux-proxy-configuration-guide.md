# Linux プロキシ設定完全ガイド - curl・wget・Docker・yum対応

## 実現できること

この記事を読むことで、以下のプロキシ設定が完全にマスターできます：

- **システム全体のプロキシ設定** - 環境変数による包括的な設定
- **コマンドラインツール** - curl、wget、ssh、gitの個別設定
- **パッケージマネージャー** - yum、dnf、aptのプロキシ経由パッケージ管理
- **コンテナ環境** - Dockerコンテナ・イメージビルド時のプロキシ設定
- **開発ツール** - npm、pip、brewなどの開発環境プロキシ設定

## システム全体のプロキシ設定

### 環境変数による基本設定

**~/.bashrc または ~/.zshrc に追加:**

```bash
# HTTP/HTTPSプロキシ設定
export http_proxy="http://proxy.company.com:8080"
export https_proxy="http://proxy.company.com:8080"
export ftp_proxy="http://proxy.company.com:8080"

# 認証が必要な場合
export http_proxy="http://username:password@proxy.company.com:8080"
export https_proxy="http://username:password@proxy.company.com:8080"

# プロキシを使わないホスト（カンマ区切り）
export no_proxy="localhost,127.0.0.1,*.company.com,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"

# 大文字版も設定（一部のアプリケーションで必要）
export HTTP_PROXY=$http_proxy
export HTTPS_PROXY=$https_proxy
export FTP_PROXY=$ftp_proxy
export NO_PROXY=$no_proxy
```

**システム全体での設定 (/etc/environment):**

```bash
http_proxy="http://proxy.company.com:8080"
https_proxy="http://proxy.company.com:8080"
ftp_proxy="http://proxy.company.com:8080"
no_proxy="localhost,127.0.0.1,*.company.com"
```

### 一時的なプロキシ設定

```bash
# 現在のセッションのみ
export http_proxy="http://proxy.company.com:8080"

# 特定のコマンドのみ
http_proxy="http://proxy.company.com:8080" curl https://example.com

# プロキシを無効化
unset http_proxy https_proxy ftp_proxy
```

## コマンドラインツールのプロキシ設定

### curl

```bash
# コマンドラインオプション
curl --proxy http://proxy.company.com:8080 https://example.com
curl -x proxy.company.com:8080 https://example.com

# 認証付きプロキシ
curl --proxy-user username:password --proxy http://proxy.company.com:8080 https://example.com

# プロキシを使わない
curl --noproxy "*.company.com,localhost" https://internal.company.com

# SOCKS5プロキシ
curl --socks5 proxy.company.com:1080 https://example.com

# ~/.curlrc での設定
echo 'proxy = "http://proxy.company.com:8080"' >> ~/.curlrc
```

### wget

```bash
# コマンドラインオプション
wget --proxy=on --http-proxy=http://proxy.company.com:8080 https://example.com

# 環境変数での設定（推奨）
export http_proxy="http://proxy.company.com:8080"
wget https://example.com

# ~/.wgetrc での設定
cat >> ~/.wgetrc << EOF
http_proxy = http://proxy.company.com:8080
https_proxy = http://proxy.company.com:8080
ftp_proxy = http://proxy.company.com:8080
use_proxy = on
EOF

# プロキシを使わない
wget --no-proxy https://internal.company.com
```

### git

```bash
# HTTPSリポジトリ用プロキシ設定
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy http://proxy.company.com:8080

# 特定のURLのみプロキシを使用
git config --global http.https://github.com.proxy http://proxy.company.com:8080

# SSH接続用プロキシ設定（~/.ssh/config）
cat >> ~/.ssh/config << EOF
Host github.com
    User git
    ProxyCommand nc -X connect -x proxy.company.com:8080 %h %p
EOF

# プロキシ設定を削除
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### ssh

```bash
# ~/.ssh/config での設定
cat >> ~/.ssh/config << EOF
Host target-server
    ProxyCommand nc -X connect -x proxy.company.com:8080 %h %p

# HTTPプロキシ経由の場合
Host target-server  
    ProxyCommand corkscrew proxy.company.com 8080 %h %p
EOF

# コマンドライン指定
ssh -o ProxyCommand="nc -X connect -x proxy.company.com:8080 %h %p" user@target-server
```

## パッケージマネージャーのプロキシ設定

### yum / dnf (RHEL/CentOS/Fedora)

**RHEL 8以降 (/etc/dnf/dnf.conf):**

```ini
[main]
proxy=http://proxy.company.com:8080
proxy_username=username
proxy_password=password
```

**RHEL 7以下 (/etc/yum.conf):**

```ini
[main]
proxy=http://proxy.company.com:8080
proxy_username=username
proxy_password=password
```

**Subscription Manager設定 (/etc/rhsm/rhsm.conf):**

```ini
[server]
proxy_hostname = proxy.company.com
proxy_port = 8080
proxy_user = username
proxy_password = password
```

### apt (Ubuntu/Debian)

**/etc/apt/apt.conf.d/95proxies:**

```bash
Acquire::http::Proxy "http://proxy.company.com:8080/";
Acquire::https::Proxy "http://proxy.company.com:8080/";
Acquire::ftp::Proxy "http://proxy.company.com:8080/";

# 認証が必要な場合
Acquire::http::Proxy "http://username:password@proxy.company.com:8080/";

# 特定のホストでプロキシを使わない
Acquire::http::Proxy::ppa.launchpad.net "DIRECT";
```

**一時的な設定:**

```bash
sudo apt -o Acquire::http::Proxy="http://proxy.company.com:8080" update
```

### zypper (openSUSE)

```bash
# プロキシ設定
sudo zypper modifyrepo --proxy http://proxy.company.com:8080 --all

# 設定ファイル編集 (/etc/zypp/zypp.conf)
proxy = http://proxy.company.com:8080
proxyuser = username
proxypass = password
```

## Docker環境のプロキシ設定

### Dockerデーモンのプロキシ設定

**/etc/systemd/system/docker.service.d/http-proxy.conf:**

```ini
[Service]
Environment="HTTP_PROXY=http://proxy.company.com:8080"
Environment="HTTPS_PROXY=http://proxy.company.com:8080"
Environment="NO_PROXY=localhost,127.0.0.1,docker-registry.company.com"
```

**設定反映:**

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### コンテナ実行時のプロキシ設定

```bash
# 環境変数で指定
docker run -e http_proxy=http://proxy.company.com:8080 \
           -e https_proxy=http://proxy.company.com:8080 \
           -e no_proxy=localhost,127.0.0.1 \
           ubuntu:latest

# Docker Compose での設定
version: '3'
services:
  app:
    image: ubuntu:latest
    environment:
      - http_proxy=http://proxy.company.com:8080
      - https_proxy=http://proxy.company.com:8080
      - no_proxy=localhost,127.0.0.1
```

### Dockerビルド時のプロキシ設定

```dockerfile
# Dockerfile内でのプロキシ設定
FROM ubuntu:latest

# ビルド時引数として受け取り
ARG http_proxy
ARG https_proxy
ARG no_proxy

# 環境変数として設定
ENV http_proxy=${http_proxy}
ENV https_proxy=${https_proxy}
ENV no_proxy=${no_proxy}

RUN apt-get update && apt-get install -y curl
```

**ビルド実行:**

```bash
docker build --build-arg http_proxy=http://proxy.company.com:8080 \
             --build-arg https_proxy=http://proxy.company.com:8080 \
             --build-arg no_proxy=localhost,127.0.0.1 \
             -t myapp .
```

### ~/.docker/config.json での設定

```json
{
  "proxies": {
    "default": {
      "httpProxy": "http://proxy.company.com:8080",
      "httpsProxy": "http://proxy.company.com:8080",
      "noProxy": "localhost,127.0.0.1,docker-registry.company.com"
    }
  }
}
```

## 開発ツールのプロキシ設定

### npm (Node.js)

```bash
# プロキシ設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# レジストリ別設定
npm config set @company:registry https://npm.company.com/
npm config set //npm.company.com/:_authToken "auth-token"

# SSL証明書エラーを回避（開発環境のみ）
npm config set strict-ssl false

# 設定確認
npm config list

# 設定削除
npm config delete proxy
npm config delete https-proxy
```

### pip (Python)

**~/.pip/pip.conf:**

```ini
[global]
proxy = http://proxy.company.com:8080
trusted-host = pypi.org
               pypi.python.org
               files.pythonhosted.org
```

**環境変数での設定:**

```bash
export pip_proxy=http://proxy.company.com:8080
pip install --proxy $pip_proxy package-name

# 一時的な設定
pip install --proxy http://proxy.company.com:8080 requests
```

### Homebrew (macOS)

```bash
# 環境変数設定後に実行
export ALL_PROXY=http://proxy.company.com:8080
brew update

# git設定も必要（Homebrewはgitを使用）
git config --global http.proxy http://proxy.company.com:8080
```

### Maven (Java)

**~/.m2/settings.xml:**

```xml
<settings>
  <proxies>
    <proxy>
      <id>company-proxy</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>proxy.company.com</host>
      <port>8080</port>
      <username>username</username>
      <password>password</password>
      <nonProxyHosts>localhost|127.0.0.1|*.company.com</nonProxyHosts>
    </proxy>
  </proxies>
</settings>
```

### Gradle (Java)

**gradle.properties:**

```properties
systemProp.http.proxyHost=proxy.company.com
systemProp.http.proxyPort=8080
systemProp.http.proxyUser=username
systemProp.http.proxyPassword=password

systemProp.https.proxyHost=proxy.company.com
systemProp.https.proxyPort=8080
systemProp.https.proxyUser=username
systemProp.https.proxyPassword=password

systemProp.http.nonProxyHosts=*.company.com|localhost|127.0.0.1
```

## 接続確認とテスト

### 基本的な接続テスト

```bash
# HTTP接続テスト
curl -I --proxy http://proxy.company.com:8080 http://httpbin.org/ip
curl -I --proxy http://proxy.company.com:8080 https://httpbin.org/ip

# プロキシ経由でのIPアドレス確認
curl --proxy http://proxy.company.com:8080 https://httpbin.org/ip

# プロキシなしでの確認（比較用）
curl https://httpbin.org/ip

# DNS解決テスト
nslookup google.com
dig google.com

# ポート接続テスト
telnet proxy.company.com 8080
nc -zv proxy.company.com 8080
```

### パッケージマネージャーのテスト

```bash
# yum/dnf
dnf repolist                    # RHEL 8以降
yum repolist                    # RHEL 7以下
dnf search vim                  # RHEL 8以降
yum search vim                  # RHEL 7以下

# apt
apt update
apt search curl

# 接続ログの確認
tail -f /var/log/dnf.log        # RHEL 8以降
tail -f /var/log/yum.log        # RHEL 7以下
tail -f /var/log/apt/history.log # Ubuntu/Debian
```

### Docker接続テスト

```bash
# イメージプル テスト
docker pull hello-world

# プロキシ経由でのコンテナテスト
docker run --rm -e http_proxy=$http_proxy alpine:latest \
  sh -c "apk update && apk add curl && curl -I https://httpbin.org/ip"
```

## トラブルシューティング

### よくある問題と解決方法

**1. SSL証明書エラー**

```bash
# curl
curl -k https://example.com  # SSL証明書検証をスキップ

# wget
wget --no-check-certificate https://example.com

# 環境変数
export PYTHONHTTPSVERIFY=0  # Python requests
export NODE_TLS_REJECT_UNAUTHORIZED=0  # Node.js (開発環境のみ)
```

**2. 認証プロキシでの特殊文字エラー**

```bash
# URLエンコードが必要な場合
# @ → %40, : → %3A, % → %25
export http_proxy="http://user%40domain.com:pass%40word@proxy.company.com:8080"
```

**3. プロキシ自動検出(PAC)環境**

```bash
# PACファイルのURL確認
env | grep -i pac

# 手動でプロキシサーバーを確認
curl -I http://wpad.company.com/wpad.dat
```

**4. キャッシュ関連の問題**

```bash
# yum/dnf キャッシュクリア
dnf clean all && dnf makecache  # RHEL 8以降
yum clean all && yum makecache  # RHEL 7以下

# apt キャッシュクリア
apt clean && apt update

# Docker キャッシュクリア
docker system prune -a
```

**5. ログ確認**

```bash
# システムログ
journalctl -u systemd-resolved  # DNS解決
journalctl -u docker            # Docker

# アプリケーションログ
tail -f /var/log/squid/access.log      # Squidプロキシ
tail -f /var/log/rhsm/rhsm.log         # RHEL Subscription Manager
```

### デバッグ用コマンド

```bash
# 環境変数確認
env | grep -i proxy

# ネットワーク設定確認
ip route show
cat /etc/resolv.conf

# プロキシサーバーへの接続確認
telnet proxy.company.com 8080

# HTTPリクエストの詳細確認
curl -v --proxy http://proxy.company.com:8080 https://httpbin.org/ip

# tcpdumpでパケット確認
sudo tcpdump -i any host proxy.company.com

# netstatで接続状況確認
netstat -an | grep :8080
ss -tuln | grep :8080
```

## セキュリティ考慮事項

### 認証情報の安全な管理

```bash
# 認証情報を環境変数から分離
# ~/.proxy_auth ファイルに保存（権限 600）
echo "username:password" > ~/.proxy_auth
chmod 600 ~/.proxy_auth

# プロキシ設定で参照
export http_proxy="http://$(cat ~/.proxy_auth)@proxy.company.com:8080"

# 一時的な認証情報入力
read -s PROXY_PASS
export http_proxy="http://username:${PROXY_PASS}@proxy.company.com:8080"
```

### プロキシバイパスの適切な設定

```bash
# 内部ネットワークはプロキシを経由しない
export no_proxy="localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,*.company.com,.local"

# Docker内部通信もバイパス
export no_proxy="${no_proxy},docker-registry.company.com,*.docker.internal"
```

## まとめ

この完全ガイドを参考に、Linux環境でのプロキシ設定を効率的に行うことができます。基本的な環境変数設定から、各種ツールの個別設定まで、エンジニアが日常的に遭遇するプロキシ設定のすべてを網羅しています。

設定時のポイント：
- 環境変数による全体設定を基本とする
- セキュリティを考慮した認証情報の管理
- 内部ネットワークの適切なバイパス設定
- トラブル時のログ確認とデバッグ手法の活用

定期的に接続テストを行い、プロキシ設定が正常に動作していることを確認しましょう。