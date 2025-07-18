#!/bin/bash

# AI速報記事自動作成スクリプト (夕方18時実行)
# 当日午後の最新AI関連ニュース・トレンド速報

# スクリプト開始時刻をログに記録
echo "=== AI News Evening Script Started at $(date) ===" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log

# エラーハンドリング設定
set -e
trap 'echo "Error occurred at line $LINENO. Exit code: $?" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log' ERR

# 環境設定
export HOME=/home/akiyoshi-yusuke
export PATH="/home/akiyoshi-yusuke/.nvm/versions/node/v18.20.8/bin:$PATH"
export NVM_DIR="/home/akiyoshi-yusuke/.nvm"

# bashrcから環境変数を読み込み（ANTHROPIC_API_KEYなど）
source /home/akiyoshi-yusuke/.bashrc

# Claude認証情報の確認
if [ -f "/home/akiyoshi-yusuke/.claude/.credentials.json" ]; then
    echo "Claude credentials found" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log
else
    echo "Warning: Claude credentials not found" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log
fi

# Node.js 18は既に環境変数で設定済みなのでNVMの初期化をスキップ
# NVM読み込み（コメントアウト）
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Node.js 18の使用（既にPATHに設定済み）
echo "Using Node.js from PATH: $(which node)" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log

# 作業ディレクトリに移動
cd /home/akiyoshi-yusuke/note

# Gitリポジトリの状態確認
echo "Checking git status..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log
git status >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log 2>&1

# 最新のリモートブランチを取得
echo "Pulling latest changes..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log
git pull origin master >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log 2>&1

# 進捗ログディレクトリの確認・作成
mkdir -p /home/akiyoshi-yusuke/note/internal/logs

# Claude Codeを実行してAI速報記事を作成
echo "Running Claude Code for AI news article creation..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log

# タイムアウト設定（15分）とエラーハンドリング
timeout 900 claude --dangerously-skip-permissions "【AI速報記事作成 - 夕方18時実行】

以下のチェックボックス形式でタスクを管理し、進捗状況を '/home/akiyoshi-yusuke/note/internal/logs/evening-progress-$(date +%Y%m%d).md' に記録してください：

## 作業進捗チェックリスト

### 📰 当日速報情報収集フェーズ
- [ ] 本日午後(12時以降)のAI関連重要ニュース収集完了
- [ ] OpenAI、Anthropic等主要企業リリース情報確認完了
- [ ] Google、Microsoft、GitHub等プラットフォーム更新確認完了
- [ ] 新AIライブラリ・フレームワーク・開発ツール発表調査完了
- [ ] AI業界動向・技術トレンド情報整理完了
- [ ] AIエージェント・自動化分野への影響度評価完了

### 🔍 ニュース分析・優先度判定フェーズ
- [ ] 収集ニュースの重要度・影響度分析完了
- [ ] 開発者にとっての実用性評価完了
- [ ] 速報性の高いトピック特定完了
- [ ] 記事化対象ニュースの選定完了
- [ ] 他メディアとの差別化ポイント整理完了

### ✍️ 速報記事作成フェーズ
- [ ] 記事構成・アウトライン作成完了
- [ ] YAMLフロントマター設定完了
- [ ] 要点を押さえた分かりやすい解説執筆完了
- [ ] 開発者向け実践的視点の追加完了
- [ ] Material Design要素（バッジ・グリッドカード・アイコン）適用完了
- [ ] 今後の展開予想・注目ポイント追加完了

### 🚀 記事公開・連携フェーズ
- [ ] 明日以降の深掘り記事予告追加完了
- [ ] 朝・昼記事との独立性確保完了
- [ ] CLAUDE.mdルール準拠チェック完了
- [ ] mkdocs.ymlナビゲーション追加完了
- [ ] Gitコミット・プッシュ完了
- [ ] 記事公開確認完了

**実行指示**：
1. 本日12時以降の最新AI動向に特化した速報記事作成
2. 各フェーズ完了時にチェックボックスを ✅ に更新
3. 進捗状況を随時ログファイルに記録
4. /home/akiyoshi-yusuke/note/templates/hybrid-article-template.md のフォーマット準拠
5. 朝・昼の記事とは独立した当日最新動向特化の内容で作成・公開" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log 2>&1

# Claude Codeの終了コードを確認
CLAUDE_EXIT_CODE=$?
if [ $CLAUDE_EXIT_CODE -eq 124 ]; then
    echo "Error: Claude Code execution timed out after 15 minutes" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log
elif [ $CLAUDE_EXIT_CODE -ne 0 ]; then
    echo "Error: Claude Code exited with code $CLAUDE_EXIT_CODE" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log
else
    echo "Claude Code completed successfully" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log
fi

# スクリプト完了時刻をログに記録
echo "=== AI News Evening Script Completed at $(date) ===" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log
echo "" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-news-evening.log