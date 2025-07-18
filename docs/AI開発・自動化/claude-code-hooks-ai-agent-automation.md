---
title: "Claude Code Hooks実践：AIエージェント自動化編"
description: "Claude Code Hooksを使った自動記事投稿システムの構築方法を解説。GSC連携、自動化パターン、AIエージェント開発の実践的テクニックを紹介します。"
tags:
  - Claude Code
  - AI Agent
  - Automation
  - Hooks
  - DevOps
  - CI/CD
categories:
  - AI開発・自動化
  - 開発効率化
author: "Yusuke Akiyoshi"
---

# Claude Code Hooks実践：AIエージェント自動化編

## はじめに

2025年7月にリリースされたClaude Code Hooksは、AIコード生成と決定論的な自動化を融合させる画期的な機能です。本記事では、実際のプロジェクトで即座に活用できるHooks実装パターンと、AIエージェント開発の最新テクニックを詳しく解説します。

## Claude Code Hooksとは

Claude Code Hooksは、AIツール実行の特定のライフサイクルポイントで自動的にシェルコマンドを実行する仕組みです。これにより、AIの柔軟性と自動化の確実性を両立できます。

### 4つのHookタイプ

1. **PreToolUse Hook**: ツール実行前に起動
2. **PostToolUse Hook**: ツール実行後に起動
3. **Notification Hook**: 特定イベント発生時に起動
4. **Stop Hook**: セッション終了時に起動

## 実装ガイド：基本設定

### 1. 設定ファイルの作成

Claude Code Hooksは以下の設定ファイルで構成します（**重要**：環境変数は不要）：

- `~/.claude/settings.json` (ユーザー設定)
- `.claude/settings.json` (プロジェクト設定)
- `.claude/settings.local.json` (ローカルプロジェクト設定)

```json
// ~/.claude/settings.json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "git add -A && git commit -m 'Auto-save: Claude Code session' && git push origin main"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'File written: $(date)' >> ~/.claude/hooks.log"
          }
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint-staged"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Command execution started' >> ~/.claude/audit.log"
          }
        ]
      }
    ]
  }
}
```

### 2. 設定の検証

```bash
# 設定ファイルの確認
cat ~/.claude/settings.json

# Hooksが有効かテスト
claude --dangerously-skip-permissions "テストファイルを作成してください"
cat ~/.claude/hooks.log  # PostToolUse Hookのログを確認
```

## 実践的な使用例

### 例1: 自動コード品質チェック

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "file_path=$(echo '$1' | jq -r '.file_path'); if [[ $file_path == *.py ]]; then ruff check $file_path && mypy $file_path; elif [[ $file_path == *.js ]] || [[ $file_path == *.ts ]]; then eslint $file_path --fix && prettier --write $file_path; fi"
          }
        ]
      }
    ]
  }
}
```

### 例2: セキュリティスキャン自動化

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "bash",
        "hooks": [
          {
            "type": "command",
            "command": "cmd=$(echo '$1' | jq -r '.command'); if echo \"$cmd\" | grep -E '(rm -rf|sudo|chmod 777)'; then echo 'BLOCKED: Dangerous command detected' >&2; exit 1; fi"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "file_path=$(echo '$1' | jq -r '.file_path'); gitleaks detect --source=$file_path --no-git"
          }
        ]
      }
    ]
  }
}
```

### 例3: 自動テスト実行とCI/CD連携

```json
{
  "hooks": {
    "postToolUse": {
      "edit": {
        "command": "#!/bin/bash\nfile={{file_path}}\nif [[ $file == *test* ]] || [[ $file == *spec* ]]; then\n  npm test -- $file\nelse\n  # Find and run related tests\n  test_file=$(echo $file | sed 's/\\.js$/.test.js/')\n  if [ -f \"$test_file\" ]; then\n    npm test -- $test_file\n  fi\nfi"
      }
    },
    "notification": {
      "test_failure": {
        "command": "curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL -d '{\"text\":\"Test failed: {{test_name}}\"}'"
      }
    }
  }
}
```

## 高度な活用パターン

### 1. AIエージェントチェーン構築

```python
# agent_chain.py
import subprocess
import json
from typing import Dict, Any

class ClaudeCodeAgentChain:
    def __init__(self, hooks_config: Dict[str, Any]):
        self.hooks = hooks_config
        
    def execute_with_hooks(self, tool: str, params: Dict[str, Any]):
        # Pre-hook実行
        if pre_hook := self.hooks.get('preToolUse', {}).get(tool):
            subprocess.run(pre_hook['command'], shell=True, check=True)
        
        # ツール実行（ここではClaude Code APIを呼び出す想定）
        result = self.execute_tool(tool, params)
        
        # Post-hook実行
        if post_hook := self.hooks.get('postToolUse', {}).get(tool):
            subprocess.run(
                post_hook['command'].format(**params), 
                shell=True, 
                check=True
            )
        
        return result
    
    def execute_tool(self, tool: str, params: Dict[str, Any]):
        # 実際のツール実行ロジック
        pass
```

### 2. 監査ログとコンプライアンス

```bash
#!/bin/bash
# audit_logger.sh

log_file="$HOME/.claude-code/audit/$(date +%Y-%m-%d).log"
mkdir -p "$(dirname "$log_file")"

echo "[$(date +%Y-%m-%d\ %H:%M:%S)] Tool: $1, User: $USER, Action: $2" >> "$log_file"

# コンプライアンスチェック
if [[ "$2" == *"sensitive"* ]] || [[ "$2" == *"production"* ]]; then
    echo "COMPLIANCE WARNING: Sensitive operation detected" >> "$log_file"
    # 管理者への通知
    mail -s "Claude Code Compliance Alert" admin@company.com < "$log_file"
fi
```

### 3. 自動ドキュメント生成

```json
{
  "hooks": {
    "postToolUse": {
      "write": {
        "command": "#!/bin/bash\nif [[ {{file_path}} == *.py ]]; then\n  # Pythonドキュメント生成\n  sphinx-apidoc -f -o docs/source .\n  cd docs && make html\nelif [[ {{file_path}} == *.js ]] || [[ {{file_path}} == *.ts ]]; then\n  # TypeScript/JavaScriptドキュメント生成\n  typedoc --out docs {{file_path}}\nfi"
      }
    }
  }
}
```

## パフォーマンス最適化のヒント

### 1. 非同期Hook実行

```bash
# async_hook.sh
#!/bin/bash
{
    # 重い処理を非同期で実行
    npm run heavy-task &
    echo "Task started with PID: $!"
} &>/dev/null &
```

### 2. 条件付きHook実行

```json
{
  "hooks": {
    "postToolUse": {
      "write": {
        "command": "#!/bin/bash\n# ファイルサイズチェック\nif [ $(stat -c%s {{file_path}}) -gt 10000 ]; then\n  echo 'Large file detected, skipping hooks'\n  exit 0\nfi\n# 通常の処理\nnpm run process-file {{file_path}}"
      }
    }
  }
}
```

## トラブルシューティング

### よくある問題と解決策

1. **Hook実行タイムアウト**
   ```bash
   # タイムアウト設定
   timeout 30s your-command || echo "Command timed out"
   ```

2. **権限エラー**
   ```bash
   chmod +x ~/.config/claude-code/hooks/*.sh
   ```

3. **環境変数の問題**
   ```bash
   # Hook内で環境変数を明示的に読み込む
   source ~/.bashrc
   ```

## まとめ

Claude Code Hooksは、AIアシスタントの柔軟性と自動化の確実性を組み合わせる強力な機能です。適切に実装することで、開発効率を大幅に向上させながら、品質とセキュリティを維持できます。

### 次のステップ

1. 基本的なHook設定から始める
2. プロジェクトに合わせてカスタマイズ
3. チーム全体で共有できるHookライブラリを構築
4. CI/CDパイプラインとの統合を進める

AIエージェント開発の新時代において、Claude Code Hooksは必須のツールとなるでしょう。ぜひ実際のプロジェクトで活用してみてください。

## 関連リソース

- [Claude Code公式ドキュメント](https://docs.anthropic.com/claude-code)
- [Hooks設定例集](https://github.com/anthropics/claude-code-hooks-examples)
- [AIエージェント開発ベストプラクティス](/ai-agent-best-practices)

---

*この記事は2025年1月18日に公開されました。最新情報は公式ドキュメントをご確認ください。*