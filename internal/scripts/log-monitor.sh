#!/bin/bash

# Claude Code自動実行ログ監視・管理スクリプト

LOG_FILE="/home/akiyoshi-yusuke/note/logs/auto-claude-news.log"
MAX_LOG_SIZE_MB=10

# ログファイルサイズチェック・ローテーション
check_and_rotate_log() {
    if [ -f "$LOG_FILE" ]; then
        # ファイルサイズをMBで取得
        SIZE=$(du -m "$LOG_FILE" | cut -f1)
        
        if [ "$SIZE" -gt "$MAX_LOG_SIZE_MB" ]; then
            echo "Log file size ($SIZE MB) exceeds limit ($MAX_LOG_SIZE_MB MB). Rotating..."
            
            # ログファイルのバックアップ
            BACKUP_NAME="${LOG_FILE}.$(date +%Y%m%d_%H%M%S)"
            mv "$LOG_FILE" "$BACKUP_NAME"
            
            # 新しいログファイル作成
            touch "$LOG_FILE"
            echo "Log rotated. Backup created: $BACKUP_NAME"
        fi
    fi
}

# 最新のログエントリ表示
show_latest_log() {
    echo "=== Latest Claude Code Auto News Log ==="
    if [ -f "$LOG_FILE" ]; then
        tail -50 "$LOG_FILE"
    else
        echo "Log file not found: $LOG_FILE"
    fi
}

# エラーログの抽出
show_errors() {
    echo "=== Error Log Entries ==="
    if [ -f "$LOG_FILE" ]; then
        grep -i "error\|failed\|exception" "$LOG_FILE" | tail -20
    else
        echo "Log file not found: $LOG_FILE"
    fi
}

# 実行状況の監視
check_running_status() {
    echo "=== Claude Code Process Status ==="
    CLAUDE_PROCESSES=$(ps aux | grep claude | grep -v grep | wc -l)
    
    if [ "$CLAUDE_PROCESSES" -gt 0 ]; then
        echo "Claude Code is currently running ($CLAUDE_PROCESSES processes)"
        ps aux | grep claude | grep -v grep
    else
        echo "No Claude Code processes found"
    fi
}

# メイン処理
case "$1" in
    "rotate")
        check_and_rotate_log
        ;;
    "log")
        show_latest_log
        ;;
    "errors")
        show_errors
        ;;
    "status")
        check_running_status
        ;;
    "all")
        check_and_rotate_log
        echo ""
        show_latest_log
        echo ""
        show_errors
        echo ""
        check_running_status
        ;;
    *)
        echo "Usage: $0 {rotate|log|errors|status|all}"
        echo "  rotate  - Check and rotate log if too large"
        echo "  log     - Show latest log entries"
        echo "  errors  - Show error entries"
        echo "  status  - Check running Claude Code processes"
        echo "  all     - Show all information"
        ;;
esac