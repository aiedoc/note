---
title: "Claude Code Hooks実践編：プロダクション環境での実装とベストプラクティス"
description: "Claude Code Hooksの実践的な実装例を詳しく解説。エラーハンドリング、パフォーマンス最適化、セキュリティ対策、チーム開発での活用方法まで、プロダクション環境で使える実装テクニックを紹介します。"
tags:
  - Claude Code
  - Hooks Implementation
  - Production
  - Best Practices
  - DevOps
  - Error Handling
categories:
  - AI開発・自動化
  - 開発効率化
author: "Yusuke Akiyoshi"
---

# Claude Code Hooks実践編：プロダクション環境での実装とベストプラクティス

## はじめに

[前回の記事](/AI開発・自動化/claude-code-hooks-ai-agent-automation/)でClaude Code Hooksの基本概念と設定方法を解説しました。本記事では、実際のプロダクション環境で安定して動作させるための実装テクニックと、チーム開発での活用方法を詳しく解説します。

## プロダクション対応Hook実装

### 1. エラーハンドリングとリトライ機構

```bash
#!/bin/bash
# production_hook.sh - エラーハンドリング付きHook

set -euo pipefail  # エラー時に即座に終了
IFS=$'\n\t'        # 安全なIFS設定

# ログ設定
LOG_DIR="$HOME/.claude-code/logs"
LOG_FILE="$LOG_DIR/hook_$(date +%Y%m%d_%H%M%S).log"
mkdir -p "$LOG_DIR"

# ログ関数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# エラーハンドラー
error_handler() {
    local line_no=$1
    local error_code=$2
    log "ERROR: Line $line_no exited with code $error_code"
    
    # Slackへの通知（オプション）
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"Hook Error: Line $line_no, Code $error_code\"}" \
            2>/dev/null || true
    fi
    
    exit $error_code
}

trap 'error_handler ${LINENO} $?' ERR

# リトライ機能
retry_with_backoff() {
    local max_attempts=3
    local timeout=1
    local attempt=1
    local exitCode=0
    
    while [ $attempt -le $max_attempts ]; do
        if "$@"; then
            return 0
        else
            exitCode=$?
        fi
        
        log "Attempt $attempt failed. Retrying in $timeout seconds..."
        sleep $timeout
        attempt=$(( attempt + 1 ))
        timeout=$(( timeout * 2 ))
    done
    
    log "Command failed after $max_attempts attempts"
    return $exitCode
}

# メイン処理
main() {
    local tool_name="${1:-unknown}"
    local file_path="${2:-}"
    
    log "Starting hook for tool: $tool_name, file: $file_path"
    
    # ファイルタイプに応じた処理
    case "$file_path" in
        *.py)
            log "Processing Python file"
            retry_with_backoff python -m py_compile "$file_path"
            retry_with_backoff ruff check "$file_path" --fix
            retry_with_backoff mypy "$file_path" --ignore-missing-imports
            ;;
        *.js|*.ts|*.jsx|*.tsx)
            log "Processing JavaScript/TypeScript file"
            retry_with_backoff npx eslint "$file_path" --fix
            retry_with_backoff npx prettier --write "$file_path"
            ;;
        *.md)
            log "Processing Markdown file"
            retry_with_backoff npx markdownlint "$file_path" --fix
            ;;
        *)
            log "No specific handler for file type"
            ;;
    esac
    
    log "Hook completed successfully"
}

# スクリプト実行
main "$@"
```

### 2. パフォーマンス最適化Hook

```json
{
  "hooks": {
    "postToolUse": {
      "write": {
        "command": "~/.claude-code/hooks/optimized_hook.sh {{tool_name}} {{file_path}}"
      }
    }
  }
}
```

```bash
#!/bin/bash
# optimized_hook.sh - パフォーマンス最適化版

# 非同期処理キュー
QUEUE_DIR="$HOME/.claude-code/queue"
mkdir -p "$QUEUE_DIR"

# キューに追加（即座に返す）
queue_task() {
    local task_id=$(date +%s%N)
    local task_file="$QUEUE_DIR/$task_id.task"
    
    cat > "$task_file" << EOF
{
  "tool": "$1",
  "file": "$2",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    
    # バックグラウンドでワーカー起動（既に起動していれば無視）
    if ! pgrep -f "claude_hook_worker" > /dev/null; then
        nohup ~/.claude-code/hooks/worker.sh > /dev/null 2>&1 &
    fi
    
    echo "Task queued: $task_id"
}

# メイン処理（即座に返す）
queue_task "$1" "$2"
exit 0
```

```bash
#!/bin/bash
# worker.sh - バックグラウンドワーカー

QUEUE_DIR="$HOME/.claude-code/queue"
PROCESSING_DIR="$HOME/.claude-code/processing"
mkdir -p "$PROCESSING_DIR"

# 既存のワーカーチェック
if [ -f "$PROCESSING_DIR/worker.pid" ]; then
    old_pid=$(cat "$PROCESSING_DIR/worker.pid")
    if kill -0 "$old_pid" 2>/dev/null; then
        echo "Worker already running (PID: $old_pid)"
        exit 0
    fi
fi

# PIDファイル作成
echo $$ > "$PROCESSING_DIR/worker.pid"

# クリーンアップ処理
cleanup() {
    rm -f "$PROCESSING_DIR/worker.pid"
    exit 0
}
trap cleanup EXIT INT TERM

# タスク処理
process_tasks() {
    while true; do
        # 最も古いタスクを取得
        task_file=$(ls -1t "$QUEUE_DIR"/*.task 2>/dev/null | tail -1)
        
        if [ -z "$task_file" ]; then
            # タスクがない場合は5秒待機
            sleep 5
            continue
        fi
        
        # タスクを処理中ディレクトリに移動
        processing_file="$PROCESSING_DIR/$(basename "$task_file")"
        mv "$task_file" "$processing_file" 2>/dev/null || continue
        
        # タスク実行
        if [ -f "$processing_file" ]; then
            # JSONパース（jqがインストールされている場合）
            if command -v jq &> /dev/null; then
                tool=$(jq -r '.tool' "$processing_file")
                file=$(jq -r '.file' "$processing_file")
                
                # 実際の処理を実行
                ~/.claude-code/hooks/process_file.sh "$tool" "$file"
            fi
            
            # 処理済みタスクを削除
            rm -f "$processing_file"
        fi
    done
}

# ワーカー開始
process_tasks
```

### 3. セキュリティ強化Hook

```bash
#!/bin/bash
# security_hook.sh - セキュリティチェック付きHook

# セキュリティ設定
readonly ALLOWED_DIRS=(
    "$HOME/projects"
    "$HOME/workspace"
    "/tmp/claude-code"
)

readonly FORBIDDEN_PATTERNS=(
    "password"
    "secret"
    "api_key"
    "private_key"
    "credentials"
)

# ディレクトリアクセス検証
validate_path() {
    local file_path="$1"
    local real_path=$(realpath "$file_path" 2>/dev/null)
    
    for allowed_dir in "${ALLOWED_DIRS[@]}"; do
        if [[ "$real_path" == "$allowed_dir"* ]]; then
            return 0
        fi
    done
    
    echo "ERROR: Access denied to path: $file_path" >&2
    exit 1
}

# センシティブ情報チェック
check_sensitive_data() {
    local file_path="$1"
    
    for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
        if grep -i "$pattern" "$file_path" > /dev/null 2>&1; then
            echo "WARNING: Possible sensitive data detected (pattern: $pattern)"
            
            # 確認プロンプト（インタラクティブな場合）
            if [ -t 0 ]; then
                read -p "Continue anyway? (y/N) " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    exit 1
                fi
            fi
        fi
    done
}

# コマンドインジェクション対策
sanitize_input() {
    local input="$1"
    # 危険な文字をエスケープ
    echo "$input" | sed 's/[;&|`$]//g'
}

# メイン処理
main() {
    local tool_name=$(sanitize_input "${1:-}")
    local file_path=$(sanitize_input "${2:-}")
    
    # パス検証
    validate_path "$file_path"
    
    # センシティブデータチェック
    if [[ "$tool_name" == "write" ]] || [[ "$tool_name" == "edit" ]]; then
        check_sensitive_data "$file_path"
    fi
    
    # 実際の処理
    echo "Security checks passed for: $file_path"
}

main "$@"
```

## チーム開発での活用

### 1. 共有Hook設定システム

```bash
#!/bin/bash
# setup_team_hooks.sh - チーム共有Hook設定

TEAM_REPO="https://github.com/your-team/claude-hooks.git"
HOOKS_DIR="$HOME/.claude-code/team-hooks"

# チームHookリポジトリをクローン/更新
setup_team_hooks() {
    if [ -d "$HOOKS_DIR/.git" ]; then
        echo "Updating team hooks..."
        cd "$HOOKS_DIR" && git pull
    else
        echo "Cloning team hooks..."
        git clone "$TEAM_REPO" "$HOOKS_DIR"
    fi
    
    # 実行権限付与
    chmod +x "$HOOKS_DIR"/*.sh
    
    # シンボリックリンク作成
    ln -sf "$HOOKS_DIR/hooks.json" "$HOME/.config/claude-code/hooks.json"
}

# 環境別設定
apply_environment_config() {
    local env="${CLAUDE_ENV:-development}"
    local env_config="$HOOKS_DIR/config/$env.json"
    
    if [ -f "$env_config" ]; then
        echo "Applying $env environment configuration..."
        jq -s '.[0] * .[1]' \
            "$HOOKS_DIR/hooks.json" \
            "$env_config" \
            > "$HOME/.config/claude-code/hooks.json"
    fi
}

# 実行
setup_team_hooks
apply_environment_config

echo "Team hooks setup completed!"
```

### 2. Hook実行ログの集約

```python
#!/usr/bin/env python3
# aggregate_logs.py - Hookログ集約スクリプト

import json
import os
import glob
from datetime import datetime
from collections import defaultdict
import pandas as pd

class HookLogAggregator:
    def __init__(self, log_dir="~/.claude-code/logs"):
        self.log_dir = os.path.expanduser(log_dir)
        
    def parse_logs(self):
        """ログファイルを解析"""
        logs = []
        
        for log_file in glob.glob(f"{self.log_dir}/*.log"):
            with open(log_file, 'r') as f:
                for line in f:
                    if line.strip():
                        logs.append(self.parse_log_line(line, log_file))
        
        return logs
    
    def parse_log_line(self, line, filename):
        """ログ行をパース"""
        # [2025-01-18 12:34:56] Starting hook for tool: write, file: test.py
        parts = line.split(']', 1)
        if len(parts) == 2:
            timestamp_str = parts[0].strip('[')
            message = parts[1].strip()
            
            return {
                'timestamp': datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S'),
                'message': message,
                'filename': os.path.basename(filename),
                'level': self.detect_log_level(message)
            }
        return None
    
    def detect_log_level(self, message):
        """ログレベルを検出"""
        if 'ERROR' in message:
            return 'ERROR'
        elif 'WARNING' in message:
            return 'WARNING'
        elif 'INFO' in message:
            return 'INFO'
        return 'DEBUG'
    
    def generate_report(self):
        """レポート生成"""
        logs = [log for log in self.parse_logs() if log]
        
        if not logs:
            print("No logs found")
            return
        
        df = pd.DataFrame(logs)
        
        # エラー統計
        error_stats = df[df['level'] == 'ERROR'].groupby(
            df['timestamp'].dt.date
        ).size()
        
        # ツール使用統計
        tool_stats = defaultdict(int)
        for message in df['message']:
            if 'tool:' in message:
                tool = message.split('tool:')[1].split(',')[0].strip()
                tool_stats[tool] += 1
        
        # レポート出力
        print("=== Claude Code Hook Usage Report ===")
        print(f"\nTotal log entries: {len(df)}")
        print(f"Date range: {df['timestamp'].min()} - {df['timestamp'].max()}")
        
        print("\n--- Error Statistics ---")
        for date, count in error_stats.items():
            print(f"{date}: {count} errors")
        
        print("\n--- Tool Usage ---")
        for tool, count in sorted(tool_stats.items(), key=lambda x: x[1], reverse=True):
            print(f"{tool}: {count} times")
        
        # 詳細レポートをファイルに保存
        report_file = f"hook_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w') as f:
            json.dump({
                'summary': {
                    'total_entries': len(df),
                    'date_range': {
                        'start': str(df['timestamp'].min()),
                        'end': str(df['timestamp'].max())
                    },
                    'error_count': len(df[df['level'] == 'ERROR']),
                    'warning_count': len(df[df['level'] == 'WARNING'])
                },
                'tool_usage': dict(tool_stats),
                'daily_errors': {str(k): int(v) for k, v in error_stats.items()}
            }, f, indent=2)
        
        print(f"\nDetailed report saved to: {report_file}")

if __name__ == "__main__":
    aggregator = HookLogAggregator()
    aggregator.generate_report()
```

### 3. CI/CD統合

```yaml
# .github/workflows/claude-hooks-test.yml
name: Claude Code Hooks Test

on:
  pull_request:
    paths:
      - '.claude-code/hooks/**'
      - 'hooks.json'

jobs:
  test-hooks:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        npm install -g eslint prettier markdownlint-cli
        pip install ruff mypy
    
    - name: Test Hook Scripts
      run: |
        # Hookスクリプトの構文チェック
        for hook in .claude-code/hooks/*.sh; do
          echo "Testing $hook..."
          bash -n "$hook"
        done
    
    - name: Test Hook Configuration
      run: |
        # hooks.jsonの検証
        python -m json.tool hooks.json > /dev/null
        echo "Hook configuration is valid JSON"
    
    - name: Simulate Hook Execution
      run: |
        # テストファイルでHook実行をシミュレート
        echo "print('test')" > test.py
        .claude-code/hooks/production_hook.sh write test.py || true
        
    - name: Check Hook Logs
      run: |
        if [ -d "$HOME/.claude-code/logs" ]; then
          echo "Hook logs:"
          cat $HOME/.claude-code/logs/*.log || true
        fi
```

## トラブルシューティングガイド

### 問題1: Hookが実行されない

```bash
#!/bin/bash
# debug_hooks.sh - Hook診断スクリプト

echo "=== Claude Code Hooks Diagnostic ==="

# 1. 環境変数チェック
echo -e "\n1. Environment Variables:"
echo "CLAUDE_CODE_HOOKS_ENABLED: ${CLAUDE_CODE_HOOKS_ENABLED:-not set}"
echo "CLAUDE_CODE_HOOKS_CONFIG: ${CLAUDE_CODE_HOOKS_CONFIG:-not set}"

# 2. 設定ファイルチェック
echo -e "\n2. Configuration Files:"
config_file="${CLAUDE_CODE_HOOKS_CONFIG:-$HOME/.config/claude-code/hooks.json}"
if [ -f "$config_file" ]; then
    echo "Config file exists: $config_file"
    echo "Config file valid: $(python -m json.tool "$config_file" > /dev/null 2>&1 && echo "Yes" || echo "No")"
else
    echo "Config file NOT FOUND: $config_file"
fi

# 3. Hookスクリプト実行権限
echo -e "\n3. Hook Scripts Permissions:"
hook_dir="$HOME/.claude-code/hooks"
if [ -d "$hook_dir" ]; then
    for script in "$hook_dir"/*.sh; do
        if [ -f "$script" ]; then
            echo "$(basename "$script"): $([ -x "$script" ] && echo "executable" || echo "NOT executable")"
        fi
    done
else
    echo "Hook directory NOT FOUND: $hook_dir"
fi

# 4. 依存関係チェック
echo -e "\n4. Dependencies:"
commands=("bash" "jq" "curl" "git" "npm" "python3")
for cmd in "${commands[@]}"; do
    echo "$cmd: $(command -v $cmd > /dev/null && echo "installed" || echo "NOT installed")"
done

# 5. テスト実行
echo -e "\n5. Test Hook Execution:"
test_hook="$hook_dir/test_hook.sh"
cat > "$test_hook" << 'EOF'
#!/bin/bash
echo "Test hook executed successfully!"
exit 0
EOF
chmod +x "$test_hook"

if $test_hook > /dev/null 2>&1; then
    echo "Test hook execution: SUCCESS"
else
    echo "Test hook execution: FAILED"
fi

rm -f "$test_hook"
```

### 問題2: パフォーマンスの問題

```bash
# performance_monitor.sh - パフォーマンスモニタリング

#!/bin/bash
METRICS_FILE="$HOME/.claude-code/metrics.log"

# Hook実行時間を計測
measure_hook_performance() {
    local hook_name="$1"
    local start_time=$(date +%s.%N)
    
    # Hook実行
    shift
    "$@"
    local exit_code=$?
    
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc)
    
    # メトリクス記録
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ),${hook_name},${duration},${exit_code}" >> "$METRICS_FILE"
    
    # 遅い実行を警告
    if (( $(echo "$duration > 5" | bc -l) )); then
        echo "WARNING: Hook '$hook_name' took ${duration}s to execute"
    fi
    
    return $exit_code
}

# 使用例
measure_hook_performance "code_quality_check" ~/.claude-code/hooks/lint.sh "$@"
```

## まとめ

Claude Code Hooksをプロダクション環境で活用するには、エラーハンドリング、パフォーマンス最適化、セキュリティ対策が不可欠です。本記事で紹介した実装パターンを参考に、チームの要求に合わせてカスタマイズしてください。

### 実装チェックリスト

- [ ] エラーハンドリングとログ記録の実装
- [ ] 非同期処理によるパフォーマンス最適化
- [ ] セキュリティチェックの導入
- [ ] チーム共有設定の構築
- [ ] CI/CDパイプラインへの統合
- [ ] モニタリングとアラートの設定

次回は、Claude Code Hooksを使った高度なワークフロー自動化について解説します。

## 関連記事

- [Claude Code Hooks完全ガイド：AIエージェント自動化の新時代](/AI開発・自動化/claude-code-hooks-ai-agent-automation/)
- [Claude Code公式ドキュメント](https://docs.anthropic.com/claude-code)
- [プロダクションレディなHook実装例](https://github.com/anthropics/claude-code-production-hooks)

---

*この記事は2025年1月18日に公開されました。実装例は継続的に更新されています。*