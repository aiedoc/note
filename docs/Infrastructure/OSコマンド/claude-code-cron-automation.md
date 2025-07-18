# Claude Code自動実行 - cron設定完全ガイド

![Badge](https://img.shields.io/badge/自動化-Claude%20Code-blue.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-clock-outline: **定期自動実行**
    
    指定した時間にClaude Codeが自動で記事作成・更新を実行

-   :material-newspaper: **ニュース記事自動化**
    
    最新ニュースを検索して記事を作成・公開まで完全自動化

-   :material-chart-line: **ログ監視**
    
    実行状況・エラーの監視とログローテーション機能

-   :material-git: **Git連携**
    
    記事作成後の自動コミット・プッシュでサイト更新まで完結

</div>

## 📖 Overview

Claude Codeの自動実行をcronで組むことで、定期的なニュース記事の作成・更新・公開を完全自動化できます。WSL環境でのcron設定から、エラーハンドリング、ログ管理まで包括的に対応しています。

!!! tip "自動化のメリット"
    - **継続的コンテンツ生成**: 手動操作なしで定期的な記事更新
    - **最新情報の自動キャッチアップ**: 12時間以内の最新ニュースを自動検索
    - **完全なワークフロー**: 記事作成からサイト公開まで一気通貫で自動化

## 🔧 セットアップ手順

### 1. スクリプトの配置確認

```bash
# 既に作成済みのスクリプトファイル確認
ls -la /home/akiyoshi-yusuke/note/scripts/
```

以下のファイルが配置されています：

```
scripts/
├── auto-claude-news.sh      # メイン実行スクリプト
├── log-monitor.sh           # ログ監視・管理スクリプト
└── crontab-sample.txt       # cron設定サンプル
```

### 2. cron設定の実装

#### WSLでのcron有効化

```bash
# cron serviceの開始（WSL環境）
sudo service cron start

# 自動起動設定
sudo systemctl enable cron
```

#### crontab設定手順

```bash
# 現在の設定をバックアップ
crontab -l > crontab_backup.txt

# crontab編集
crontab -e
```

#### 推奨スケジュール設定

```bash
# 毎日朝6時と夕方18時に実行（1日2回）
0 6,18 * * * /home/akiyoshi-yusuke/note/scripts/auto-claude-news.sh

# その他のオプション例:

# 毎時実行（APIレート制限に注意）
# 0 * * * * /home/akiyoshi-yusuke/note/scripts/auto-claude-news.sh

# 平日のみ朝9時
# 0 9 * * 1-5 /home/akiyoshi-yusuke/note/scripts/auto-claude-news.sh

# 週1回土曜日の午前10時
# 0 10 * * 6 /home/akiyoshi-yusuke/note/scripts/auto-claude-news.sh
```

### 3. 環境変数の確認

```bash
# API keyの設定確認
echo $ANTHROPIC_API_KEY | head -c 20

# .bashrcに環境変数が設定されているか確認
grep ANTHROPIC ~/.bashrc
```

!!! warning "重要: API key設定"
    ANTHROPIC_API_KEYが設定されていない場合、以下をbashrcに追加：
    ```bash
    export ANTHROPIC_API_KEY="your-api-key-here"
    ```

## 📊 監視・運用

### ログ監視コマンド

```bash
# 包括的なステータス確認
./scripts/log-monitor.sh all

# 最新ログのみ表示
./scripts/log-monitor.sh log

# エラーログのみ表示
./scripts/log-monitor.sh errors

# 実行中プロセス確認
./scripts/log-monitor.sh status

# ログローテーション実行
./scripts/log-monitor.sh rotate
```

### ログファイルの場所

```
logs/
└── auto-claude-news.log    # メイン実行ログ
```

### 実行状況の確認

```bash
# cron実行状況確認
crontab -l

# 実行中のClaudeプロセス確認
ps aux | grep claude

# 最近の実行結果確認
tail -50 /home/akiyoshi-yusuke/note/logs/auto-claude-news.log
```

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### 1. 環境変数が読み込まれない

```bash
# bashrcの読み込み確認
source ~/.bashrc

# cronから環境変数が見えるか確認
* * * * * env > /tmp/cron-env.txt
```

#### 2. nvmコマンドが見つからない

スクリプト内でnvmのパスを明示的に指定済み：

```bash
export NVM_DIR="/home/akiyoshi-yusuke/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

#### 3. Git認証エラー

```bash
# SSH keyの設定確認
ssh -T git@github.com

# HTTPS認証の場合、Personal Access Tokenの設定確認
git config --global credential.helper store
```

#### 4. API制限エラー

```bash
# 実行頻度を調整
# 毎時 → 1日2回 → 週1回 の順で頻度を下げる

# 0 6,18 * * * # 1日2回（推奨）
# 0 10 * * 6   # 週1回
```

## 📋 メンテナンス作業

### 定期メンテナンス（月1回推奨）

```bash
# 1. ログファイルサイズ確認・ローテーション
./scripts/log-monitor.sh rotate

# 2. エラーログ確認
./scripts/log-monitor.sh errors

# 3. cronジョブ実行履歴確認
grep CRON /var/log/syslog | grep claude

# 4. ディスク使用量確認
du -sh /home/akiyoshi-yusuke/note/logs/
```

### アップデート作業

```bash
# Claude Codeバージョン更新
npm update -g claude-code

# スクリプトの更新（必要に応じて）
git pull origin master
```

## 💡 高度な設定例

### 条件付き実行

特定の条件でのみ実行したい場合：

```bash
# スクリプト内に条件分岐を追加
if [ "$(date +%u)" -eq 6 ]; then  # 土曜日のみ
    claude --dangerously-skip-permissions "..."
fi
```

### 複数記事タイプの自動化

```bash
# 朝: Claude Codeニュース、夕方: 生成AIニュース
0 6 * * * /home/akiyoshi-yusuke/note/scripts/auto-claude-news.sh
0 18 * * * /home/akiyoshi-yusuke/note/scripts/auto-ai-news.sh
```

### Slack通知連携

```bash
# 実行完了をSlackに通知
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Claude Code auto-execution completed"}' \
  YOUR_SLACK_WEBHOOK_URL
```

## 🔗 Related Articles

- [crontabの書き方](./crontabの書き方.md)
- [Claude Code完全ガイド](../../AI/claude-code-complete-guide.md)
- [GitHub Actions自動デプロイ](../../MkDocs/GitHub Actions自動デプロイ設定.md)

## 🚀 実行例

### 手動テスト実行

```bash
# スクリプトの動作確認
./scripts/auto-claude-news.sh

# バックグラウンド実行
nohup ./scripts/auto-claude-news.sh &

# ログリアルタイム監視
tail -f /home/akiyoshi-yusuke/note/logs/auto-claude-news.log
```

### 設定完了確認

```bash
# cron設定確認
crontab -l

# 次回実行時刻確認
echo "次回実行予定:"
echo "朝6時: $(date -d 'tomorrow 06:00')"
echo "夕方18時: $(date -d 'today 18:00')"
```

---

!!! success "自動化完了"
    この設定により、Claude Codeによる記事作成が完全自動化されます。
    定期的なログ確認と必要に応じたスケジュール調整を行い、
    継続的なコンテンツ更新システムを維持してください。