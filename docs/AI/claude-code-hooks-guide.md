# Claude Code Hooks完全ガイド

![Badge](https://img.shields.io/badge/Claude%20Code-Hooks-blue.svg)
![Badge](https://img.shields.io/badge/Status-Latest-green.svg)

## Claude Code Hooksとは？

**一言で言うと**：「Claude Codeの動作に自動的に処理を割り込ませる仕組み」

```
Claude Code実行 → 特定のタイミング → 自動でコマンド実行
```

## 4つのタイミング（Hook）

<div class="grid cards" markdown>

-   :material-play-circle: **PreToolUse Hook**
    
    ツール実行**前**に発動
    例：ファイル編集前にバックアップ

-   :material-check-circle: **PostToolUse Hook**
    
    ツール実行**後**に発動
    例：ファイル保存後に自動lint

-   :material-bell: **Notification Hook**
    
    通知発生時に発動
    例：エラー時にSlack通知

-   :material-stop-circle: **Stop Hook**
    
    Claude Code終了時に発動
    例：作業完了後に自動git push

</div>

## 簡単な設定例

### 1. 設定ファイルを作成
```bash
mkdir -p ~/.claude
nano ~/.claude/settings.json
```

### 2. 基本的な設定を追加
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '作業完了！' >> ~/work.log"
          }
        ]
      }
    ]
  }
}
```

### 3. 動作確認
Claude Codeを実行して終了すると、自動でログが記録されます。

## 活用例

<div class="grid cards" markdown>

-   :material-git: **自動Git操作**
    
    記事作成後に自動でcommit & push

-   :material-code-tags: **コード品質保証**
    
    保存時に自動でlint & format

-   :material-shield: **セキュリティ強化**
    
    危険なコマンドを事前にブロック

-   :material-test-tube: **自動テスト**
    
    コード変更時に関連テスト実行

</div>

## 関連記事で詳しく学ぶ

!!! tip "用途別の詳細ガイド"
    
    ### 🎯 [AIエージェント自動化編](../AI開発・自動化/claude-code-hooks-ai-agent-automation.md)
    - 自動記事投稿システムの構築
    - GSC連携による最適化
    - 実践的な自動化パターン
    
    ### 🛠️ [プロダクション実装編](../AI開発・自動化/claude-code-hooks-practical-implementation.md)
    - エラーハンドリングとリトライ
    - チーム開発での活用
    - 本格運用のベストプラクティス
    
    ### 🔧 [高度な条件付き実行編](./claude-code-hooks-advanced.md)
    - 環境変数を使った条件分岐
    - 特定ファイルパターンでの実行制御
    - 記事作成時のみgit pushする精密制御

## まとめ

Claude Code Hooksを使えば：
- ✅ 手作業を自動化
- ✅ ミスを防止
- ✅ 品質を保証
- ✅ 効率を向上

詳細な実装方法は関連記事をご覧ください。