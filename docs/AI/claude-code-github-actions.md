# Claude Code GitHub Actions 自動化 - CI/CD に AI を組み込む

![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-AI%20Powered-blue.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-robot: **@claude コマンド**
    
    Issues や PR コメントで AI アシスタントを起動

-   :material-code-review: **自動コードレビュー**
    
    PR 作成時に品質チェックとレビュー

-   :material-bug: **Issues 自動対応**
    
    バグ報告から修正 PR まで自動化

-   :material-test-tube: **テスト自動生成**
    
    コード変更に応じたテストケース生成

</div>

## 📖 GitHub Actions 統合の概要

Claude Code GitHub Action は、GitHub の Issue や PR コメントから直接 AI アシスタントを呼び出し、コードの実装・修正・レビューを自動化します。

### 基本的な動作フロー

```mermaid
graph LR
    A[Issue/PR Comment] --> B[@claude trigger]
    B --> C[GitHub Action]
    C --> D[Claude Code]
    D --> E[Code Analysis]
    E --> F[Implementation]
    F --> G[PR Creation]
    G --> H[Review & Merge]
```

## 🔧 セットアップ

### 1. GitHub Action の設定

```yaml
# .github/workflows/claude-code.yml
name: Claude Code Assistant

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: write
  pull-requests: write
  issues: write
  actions: read

jobs:
  claude-assistant:
    if: contains(github.event.comment.body, '@claude') || github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Claude Code
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          max_iterations: 3
          permission_mode: 'plan'
        env:
          CLAUDE_CODE_USE_BEDROCK: ${{ secrets.USE_BEDROCK }}
```

### 2. 環境変数の設定

```bash
# GitHub リポジトリの Secrets に設定
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
GITHUB_TOKEN=github_pat_xxxxx  # 自動で設定される
USE_BEDROCK=false  # オプション
```

### 3. CLAUDE.md の作成

```markdown
# CLAUDE.md

## Project Overview
This is a React TypeScript project with Material-UI components.

## Development Guidelines
- Use TypeScript strict mode
- Follow React best practices
- Write unit tests for all components
- Use Material-UI components consistently

## Common Commands
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## Code Style
- Use functional components with hooks
- Implement proper error handling
- Follow accessibility guidelines
- Use meaningful variable names
```

## 🚀 活用パターン

### 1. Issue から実装まで自動化

```markdown
<!-- GitHub Issue -->
## 🐛 Bug Report
ログインボタンをクリックしても反応しない

### 期待される動作
ログインボタンをクリックするとログイン画面に遷移する

### 実際の動作
ボタンをクリックしても何も起こらない

### 環境
- Browser: Chrome 120
- OS: macOS 14

@claude この問題を調査して修正してください
```

**Claude の対応:**
1. 関連するコードファイルを分析
2. 問題の原因を特定
3. 修正コードを実装
4. テストケースを追加
5. PR を作成

### 2. PR の自動レビュー

```yaml
# PR 作成時の自動レビュー
name: Auto Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude Code Review
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          review_mode: true
          focus_areas: |
            - Security vulnerabilities
            - Performance issues
            - Code quality
            - Test coverage
```

### 3. 機能追加の自動化

```markdown
<!-- PR コメント -->
@claude この機能を追加してください：

## 新機能: ダークモード切り替え

### 要件
- ヘッダーにダークモード切り替えボタンを追加
- ユーザーの設定を localStorage に保存
- 全てのコンポーネントでダークモードに対応

### 技術要件
- Material-UI の ThemeProvider を使用
- React Context でテーマ状態を管理
- CSS-in-JS でスタイリング
```

## 🔍 高度な活用例

### 1. 複数環境での自動テスト

```yaml
name: Cross-Platform Testing

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-test-generation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate Tests
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Generate comprehensive tests for the changes in this PR:
            - Unit tests for all new functions
            - Integration tests for API endpoints
            - E2E tests for UI components
            - Edge case testing
        env:
          TEST_FRAMEWORKS: "jest,cypress,playwright"
  
  run-tests:
    needs: claude-test-generation
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [16, 18, 20]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - name: Run Tests
        run: npm test
```

### 2. セキュリティ監査の自動化

```yaml
name: Security Audit

on:
  schedule:
    - cron: '0 2 * * *'  # 毎日午前2時
  pull_request:
    types: [opened, synchronize]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude Security Review
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Perform a comprehensive security audit:
            - Check for common vulnerabilities (XSS, SQL injection, etc.)
            - Review authentication and authorization
            - Analyze dependency security
            - Check for hardcoded secrets
            - Review API security
        env:
          SECURITY_TOOLS: "npm audit,snyk,semgrep"
```

### 3. ドキュメント自動生成

```yaml
name: Documentation Update

on:
  push:
    branches: [main]
    paths: ['src/**/*.ts', 'src/**/*.tsx']

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate Documentation
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Update the documentation based on code changes:
            - Generate API documentation
            - Update README.md
            - Create component documentation
            - Update changelog
        env:
          DOC_FORMATS: "markdown,jsdoc,typedoc"
```

## 🎯 ベストプラクティス

### 1. 効果的なプロンプト設計

```markdown
<!-- 良い例 -->
@claude この機能を実装してください：

## 目的
ユーザーが商品を検索できる機能

## 詳細要件
- 検索バーをヘッダーに追加
- リアルタイム検索（入力時に結果を表示）
- カテゴリでのフィルタリング
- 検索履歴の保存

## 技術仕様
- TypeScript + React
- Material-UI コンポーネント
- Redux Toolkit for state management
- React Query for API calls

## 制約
- モバイルフレンドリー
- アクセシビリティ準拠
- 1秒以内の応答速度
```

### 2. 段階的な実装

```yaml
# 段階的な機能実装
jobs:
  phase-1:
    name: "Phase 1: Basic Implementation"
    runs-on: ubuntu-latest
    steps:
      - name: Implement Core Features
        uses: anthropics/claude-code-action@beta
        with:
          prompt: "Implement basic search functionality"
  
  phase-2:
    name: "Phase 2: Enhanced Features"
    needs: phase-1
    runs-on: ubuntu-latest
    steps:
      - name: Add Advanced Features
        uses: anthropics/claude-code-action@beta
        with:
          prompt: "Add filtering and sorting capabilities"
  
  phase-3:
    name: "Phase 3: Optimization"
    needs: phase-2
    runs-on: ubuntu-latest
    steps:
      - name: Optimize Performance
        uses: anthropics/claude-code-action@beta
        with:
          prompt: "Optimize search performance and UX"
```

### 3. エラーハンドリング

```yaml
jobs:
  claude-with-fallback:
    runs-on: ubuntu-latest
    steps:
      - name: Primary Claude Action
        id: claude-primary
        uses: anthropics/claude-code-action@beta
        continue-on-error: true
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
      
      - name: Fallback Action
        if: steps.claude-primary.outcome == 'failure'
        run: |
          echo "Claude action failed, falling back to manual review"
          gh pr comment ${{ github.event.pull_request.number }} \
            --body "🤖 Claude Code action failed. Manual review required."
```

## 📊 効果測定

### 導入効果の例

| 指標 | 改善結果 |
|------|----------|
| 開発速度 | 3倍高速化 |
| バグ発見率 | 早期発見 80% 向上 |
| コードレビュー時間 | 60% 短縮 |
| テストカバレッジ | 95% 達成 |

### 監視とアラート

```yaml
name: Claude Performance Monitor

on:
  workflow_run:
    workflows: ["Claude Code Assistant"]
    types: [completed]

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Check Performance
        run: |
          if [[ "${{ github.event.workflow_run.conclusion }}" == "failure" ]]; then
            curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
              -H 'Content-type: application/json' \
              --data '{"text":"🚨 Claude Code action failed in ${{ github.repository }}"}'
          fi
```

## 🔗 関連記事

- [Claude Code 応用編完全ガイド](./claude-code-advanced-guide.md)
- [Hooks活用術](./claude-code-hooks-advanced.md)
- [MCP統合戦略](./claude-code-mcp-integration.md)

---

*最終更新: 2025-07-05*