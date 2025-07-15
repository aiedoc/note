# Claude Codeのコマンド自動実行許可ガイド

![Badge](https://img.shields.io/badge/AI-Claude_Code-blue.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-speedometer: **作業効率の向上**
    
    確認プロンプトの省略により、タスクの実行速度が大幅に向上

-   :material-robot: **自動化の促進**
    
    バッチ処理やCI/CDパイプラインでの完全自動実行が可能

-   :material-shield-check: **柔軟な権限管理**
    
    特定のコマンドやツールに対して細かい権限設定が可能

-   :material-docker: **安全な実行環境**
    
    コンテナ環境での隔離実行により、リスクを最小化

</div>

## 📖 概要

Claude Codeでは、デフォルトでファイル編集やコマンド実行時に確認プロンプトが表示されます。本記事では、**作業効率を向上させるための自動承認設定**に特化して、具体的な設定方法と実践的な活用法を解説します。

!!! info "記事の位置づけ"
    - **本記事**: 自動承認の具体的な設定方法と実用テクニック
    - **[権限管理概要](./claude-code-permission-overview.md)**: 権限システム全体の理論と戦略
    - **[制御ベストプラクティス](./claude-code-control-best-practices.md)**: CLAUDE.mdによる包括的な制御手法

## 🔧 自動実行許可の設定方法

### 方法1: インタラクティブモードでの切り替え（Shift+Tab）

Claude Codeのインタラクティブモードでは、**Shift+Tab**キーを押すことで動作モードを切り替えられます。

#### 利用可能なモード

1. **normal-mode**: 標準モード（すべての操作で確認プロンプトが表示）
2. **auto-accept edit on**: 自動承認モード（すべての操作を自動的に許可）
3. **plan mode on**: 計画モード（読み取り専用で計画立案のみ）

#### 切り替え方法

```text
Shift+Tab を繰り返し押すことで、以下の順序でモードが切り替わります：
normal-mode → auto-accept edit on → plan mode on → normal-mode
```

UIには現在のモードが表示され、自動承認モードでは「auto-accept edit on」と表示されます。

### 方法2: コマンドラインフラグ（--dangerously-skip-permissions）

非対話的な実行やスクリプト化された処理では、コマンドラインフラグを使用します。

```bash
claude --dangerously-skip-permissions "タスクの説明"
```

このフラグを使用すると、Claude Codeは完了までのすべての操作を確認なしで実行します。

#### 使用例

```bash
# Lintエラーの自動修正
claude --dangerously-skip-permissions "Fix all ESLint errors in the project"

# ボイラープレートコードの生成
claude --dangerously-skip-permissions "Generate CRUD operations for User model"
```

### 方法3: 設定ファイルでの権限管理

`settings.json`ファイルで、特定のツールやコマンドに対する権限を細かく設定できます。

#### 基本的な設定例

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Edit",
      "MultiEdit"
    ],
    "deny": [
      "WebFetch",
      "Bash(curl:*)",
      "Bash(rm -rf *)"
    ]
  }
}
```

#### 設定の詳細

- **allow**: 自動的に許可するツールやコマンドのパターン
- **deny**: 常に拒否するツールやコマンドのパターン
- ワイルドカード（`*`）を使用したパターンマッチングが可能

### 方法4: /allowed-toolsコマンドの使用

インタラクティブモード中に、`/allowed-tools`コマンドを使用して動的に権限を管理できます。

```text
/allowed-tools add Bash(npm run build)
/allowed-tools remove WebFetch
/allowed-tools list
```

## 🎯 利用シーン別の推奨設定

### 開発環境での効率化

信頼できる開発環境では、頻繁に使用するコマンドを自動許可に設定：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(yarn *)",
      "Edit",
      "MultiEdit",
      "Write"
    ]
  }
}
```

### CI/CDパイプラインでの自動化

完全自動化が必要な環境では、コマンドラインフラグを使用：

```yaml
# GitHub Actions の例
- name: Auto-fix code issues
  run: |
    claude --dangerously-skip-permissions "Fix all linting errors and format code"
```

### セキュアな環境での作業

リスクの高い操作を含む場合は、Dockerコンテナ内で実行：

```bash
# Dockerコンテナ内での実行例
docker run --rm -it \
  -v $(pwd):/workspace \
  --network none \
  claude-code:latest \
  claude --dangerously-skip-permissions "Refactor database schema"
```

## ⚖️ メリットとデメリット

### メリット

1. **作業効率の大幅な向上**
   - 確認待ち時間がゼロになり、タスクが迅速に完了
   - 大量のファイル編集や繰り返し作業で特に効果的

2. **完全な自動化が可能**
   - CI/CDパイプラインへの統合が容易
   - バッチ処理やスケジュールされたタスクの実行

3. **開発フローの改善**
   - 思考の流れを妨げることなく作業を継続
   - コードレビューやリファクタリングの効率化

### デメリット

1. **セキュリティリスクの増大**
   - 誤った操作による破壊的な変更の可能性
   - プロンプトインジェクション攻撃のリスク

2. **デバッグの困難さ**
   - 問題が発生した際の原因特定が難しい
   - 意図しない変更の発見が遅れる可能性

3. **制御の喪失**
   - AIの判断に完全に依存することになる
   - 予期しない動作を事前に防げない

## 🛡️ セキュリティベストプラクティス

### 1. 環境の分離

```bash
# 隔離された環境での実行
docker run --rm -it \
  --network none \
  -v $(pwd):/workspace:ro \
  claude-code:latest
```

### 2. 権限の最小化

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Read"
    ],
    "deny": [
      "Bash(rm *)",
      "Bash(sudo *)",
      "WebFetch"
    ]
  }
}
```

### 3. 監査ログの活用

Hooksを使用して、すべての操作をログに記録：

```json
{
  "hooks": {
    "afterToolUse": "echo '[$(date)] Tool used: {{tool}} {{args}}' >> claude-audit.log"
  }
}
```

## 🎨 実践的な使用例

### Lintエラーの自動修正

```bash
# ESLintとPrettierの自動実行
claude --dangerously-skip-permissions "Run ESLint --fix and Prettier on all JavaScript files"
```

### テストの自動実行と修正

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Edit",
      "Bash(npm run test:watch)"
    ]
  }
}
```

### ドキュメントの自動生成

```bash
# APIドキュメントの自動生成
claude --dangerously-skip-permissions "Generate JSDoc comments for all exported functions"
```

## 🔗 関連記事

- [Claude Codeベストプラクティス](./claude-code-best-practices.md)
- [Claude Code Hooks活用ガイド](./claude-code-hooks-guide.md)
- [Claude Code高度な設定ガイド](./claude-code-advanced-guide.md)

---

