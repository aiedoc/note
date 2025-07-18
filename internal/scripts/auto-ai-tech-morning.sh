#!/bin/bash

# AI技術記事自動作成スクリプト (朝6時実行)
# GSC分析 + 最新技術動向の統合記事作成

# スクリプト開始時刻をログに記録
echo "=== AI Tech Morning Script Started at $(date) ===" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log

# エラーハンドリング設定
set -e
trap 'echo "Error occurred at line $LINENO. Exit code: $?" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log' ERR

# 環境設定
export HOME=/home/akiyoshi-yusuke
export PATH="/home/akiyoshi-yusuke/.nvm/versions/node/v18.20.8/bin:$PATH"
export NVM_DIR="/home/akiyoshi-yusuke/.nvm"
export GSC_CREDENTIALS_PATH="/home/akiyoshi-yusuke/note/internal/mcp-gsc/token.json"

# bashrcから環境変数を読み込み（ANTHROPIC_API_KEYなど）
source /home/akiyoshi-yusuke/.bashrc

# Claude認証情報の確認
if [ -f "/home/akiyoshi-yusuke/.claude/.credentials.json" ]; then
    echo "Claude credentials found" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
else
    echo "Warning: Claude credentials not found" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
fi

# Node.js 18は既に環境変数で設定済みなのでNVMの初期化をスキップ
# NVM読み込み（コメントアウト）
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Node.js 18の使用（既にPATHに設定済み）
echo "Using Node.js from PATH: $(which node)" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log

# 作業ディレクトリに移動
cd /home/akiyoshi-yusuke/note

# Gitリポジトリの状態確認
echo "Checking git status..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
git status >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log 2>&1

# 最新のリモートブランチを取得
echo "Pulling latest changes..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
git pull origin master >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log 2>&1

# GSC分析の実行
echo "Running GSC analysis..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
cd /home/akiyoshi-yusuke/note/internal/mcp-gsc
/home/akiyoshi-yusuke/bin/python -c "
from gsc_server import get_gsc_service
from datetime import datetime, timedelta
import json

try:
    service = get_gsc_service()
    
    # 過去7日間と前週のデータ取得
    end_date = datetime.now().date()
    current_start = end_date - timedelta(days=7)
    previous_start = end_date - timedelta(days=14)
    previous_end = end_date - timedelta(days=7)
    
    # 現在の7日間
    current_request = {
        'startDate': current_start.strftime('%Y-%m-%d'),
        'endDate': end_date.strftime('%Y-%m-%d'),
        'dimensions': ['query'],
        'rowLimit': 10
    }
    
    # 前週の7日間
    previous_request = {
        'startDate': previous_start.strftime('%Y-%m-%d'),
        'endDate': previous_end.strftime('%Y-%m-%d'),
        'dimensions': ['query'],
        'rowLimit': 10
    }
    
    current_data = service.searchanalytics().query(
        siteUrl='https://smartscope.blog/', 
        body=current_request
    ).execute()
    
    previous_data = service.searchanalytics().query(
        siteUrl='https://smartscope.blog/', 
        body=previous_request
    ).execute()
    
    # 結果をファイルに保存
    gsc_analysis = {
        'current_period': {
            'start_date': current_start.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d'),
            'data': current_data.get('rows', [])
        },
        'previous_period': {
            'start_date': previous_start.strftime('%Y-%m-%d'),
            'end_date': previous_end.strftime('%Y-%m-%d'),
            'data': previous_data.get('rows', [])
        }
    }
    
    with open('/home/akiyoshi-yusuke/note/internal/logs/gsc-analysis-morning.json', 'w') as f:
        json.dump(gsc_analysis, f, ensure_ascii=False, indent=2)
    
    print('GSC analysis completed successfully')
    
except Exception as e:
    print(f'GSC analysis failed: {str(e)}')
" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log 2>&1

# 進捗ログディレクトリの確認・作成
mkdir -p /home/akiyoshi-yusuke/note/internal/logs

# Claude Codeを実行してAIエージェント開発記事を作成
echo "Running Claude Code for AI tech article creation..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
cd /home/akiyoshi-yusuke/note

# タイムアウト設定（15分）とエラーハンドリング
timeout 900 claude --dangerously-skip-permissions "【AIエージェント開発技術記事作成 - 朝6時実行】

以下のチェックボックス形式でタスクを管理し、進捗状況を '/home/akiyoshi-yusuke/note/internal/logs/morning-progress-$(date +%Y%m%d).md' に記録してください：

## 作業進捗チェックリスト

### 📊 GSC分析フェーズ
- [ ] GSC分析データ読み込み実行
- [ ] 過去7日間 vs 前週パフォーマンス比較分析完了
- [ ] 成長クエリ・注目ページ特定完了
- [ ] 検索トレンド変化要因分析完了
- [ ] GSC分析結果まとめ完了

### 🔍 最新技術動向調査フェーズ  
- [ ] 過去24時間のAI開発重要発表調査完了
- [ ] Claude Code最新アップデート情報収集完了
- [ ] GitHub Copilot/Cursor/Continue等ツール更新確認完了
- [ ] 新ライブラリ・フレームワーク情報収集完了
- [ ] 技術動向分析・要点整理完了

### ✍️ 記事作成フェーズ
- [ ] 記事構成・アウトライン作成完了
- [ ] YAMLフロントマター設定完了
- [ ] 技術詳細・実装手順執筆完了  
- [ ] 実際に動くコード例・チュートリアル作成完了
- [ ] Material Design要素（バッジ・グリッドカード・アイコン）適用完了
- [ ] GSCデータ統合・実践的内容追加完了

### 🚀 公開準備フェーズ
- [ ] CLAUDE.mdルール準拠チェック完了
- [ ] GitHub Actions変数エスケープ確認完了
- [ ] mkdocs.ymlナビゲーション追加完了
- [ ] Gitコミット・プッシュ完了
- [ ] 記事公開確認完了

**実行指示**：
1. /home/akiyoshi-yusuke/note/internal/logs/gsc-analysis-morning.json からGSCデータを読み込み
2. 各フェーズ完了時にチェックボックスを ✅ に更新
3. 進捗状況を随時ログファイルに記録
4. /home/akiyoshi-yusuke/note/templates/hybrid-article-template.md のフォーマット準拠
5. 最終的に記事を作成・公開し、全チェックリスト完了を報告" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log 2>&1

# Claude Codeの終了コードを確認
CLAUDE_EXIT_CODE=$?
if [ $CLAUDE_EXIT_CODE -eq 124 ]; then
    echo "Error: Claude Code execution timed out after 15 minutes" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
elif [ $CLAUDE_EXIT_CODE -ne 0 ]; then
    echo "Error: Claude Code exited with code $CLAUDE_EXIT_CODE" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
else
    echo "Claude Code completed successfully" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
fi

# スクリプト完了時刻をログに記録
echo "=== AI Tech Morning Script Completed at $(date) ===" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log
echo "" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-tech-morning.log