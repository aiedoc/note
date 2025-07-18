# Claude Code Hooks: 高度な条件付き実行とワークフロー制御

Claude Code Hooksは、Claude Codeの動作を決定論的に制御する強力なシステムです。特定の条件下でのみコマンドを実行する高度な方法を探求し、記事作成時のみgit pushするような精密なワークフロー制御を実現しましょう。

## 概要

Claude Code Hooksは、Claude Codeのライフサイクルの様々な段階で実行されるユーザー定義のシェルコマンドです。以下の6つの主要な介入ポイントを提供します：

1. **UserPromptSubmit** - プロンプト送信時（Claude処理前）
2. **PreToolUse** - ツール実行前
3. **PostToolUse** - ツール実行後
4. **Notification** - 通知発生時
5. **Stop** - Claude応答終了時
6. **SubagentStop** - サブエージェント終了時

## 環境変数を使った条件分岐

### 利用可能な環境変数

Claude Code Hooksは、トリガーされたイベントのコンテキストから環境変数を自動的に設定します：

```bash
# PostToolUseでのみ利用可能
$CLAUDE_TOOL_OUTPUT     # ツールの実行結果

# 全てのHookで利用可能
$CLAUDE_TOOL_NAME       # 実行されたツール名
$CLAUDE_FILE_PATHS      # 関連するファイルパス（スペース区切り）
$CLAUDE_NOTIFICATION    # 通知内容（Notificationイベントのみ）
```

### 実装例: 環境変数を使用した条件分岐

```python
#!/usr/bin/env python3
import os
import sys
import json
import subprocess

def main():
    # 環境変数から情報を取得
    tool_name = os.environ.get('CLAUDE_TOOL_NAME', '')
    file_paths = os.environ.get('CLAUDE_FILE_PATHS', '')
    tool_output = os.environ.get('CLAUDE_TOOL_OUTPUT', '')
    
    # 条件分岐: Writeツールでmarkdownファイルが作成された場合のみ実行
    if tool_name == 'Write' and any(path.endswith('.md') for path in file_paths.split()):
        print("Markdown file created - triggering git operations")
        # git操作を実行
        subprocess.run(['git', 'add', '.'], check=True)
        subprocess.run(['git', 'commit', '-m', 'Auto-commit: New article created'], check=True)
        subprocess.run(['git', 'push'], check=True)
    
    sys.exit(0)

if __name__ == '__main__':
    main()
```

## 特定ツール使用時のみ発動するHook

### Matcher設定による条件実行

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/format_and_commit.py"
          }
        ]
      }
    ]
  }
}
```

### 高度なツール判定例

```python
#!/usr/bin/env python3
import json
import sys
import subprocess
import os

def is_article_creation_tool(tool_name, tool_input):
    """記事作成に関連するツールかどうかを判定"""
    if tool_name == 'Write':
        file_path = tool_input.get('file_path', '')
        # docsディレクトリ内のmarkdownファイルの作成
        return file_path.startswith('docs/') and file_path.endswith('.md')
    
    if tool_name == 'Edit':
        file_path = tool_input.get('file_path', '')
        # mkdocs.ymlの更新（新しいナビゲーション追加）
        return file_path.endswith('mkdocs.yml')
    
    return False

def main():
    try:
        # JSON入力を読み込み
        input_data = json.load(sys.stdin)
        
        tool_name = input_data.get('tool_name', '')
        tool_input = input_data.get('tool_input', {})
        
        # 記事作成関連のツールの場合のみ実行
        if is_article_creation_tool(tool_name, tool_input):
            print("Article creation detected - executing git workflow")
            
            # git操作を実行
            subprocess.run(['git', 'add', '.'], check=True)
            subprocess.run(['git', 'commit', '-m', 'feat: Add new article'], check=True)
            subprocess.run(['git', 'push'], check=True)
            
            print("Article published successfully")
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Hook execution failed: {e}", file=sys.stderr)
        sys.exit(0)

if __name__ == '__main__':
    main()
```

## ファイルパターンに基づく条件実行

### TOML設定での高度なファイルパターン

```toml
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "Write"
file_paths = ["docs/**/*.md", "!docs/drafts/**"]
command = "python3 .claude/hooks/article_publisher.py"
```

### Pythonでの高度なファイルパターン判定

```python
#!/usr/bin/env python3
import fnmatch
import os
import json
import sys
import subprocess
from pathlib import Path

def matches_article_pattern(file_path):
    """記事ファイルのパターンにマッチするかどうかを判定"""
    path = Path(file_path)
    
    # 除外パターン
    exclude_patterns = [
        "docs/drafts/**",
        "docs/templates/**",
        "**/.git/**",
        "**/__pycache__/**"
    ]
    
    # 包含パターン
    include_patterns = [
        "docs/**/*.md",
        "docs/**/*.ja.md"
    ]
    
    # 除外チェック
    for pattern in exclude_patterns:
        if path.match(pattern):
            return False
    
    # 包含チェック
    for pattern in include_patterns:
        if path.match(pattern):
            return True
    
    return False

def main():
    try:
        input_data = json.load(sys.stdin)
        
        tool_name = input_data.get('tool_name', '')
        tool_input = input_data.get('tool_input', {})
        
        if tool_name == 'Write':
            file_path = tool_input.get('file_path', '')
            
            if matches_article_pattern(file_path):
                print(f"Article file pattern matched: {file_path}")
                
                # ファイル内容を検証
                if validate_article_content(file_path):
                    # git操作を実行
                    execute_git_workflow(file_path)
                else:
                    print("Article validation failed - skipping publication")
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(0)

def validate_article_content(file_path):
    """記事内容の妥当性チェック"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 基本的な記事構造チェック
        if not content.strip():
            return False
        
        # フロントマターまたはタイトルの存在チェック
        if not (content.startswith('---') or content.startswith('# ')):
            return False
        
        # 最小文字数チェック
        if len(content) < 100:
            return False
        
        return True
        
    except Exception:
        return False

def execute_git_workflow(file_path):
    """git操作のワークフロー実行"""
    try:
        # ファイルをステージング
        subprocess.run(['git', 'add', file_path], check=True)
        
        # コミット
        article_title = extract_article_title(file_path)
        commit_message = f"feat: Add new article - {article_title}"
        subprocess.run(['git', 'commit', '-m', commit_message], check=True)
        
        # プッシュ
        subprocess.run(['git', 'push'], check=True)
        
        print(f"Successfully published: {file_path}")
        
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}", file=sys.stderr)

def extract_article_title(file_path):
    """記事タイトルを抽出"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # マークダウンタイトルを探す
        lines = content.split('\n')
        for line in lines:
            if line.startswith('# '):
                return line[2:].strip()
        
        # ファイル名をフォールバック
        return Path(file_path).stem
        
    except Exception:
        return "Unknown Article"

if __name__ == '__main__':
    main()
```

## PostToolUse Hookでの精密な制御

### JSON制御フローによる高度な制御

```python
#!/usr/bin/env python3
import json
import sys
import subprocess
import os
from pathlib import Path

def main():
    try:
        input_data = json.load(sys.stdin)
        
        tool_name = input_data.get('tool_name', '')
        tool_input = input_data.get('tool_input', {})
        tool_response = input_data.get('tool_response', {})
        
        # 記事作成の条件チェック
        if should_publish_article(tool_name, tool_input, tool_response):
            result = publish_article(tool_input, tool_response)
            
            if result['success']:
                # 成功時の制御
                output = {
                    "continue": True,
                    "suppressOutput": False
                }
                print(json.dumps(output))
                print(f"✅ Article published: {result['url']}")
            else:
                # 失敗時の制御 - Claudeにフィードバック
                output = {
                    "decision": "block",
                    "reason": f"Article publication failed: {result['error']}"
                }
                print(json.dumps(output))
                sys.exit(2)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(0)

def should_publish_article(tool_name, tool_input, tool_response):
    """記事を公開すべきかどうかの判定"""
    if tool_name != 'Write':
        return False
    
    file_path = tool_input.get('file_path', '')
    
    # docsディレクトリ内のmarkdownファイルかチェック
    if not (file_path.startswith('docs/') and file_path.endswith('.md')):
        return False
    
    # ツールの実行が成功したかチェック
    if not tool_response.get('success', False):
        return False
    
    # ドラフトファイルでないかチェック
    if 'draft' in file_path.lower():
        return False
    
    return True

def publish_article(tool_input, tool_response):
    """記事公開のワークフロー実行"""
    try:
        file_path = tool_input.get('file_path', '')
        
        # ファイル存在チェック
        if not Path(file_path).exists():
            return {"success": False, "error": "File not found"}
        
        # 記事内容の検証
        if not validate_article_structure(file_path):
            return {"success": False, "error": "Invalid article structure"}
        
        # git操作
        git_result = execute_git_operations(file_path)
        if not git_result['success']:
            return git_result
        
        # 公開URL生成
        url = generate_article_url(file_path)
        
        return {
            "success": True,
            "url": url,
            "commit": git_result['commit_hash']
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def validate_article_structure(file_path):
    """記事構造の検証"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 基本チェック
        if len(content.strip()) < 100:
            return False
        
        # タイトルの存在チェック
        if not (content.startswith('# ') or '# ' in content[:500]):
            return False
        
        # 特定のキーワードが含まれているかチェック
        forbidden_keywords = ['TODO', 'FIXME', '[placeholder]']
        for keyword in forbidden_keywords:
            if keyword in content:
                return False
        
        return True
        
    except Exception:
        return False

def execute_git_operations(file_path):
    """git操作の実行"""
    try:
        # ファイルをステージング
        subprocess.run(['git', 'add', file_path], check=True)
        
        # 既存のコミットがあるかチェック
        result = subprocess.run(['git', 'diff', '--cached', '--quiet'], 
                              capture_output=True)
        if result.returncode == 0:
            return {"success": True, "commit_hash": "no-changes"}
        
        # コミット
        title = extract_title(file_path)
        commit_msg = f"feat: Add article - {title}"
        subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
        
        # コミットハッシュ取得
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], 
                              capture_output=True, text=True, check=True)
        commit_hash = result.stdout.strip()
        
        # プッシュ
        subprocess.run(['git', 'push'], check=True)
        
        return {"success": True, "commit_hash": commit_hash}
        
    except subprocess.CalledProcessError as e:
        return {"success": False, "error": f"Git operation failed: {e}"}

def extract_title(file_path):
    """記事タイトルの抽出"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.split('\n')
        for line in lines:
            if line.startswith('# '):
                return line[2:].strip()
        
        return Path(file_path).stem
        
    except Exception:
        return "Unknown"

def generate_article_url(file_path):
    """記事のURLを生成"""
    # docsディレクトリからの相対パス
    relative_path = Path(file_path).relative_to('docs')
    
    # .mdを除去してURLパス作成
    url_path = str(relative_path).replace('.md', '/')
    
    return f"https://smartscope.blog/{url_path}"

if __name__ == '__main__':
    main()
```

## Exit Codeによる精密な制御

### Exit Codeの種類と動作

| Exit Code | 動作 | 説明 |
|-----------|------|------|
| **0** | 成功 | 正常実行、stdoutがトランスクリプトに表示 |
| **2** | ブロック | **重要**: stderrがClaudeに自動的にフィードバック |
| **その他** | 非ブロック | stderrがユーザーに表示、実行継続 |

### Hook固有の制御フロー

```python
#!/usr/bin/env python3
import sys
import json
import subprocess

def main():
    try:
        input_data = json.load(sys.stdin)
        
        # 危険なコマンドの検出と阻止
        if is_dangerous_command(input_data):
            print("BLOCKED: Dangerous command detected", file=sys.stderr)
            sys.exit(2)  # Claudeに自動的にエラーを通知
        
        # 記事作成の検出と処理
        if is_article_creation(input_data):
            result = handle_article_creation(input_data)
            
            if result['success']:
                # 成功時のJSON制御
                output = {
                    "continue": True,
                    "suppressOutput": False
                }
                print(json.dumps(output))
                print(f"✅ Article published: {result['url']}")
                sys.exit(0)
            else:
                # 失敗時のJSON制御
                output = {
                    "decision": "block",
                    "reason": f"Publication failed: {result['error']}"
                }
                print(json.dumps(output))
                sys.exit(2)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Hook execution error: {e}", file=sys.stderr)
        sys.exit(1)  # 非ブロックエラー

def is_dangerous_command(input_data):
    """危険なコマンドの判定"""
    tool_name = input_data.get('tool_name', '')
    
    if tool_name == 'Bash':
        command = input_data.get('tool_input', {}).get('command', '')
        
        dangerous_patterns = [
            r'rm\s+.*-[rf]',
            r'sudo\s+rm',
            r'>\s*/etc/',
            r'chmod\s+777'
        ]
        
        import re
        for pattern in dangerous_patterns:
            if re.search(pattern, command):
                return True
    
    return False

def is_article_creation(input_data):
    """記事作成の判定"""
    tool_name = input_data.get('tool_name', '')
    tool_input = input_data.get('tool_input', {})
    
    if tool_name == 'Write':
        file_path = tool_input.get('file_path', '')
        return file_path.startswith('docs/') and file_path.endswith('.md')
    
    return False

def handle_article_creation(input_data):
    """記事作成の処理"""
    try:
        file_path = input_data.get('tool_input', {}).get('file_path', '')
        
        # 記事の検証
        if not validate_article(file_path):
            return {"success": False, "error": "Article validation failed"}
        
        # git操作
        subprocess.run(['git', 'add', file_path], check=True)
        subprocess.run(['git', 'commit', '-m', f'feat: Add article {file_path}'], check=True)
        subprocess.run(['git', 'push'], check=True)
        
        url = f"https://smartscope.blog/{file_path.replace('docs/', '').replace('.md', '/')}"
        
        return {"success": True, "url": url}
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def validate_article(file_path):
    """記事の検証"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 基本検証
        if len(content.strip()) < 100:
            return False
        
        if not content.startswith('# '):
            return False
        
        return True
        
    except Exception:
        return False

if __name__ == '__main__':
    main()
```

## 実際のHook設定例

### .claude/settings.json

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Write",
      "Edit",
      "Read"
    ],
    "deny": []
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/article_publisher.py"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/security_check.py"
          }
        ]
      }
    ]
  }
}
```

## 記事作成時のみgit pushする完全な実装

以下は、記事作成時のみgit pushを実行する完全な実装例です：

```python
#!/usr/bin/env python3
# .claude/hooks/article_publisher.py

import json
import sys
import subprocess
import os
from pathlib import Path
import re

def main():
    """記事作成時のみgit pushを実行するHook"""
    try:
        # JSON入力を読み込み
        input_data = json.load(sys.stdin)
        
        # 記事作成の条件チェック
        if is_article_creation(input_data):
            result = publish_article(input_data)
            
            if result['success']:
                print(f"✅ Article published successfully: {result['url']}")
                # 成功時の制御フロー
                output = {
                    "continue": True,
                    "suppressOutput": False
                }
                print(json.dumps(output))
            else:
                # 失敗時はClaudeにフィードバック
                output = {
                    "decision": "block",
                    "reason": f"記事の公開に失敗しました: {result['error']}"
                }
                print(json.dumps(output))
                sys.exit(2)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Hook execution error: {e}", file=sys.stderr)
        sys.exit(0)

def is_article_creation(input_data):
    """記事作成かどうかの判定"""
    tool_name = input_data.get('tool_name', '')
    tool_input = input_data.get('tool_input', {})
    tool_response = input_data.get('tool_response', {})
    
    # Writeツールでの成功した実行のみ対象
    if tool_name != 'Write' or not tool_response.get('success', False):
        return False
    
    file_path = tool_input.get('file_path', '')
    
    # 記事ファイルの条件
    conditions = [
        file_path.startswith('docs/'),  # docsディレクトリ内
        file_path.endswith('.md'),      # マークダウンファイル
        'draft' not in file_path.lower(), # ドラフトでない
        'template' not in file_path.lower() # テンプレートでない
    ]
    
    return all(conditions)

def publish_article(input_data):
    """記事公開のワークフロー"""
    try:
        file_path = input_data.get('tool_input', {}).get('file_path', '')
        
        # ファイル存在チェック
        if not Path(file_path).exists():
            return {"success": False, "error": "ファイルが見つかりません"}
        
        # 記事内容の検証
        validation_result = validate_article_content(file_path)
        if not validation_result['valid']:
            return {"success": False, "error": validation_result['error']}
        
        # git操作の実行
        git_result = execute_git_workflow(file_path)
        if not git_result['success']:
            return git_result
        
        # 公開URL生成
        url = generate_article_url(file_path)
        
        return {
            "success": True,
            "url": url,
            "commit": git_result['commit_hash']
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def validate_article_content(file_path):
    """記事内容の詳細検証"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 基本的な長さチェック
        if len(content.strip()) < 200:
            return {"valid": False, "error": "記事が短すぎます（最低200文字）"}
        
        # タイトルの存在チェック
        if not content.startswith('# '):
            return {"valid": False, "error": "記事タイトル（# で始まる行）が必要です"}
        
        # 禁止キーワードチェック
        forbidden_keywords = ['TODO', 'FIXME', '[placeholder]', 'XXX']
        for keyword in forbidden_keywords:
            if keyword in content:
                return {"valid": False, "error": f"未完成のマーカー '{keyword}' が含まれています"}
        
        # 日本語記事の場合の追加チェック
        if has_japanese_content(content):
            if not validate_japanese_article(content):
                return {"valid": False, "error": "日本語記事の形式が適切ではありません"}
        
        return {"valid": True, "error": None}
        
    except Exception as e:
        return {"valid": False, "error": f"ファイル読み取りエラー: {str(e)}"}

def has_japanese_content(content):
    """日本語が含まれているかチェック"""
    japanese_pattern = r'[ひらがなカタカナ漢字]'
    return bool(re.search(japanese_pattern, content))

def validate_japanese_article(content):
    """日本語記事の形式チェック"""
    # 基本的な日本語文章構造チェック
    sentences = content.split('。')
    if len(sentences) < 3:
        return False
    
    # 見出し構造チェック
    headers = re.findall(r'^#+\s+.+', content, re.MULTILINE)
    if len(headers) < 2:  # タイトル + 最低1つの見出し
        return False
    
    return True

def execute_git_workflow(file_path):
    """git操作のワークフロー実行"""
    try:
        # 現在のgitステータスをチェック
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True, check=True)
        
        # 変更がない場合はスキップ
        if not result.stdout.strip():
            return {"success": True, "commit_hash": "no-changes"}
        
        # ファイルをステージング
        subprocess.run(['git', 'add', file_path], check=True)
        
        # mkdocs.ymlも更新された場合は一緒にコミット
        mkdocs_path = 'mkdocs.yml'
        if Path(mkdocs_path).exists():
            subprocess.run(['git', 'add', mkdocs_path], check=True)
        
        # コミット
        title = extract_article_title(file_path)
        commit_message = f"feat: Add new article - {title}"
        subprocess.run(['git', 'commit', '-m', commit_message], check=True)
        
        # コミットハッシュ取得
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], 
                              capture_output=True, text=True, check=True)
        commit_hash = result.stdout.strip()
        
        # プッシュ
        subprocess.run(['git', 'push'], check=True)
        
        return {"success": True, "commit_hash": commit_hash}
        
    except subprocess.CalledProcessError as e:
        return {"success": False, "error": f"Git操作エラー: {e}"}

def extract_article_title(file_path):
    """記事タイトルの抽出"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 最初の# で始まる行を探す
        lines = content.split('\n')
        for line in lines:
            if line.startswith('# '):
                return line[2:].strip()
        
        # タイトルが見つからない場合はファイル名を使用
        return Path(file_path).stem
        
    except Exception:
        return "Unknown Article"

def generate_article_url(file_path):
    """記事のURLを生成"""
    # docsディレクトリからの相対パス
    relative_path = Path(file_path).relative_to('docs')
    
    # .mdを除去してURLパス作成
    url_path = str(relative_path).replace('.md', '/')
    
    return f"https://smartscope.blog/{url_path}"

if __name__ == '__main__':
    main()
```

## まとめ

Claude Code Hooksを使用することで、以下のような高度な条件付き実行が可能になります：

1. **環境変数による条件分岐** - `$CLAUDE_TOOL_OUTPUT`、`$CLAUDE_FILE_PATHS`などを活用
2. **特定ツールでの発動** - Matcher設定で対象ツールを限定
3. **ファイルパターンベースの実行** - 記事ファイルのみを対象とした処理
4. **Exit CodeとJSON制御** - 精密なフロー制御とエラーハンドリング
5. **PostToolUse Hook** - ツール実行後の自動化ワークフロー

これらの機能を組み合わせることで、記事作成時のみgit pushを実行するような、極めて精密で信頼性の高い自動化ワークフローを構築できます。

> **注意**: Hooksは強力な機能ですが、任意のシェルコマンドを自動実行するため、セキュリティリスクがあります。実装時は十分なテストと検証を行ってください。