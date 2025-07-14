# Claude Code インストール完全ガイド

![Badge](https://img.shields.io/badge/Claude_Code-Installation-blue.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-download: **簡単セットアップ**
    
    3ステップでClaude Codeの強力な機能をすぐに利用開始

-   :material-monitor: **全プラットフォーム対応**
    
    Windows、macOS、Linux環境での最適な設定方法

-   :material-wrench: **トラブル解決**
    
    よくある問題の事前回避と効率的な解決策

-   :material-rocket: **パフォーマンス最適化**
    
    OSごとの特性を活かした高速動作設定

</div>

## 📖 概要

Claude Codeは、Anthropic社が開発したターミナルベースのAIコーディング支援ツールです。このガイドでは、各プラットフォームでの正しいインストール方法と、よくある問題の解決策を包括的に解説します。

### 対応プラットフォーム
- **macOS**: 完全対応
- **Linux**: Ubuntu 20.04+、Debian 10+ 推奨
- **Windows**: WSL2が必要（推奨）

## 🔧 システム要件

### 共通要件
- **Node.js**: 18.0.0以降（LTS版推奨）
- **npm**: 9.0.0以降
- **メモリ**: 4GB以上（大規模プロジェクトは8GB推奨）
- **ストレージ**: 500MB以上の空き容量

### API要件
- **Anthropic APIキー**: 有効なサブスクリプション
- **インターネット接続**: API通信用

## 🍎 macOS インストール

### Step 1: Node.js のインストール

```bash
# Homebrew経由（推奨）
brew install node

# または公式インストーラー
# https://nodejs.org からダウンロード

# バージョン確認
node --version  # v18.0.0以降
npm --version   # 9.0.0以降
```

### Step 2: Claude Code のインストール

```bash
# グローバルインストール
npm install -g @anthropic-ai/claude-code

# インストール確認
claude --version
```

### Step 3: 初期設定

```bash
# プロジェクトディレクトリに移動
cd /path/to/your/project

# Claude Code起動
claude
```

### macOS特有の最適化

```bash
# Xcodeコマンドラインツールの確認
xcode-select --install

# Homebrewの権限修正（必要に応じて）
sudo chown -R $(whoami) $(brew --prefix)/*
```

## 🐧 Linux インストール

### Ubuntu/Debian系

```bash
# Node.js 18.x のインストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 依存関係のインストール
sudo apt-get update
sudo apt-get install -y build-essential curl git

# Claude Code インストール
npm install -g @anthropic-ai/claude-code
```

### CentOS/RHEL系

```bash
# Node.js インストール
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs npm

# 開発ツールのインストール
sudo yum groupinstall -y "Development Tools"

# Claude Code インストール
npm install -g @anthropic-ai/claude-code
```

### Linux特有の最適化

```bash
# npm権限の設定（sudo不要にする）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# ファイル監視制限の増加（大規模プロジェクト用）
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 🪟 Windows インストール

### WSL2 セットアップ（推奨）

```powershell
# PowerShellを管理者として実行
wsl --install

# Ubuntu のインストール
wsl --install -d Ubuntu

# 再起動後、Ubuntuを起動
wsl
```

### Windows内でのセットアップ

```bash
# WSL2内でのLinux手順に従う
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Claude Code インストール
npm install -g @anthropic-ai/claude-code
```

### Windows特有の最適化

```bash
# WSL2のメモリ制限設定
# %USERPROFILE%\.wslconfig ファイルを作成
echo "[wsl2]
memory=8GB
processors=4" > /mnt/c/Users/$(whoami)/.wslconfig

# Linuxファイルシステムでの作業推奨
cd ~  # Windows の /mnt/c/ ではなくLinuxホームを使用
```

## ⚙️ API認証設定

### Anthropic APIキーの取得

1. [Anthropic Console](https://console.anthropic.com/) にアクセス
2. アカウント登録・ログイン
3. **API Keys** セクションでキーを生成
4. キーを安全な場所に保存

### 認証方法

```bash
# 方法1: 環境変数（推奨）
export ANTHROPIC_API_KEY="your-api-key-here"
echo 'export ANTHROPIC_API_KEY="your-key"' >> ~/.bashrc

# 方法2: Claude起動時に設定
claude auth login

# 方法3: 設定ファイル
mkdir -p ~/.config/claude
echo "api_key: your-api-key-here" > ~/.config/claude/config.yaml
```

## 🚀 動作確認

### 基本動作テスト

```bash
# Claude Code起動
claude

# プロンプトで入力
"Hello, Claude! システム情報を教えて"

# ファイル操作テスト
claude "package.jsonの内容を確認して"
```

### パフォーマンステスト

```bash
# 大きなプロジェクトでの動作確認
cd /path/to/large/project
claude "プロジェクト構造を分析して課題を報告"

# 応答時間測定（期待値: 2-5秒）
time claude "簡単なHello Worldスクリプトを作成"
```

## ⚠️ よくあるトラブル解決

### インストールエラー

```bash
# 権限エラーの場合
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# ネットワークエラーの場合
npm config set registry https://registry.npmjs.org/
npm cache clean --force

# Node.jsバージョンエラー
nvm install 18  # nvmを使用している場合
nvm use 18
```

### 起動エラー

```bash
# PATH設定確認
echo $PATH | grep npm

# 設定ファイル権限確認
ls -la ~/.config/claude/

# ログファイル確認
cat ~/.claude/logs/debug.log
```

### API接続エラー

```bash
# 接続テスト
curl -H "x-api-key: your-key" https://api.anthropic.com/v1/models

# プロキシ設定（企業環境）
export HTTPS_PROXY=http://proxy.company.com:8080
export HTTP_PROXY=http://proxy.company.com:8080
```

## 💡 インストール後の推奨設定

### プロジェクト設定

```bash
# CLAUDE.mdファイルの作成
cat > CLAUDE.md << 'EOF'
# プロジェクト設定

## 開発環境
- Node.js 18+
- TypeScript
- React

## コーディングルール
- ESLint/Prettier準拠
- テスト必須
- セキュリティ重視

## よく使うコマンド
- 開発: npm run dev
- テスト: npm test
- ビルド: npm run build
EOF
```

### パフォーマンス最適化

```bash
# クラウドキャッシュ有効化
claude config set cache.enabled true

# 並列処理数の調整
claude config set max_concurrent_requests 3

# 応答時間の最適化
claude config set timeout 30
```

## 🔗 関連記事

- [Claude Code完全ガイド](./claude-code-complete-guide.md)
- [Claude Codeトラブルシューティング](./claude-code-troubleshooting-guide.md)
- [Claude Code Tips集](../Tips/claude-code-tips.md)
- [Claude Code 2025年新機能](./claude-code-2025-features.md)

## 📞 サポート

### 公式リソース
- [Claude Code Documentation](https://docs.anthropic.com/claude/code)
- [Anthropic Community](https://community.anthropic.com)
- [GitHub Issues](https://github.com/anthropics/claude-code/issues)

### 緊急時の対処
1. **即座に確認**: API制限状況、ネットワーク接続
2. **ログ確認**: `~/.claude/logs/` ディレクトリ内のファイル
3. **一時的回避**: ブラウザ版Claude（claude.ai）を使用

---

*最終更新: 2025-01-14*