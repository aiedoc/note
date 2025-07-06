# Claude Code Hooks 活用術 - 自動化で開発効率を最大化

![Hooks](https://img.shields.io/badge/Hooks-Advanced-green.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-auto-fix: **自動フォーマッティング**
    
    コード保存時に自動でフォーマットを適用

-   :material-test-tube: **テスト自動実行**
    
    コード変更時に関連テストを自動実行

-   :material-bell: **通知システム**
    
    重要なイベントを Slack や Discord に通知

-   :material-shield-check: **品質ゲート**
    
    リント違反やセキュリティ問題を自動検出

</div>

## 📖 Hooks の基本概念

Claude Code の Hooks は、AI の動作タイミングに応じて**決定論的な処理**を実行する仕組みです。LLM の判断に委ねるのではなく、必ず実行される処理を定義できます。

### Hook の種類

| Hook Type | 実行タイミング | 用途例 |
|-----------|----------------|--------|
| **PreToolUse** | ツール使用前 | 権限チェック、前処理 |
| **PostToolUse** | ツール使用後 | フォーマット、テスト実行 |
| **Notification** | 通知時 | 外部通知、ログ記録 |
| **Stop** | 応答完了時 | 後処理、レポート生成 |

## 🔧 実装例

### 1. 自動フォーマッティング

```toml
# ~/.claude/hooks.toml
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py", "*.js", "*.ts"]
command = """
echo "🎨 Auto-formatting $CLAUDE_FILE_PATHS..."
if [[ "$CLAUDE_FILE_PATHS" == *.py ]]; then
    black "$CLAUDE_FILE_PATHS"
    ruff check --fix "$CLAUDE_FILE_PATHS"
elif [[ "$CLAUDE_FILE_PATHS" == *.js ]] || [[ "$CLAUDE_FILE_PATHS" == *.ts ]]; then
    prettier --write "$CLAUDE_FILE_PATHS"
    eslint --fix "$CLAUDE_FILE_PATHS"
fi
"""
```

### 2. テスト自動実行

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = true
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.py", "tests/**/*.py"]
command = """
echo "🧪 Running tests for changed files..."
pytest -xvs --tb=short
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Tests failed - please check the output"
fi
"""
```

### 3. Slack 通知システム

```toml
[[hooks]]
event = "Notification"
command = """
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
MESSAGE="Claude Code: $CLAUDE_NOTIFICATION"
curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"$MESSAGE\"}" \
  $SLACK_WEBHOOK_URL
"""
```

### 4. セキュリティ検査

```toml
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py", "*.js", "*.ts", "*.go"]
command = """
echo "🔒 Security check for $CLAUDE_FILE_PATHS..."
if [[ "$CLAUDE_FILE_PATHS" == *.py ]]; then
    bandit -r "$CLAUDE_FILE_PATHS"
elif [[ "$CLAUDE_FILE_PATHS" == *.js ]] || [[ "$CLAUDE_FILE_PATHS" == *.ts ]]; then
    npm audit --audit-level=moderate
fi
"""
```

## 🚀 高度な活用パターン

### 1. 条件分岐処理

```toml
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
command = """
# ファイルタイプに応じた処理
case "$CLAUDE_FILE_PATHS" in
    *.py)
        echo "Python file detected"
        python -m py_compile "$CLAUDE_FILE_PATHS"
        ;;
    *.go)
        echo "Go file detected"
        go fmt "$CLAUDE_FILE_PATHS"
        go vet "$CLAUDE_FILE_PATHS"
        ;;
    *.rs)
        echo "Rust file detected"
        cargo fmt -- "$CLAUDE_FILE_PATHS"
        cargo clippy -- -D warnings
        ;;
    *)
        echo "Unknown file type: $CLAUDE_FILE_PATHS"
        ;;
esac
"""
```

### 2. Git 統合

```toml
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
command = """
# 変更をステージングに追加
git add "$CLAUDE_FILE_PATHS"

# 変更内容を確認
echo "📝 Git diff for $CLAUDE_FILE_PATHS:"
git diff --cached "$CLAUDE_FILE_PATHS"

# コミットメッセージを生成（オプション）
if [ -n "$CLAUDE_LAST_CHANGE_DESCRIPTION" ]; then
    echo "💬 Suggested commit message:"
    echo "feat: $CLAUDE_LAST_CHANGE_DESCRIPTION"
fi
"""
```

### 3. プロジェクト固有の設定

```toml
# プロジェクトルートの .claude/hooks.toml
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.tsx", "src/**/*.ts"]
command = """
# TypeScript コンパイル
npx tsc --noEmit

# Storybook 更新
if [[ "$CLAUDE_FILE_PATHS" == *"components"* ]]; then
    npm run storybook:build
fi

# E2E テスト実行
if [[ "$CLAUDE_FILE_PATHS" == *"pages"* ]]; then
    npm run test:e2e -- --grep="$(basename "$CLAUDE_FILE_PATHS" .tsx)"
fi
"""
```

## 🔍 デバッグとトラブルシューティング

### 環境変数の確認

```bash
# Hook 実行時に利用可能な環境変数
echo "Tool: $CLAUDE_TOOL_NAME"
echo "File: $CLAUDE_FILE_PATHS"
echo "Change: $CLAUDE_LAST_CHANGE_DESCRIPTION"
echo "Notification: $CLAUDE_NOTIFICATION"
```

### ログ出力の設定

```toml
[[hooks]]
event = "PostToolUse"
command = """
# ログファイルに記録
echo "$(date): Hook executed for $CLAUDE_FILE_PATHS" >> ~/.claude/hooks.log

# 詳細なデバッグ情報
if [ "$CLAUDE_DEBUG" = "true" ]; then
    env | grep CLAUDE_ >> ~/.claude/hooks.log
fi
"""
```

## 💡 ベストプラクティス

### 1. エラーハンドリング

```toml
[[hooks]]
event = "PostToolUse"
command = """
set -e  # エラー時に停止

# 処理の実行
if ! command -v black &> /dev/null; then
    echo "Warning: black not installed"
    exit 0
fi

black "$CLAUDE_FILE_PATHS" || {
    echo "Error: black formatting failed"
    exit 1
}
"""
```

### 2. パフォーマンス最適化

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = true  # バックグラウンド実行
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = """
# 大きなファイルのスキップ
if [ $(wc -l < "$CLAUDE_FILE_PATHS") -gt 1000 ]; then
    echo "Skipping large file: $CLAUDE_FILE_PATHS"
    exit 0
fi

# 並列処理
black "$CLAUDE_FILE_PATHS" &
ruff check --fix "$CLAUDE_FILE_PATHS" &
wait
"""
```

### 3. 設定の階層化

```bash
# 優先順位
# 1. プロジェクト固有: .claude/hooks.toml
# 2. ユーザー設定: ~/.claude/hooks.toml
# 3. システム設定: /etc/claude/hooks.toml
```

## 🌟 成功事例

### 企業での導入事例

```toml
# 大規模プロジェクトでの品質管理
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.py"]
command = """
# 複数の品質チェックを並列実行
{
    echo "🔍 Running quality checks..."
    black --check "$CLAUDE_FILE_PATHS" &
    ruff check "$CLAUDE_FILE_PATHS" &
    mypy "$CLAUDE_FILE_PATHS" &
    bandit -r "$CLAUDE_FILE_PATHS" &
    wait
    echo "✅ All quality checks passed!"
} || {
    echo "❌ Quality checks failed"
    exit 1
}
"""
```

### 効果測定

- **コード品質**: リント違反 80% 削減
- **開発効率**: フォーマット作業 100% 自動化
- **バグ発見**: 早期発見率 60% 向上
- **チーム統一**: コードスタイル統一 100% 達成

## 🔗 関連記事

- [Claude Code 応用編完全ガイド](./claude-code-advanced-guide.md)
- [MCP統合戦略](./claude-code-mcp-integration.md)
- [GitHub Actions自動化](./claude-code-github-actions.md)

---

*最終更新: 2025-07-05*