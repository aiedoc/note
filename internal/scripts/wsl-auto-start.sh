#!/bin/bash

# WSL自動起動・復旧スクリプト
# Windows起動時にWSLとcronサービスを自動開始

LOG_FILE="/home/akiyoshi-yusuke/note/logs/wsl-auto-start.log"

echo "=== WSL Auto-start Script Started at $(date) ===" >> $LOG_FILE

# cronサービスの確認・起動
if ! service cron status > /dev/null 2>&1; then
    echo "Starting cron service..." >> $LOG_FILE
    sudo service cron start >> $LOG_FILE 2>&1
    
    if service cron status > /dev/null 2>&1; then
        echo "✓ Cron service started successfully" >> $LOG_FILE
    else
        echo "✗ Failed to start cron service" >> $LOG_FILE
    fi
else
    echo "✓ Cron service already running" >> $LOG_FILE
fi

# 環境変数の設定確認
source /home/akiyoshi-yusuke/.bashrc

# Claude認証の確認
if [ -f "/home/akiyoshi-yusuke/.claude/.credentials.json" ]; then
    echo "✓ Claude credentials found" >> $LOG_FILE
else
    echo "✗ Claude credentials missing" >> $LOG_FILE
fi

# Node.js環境の確認
export NVM_DIR="/home/akiyoshi-yusuke/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if command -v node >/dev/null 2>&1; then
    echo "✓ Node.js available: $(node --version)" >> $LOG_FILE
else
    echo "✗ Node.js not available" >> $LOG_FILE
fi

# Claude Codeの確認
if command -v claude >/dev/null 2>&1; then
    echo "✓ Claude Code available" >> $LOG_FILE
else
    echo "✗ Claude Code not available" >> $LOG_FILE
fi

echo "=== WSL Auto-start Script Completed at $(date) ===" >> $LOG_FILE
echo "" >> $LOG_FILE