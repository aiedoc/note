---
title: "Claude Code Batch API完全ガイド：大量処理とCI/CD自動化の実装方法"
description: "Claude Code Batch APIで大量データ処理を自動化。コマンドライン実行、CI/CD統合、料金最適化まで実装例で解説。"
---

# Claude Code Batch API完全ガイド：大量処理とCI/CD自動化の実装方法

![Batch Processing](https://img.shields.io/badge/Batch%20Processing-Automation-orange.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-lightning-bolt: **高速処理**
    
    対話なしで大量のコード解析と処理

-   :material-script: **CI/CD統合**
    
    パイプラインに組み込んで自動化

-   :material-file-multiple: **一括処理**
    
    複数ファイルの同時処理と変換

-   :material-chart-line: **結果分析**
    
    構造化された出力で後処理が容易

</div>

## 📖 バッチ処理の基本概念

Claude Code のバッチ処理（ヘッドレスモード）は、対話型 UI を使わずにコマンドラインから直接 AI 機能を実行する方法です。CI/CD パイプラインや自動化スクリプトに組み込むことで、大規模な処理を効率的に実行できます。

### 基本的な使用方法

```bash
# 基本的なバッチ実行
claude -p "Find all files containing the variable 'userId'"

# パイプを使ったデータ処理
cat error.log | claude -p "Summarize the key errors in this log file"

# 出力をファイルに保存
claude -p "Review this code for security vulnerabilities" < app.py > security_report.txt
```

## 🚀 活用パターン

### 1. コード解析と品質チェック

```bash
#!/bin/bash
# code_quality_check.sh

echo "🔍 Starting code quality analysis..."

# セキュリティ監査
find src -name "*.py" -exec claude -p "Analyze this file for security vulnerabilities and provide a severity rating" {} \; > security_audit.txt

# コード複雑度分析
for file in src/**/*.py; do
    echo "Analyzing: $file"
    claude -p "Analyze the complexity of this code and suggest improvements" < "$file" >> complexity_report.txt
done

# 依存関係分析
claude -p "Analyze package.json for outdated dependencies and security issues" < package.json > dependency_report.txt

echo "✅ Code quality analysis complete"
```

### 2. 構造化された出力

```bash
# JSON形式での出力
claude -p "Analyze this API and return the result in JSON format" --output-format json < api.py

# ストリーミング出力
claude -p "Process this large dataset incrementally" --output-format stream-json < large_dataset.csv
```

### 3. 大規模リファクタリング

```bash
#!/bin/bash
# mass_refactoring.sh

REFACTOR_RULE="Convert class-based components to functional components with hooks"

find src/components -name "*.tsx" | while read file; do
    echo "Processing: $file"
    
    # バックアップ作成
    cp "$file" "$file.backup"
    
    # リファクタリング実行
    claude -p "$REFACTOR_RULE" < "$file" > "$file.new"
    
    # 結果確認
    if [[ -s "$file.new" ]]; then
        mv "$file.new" "$file"
        echo "✅ Refactored: $file"
    else
        echo "❌ Failed: $file"
        rm "$file.new"
    fi
done
```

## 🔧 CI/CD 統合

### 1. GitHub Actions での活用

```yaml
name: Code Analysis Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-analysis:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Install Claude Code
        run: |
          curl -sSL https://claude.ai/install.sh | sh
          echo "$HOME/.claude/bin" >> $GITHUB_PATH
      
      - name: Security Analysis
        run: |
          echo "🔒 Running security analysis..."
          find . -name "*.py" -exec claude -p "Check for security vulnerabilities" {} \; > security_report.txt
          
      - name: Code Quality Check
        run: |
          echo "📊 Running code quality analysis..."
          claude -p "Analyze overall code quality and provide recommendations" --output-format json > quality_report.json
          
      - name: Generate Summary
        run: |
          echo "📝 Generating summary report..."
          claude -p "Create a summary report from these analysis results" \
            --input-files security_report.txt,quality_report.json \
            --output-format markdown > analysis_summary.md
          
      - name: Upload Reports
        uses: actions/upload-artifact@v4
        with:
          name: analysis-reports
          path: |
            security_report.txt
            quality_report.json
            analysis_summary.md
```

### 2. GitLab CI での活用

```yaml
# .gitlab-ci.yml
stages:
  - analysis
  - report

code_analysis:
  stage: analysis
  image: ubuntu:latest
  before_script:
    - apt-get update && apt-get install -y curl
    - curl -sSL https://claude.ai/install.sh | sh
    - export PATH="$HOME/.claude/bin:$PATH"
  script:
    - echo "Running Claude Code analysis..."
    - claude -p "Analyze this codebase for maintainability issues" --output-format json > maintainability.json
    - claude -p "Check for performance bottlenecks" --output-format json > performance.json
    - claude -p "Review test coverage and suggest improvements" --output-format json > testing.json
  artifacts:
    reports:
      junit: "*.json"
    paths:
      - "*.json"
    expire_in: 1 week

generate_report:
  stage: report
  dependencies:
    - code_analysis
  script:
    - claude -p "Create a comprehensive report from these analysis files" \
        --input-files maintainability.json,performance.json,testing.json \
        --output-format html > final_report.html
  artifacts:
    paths:
      - final_report.html
```

## 📊 高度な活用例

### 1. 多言語対応の自動化

```bash
#!/bin/bash
# i18n_automation.sh

# 翻訳対象ファイルの検出
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "t(" > translatable_files.txt

# 翻訳キーの抽出
while read file; do
    echo "Extracting i18n keys from: $file"
    claude -p "Extract all i18n translation keys from this file and output as JSON" < "$file" >> i18n_keys.json
done < translatable_files.txt

# 翻訳ファイルの生成
for lang in en ja ko zh; do
    echo "Generating translations for: $lang"
    claude -p "Translate these i18n keys to $lang language" < i18n_keys.json > "locales/$lang.json"
done
```

### 2. ドキュメント自動生成

```bash
#!/bin/bash
# doc_generation.sh

# API ドキュメントの生成
find src/api -name "*.py" | while read file; do
    echo "Generating API docs for: $file"
    claude -p "Generate comprehensive API documentation in OpenAPI format" < "$file" > "docs/api/$(basename "$file" .py).yaml"
done

# README の自動更新
claude -p "Update README.md based on recent code changes and new features" \
    --input-files $(find src -name "*.py" | head -10 | tr '\n' ',') \
    --output-format markdown > README_updated.md

# 変更履歴の生成
git log --oneline -10 | claude -p "Generate a user-friendly changelog from these git commits" > CHANGELOG.md
```

### 3. テストケース自動生成

```bash
#!/bin/bash
# test_generation.sh

# 単体テストの生成
find src -name "*.py" -not -path "*/tests/*" | while read file; do
    test_file="tests/test_$(basename "$file")"
    echo "Generating tests for: $file"
    
    claude -p "Generate comprehensive unit tests for this Python file using pytest" < "$file" > "$test_file"
    
    # 生成されたテストの検証
    if python -m py_compile "$test_file"; then
        echo "✅ Valid test file generated: $test_file"
    else
        echo "❌ Invalid test file: $test_file"
        rm "$test_file"
    fi
done

# 統合テストの生成
claude -p "Generate integration tests for the entire application" \
    --input-files $(find src -name "*.py" | grep -E "(main|app|api)" | tr '\n' ',') \
    --output-format python > tests/integration/test_full_app.py
```

## ⚡ パフォーマンス最適化

### 1. 並列処理

```bash
#!/bin/bash
# parallel_processing.sh

# 並列処理の実装
process_file() {
    local file="$1"
    local output_dir="$2"
    
    echo "Processing: $file"
    claude -p "Optimize this code for performance" < "$file" > "$output_dir/$(basename "$file")"
}

# 並列実行
export -f process_file
find src -name "*.py" | parallel -j 4 process_file {} optimized/

echo "✅ Parallel processing completed"
```

### 2. バッチサイズの最適化

```bash
#!/bin/bash
# batch_optimization.sh

# ファイルをバッチに分割
find src -name "*.py" | split -l 10 - batch_

# 各バッチを処理
for batch in batch_*; do
    echo "Processing batch: $batch"
    
    # バッチ内のファイルを結合
    cat $(cat "$batch") > combined_input.txt
    
    # 一括処理
    claude -p "Analyze these Python files and provide optimization suggestions" < combined_input.txt > "results/$(basename "$batch").txt"
    
    # 一時ファイルのクリーンアップ
    rm combined_input.txt
done

# バッチファイルのクリーンアップ
rm batch_*
```

## 🔍 エラーハンドリング

### 1. 堅牢なエラー処理

```bash
#!/bin/bash
# robust_processing.sh

set -euo pipefail  # エラー時に停止

# ログ設定
LOG_FILE="claude_batch.log"
exec 1> >(tee -a "$LOG_FILE")
exec 2> >(tee -a "$LOG_FILE" >&2)

# エラーハンドリング関数
handle_error() {
    local line_number="$1"
    echo "❌ Error occurred at line: $line_number"
    echo "📝 Check log file: $LOG_FILE"
    exit 1
}

trap 'handle_error $LINENO' ERR

# 処理の実行
process_files() {
    local max_retries=3
    local retry_count=0
    
    while [[ $retry_count -lt $max_retries ]]; do
        if claude -p "Process these files" --timeout 300 < input.txt > output.txt; then
            echo "✅ Processing completed successfully"
            return 0
        else
            ((retry_count++))
            echo "⚠️ Attempt $retry_count failed, retrying..."
            sleep 5
        fi
    done
    
    echo "❌ Processing failed after $max_retries attempts"
    return 1
}

# メイン処理
main() {
    echo "🚀 Starting batch processing..."
    
    # 前処理
    if [[ ! -f "input.txt" ]]; then
        echo "❌ Input file not found"
        exit 1
    fi
    
    # 処理実行
    process_files
    
    # 後処理
    if [[ -f "output.txt" && -s "output.txt" ]]; then
        echo "✅ Batch processing completed successfully"
    else
        echo "❌ Output file is empty or missing"
        exit 1
    fi
}

main "$@"
```

## 📈 効果測定と監視

### 1. パフォーマンス監視

```bash
#!/bin/bash
# performance_monitoring.sh

# 処理開始時間
start_time=$(date +%s)

# リソース使用量の監視
monitor_resources() {
    while true; do
        echo "$(date): CPU: $(top -l 1 | grep "CPU usage" | cut -d'%' -f1 | cut -d' ' -f3), Memory: $(free -h | grep Mem | awk '{print $3}')" >> resource_usage.log
        sleep 10
    done
}

# バックグラウンドで監視開始
monitor_resources &
monitor_pid=$!

# メイン処理
claude -p "Large scale code analysis" --input-files $(find src -name "*.py" | tr '\n' ',') > analysis_results.txt

# 監視停止
kill $monitor_pid

# 処理時間の計算
end_time=$(date +%s)
duration=$((end_time - start_time))

echo "📊 Processing completed in ${duration} seconds"
echo "📈 Performance metrics saved to resource_usage.log"
```

### 2. 結果の品質評価

```bash
#!/bin/bash
# quality_assessment.sh

# 出力品質の評価
evaluate_output() {
    local output_file="$1"
    
    # ファイルサイズチェック
    if [[ ! -s "$output_file" ]]; then
        echo "❌ Output file is empty"
        return 1
    fi
    
    # 内容の検証
    if grep -q "error\|failed\|exception" "$output_file"; then
        echo "⚠️ Output contains error indicators"
        return 1
    fi
    
    # 構造化データの検証
    if [[ "$output_file" == *.json ]]; then
        if ! jq empty "$output_file" 2>/dev/null; then
            echo "❌ Invalid JSON format"
            return 1
        fi
    fi
    
    echo "✅ Output quality check passed"
    return 0
}

# 全出力ファイルの評価
for output in results/*.txt results/*.json; do
    echo "Evaluating: $output"
    evaluate_output "$output"
done
```

## 🔗 関連記事

- [Claude Code 応用編完全ガイド](./claude-code-advanced-guide.md)
- [Hooks活用術](./claude-code-hooks-advanced.md)
- [MCP統合戦略](./claude-code-mcp-integration.md)
- [GitHub Actions自動化](./claude-code-github-actions.md)

---

