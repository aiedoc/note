#!/bin/bash

# AI技術フォローアップ記事自動作成スクリプト (昼12時実行)
# 朝の記事を受けた実践・応用記事作成

# スクリプト開始時刻をログに記録
echo "=== AI Tech Followup Noon Script Started at $(date) ===" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log

# エラーハンドリング設定
set -e
trap 'echo "Error occurred at line $LINENO. Exit code: $?" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log' ERR

# 環境設定
export HOME=/home/akiyoshi-yusuke
export PATH="/home/akiyoshi-yusuke/.nvm/versions/node/v18.20.8/bin:$PATH"
export NVM_DIR="/home/akiyoshi-yusuke/.nvm"

# bashrcから環境変数を読み込み（ANTHROPIC_API_KEYなど）
source /home/akiyoshi-yusuke/.bashrc

# Claude認証情報の確認
if [ -f "/home/akiyoshi-yusuke/.claude/.credentials.json" ]; then
    echo "Claude credentials found" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
else
    echo "Warning: Claude credentials not found" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
fi

# Node.js 18は既に環境変数で設定済みなのでNVMの初期化をスキップ
# NVM読み込み（コメントアウト）
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Node.js 18の使用（既にPATHに設定済み）
echo "Using Node.js from PATH: $(which node)" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log

# 作業ディレクトリに移動
cd /home/akiyoshi-yusuke/note

# Gitリポジトリの状態確認
echo "Checking git status..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
git status >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log 2>&1

# 最新のリモートブランチを取得
echo "Pulling latest changes..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
git pull origin master >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log 2>&1

# 今朝のコミット履歴を取得（AUTO-POSTタグ付きのみ）
echo "Getting morning commit history..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
TODAY_TAG="[AUTO-POST-$(date +%Y%m%d)]"
MORNING_COMMITS=$(git log --since="$(date -d 'today 05:00' '+%Y-%m-%d %H:%M')" --until="$(date -d 'today 11:00' '+%Y-%m-%d %H:%M')" --oneline --grep="$TODAY_TAG" | head -1)
echo "Morning commits found:" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
echo "$MORNING_COMMITS" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log

# 進捗ログディレクトリの確認・作成
mkdir -p /home/akiyoshi-yusuke/note/internal/logs

# Claude Codeを実行してフォローアップ記事を作成
echo "Running Claude Code for followup article creation..." >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log

# タイムアウト設定（15分）とエラーハンドリング
timeout 900 claude --dangerously-skip-permissions "【AI技術フォローアップ記事作成 - 昼12時実行】

以下のチェックボックス形式でタスクを管理し、進捗状況を '/home/akiyoshi-yusuke/note/internal/logs/noon-progress-$(date +%Y%m%d).md' に記録してください：

## 作業進捗チェックリスト

### 🔍 前回記事分析フェーズ
- [ ] 朝6時頃の自動投稿記事確認完了
- [ ] [AUTO-POST-$(date +%Y%m%d)]タグ付きコミット特定完了
- [ ] 朝の記事で扱った技術・ツール把握完了
- [ ] 朝の記事の主要トピック整理完了
- [ ] フォローアップ対象の技術要素選定完了

### 💡 実装例・実践方法調査フェーズ
- [ ] 朝の記事技術の具体的実装方法調査完了
- [ ] ベストプラクティス・ノウハウ収集完了
- [ ] サンプルコード・設定例準備完了
- [ ] トラブルシューティング情報収集完了
- [ ] 応用例・カスタマイズ方法調査完了

### ✍️ フォローアップ記事作成フェーズ
- [ ] 記事構成・アウトライン作成完了
- [ ] YAMLフロントマター設定完了
- [ ] 実践的実装手順執筆完了
- [ ] 動作するサンプルコード作成完了
- [ ] Material Design要素（バッジ・グリッドカード・アイコン）適用完了
- [ ] 朝の記事との関連性・導線追加完了

### 🔗 記事連携・公開フェーズ
- [ ] 朝の記事からの相互リンク設定完了
- [ ] シリーズ記事としての位置づけ明記完了
- [ ] CLAUDE.mdルール準拠チェック完了
- [ ] mkdocs.ymlナビゲーション追加完了
- [ ] Gitコミット・プッシュ完了
- [ ] 記事公開確認完了

**実行指示**：
1. git logから今朝の[AUTO-POST-$(date +%Y%m%d)]コミットを確認
2. 各フェーズ完了時にチェックボックスを ✅ に更新
3. 進捗状況を随時ログファイルに記録
4. /home/akiyoshi-yusuke/note/templates/hybrid-article-template.md のフォーマット準拠
5. 朝の記事との連携を重視した実践的内容で記事作成・公開" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log 2>&1

# Claude Codeの終了コードを確認
CLAUDE_EXIT_CODE=$?
if [ $CLAUDE_EXIT_CODE -eq 124 ]; then
    echo "Error: Claude Code execution timed out after 15 minutes" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
elif [ $CLAUDE_EXIT_CODE -ne 0 ]; then
    echo "Error: Claude Code exited with code $CLAUDE_EXIT_CODE" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
else
    echo "Claude Code completed successfully" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
fi

# スクリプト完了時刻をログに記録
echo "=== AI Tech Followup Noon Script Completed at $(date) ===" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log
echo "" >> /home/akiyoshi-yusuke/note/internal/logs/auto-ai-followup-noon.log