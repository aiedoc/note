# GitHub Copilot applyToパターンで実現する条件分岐型インストラクション管理

![Badge](https://img.shields.io/badge/GitHub-Copilot-blue.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-filter: **条件分岐型インストラクション**
    
    ファイル拡張子や命名パターンに応じた自動的なルール適用

-   :material-speedometer: **コンテキスト効率化**
    
    関連性の高い情報のみを64kトークン制限内で集中投入

-   :material-file-multiple: **複数技術スタック対応**
    
    React/Python/YAML等の混在環境での最適化された開発支援

-   :material-account-group: **チーム作業標準化**
    
    議事録・PR・仕様書作成時の自動的な命名規則とフォーマット適用

</div>

## 📖 applyToパターンとは

GitHub Copilot の `applyTo` パターンは、カスタムインストラクションファイルにおいて**特定の条件に合致するファイルにのみインストラクションを適用**する機能です。

従来のカスタムインストラクションが全ファイルに適用されるのに対し、`applyTo` を使用することで：

- **ファイル拡張子別**の専用ルール適用
- **命名パターン別**の自動フォーマット適用
- **コンテキスト使用量の最適化**

が可能になります。

## ⚙️ 前提条件：settings.json設定

!!! warning "重要：設定なしでは動作しません"
    `applyTo` パターンを活用するには、VS Codeの `settings.json` で複数インストラクションファイルの読み込みを**有効化する必要があります**。

### 必須設定

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions/**/*.instructions.md": true
  }
}
```

### チーム全体での設定共有

**.vscode/settings.json** にプロジェクト設定として追加することで、チーム全体で統一できます：

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions/**/*.instructions.md": true,
    "docs/instructions/**/*.instructions.md": true
  }
}
```

## 🏗️ 基本的なファイル構成

```
project-root/
├── .github/
│   ├── copilot-instructions.md         # 基本ルール（確実読み込み）
│   └── instructions/
│       ├── frontend.instructions.md    # React/TypeScript用
│       ├── backend.instructions.md     # Python/API用
│       ├── meeting.instructions.md     # 議事録用
│       └── docs.instructions.md        # ドキュメント用
├── .vscode/
│   └── settings.json                   # プロジェクト設定
└── docs/
    └── instructions/
        └── style.instructions.md       # スタイルガイド用
```

## 🔧 実践的な実装例

### 1. 技術スタック別インストラクション

#### フロントエンド用（React/TypeScript）

```markdown
---
description: "React/TypeScript専用のコーディング規則"
applyTo: "**/*.tsx,**/*.ts"
---

# React/TypeScript開発ガイドライン

## 基本ルール
- React Hooksの依存配列を必ず適切に設定
- TypeScriptは strict モードで使用
- コンポーネント名はPascalCase
- カスタムHooksは "use" プレフィックス必須

## インポート順序
1. React関連
2. 外部ライブラリ
3. 内部コンポーネント
4. 型定義
5. スタイル

## 命名規則
- コンポーネントファイル: `ComponentName.tsx`
- カスタムHooks: `useFeatureName.ts`
- 型定義: `types/FeatureName.ts`
```

#### バックエンド用（Python/FastAPI）

```markdown
---
description: "Python/FastAPI専用のコーディング規則"
applyTo: "**/*.py"
---

# Python/FastAPI開発ガイドライン

## 基本ルール
- Type hints必須
- Black フォーマッター使用
- docstringはGoogle形式
- 例外処理は必ず実装

## ファイル構成
- APIエンドポイント: `routers/feature_name.py`
- データモデル: `models/feature_name.py`
- ビジネスロジック: `services/feature_name.py`
- ユーティリティ: `utils/feature_name.py`

## 命名規則
- 関数名: snake_case
- クラス名: PascalCase
- 定数: UPPER_SNAKE_CASE
- プライベート関数: _private_function
```

### 2. 作業用途別インストラクション

#### 議事録作成用

```markdown
---
description: "会議議事録作成時の自動フォーマット"
applyTo: "meeting-*.md,**/meetings/*.md"
---

# 会議議事録作成ガイドライン

## ファイル命名規則
- 形式: `meeting-YYYY-MM-DD-[会議名].md`
- 例: `meeting-2024-01-15-sprint-planning.md`

## 必須構成
1. **会議情報**
   - 日時：
   - 参加者：
   - 会議種別：

2. **議題**
   - 各議題に番号を付与
   - 議論内容を簡潔に記録

3. **決定事項**
   - 何が決定されたか明確に記載
   - 影響範囲を含める

4. **アクションアイテム**
   - [ ] タスク内容（担当者：@username、期限：YYYY-MM-DD）

## 注意点
- 参加者にはGitHubユーザー名を使用
- 期限は必ず設定
- 未解決事項は次回議題に追加
```

#### プルリクエスト作成用

```markdown
---
description: "PR作成時の自動テンプレート適用"
applyTo: "pr-*.md,pull_request_template.md"
---

# プルリクエスト作成ガイドライン

## ファイル命名規則
- 形式: `pr-[機能名]-YYYY-MM-DD.md`
- 例: `pr-user-authentication-2024-01-15.md`

## 必須項目
### 📋 変更内容
- [ ] 新機能追加
- [ ] バグ修正
- [ ] リファクタリング
- [ ] ドキュメント更新

### 🔍 テスト
- [ ] 単体テスト追加/更新
- [ ] 結合テスト実施
- [ ] 手動テスト実施
- [ ] エラーケースのテスト

### 📝 チェックリスト
- [ ] コードレビュー依頼
- [ ] CI/CDパイプライン通過
- [ ] ドキュメント更新
- [ ] 既存機能への影響確認

## ブランチ命名規則
- feature/機能名
- bugfix/バグ修正内容
- hotfix/緊急修正内容
```

### 3. ドキュメント種別別インストラクション

#### 技術仕様書用

```markdown
---
description: "技術仕様書作成時の構成とフォーマット"
applyTo: "**/*-spec.md,**/specs/*.md"
---

# 技術仕様書作成ガイドライン

## ファイル命名規則
- 形式: `[機能名]-spec.md`
- 例: `user-authentication-spec.md`

## 必須構成
1. **概要**
   - 機能の目的と背景
   - 想定ユーザー
   - 成功基準

2. **技術仕様**
   - アーキテクチャ図
   - データベース設計
   - API仕様

3. **実装方針**
   - 使用技術
   - 設計パターン
   - セキュリティ考慮事項

4. **テスト仕様**
   - 単体テスト範囲
   - 結合テスト範囲
   - 性能要件

## 図表の扱い
- Mermaidを使用してフロー図を作成
- PlantUMLでシーケンス図を作成
- 画像は `assets/images/` に配置
```

## 💡 デフォルト読み込みとの組み合わせ戦略

### 基本構成の設計思想

```markdown
# .github/copilot-instructions.md（基本ルール - 確実読み込み）

## 全体共通ルール
- エラーハンドリング必須
- ログ出力の統一
- セキュリティ原則の遵守

## ファイル作成時の命名規則
- 議事録: `meeting-YYYY-MM-DD-[会議名].md`
- PR: `pr-[機能名]-YYYY-MM-DD.md`
- 仕様書: `[機能名]-spec.md`
- テスト: `[対象].test.[拡張子]`

## 技術スタック別の詳細ルール
フロントエンド: [.github/instructions/frontend.instructions.md]
バックエンド: [.github/instructions/backend.instructions.md]
インフラ: [.github/instructions/infrastructure.instructions.md]
```

この設計により：
- **基本ルール**：デフォルトファイルで確実に読み込み
- **詳細ルール**：applyToで条件に応じて自動適用
- **読み込み確実性**：重要な情報は必ず伝わる

## 🚀 コンテキスト効率化のメリット

### 1. トークン使用量の最適化

```
従来の方式：
- 全インストラクション読み込み: 15,000トークン
- 実際に関連する情報: 3,000トークン
- 効率: 20%

applyTo方式：
- 該当インストラクションのみ読み込み: 4,000トークン
- 実際に関連する情報: 3,500トークン
- 効率: 87.5%
```

### 2. 応答精度の向上

条件分岐により**関連性の高い情報のみ**がCopilotのコンテキストに含まれるため：

- 不要な情報によるノイズ削減
- 特定技術スタックに特化した提案
- より具体的で実用的なコード生成

### 3. 認知負荷の軽減

開発者は作業中のファイルに応じて：
- 自動的に適切なルールが適用される
- 「今何のルールを守るべきか」を意識する必要がない
- 開発フローの中断が最小化される

## ⚠️ 運用時の注意点

### 1. よくある設定ミス

```json
// ❌ 拡張子なし
"chat.instructionsFilesLocations": {
    ".github/instructions/**/*.md": true
}

// ✅ 正しい拡張子
"chat.instructionsFilesLocations": {
    ".github/instructions/**/*.instructions.md": true
}
```

### 2. applyToパターンの記述ミス

```markdown
# ❌ 間違った記述
applyTo: "*.tsx"

# ✅ 正しい記述
applyTo: "**/*.tsx"
```

### 3. 過度な分割による管理複雑化

```
❌ 避けるべき構成:
├── instructions/
│   ├── react-hooks.instructions.md
│   ├── react-context.instructions.md
│   ├── react-components.instructions.md
│   └── react-routing.instructions.md

✅ 推奨構成:
├── instructions/
│   ├── frontend.instructions.md
│   ├── backend.instructions.md
│   └── docs.instructions.md
```

## 🔍 効果測定の方法

### 1. 参照確認

Copilot Chatの応答に表示される「References」で：
- 適切なインストラクションファイルが参照されているか
- 不要なファイルが読み込まれていないか

### 2. 応答品質の評価

定期的に以下を確認：
- 期待通りのコード生成が行われているか
- 技術スタック固有の提案が含まれているか
- 命名規則が正しく適用されているか

### 3. チームフィードバック

開発者からの使用感調査：
- 開発効率の向上実感
- 提案内容の適切さ
- 設定の使いやすさ

## 🎯 まとめ

`applyTo` パターンは、GitHub Copilotカスタムインストラクションの**効率化と精度向上**を実現する強力な機能です。

### 重要なポイント

1. **settings.json設定が前提条件**
2. **デフォルト読み込みとの組み合わせ**で確実性を担保
3. **コンテキスト効率化**による64kトークン制限の有効活用
4. **技術スタック混在環境**での最適化された開発支援

適切に設計・運用することで、従来のカスタムインストラクションでは実現できなかった**条件分岐型の知識管理**が可能になり、チーム開発の効率化と品質向上を同時に実現できます。

## 🔗 関連記事

- [GitHub Copilotカスタムインストラクション完全ガイド](./github-copilot-custom-instructions-guide.md) - 基本的な設定方法
- [Claude Code Tips集](../Tips/claude-code-tips.md) - AI支援開発の実践テクニック
- [開発効率化Tips集](../Tips/development-efficiency-tips.md) - 一般的な開発効率化手法

---