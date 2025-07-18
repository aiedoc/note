#!/bin/bash

# Claude Code自動ニュース記事作成スクリプト
# 使用方法: ./scripts/auto-claude-news.sh

# スクリプト開始時刻をログに記録
echo "=== Claude Code Auto News Script Started at $(date) ===" >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log

# エラーハンドリング設定
set -e
trap 'echo "Error occurred at line $LINENO. Exit code: $?" >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log' ERR

# 環境設定
export HOME=/home/akiyoshi-yusuke
export PATH="/home/akiyoshi-yusuke/.nvm/versions/node/v18.20.8/bin:$PATH"
export NVM_DIR="/home/akiyoshi-yusuke/.nvm"

# bashrcから環境変数を読み込み（ANTHROPIC_API_KEYなど）
source /home/akiyoshi-yusuke/.bashrc

# Claude認証情報の確認
if [ -f "/home/akiyoshi-yusuke/.claude/.credentials.json" ]; then
    echo "Claude credentials found" >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log
else
    echo "Warning: Claude credentials not found" >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log
fi

# NVM読み込み
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Node.js 18の使用
nvm use 18 >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log 2>&1

# 作業ディレクトリに移動
cd /home/akiyoshi-yusuke/note

# Gitリポジトリの状態確認
echo "Checking git status..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log
git status >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log 2>&1

# 最新のリモートブランチを取得
echo "Pulling latest changes..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log
git pull origin master >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log 2>&1

# Claude Codeを実行してClaude Codeニュース記事を作成
echo "Running Claude Code for news article creation..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log
claude --dangerously-skip-permissions "いまから12時間以内の最新の「claude code」に関するニュースを検索しclaude.mdのルールに応じて記事を作成または既存記事の更新し、公開してください" >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log 2>&1

# スクリプト完了時刻をログに記録
echo "=== Claude Code Auto News Script Completed at $(date) ===" >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log
echo "" >> /home/akiyoshi-yusuke/note/internal/logs/auto-claude-news.log