# crontab設定

## 基本操作

```bash
# crontab編集
crontab -e

# crontab確認
crontab -l

# crontab削除
crontab -r
```

## 記法の基本

フォーマット: `分 時 日 月 曜日 コマンド`

```bash
# よく使う実用例
0 1 * * *           # 毎日1:00に実行
*/10 * * * *        # 10分おきに実行
0 */2 * * *         # 2時間おきに実行
0 9 * * 1-5         # 平日の9:00に実行
0 0 1 * *           # 毎月1日の0:00に実行
0 2 * * 0           # 毎週日曜の2:00に実行
30 5 1,15 * *       # 毎月1日と15日の5:30に実行
```

## 特殊文字

```bash
*      # すべての値
,      # 複数の値（例: 1,3,5）
-      # 範囲指定（例: 1-5）
/      # 間隔指定（例: */10）
```

## ログ出力設定

```bash
# ログをファイルに出力
0 1 * * * /path/to/script.sh >> /var/log/cron.log 2>&1

# メール通知なし
0 1 * * * /path/to/script.sh > /dev/null 2>&1
```

## cron動作確認

```bash
# cronサービス状態確認
systemctl status cron

# cronログ確認
tail -f /var/log/cron
```