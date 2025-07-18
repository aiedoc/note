#!/bin/bash

# WSL・Windowsシステム状態テストスクリプト
# cronが動作するための前提条件をテスト

LOG_FILE="/home/akiyoshi-yusuke/note/logs/system-state-test.log"

echo "=== System State Test Started at $(date) ===" >> $LOG_FILE

# 1. WSL基本情報
echo "WSL Information:" >> $LOG_FILE
echo "  Distribution: $WSL_DISTRO_NAME" >> $LOG_FILE
echo "  Kernel: $(uname -r)" >> $LOG_FILE
echo "  Uptime: $(uptime -p)" >> $LOG_FILE
echo "" >> $LOG_FILE

# 2. cronサービス状態
echo "Cron Service Status:" >> $LOG_FILE
if service cron status > /dev/null 2>&1; then
    echo "  ✓ Cron service is running" >> $LOG_FILE
else
    echo "  ✗ Cron service is NOT running" >> $LOG_FILE
fi

# 3. cron設定確認
echo "Cron Configuration:" >> $LOG_FILE
echo "  User crontab entries: $(crontab -l 2>/dev/null | grep -v '^#' | wc -l)" >> $LOG_FILE

# 4. プロセス確認
echo "Process Information:" >> $LOG_FILE
CRON_PROCESSES=$(ps -ef | grep cron | grep -v grep | wc -l)
echo "  Cron processes running: $CRON_PROCESSES" >> $LOG_FILE

# 5. Windowsシステム情報取得（可能であれば）
echo "Windows System Information:" >> $LOG_FILE
if command -v powershell.exe >/dev/null 2>&1; then
    POWER_STATE=$(powershell.exe -Command "Get-WmiObject -Class Win32_PowerManagementEvent | Select-Object -Last 1" 2>/dev/null || echo "Unable to get power state")
    echo "  Windows accessible: Yes" >> $LOG_FILE
    echo "  Power state info: $POWER_STATE" >> $LOG_FILE
else
    echo "  Windows accessible: No (powershell.exe not found)" >> $LOG_FILE
fi

# 6. ネットワーク接続確認
echo "Network Connectivity:" >> $LOG_FILE
if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    echo "  ✓ Internet connectivity available" >> $LOG_FILE
else
    echo "  ✗ Internet connectivity NOT available" >> $LOG_FILE
fi

# 7. Claude Codeアクセス確認
echo "Claude Code Status:" >> $LOG_FILE
if command -v claude >/dev/null 2>&1; then
    echo "  ✓ Claude command available" >> $LOG_FILE
    if [ -f "/home/akiyoshi-yusuke/.claude/.credentials.json" ]; then
        echo "  ✓ Claude credentials found" >> $LOG_FILE
    else
        echo "  ✗ Claude credentials NOT found" >> $LOG_FILE
    fi
else
    echo "  ✗ Claude command NOT available" >> $LOG_FILE
fi

# 8. 実行環境確認
echo "Execution Environment:" >> $LOG_FILE
echo "  Current user: $(whoami)" >> $LOG_FILE
echo "  Current directory: $(pwd)" >> $LOG_FILE
echo "  PATH: $PATH" >> $LOG_FILE
echo "  Node.js version: $(node --version 2>/dev/null || echo 'Not found')" >> $LOG_FILE

echo "=== System State Test Completed at $(date) ===" >> $LOG_FILE
echo "" >> $LOG_FILE

# 結果サマリー表示
echo "System State Test completed. Results logged to: $LOG_FILE"
echo ""
echo "Quick Summary:"
echo "  WSL Distribution: $WSL_DISTRO_NAME"
echo "  Cron Status: $(service cron status 2>/dev/null | head -1)"
echo "  Claude Available: $(command -v claude >/dev/null 2>&1 && echo 'Yes' || echo 'No')"
echo "  Internet: $(ping -c 1 8.8.8.8 > /dev/null 2>&1 && echo 'Connected' || echo 'Disconnected')"