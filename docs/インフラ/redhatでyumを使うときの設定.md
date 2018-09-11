# RHELについて、yumを利用する

## 1. Subscription Managerを登録する

```
subscription-manager register --proxy=<プロキシホスト>:<プロキシポート> --autosubscribe
```

アカウント名、パスワードを入力する

```
subscription-manager list
```

## 2. rhsmのProxy設定

/etc/rhsm/rhsm.confにProxyの設定を行う。

- 設定ファイル：/etc/rhsm/rhsm.conf

```
# an http proxy server to use
proxy_hostname = <プロキシホスト>

# port for http proxy server
proxy_port = <プロキシポート>
```

## 3. yumのProxy設定

/etc/yum.confにProxyの設定を行う。

- 設定ファイル：/etc/yum.conf

```
#記載内容
proxy=http://<プロキシホスト>:<プロキシポート>/
```

## 4. RHELリポジトリの接続確認

```
yum repolist
```

