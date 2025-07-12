# Claude Code Auto-Permission Guide

![Badge](https://img.shields.io/badge/AI-Claude_Code-blue.svg)

## What You Can Achieve

<div class="grid cards" markdown>

-   :material-speedometer: **Improved Work Efficiency**
    
    Significantly faster task execution by skipping confirmation prompts

-   :material-robot: **Enhanced Automation**
    
    Fully automated execution in batch processing and CI/CD pipelines

-   :material-shield-check: **Flexible Permission Management**
    
    Fine-grained permission settings for specific commands and tools

-   :material-docker: **Secure Execution Environment**
    
    Minimize risks through isolated execution in container environments

</div>

## 📖 Overview

Claude Code displays confirmation prompts by default when editing files or executing commands. While this is an important safety feature, it can reduce work efficiency in trusted environments or repetitive tasks. This article explains how to configure auto-execution permissions in Claude Code and discusses the advantages and disadvantages.

## 🔧 Setting Up Auto-Execution Permissions

### Method 1: Interactive Mode Toggle (Shift+Tab)

In Claude Code's interactive mode, you can switch between operation modes by pressing **Shift+Tab**.

#### Available Modes

1. **normal-mode**: Standard mode (confirmation prompts for all operations)
2. **auto-accept edit on**: Auto-approval mode (automatically allows all operations)
3. **plan mode on**: Planning mode (read-only for planning purposes)

#### How to Switch

```text
Press Shift+Tab repeatedly to cycle through modes in this order:
normal-mode → auto-accept edit on → plan mode on → normal-mode
```

The current mode is displayed in the UI, showing "auto-accept edit on" in auto-approval mode.

### Method 2: Command Line Flag (--dangerously-skip-permissions)

For non-interactive execution or scripted processes, use the command line flag.

```bash
claude --dangerously-skip-permissions "task description"
```

With this flag, Claude Code executes all operations without confirmation until completion.

#### Usage Examples

```bash
# Auto-fix lint errors
claude --dangerously-skip-permissions "Fix all ESLint errors in the project"

# Generate boilerplate code
claude --dangerously-skip-permissions "Generate CRUD operations for User model"
```

### Method 3: Permission Management via Configuration File

You can set detailed permissions for specific tools and commands in the `settings.json` file.

#### Basic Configuration Example

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

#### Configuration Details

- **allow**: Patterns for tools and commands to automatically permit
- **deny**: Patterns for tools and commands to always deny
- Pattern matching with wildcards (`*`) is supported

### Method 4: Using /allowed-tools Command

During interactive mode, you can dynamically manage permissions using the `/allowed-tools` command.

```text
/allowed-tools add Bash(npm run build)
/allowed-tools remove WebFetch
/allowed-tools list
```

## 🎯 Recommended Settings by Use Case

### Efficiency in Development Environment

In trusted development environments, set frequently used commands to auto-allow:

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

### Automation in CI/CD Pipelines

For environments requiring full automation, use command line flags:

```yaml
# GitHub Actions example
- name: Auto-fix code issues
  run: |
    claude --dangerously-skip-permissions "Fix all linting errors and format code"
```

### Working in Secure Environments

For high-risk operations, execute within Docker containers:

```bash
# Example execution in Docker container
docker run --rm -it \
  -v $(pwd):/workspace \
  --network none \
  claude-code:latest \
  claude --dangerously-skip-permissions "Refactor database schema"
```

## ⚖️ Pros and Cons

### Pros

1. **Significant Improvement in Work Efficiency**
   - Zero confirmation wait time, tasks complete quickly
   - Particularly effective for bulk file editing and repetitive tasks

2. **Complete Automation Possible**
   - Easy integration with CI/CD pipelines
   - Execution of batch processes and scheduled tasks

3. **Improved Development Flow**
   - Continue working without interrupting thought flow
   - More efficient code reviews and refactoring

### Cons

1. **Increased Security Risks**
   - Possibility of destructive changes due to incorrect operations
   - Risk of prompt injection attacks

2. **Debugging Difficulties**
   - Hard to identify causes when problems occur
   - Delayed discovery of unintended changes

3. **Loss of Control**
   - Complete dependence on AI judgment
   - Cannot prevent unexpected behavior in advance

## 🛡️ Security Best Practices

### 1. Environment Isolation

```bash
# Execution in isolated environment
docker run --rm -it \
  --network none \
  -v $(pwd):/workspace:ro \
  claude-code:latest
```

### 2. Minimize Permissions

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

### 3. Utilize Audit Logs

Use hooks to log all operations:

```json
{
  "hooks": {
    "afterToolUse": "echo '[$(date)] Tool used: {{tool}} {{args}}' >> claude-audit.log"
  }
}
```

## 🎨 Practical Usage Examples

### Auto-fixing Lint Errors

```bash
# Auto-run ESLint and Prettier
claude --dangerously-skip-permissions "Run ESLint --fix and Prettier on all JavaScript files"
```

### Auto-run and Fix Tests

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

### Auto-generate Documentation

```bash
# Auto-generate API documentation
claude --dangerously-skip-permissions "Generate JSDoc comments for all exported functions"
```

## 🔗 Related Articles

- [Claude Code Best Practices](./claude-code-best-practices.en.md)
- [Claude Code Hooks Usage Guide](./claude-code-hooks-guide.en.md)
- [Claude Code Advanced Configuration Guide](./claude-code-advanced-guide.en.md)

---

*Last updated: 2025-01-12*