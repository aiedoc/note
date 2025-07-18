#!/bin/bash

echo "=== Test Script Started at $(date) ==="

# 環境設定
export PATH="/home/akiyoshi-yusuke/.nvm/versions/node/v18.20.8/bin:$PATH"

# Claude Codeの存在確認
which claude && echo "Claude found"

# シンプルなテスト
echo "Testing Claude Code..."
timeout 30 claude --dangerously-skip-permissions "一言で答えてください: 2+2は？" 2>&1

echo "Exit code: $?"
echo "=== Test Script Completed at $(date) ==="