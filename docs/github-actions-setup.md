# GitHub Actions + Claude Code セットアップガイド

## 🚀 事前準備

### 1. OAuth トークンの生成
ローカル環境で以下を実行:
```bash
claude setup-token
```
生成されたトークンをコピーして保存

### 2. GitHub Secrets の設定
1. GitHubリポジトリの `Settings` → `Secrets and variables` → `Actions`
2. `New repository secret` をクリック
3. 以下のシークレットを追加:
   - **Name**: `CLAUDE_CODE_OAUTH_TOKEN`
   - **Value**: 手順1で生成したトークン

## 🧪 テスト実行手順

### 手動トリガーテスト
1. GitHubリポジトリの `Actions` タブを開く
2. `Claude Code Test` ワークフローを選択
3. `Run workflow` をクリックして手動実行

### 自動実行テスト（30分毎）
- ワークフローは30分毎に自動実行されます
- テスト期間後は `schedule` 部分をコメントアウト推奨

## 📁 作成されたファイル

- `.github/workflows/claude-test.yml` - GitHub Actionsワークフロー
- `test-prompts/simple-test.md` - テスト用プロンプト
- `test-results/` - Claude Codeの実行結果（自動生成）

## 🔍 確認ポイント

1. **認証成功**: Claude Codeが正常にインストールされる
2. **実行成功**: プロンプトが正常に処理される  
3. **ファイル生成**: テスト結果ファイルが作成される
4. **コミット**: 変更が自動的にコミットされる

## ⚠️ 注意事項

- Maxプランの使用量制限内で実行
- テスト後は不要なスケジュール実行を停止
- 生成されるファイルは適宜整理

## 🔄 本格運用への移行

テストが成功したら:
1. 既存のcronスクリプトをGitHub Actionsに移行
2. スケジュール時間を実際の投稿時間に変更
3. プロンプトを記事生成用に更新