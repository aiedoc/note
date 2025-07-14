# Claude Code トラブルシューティング完全ガイド

![Badge](https://img.shields.io/badge/Claude_Code-Troubleshooting-red.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-bug: **問題の迅速な特定**
    
    エラーの原因を素早く診断し、効率的な解決策を提供

-   :material-shield-check: **システム安定性の確保**
    
    予防策により予期しない問題を未然に防止

-   :material-chart-line: **パフォーマンス向上**
    
    最適化により応答速度と処理効率を大幅改善

-   :material-refresh: **自動復旧システム**
    
    問題発生時の自動修復と代替手段の確立

</div>

## 📖 概要

Claude Codeの使用中に発生する可能性のある問題を体系的に整理し、効果的な解決策を提供します。予防策から緊急時の対処まで、あらゆるシナリオに対応した実践的なガイドです。

## 🚨 緊急時の対処法

### クイック診断チェックリスト

```bash
# 1. 基本接続確認
claude --version
curl -I https://api.anthropic.com

# 2. 認証状態確認
echo $ANTHROPIC_API_KEY
claude auth status

# 3. システムリソース確認
free -h     # メモリ使用量
df -h       # ディスク容量
top -p $(pgrep claude)  # Claude プロセス状況
```

## 💥 よくあるエラーと解決策

### 1. インストール・起動エラー

#### エラー: `claude: command not found`

**原因**: PATH設定の問題、またはインストール失敗

```bash
# 解決策1: PATHの確認と修正
echo $PATH | grep npm
which claude

# 解決策2: グローバルnpmの再設定
npm config get prefix
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 解決策3: 再インストール
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code
```

#### エラー: `Permission denied`

**原因**: ファイルアクセス権限の問題

```bash
# 解決策1: npm権限の修正
sudo chown -R $(whoami) $(npm config get prefix)

# 解決策2: 設定ディレクトリの権限修正
chmod 755 ~/.config/claude
chmod 644 ~/.config/claude/*

# 解決策3: 一時的な権限昇格（最後の手段）
sudo claude  # 推奨しない
```

### 2. API接続エラー

#### エラー: `API key not found or invalid`

**原因**: APIキー設定の問題

```bash
# 解決策1: 環境変数の確認
echo $ANTHROPIC_API_KEY

# 解決策2: 設定ファイルの確認
cat ~/.config/claude/config.yaml

# 解決策3: APIキーの再設定
export ANTHROPIC_API_KEY="sk-ant-api03-..."
claude auth login

# 解決策4: APIキーのテスト
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.anthropic.com/v1/models
```

#### エラー: `Rate limit exceeded`

**原因**: API使用量の上限に達した

```bash
# 解決策1: 現在の使用量確認
claude usage

# 解決策2: リクエスト間隔の調整
claude config set rate_limit_delay 2000  # 2秒間隔

# 解決策3: バッチ処理の最適化
claude --batch-mode "複数のファイルを順次処理"

# 解決策4: プランのアップグレード検討
# https://console.anthropic.com/billing
```

#### エラー: `Connection timeout`

**原因**: ネットワーク接続の問題

```bash
# 解決策1: 接続テスト
ping api.anthropic.com
telnet api.anthropic.com 443

# 解決策2: プロキシ設定（企業環境）
export HTTPS_PROXY=http://proxy.company.com:8080
export HTTP_PROXY=http://proxy.company.com:8080

# 解決策3: タイムアウト値の調整
claude config set timeout 60

# 解決策4: DNS設定の確認
nslookup api.anthropic.com
```

### 3. パフォーマンス問題

#### 症状: 応答が異常に遅い

**期待値**: 通常2-5秒、複雑な処理で10-30秒

```bash
# 診断1: システムリソース確認
htop
iostat 1 5

# 診断2: Claude プロセス確認
ps aux | grep claude
lsof -p $(pgrep claude)

# 解決策1: キャッシュクリア
claude cache clear
rm -rf ~/.claude/cache/*

# 解決策2: 並列処理数の調整
claude config set max_concurrent_requests 2

# 解決策3: メモリ使用量の最適化
claude config set memory_limit 4096  # 4GB制限
```

#### 症状: メモリ不足エラー

```bash
# 診断: メモリ使用量確認
free -h
cat /proc/meminfo | grep Available

# 解決策1: スワップ設定
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 解決策2: 処理サイズの制限
claude config set max_file_size 10485760  # 10MB制限

# 解決策3: バッチサイズの調整
claude --chunk-size 1000 "大きなファイルの処理"
```

### 4. ファイル操作エラー

#### エラー: `File not found` または `Permission denied`

```bash
# 診断: ファイル権限確認
ls -la /path/to/file
stat /path/to/file

# 解決策1: 権限修正
chmod 644 /path/to/file
chown $(whoami) /path/to/file

# 解決策2: 相対パスの使用
cd /project/root
claude "現在のディレクトリからsrc/app.jsを確認"

# 解決策3: シンボリックリンクの確認
readlink -f /path/to/file
```

#### エラー: `Working directory changed unexpectedly`

```bash
# 診断: 現在のディレクトリ確認
pwd
ls -la

# 解決策1: 作業ディレクトリの明示的設定
cd /original/project/path
claude --cwd /original/project/path

# 解決策2: CLAUDE.mdファイルの設置
echo "# Working Directory: $(pwd)" > CLAUDE.md
```

## 🔧 高度なトラブルシューティング

### ログ分析

```bash
# デバッグログの有効化
claude --debug --verbose

# ログファイルの確認
tail -f ~/.claude/logs/debug.log
tail -f ~/.claude/logs/error.log
tail -f ~/.claude/logs/performance.log

# ログレベルの調整
claude config set log_level debug
claude config set log_file ~/.claude/logs/custom.log
```

### ネットワーク診断

```bash
# 詳細な接続テスト
traceroute api.anthropic.com
mtr api.anthropic.com

# SSL証明書の確認
openssl s_client -connect api.anthropic.com:443

# DNSキャッシュクリア
sudo systemctl flush-dns  # Linux
sudo dscacheutil -flushcache  # macOS
```

### システム環境の最適化

```bash
# Ubuntu/Debian での最適化
sudo apt update && sudo apt upgrade
sudo apt install curl wget git build-essential

# CentOS/RHEL での最適化
sudo yum update
sudo yum groupinstall "Development Tools"

# macOS での最適化
brew update && brew upgrade
xcode-select --install
```

## 🛡️ 予防策とベストプラクティス

### 定期メンテナンス

```bash
# 週次メンテナンススクリプト
#!/bin/bash
echo "Claude Code メンテナンス開始"

# キャッシュクリア
claude cache clear

# ログローテーション
find ~/.claude/logs -name "*.log" -mtime +7 -delete

# 設定ファイルのバックアップ
cp ~/.config/claude/config.yaml ~/.config/claude/config.yaml.backup

# パッケージの更新確認
npm outdated -g @anthropic-ai/claude-code

echo "メンテナンス完了"
```

### 設定の最適化

```bash
# パフォーマンス重視設定
claude config set cache.enabled true
claude config set cache.ttl 3600
claude config set max_concurrent_requests 3
claude config set timeout 45

# 安定性重視設定
claude config set retry_count 3
claude config set retry_delay 1000
claude config set auto_save true
claude config set backup_enabled true
```

### モニタリング設定

```bash
# システムリソースの監視
watch -n 5 'free -h && df -h && ps aux | grep claude'

# ログ監視（別ターミナル）
tail -f ~/.claude/logs/error.log | grep -E "(ERROR|FATAL)"

# パフォーマンス監視
echo '#!/bin/bash
while true; do
  echo "$(date): $(ps -p $(pgrep claude) -o %cpu,%mem --no-headers)"
  sleep 60
done' > ~/claude-monitor.sh
chmod +x ~/claude-monitor.sh
```

## 🆘 緊急時の代替手段

### 1. ブラウザ版Claude

```bash
# Claude Code が動作しない場合
echo "ブラウザでhttps://claude.ai にアクセス"
echo "同様の機能を一時的に利用可能"
```

### 2. ローカルLLMの利用

```bash
# Ollama を使用した代替案
curl -fsSL https://ollama.ai/install.sh | sh
ollama run codellama

# ローカルでのコード支援
ollama run codellama "Python でファイル読み込みの関数を作成"
```

### 3. 他のAIツールとの併用

```bash
# GitHub Copilot CLI （インストール済みの場合）
gh copilot suggest "git コマンドでファイルを削除"

# VS Code 拡張機能の利用
code --install-extension GitHub.copilot
```

## 📞 サポートとコミュニティ

### 公式サポート

- **Anthropic Status**: https://status.anthropic.com/
- **Documentation**: https://docs.anthropic.com/claude/code
- **Support Email**: support@anthropic.com

### コミュニティリソース

- **GitHub Issues**: 既知の問題と解決策
- **Discord**: リアルタイムサポート
- **Reddit r/Claude**: ユーザーコミュニティ

### 問題報告時の情報

```bash
# 問題報告用情報収集スクリプト
echo "=== Claude Code Debug Info ==="
echo "Version: $(claude --version)"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "OS: $(uname -a)"
echo "Memory: $(free -h | head -2)"
echo "Disk: $(df -h | head -2)"
echo "Config: $(cat ~/.config/claude/config.yaml)"
echo "Recent Errors:"
tail -10 ~/.claude/logs/error.log
```

## 🔗 関連記事

- [Claude Code インストールガイド](./claude-code-installation-guide.md)
- [Claude Code完全ガイド](./claude-code-complete-guide.md)
- [Claude Code パフォーマンス最適化](./claude-code-performance-optimization.md)
- [Claude Code Tips集](../Tips/claude-code-tips.md)

---

*最終更新: 2025-01-14*