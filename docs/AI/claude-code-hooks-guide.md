# Claude Code Hooks完全ガイド

!!! info "更新情報"
    Claude Code Hooksの基本から応用まで、CLAUDE.mdとの違いや実践的な使い方を詳しく解説します。

## 実現できること

<div class="grid cards" markdown>

-   :material-cog-outline: **自動化**

    ---

    コードフォーマット、テスト実行、リント修正を自動化

-   :material-shield-check: **品質保証**

    ---

    コード品質を自動的にチェック・修正

-   :material-alert-circle: **エラー防止**

    ---

    危険なコマンドや操作を事前にブロック

-   :material-speedometer: **効率化**

    ---

    手動作業を削減し、開発速度を向上

</div>

## Claude Code Hooksとは

Claude Code Hooks（フック）は、Claude Codeの**ライフサイクルの特定時点で自動的にシェルコマンドを実行**する機能です。

### 従来の問題点
- 「フォーマットしてください」と毎回お願いする必要がある
- Claude が忘れることがある
- 手動操作によるミスや見落とし
- チーム間での一貫性の欠如

### Hooksによる解決
- **自動実行**: 指定したタイミングで確実に実行
- **決定論的**: AIの判断に依存しない確実な動作
- **統一性**: チーム全体で同じルールを自動適用

## CLAUDE.mdとの違い

| 比較項目 | Claude Code Hooks | CLAUDE.md |
|----------|-------------------|-----------|
| **目的** | 自動化・強制実行 | 文脈提供・ガイダンス |
| **実行方法** | シェルコマンドの自動実行 | Claudeが解釈・判断 |
| **確実性** | 100%実行される | Claudeが従うかは不確実 |
| **設定方法** | TOML設定ファイル | Markdownドキュメント |
| **用途** | ルールの強制、ワークフロー自動化 | プロジェクト知識、コーディング規約 |

### 使い分けの指針

**Claude Code Hooksを使う場面**
- 必ず実行したい処理がある
- 品質チェックを自動化したい
- 危険な操作をブロックしたい
- CI/CDのような自動化が必要

**CLAUDE.mdを使う場面**
- プロジェクト固有の知識を伝えたい
- コーディングスタイルを共有したい
- チーム規約を文書化したい
- Claudeに判断基準を提供したい

## Hooksの基本設定

### 設定ファイルの場所
`.claude/settings.toml`ファイルでHooksを設定します。

### 基本的な構文
```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

command = "black $CLAUDE_FILE_PATHS"
```

### 利用可能なイベント

1. **PreToolUse**: ツール実行前
2. **PostToolUse**: ツール実行後
3. **Notification**: 通知時
4. **Stop**: 応答生成完了時

### 環境変数

Hooksで利用可能な主な環境変数：

- `$CLAUDE_EVENT_TYPE`: イベントタイプ
- `$CLAUDE_TOOL_NAME`: 使用されたツール名
- `$CLAUDE_FILE_PATHS`: 操作対象ファイルのパス
- `$CLAUDE_TOOL_INPUT`: ツールの入力パラメータ
- `$CLAUDE_TOOL_OUTPUT`: ツールの出力結果（PostToolUseのみ）

## 実践的な設定例

### 1. Pythonコードの自動フォーマット

```toml
# Black によるフォーマット
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "black $CLAUDE_FILE_PATHS"

# Ruff によるリント修正
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "ruff check --fix $CLAUDE_FILE_PATHS"
```

### 2. JavaScript/TypeScriptの品質チェック

```toml
# Prettier によるフォーマット
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.js", "*.ts", "*.jsx", "*.tsx"]
command = "prettier --write $CLAUDE_FILE_PATHS"

# ESLint による修正
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.ts", "src/**/*.tsx"]
command = "eslint --fix $CLAUDE_FILE_PATHS"
```

### 3. 自動テスト実行

```toml
# テストファイル変更時の自動実行
[[hooks]]
event = "PostToolUse"
run_in_background = true
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["**/test_*.py", "**/*_test.py"]
command = "pytest $CLAUDE_FILE_PATHS -v"

# 全体テスト実行
[[hooks]]
event = "PostToolUse"
run_in_background = true
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.py"]
command = "pytest --cov=src --cov-report=term-missing"
```

### 4. 危険なコマンドのブロック

```toml
# 本番環境ファイルの編集防止
[[hooks]]
event = "PreToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["production.env", "prod-config.json"]
command = "echo 'ERROR: 本番環境ファイルの編集は禁止されています' && exit 1"
```

### 5. Git関連の自動化

```toml
# コミット前の品質チェック
[[hooks]]
event = "PreToolUse"
[hooks.matcher]
tool_name = "git_commit"
command = "npm run lint && npm run test"

# コミット後の通知
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "git_commit"
command = "echo 'コミットが完了しました: $CLAUDE_TOOL_INPUT'"
```

## 高度な設定パターン

### 1. 条件分岐を含む複雑な処理

```toml
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py", "*.js", "*.ts"]
command = """
if [[ "$CLAUDE_FILE_PATHS" == *.py ]]; then
    black $CLAUDE_FILE_PATHS && ruff check --fix $CLAUDE_FILE_PATHS
elif [[ "$CLAUDE_FILE_PATHS" == *.js ]] || [[ "$CLAUDE_FILE_PATHS" == *.ts ]]; then
    prettier --write $CLAUDE_FILE_PATHS && eslint --fix $CLAUDE_FILE_PATHS
fi
"""
```

### 2. 外部スクリプトの実行

```toml
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["**/*.py"]
command = "bash ./.claude/scripts/python-quality-check.sh $CLAUDE_FILE_PATHS"
```

### 3. 並列処理による高速化

```toml
# バックグラウンドで複数処理を並列実行
[[hooks]]
event = "PostToolUse"
run_in_background = true
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.py"]
command = "black $CLAUDE_FILE_PATHS & ruff check --fix $CLAUDE_FILE_PATHS & pytest $CLAUDE_FILE_PATHS & wait"
```

## 実用的なユースケース

### 1. Web開発でのフロントエンド自動化

```toml
# スタイル自動修正
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.css", "src/**/*.scss"]
command = "stylelint --fix $CLAUDE_FILE_PATHS"

# コンポーネント変更時の型チェック
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/components/**/*.tsx"]
command = "tsc --noEmit"
```

### 2. データサイエンスプロジェクトでの品質管理

```toml
# Jupyter Notebook の自動クリーンアップ
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.ipynb"]
command = "jupyter nbconvert --ClearOutputPreprocessor.enabled=True --inplace $CLAUDE_FILE_PATHS"

# データファイル変更時の検証
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["data/**/*.csv"]
command = "python scripts/validate_data.py $CLAUDE_FILE_PATHS"
```

### 3. API開発での自動テスト

```toml
# API テストの自動実行
[[hooks]]
event = "PostToolUse"
run_in_background = true
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["api/**/*.py"]
command = "pytest tests/api/ -v --cov=api"

# OpenAPI スキーマの自動生成
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["api/routes/**/*.py"]
command = "python scripts/generate_openapi_schema.py"
```

## ベストプラクティス

### 1. 段階的な導入

```toml
# 最初は警告のみ
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "black --check $CLAUDE_FILE_PATHS || echo 'WARNING: コードをフォーマットすることを推奨します'"

# 慣れてきたら自動修正
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "black $CLAUDE_FILE_PATHS"
```

### 2. エラーハンドリング

```toml
# 失敗しても継続する場合
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "black $CLAUDE_FILE_PATHS || echo 'フォーマットに失敗しましたが、継続します'"

# 失敗時は停止する場合
[[hooks]]
event = "PreToolUse"
[hooks.matcher]
tool_name = "git_commit"
command = "npm run test || (echo 'テストが失敗したため、コミットを停止します' && exit 1)"
```

### 3. パフォーマンスの最適化

```toml
# 大きなファイルは並列処理
[[hooks]]
event = "PostToolUse"
run_in_background = true
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.py"]
command = "find . -name '*.py' -print0 | xargs -0 -P 4 -I {} black {}"
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. Hookが実行されない
```toml
# デバッグ用に実行確認
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "echo 'Hook実行: $CLAUDE_FILE_PATHS' && black $CLAUDE_FILE_PATHS"
```

#### 2. パスが正しく渡されない
```toml
# パスの確認
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "echo 'ファイルパス: $CLAUDE_FILE_PATHS' && ls -la $CLAUDE_FILE_PATHS"
```

#### 3. コマンドが見つからない
```toml
# 環境確認
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "which black && black --version && black $CLAUDE_FILE_PATHS"
```

## セキュリティ上の注意点

### 重要な注意事項

1. **フル権限での実行**: Hooksはユーザーの全権限で実行されます
2. **コマンドの検証**: 実行前にコマンドを必ず検証してください
3. **動的なコマンド構築の回避**: 外部入力からコマンドを構築しないでください
4. **定期的な見直し**: 設定を定期的に見直し、不要なHookは削除してください

### 安全な設定例

```toml
# 良い例: 固定コマンド
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "black $CLAUDE_FILE_PATHS"

# 悪い例: 動的なコマンド構築（セキュリティリスク）
# command = "eval $CLAUDE_TOOL_INPUT"  # 絶対にしないでください
```

## まとめ

Claude Code Hooksは、開発ワークフローの自動化と品質保証を実現する強力な機能です。

### 主な利点

1. **確実性**: 指定した処理が必ず実行される
2. **効率性**: 手動作業を削減し、開発速度を向上
3. **一貫性**: チーム全体で同じ品質基準を自動適用
4. **統合性**: 既存のツールチェーンとシームレスに連携

### 導入戦略

1. **小さく始める**: 簡単なフォーマットから開始
2. **徐々に拡張**: 成功体験を重ねて機能を追加
3. **チームで共有**: 設定をバージョン管理してチーム全体で活用
4. **継続的改善**: 定期的に設定を見直し、最適化

Claude Code HooksとCLAUDE.mdを組み合わせることで、自動化された効率的で高品質な開発環境を構築できます。

## 関連記事

- [Claude Code活用法](claude-code-best-practices.md)
- [Claude Code制御のベストプラクティス](claude-code-control-best-practices.md)
- [AI開発ツール比較](ai-development-tools.md)