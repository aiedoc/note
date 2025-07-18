#!/bin/bash

echo "=== Testing Preprocessing Steps ==="

# 1. 環境設定
echo "1. Setting environment..."
export HOME=/home/akiyoshi-yusuke
export PATH="/home/akiyoshi-yusuke/.nvm/versions/node/v18.20.8/bin:$PATH"
export NVM_DIR="/home/akiyoshi-yusuke/.nvm"
export GSC_CREDENTIALS_PATH="/home/akiyoshi-yusuke/note/internal/mcp-gsc/token.json"
echo "   Environment set"

# 2. Bashrc読み込み
echo "2. Loading bashrc..."
source /home/akiyoshi-yusuke/.bashrc
echo "   Bashrc loaded"

# 3. Claude認証確認
echo "3. Checking Claude credentials..."
if [ -f "/home/akiyoshi-yusuke/.claude/.credentials.json" ]; then
    echo "   Claude credentials found"
else
    echo "   Warning: Claude credentials not found"
fi

# 4. Node.js確認
echo "4. Checking Node.js..."
which node && node --version
which claude && claude --version | head -1

# 5. Git操作
echo "5. Git operations..."
cd /home/akiyoshi-yusuke/note
git status | head -5
echo "   Git status checked"

# 6. GSC分析テスト
echo "6. Testing GSC analysis..."
cd /home/akiyoshi-yusuke/note/internal/mcp-gsc
python -c "print('Python test OK')"

echo "=== All preprocessing steps completed ==="