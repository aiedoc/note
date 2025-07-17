#!/bin/bash
# 週次SEOレポート自動実行スクリプト

# 設定
SCRIPT_DIR="/home/akiyoshi-yusuke/note/seo_automation"
LOG_FILE="/home/akiyoshi-yusuke/note/seo_reports/weekly_report.log"
REPORT_DIR="/home/akiyoshi-yusuke/note/seo_reports"

# ログディレクトリ作成
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$REPORT_DIR"

# 実行開始ログ
echo "$(date '+%Y-%m-%d %H:%M:%S') - 週次SEOレポート生成開始" >> "$LOG_FILE"

# Python環境の設定
cd /home/akiyoshi-yusuke/note

# レポート生成実行
python3 "$SCRIPT_DIR/weekly_seo_report_simple.py" >> "$LOG_FILE" 2>&1

# 実行結果チェック
if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - レポート生成成功" >> "$LOG_FILE"
    
    # 最新レポートが存在する場合、通知（オプション）
    if [ -f "$REPORT_DIR/latest_weekly_report.md" ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - 最新レポート: $REPORT_DIR/latest_weekly_report.md" >> "$LOG_FILE"
    fi
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - レポート生成エラー" >> "$LOG_FILE"
fi

# 古いレポートファイルの削除（30日以上前）
find "$REPORT_DIR" -name "weekly_seo_report_*.md" -mtime +30 -delete 2>/dev/null

echo "$(date '+%Y-%m-%d %H:%M:%S') - 週次SEOレポート処理完了" >> "$LOG_FILE"