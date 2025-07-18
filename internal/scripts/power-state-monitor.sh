#!/bin/bash

# Windows電源状態・スリープ・ロック監視スクリプト
# cronが実行されるシステム状態の調査

LOG_FILE="/home/akiyoshi-yusuke/note/logs/power-state-monitor.log"

echo "=== Power State Monitor Started at $(date) ===" >> $LOG_FILE

# システム稼働時間記録
echo "System Uptime: $(uptime -p)" >> $LOG_FILE

# WSL稼働状態
echo "WSL Status:" >> $LOG_FILE
echo "  Distribution: $WSL_DISTRO_NAME" >> $LOG_FILE
echo "  Kernel: $(uname -r)" >> $LOG_FILE

# Windows電源管理状態（可能であれば）
if command -v powershell.exe >/dev/null 2>&1; then
    echo "Windows Power Information:" >> $LOG_FILE
    
    # システム稼働状態
    WIN_UPTIME=$(powershell.exe -Command "(Get-Date) - (Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime" 2>/dev/null | head -1)
    echo "  Windows Uptime: $WIN_UPTIME" >> $LOG_FILE
    
    # 電源スキーム
    POWER_SCHEME=$(powershell.exe -Command "Get-WmiObject -Namespace root\\cimv2\\power -Class Win32_PowerPlan | Where-Object {$_.IsActive -eq $true} | Select-Object -ExpandProperty ElementName" 2>/dev/null)
    echo "  Active Power Scheme: $POWER_SCHEME" >> $LOG_FILE
    
    # スリープ設定
    SLEEP_SETTINGS=$(powershell.exe -Command "powercfg /q | Select-String 'Sleep'" 2>/dev/null | head -3)
    echo "  Sleep Settings: $SLEEP_SETTINGS" >> $LOG_FILE
fi

# プロセス・サービス状態
echo "Critical Services Status:" >> $LOG_FILE
echo "  Cron: $(service cron status 2>&1 | head -1)" >> $LOG_FILE
echo "  WSL Processes: $(ps aux | grep -v grep | wc -l) total" >> $LOG_FILE

# ネットワーク接続状態
if ping -c 1 -W 2 8.8.8.8 > /dev/null 2>&1; then
    echo "  Network: Connected" >> $LOG_FILE
else
    echo "  Network: Disconnected" >> $LOG_FILE
fi

# 負荷状況
LOAD=$(uptime | awk -F'load average:' '{print $2}')
echo "  System Load: $LOAD" >> $LOG_FILE

echo "=== Power State Monitor Completed at $(date) ===" >> $LOG_FILE
echo "" >> $LOG_FILE

# 簡単なテスト用cronエントリ提案
echo "Test Cron Entry (every 5 minutes for monitoring):"
echo "*/5 * * * * /home/akiyoshi-yusuke/note/scripts/power-state-monitor.sh"