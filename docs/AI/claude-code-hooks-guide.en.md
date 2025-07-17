# Claude Code Hooks Complete Guide

!!! info "Update Information"
    Comprehensive guide covering Claude Code Hooks from basics to advanced usage, including differences from CLAUDE.md and practical implementation tips.

## What You Can Achieve

<div class="grid cards" markdown>

-   :material-cog-outline: **Automation**

    ---

    Automate code formatting, test execution, and lint fixes

-   :material-shield-check: **Quality Assurance**

    ---

    Automatically check and fix code quality issues

-   :material-alert-circle: **Error Prevention**

    ---

    Block dangerous commands or operations proactively

-   :material-speedometer: **Efficiency**

    ---

    Reduce manual work and improve development speed

</div>

## What are Claude Code Hooks?

Claude Code Hooks are a feature that **automatically executes shell commands at specific points in Claude Code's lifecycle**.

### Traditional Problems
- Need to ask "please format this" repeatedly
- Claude sometimes forgets to apply rules
- Manual operations lead to mistakes and oversights
- Lack of consistency across team members

### Solutions with Hooks
- **Automatic execution**: Reliable execution at specified timing
- **Deterministic**: Consistent behavior independent of AI judgment
- **Uniformity**: Same rules automatically applied across the entire team

## Differences from CLAUDE.md

| Comparison | Claude Code Hooks | CLAUDE.md |
|------------|-------------------|-----------|
| **Purpose** | Automation & Enforcement | Context Provision & Guidance |
| **Execution** | Automatic shell command execution | Claude interprets & decides |
| **Reliability** | 100% execution guaranteed | Uncertain if Claude follows |
| **Configuration** | TOML configuration file | Markdown documentation |
| **Use Cases** | Rule enforcement, workflow automation | Project knowledge, coding standards |

### When to Use Each

**Use Claude Code Hooks when:**
- You have processes that must always run
- You want to automate quality checks
- You need to block dangerous operations
- You require CI/CD-like automation

**Use CLAUDE.md when:**
- You want to share project-specific knowledge
- You need to communicate coding styles
- You want to document team conventions
- You need to provide decision criteria to Claude

## Basic Hook Configuration

### Configuration File Location
Configure hooks in the `.claude/settings.toml` file.

### Basic Syntax
```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

command = "black $CLAUDE_FILE_PATHS"
```

### Available Events

1. **PreToolUse**: Before tool execution
2. **PostToolUse**: After tool execution
3. **Notification**: On notification
4. **Stop**: When response generation completes

### Environment Variables

Claude Code provides several environment variables for use in hooks:

- `$CLAUDE_FILE_PATHS`: Paths of files being operated on
- `$CLAUDE_TOOL_NAME`: Name of the tool being used
- `$CLAUDE_WORKING_DIR`: Current working directory
- `$CLAUDE_SESSION_ID`: Current session identifier

## Practical Hook Examples

### 1. Python Code Formatting (Black)

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

command = "black $CLAUDE_FILE_PATHS"
```

**Effect**: Automatically formats Python files after editing

### 2. JavaScript/TypeScript Formatting (Prettier)

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.js", "*.ts", "*.tsx", "*.jsx"]

command = "prettier --write $CLAUDE_FILE_PATHS"
```

### 3. Rust Code Formatting

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.rs"]

command = "rustfmt $CLAUDE_FILE_PATHS"
```

### 4. Git Auto-commit

```toml
[[hooks]]
event = "Stop"
run_in_background = false

command = "git add . && git commit -m 'Auto-commit via Claude Code'"
```

**Effect**: Automatically commits all changes when Claude completes

### 5. Test Execution

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = true

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.py", "tests/**/*.py"]

command = "python -m pytest tests/ -v"
```

**Effect**: Runs tests in background when Python files are modified

### 6. Lint Checking

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

command = "flake8 $CLAUDE_FILE_PATHS || echo 'Lint errors found'"
```

### 7. Blocking Dangerous Commands

```toml
[[hooks]]
event = "PreToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "bash"

command = '''
if echo "$CLAUDE_COMMAND" | grep -E "(rm -rf|sudo|chmod 777)" > /dev/null; then
    echo "❌ Dangerous command blocked"
    exit 1
fi
'''
```

**Effect**: Prevents execution of potentially dangerous commands

## Advanced Configuration

### 1. Conditional Execution

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

command = '''
if [ -f "requirements.txt" ]; then
    black $CLAUDE_FILE_PATHS
    isort $CLAUDE_FILE_PATHS
    echo "✅ Python code formatted"
else
    echo "⚠️ No requirements.txt found, skipping format"
fi
'''
```

### 2. Multi-language Support

```toml
# Python formatting
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

command = "black $CLAUDE_FILE_PATHS && isort $CLAUDE_FILE_PATHS"

# JavaScript formatting  
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.js", "*.ts"]

command = "prettier --write $CLAUDE_FILE_PATHS"

# Go formatting
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.go"]

command = "go fmt $CLAUDE_FILE_PATHS"
```

### 3. Complex Workflow

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.py"]

command = '''
echo "🔄 Starting Python workflow..."

# Format code
black $CLAUDE_FILE_PATHS
isort $CLAUDE_FILE_PATHS

# Run type checking
mypy $CLAUDE_FILE_PATHS || echo "Type check warnings found"

# Run tests
python -m pytest tests/ -x

# Security check
bandit -r $CLAUDE_FILE_PATHS

echo "✅ Python workflow completed"
'''
```

## Development Environment-Specific Hooks

### For Django Projects

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*/models.py", "*/migrations/*.py"]

command = '''
echo "🔄 Django workflow started..."

# Format code
black $CLAUDE_FILE_PATHS

# Check migrations
python manage.py makemigrations --check --dry-run

# Run Django system checks
python manage.py check

echo "✅ Django workflow completed"
'''
```

### For React Projects

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.tsx", "src/**/*.jsx", "src/**/*.ts", "src/**/*.js"]

command = '''
echo "🔄 React workflow started..."

# Format code
prettier --write $CLAUDE_FILE_PATHS

# Lint check
eslint $CLAUDE_FILE_PATHS --fix

# Type check (if TypeScript)
if [ -f "tsconfig.json" ]; then
    npx tsc --noEmit
fi

echo "✅ React workflow completed"
'''
```

### For Rust Projects

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.rs", "Cargo.toml"]

command = '''
echo "🔄 Rust workflow started..."

# Format code
cargo fmt

# Lint check
cargo clippy -- -D warnings

# Build check
cargo check

echo "✅ Rust workflow completed"
'''
```

## Best Practices

### 1. Performance Considerations

- Use `run_in_background = true` for long-running tasks
- Combine multiple quick operations in one hook
- Avoid hooks that significantly slow down development

### 2. Error Handling

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

command = '''
if black $CLAUDE_FILE_PATHS; then
    echo "✅ Code formatted successfully"
else
    echo "❌ Formatting failed, please check syntax"
    exit 1
fi
'''
```

### 3. Logging and Debugging

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

command = '''
echo "$(date): Formatting $CLAUDE_FILE_PATHS" >> .claude/format.log
black $CLAUDE_FILE_PATHS
echo "$(date): Formatting completed" >> .claude/format.log
'''
```

### 4. Team Configuration

Create a shared `.claude/settings.toml` template:

```toml
# Team-wide hooks configuration
# Copy this to your project and customize as needed

# Universal code formatting
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]
command = "black $CLAUDE_FILE_PATHS && isort $CLAUDE_FILE_PATHS"

# Security checks
[[hooks]]
event = "PreToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "bash"
command = '''
if echo "$CLAUDE_COMMAND" | grep -E "(rm -rf /|sudo rm|chmod 777)" > /dev/null; then
    echo "❌ Potentially dangerous command blocked by team policy"
    exit 1
fi
'''
```

## Troubleshooting

### Common Issues

1. **Hook not executing**
   - Check file path matching in `file_paths`
   - Verify event type is correct
   - Ensure command has execution permissions

2. **Command not found errors**
   - Check if required tools are installed
   - Verify PATH environment variable
   - Use absolute paths if necessary

3. **Performance issues**
   - Set `run_in_background = true` for slow commands
   - Reduce scope of file matching
   - Combine multiple operations efficiently

### Debugging Commands

```bash
# Check hook configuration
cat .claude/settings.toml

# Test command manually
black your_file.py

# Check available tools
which black prettier rustfmt

# View hook logs (if logging is configured)
tail -f .claude/hooks.log
```

## Security Considerations

### 1. Command Injection Prevention

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["*.py"]

# Safe: Using predefined environment variables
command = "black $CLAUDE_FILE_PATHS"

# Unsafe: Don't use user input directly in commands
# command = "black $USER_INPUT"  # ❌ Never do this
```

### 2. Restrict Execution Scope

```toml
[[hooks]]
event = "PostToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.py"]  # Specific to src directory only

command = "black $CLAUDE_FILE_PATHS"
```

### 3. Validate Commands

```toml
[[hooks]]
event = "PreToolUse"
run_in_background = false

[hooks.matcher]
tool_name = "bash"

command = '''
# Whitelist allowed commands
if echo "$CLAUDE_COMMAND" | grep -E "^(ls|cat|grep|find)" > /dev/null; then
    echo "✅ Command allowed"
else
    echo "❌ Command not in whitelist"
    exit 1
fi
'''
```

## Integration with CI/CD

### GitHub Actions Integration

```yaml
name: Claude Code Quality Check
on: [push, pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          pip install black isort flake8
      - name: Run same checks as Claude Hooks
        run: |
          black --check .
          isort --check-only .
          flake8 .
```

### Pre-commit Integration

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 22.3.0
    hooks:
      - id: black
  - repo: https://github.com/pycqa/isort
    rev: 5.10.1
    hooks:
      - id: isort
```

## Conclusion

Claude Code Hooks provide powerful automation capabilities that:

- **Ensure consistency** across team development
- **Reduce manual errors** through automation
- **Integrate seamlessly** with existing workflows
- **Scale effectively** from individual to team use

By implementing hooks strategically, you can create a robust, automated development environment that maintains high code quality while improving developer productivity.

## Related Articles

- [Claude Code Installation Guide](./claude-code-installation-guide.md)
- [Claude Code Best Practices](./claude-code-best-practices.md)
- [Claude Code Auto-Permission Guide](./claude-code-auto-permission-guide.md)

---