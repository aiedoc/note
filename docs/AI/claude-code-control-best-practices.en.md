# Claude Code Autonomous Control and Best Practices [2025 Edition]

Learn the latest control methods to solve the problem of Claude Code being too autonomous and not following rules, along with effective CLAUDE.md file writing techniques. This comprehensive guide covers practical techniques used in real development environments.

## 📋 Table of Contents

1. [What is Claude Code's Autonomous Problem?](#what-is-claude-codes-autonomous-problem)
2. [Control with CLAUDE.md Files](#control-with-claudemd-files)
3. [Writing Effective Instructions](#writing-effective-instructions)
4. [Practical Control Techniques](#practical-control-techniques)
5. [Team Development Operations](#team-development-operations)
6. [Troubleshooting](#troubleshooting)

## What is Claude Code's Autonomous Problem?

### Common Issues

When using Claude Code, you may encounter these "overly autonomous" problems:

- ✋ **Ignoring instructions and changing code arbitrarily**
- ✋ **Editing more files than necessary**
- ✋ **Not following coding conventions**
- ✋ **Committing without running tests**
- ✋ **Changing important settings without approval**

!!! warning "Risks of Autonomy"
    Claude Code is a powerful tool, but without control, it may make unexpected changes. Setting up appropriate control mechanisms is crucial.

### Why Autonomous Problems Occur

1. **Insufficient Context**: Project rules are not adequately communicated
2. **Vague Instructions**: Lack of specificity leads to Claude's independent judgment
3. **Configuration Issues**: Incomplete CLAUDE.md file settings
4. **Permission Settings**: Inappropriate use of auto-approval mode

## Control with CLAUDE.md Files

### What is CLAUDE.md?

CLAUDE.md is a special file that Claude Code automatically loads into context. By defining project rules, constraints, and workflows, you can control Claude's behavior.

### File Placement Locations

```
Project/
├── CLAUDE.md              # Project-wide rules
├── CLAUDE.local.md        # Local-specific settings (gitignore recommended)
├── src/
│   └── CLAUDE.md          # src directory-specific rules
└── docs/
    └── CLAUDE.md          # docs directory-specific rules
```

### Basic CLAUDE.md Template

```markdown
# CLAUDE.md - Project Control File

## 🚨 Important Constraints

### Required Approval Items
The following operations **must be confirmed** before execution:
- Adding/removing packages
- Changing configuration files (package.json, tsconfig.json, etc.)
- Database schema changes
- Changes affecting production environment

### Prohibited Actions
- Creating/modifying `.env` files
- Editing files in `node_modules`
- Committing without running tests
- Merging PRs without approval

## 🔧 Development Workflow

### Command List
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Type check
npm run typecheck

# Fix linting issues
npm run lint:fix

# Build
npm run build
```

### Required Steps
1. Always run `npm run typecheck` after code changes
2. Confirm tests pass
3. Confirm no linting violations
4. Explain changes

## 📝 Coding Conventions

### TypeScript
- Use ES modules (import/export), CommonJS (require) is prohibited
- Use destructuring for imports when possible
- Explicitly write type definitions

### React
- Use function components
- Follow Hooks order
- Props type definitions are mandatory

### File Structure
- Components under `src/components/`
- Utilities under `src/utils/`
- Type definitions under `src/types/`

## 🧪 Testing Policy

### Test Execution Order
1. Unit tests (Jest)
2. Integration tests (Testing Library)
3. E2E tests (Playwright)

### Required Test Coverage
- New features: 80% or higher
- Important functions: 100%
```

### Advanced Control Settings

```markdown
# Advanced CLAUDE.md Configuration Example

## 🤖 AI Behavior Control

### Thinking Modes
- Use "think hard" before complex changes
- Use "ultrathink" for architectural changes

### Staged Execution
Execute large changes in the following steps:
1. Present change plan and wait for approval
2. Analyze impact scope
3. Develop testing strategy
4. Gradual implementation

### Auto-approval Restrictions
Disable auto-approval in the following cases:
- Simultaneous changes to multiple files (3 or more)
- Configuration file changes
- Dependency changes

## 🔍 Quality Checks

### Pre-change Checklist
- [ ] Confirm existing tests pass
- [ ] Confirm no type errors
- [ ] Confirm no linting violations
- [ ] Confirm no security vulnerabilities

### Post-change Checklist
- [ ] Add new tests
- [ ] Update documentation
- [ ] Record changelog
- [ ] Create review request

## 📋 Project-specific Rules

### Database
- Migration files must be created manually
- SEED data changes require production environment confirmation

### API
- Endpoint additions require API design document updates
- Maintain backward compatibility

### Security
- Functions requiring authentication must be tested
- User input sanitization is mandatory
```

## Writing Effective Instructions

### Specific and Clear Instructions

**❌ Bad Example:**
```
Create login functionality
```

**✅ Good Example:**
```
Create login functionality with the following specifications:

1. Create components/auth/LoginForm.tsx
2. Authentication with email/password
3. Validation: email format check, password 8+ characters
4. Show loading state during submission
5. Implement error handling
6. Create test files simultaneously
7. Run npm run test and npm run typecheck after changes
```

### Specify Constraints and Priorities

```markdown
## Instruction Example: Adding New Feature

### Requirements
- Add user profile editing functionality

### Constraints
- Do not modify existing User component
- Use API endpoint /api/users/:id
- Image upload is out of scope for now

### Priorities
1. Basic editing functionality (name, email)
2. Form validation
3. Error handling
4. Adding tests

### Completion Criteria
- [ ] Form works properly
- [ ] Validation functions
- [ ] Test coverage 80% or higher
- [ ] Type checking passes
```

## Practical Control Techniques

### 1. Staged Approval System

```markdown
# Staged Approval Settings in CLAUDE.md

## Approval Levels

### Level 1 (Auto-executable)
- Style adjustments
- Adding comments
- Minor bug fixes

### Level 2 (Simple Approval)
- Adding new functions
- Extending existing features
- Adding tests

### Level 3 (Detailed Review Required)
- Multiple file changes
- Architectural changes
- Dependency changes
- Configuration file changes

### Level 4 (Mandatory Approval)
- Database schema changes
- Security-related changes
- Changes affecting production environment
```

### 2. Checkpoint Settings

```bash
# .claude/checkpoints.md

## Required Checkpoints

### Before Code Changes
1. Check uncommitted changes with git status
2. Confirm current branch
3. Confirm all tests pass

### During Code Changes
1. Report in advance if changing 3+ files
2. Analyze impact scope when changing important functions
3. Explain reasons when adding new dependencies

### After Code Changes
1. Execute npm run test
2. Execute npm run typecheck
3. Review with git diff
4. Confirm commit message
```

### 3. Auto-approval Mode Control

```javascript
// claude-config.js (configuration example)
module.exports = {
  autoApprove: {
    // File patterns allowed for auto-approval
    allowedFiles: [
      'src/**/*.test.ts',
      'src/**/*.spec.ts',
      'docs/**/*.md'
    ],
    // File patterns blocked from auto-approval
    blockedFiles: [
      'package.json',
      'tsconfig.json',
      '.env*',
      'database/**/*'
    ],
    // Maximum number of files for auto-approval
    maxFiles: 2,
    // Maximum number of changed lines for auto-approval
    maxLines: 50
  }
};
```

## Team Development Operations

### Team Shared CLAUDE.md

```markdown
# team-claude.md

## Team Development Rules

### Commit Conventions
- feat: new feature
- fix: bug fix
- docs: documentation update
- style: code style
- refactor: refactoring
- test: adding tests

### Branch Strategy
- main: production environment
- develop: development environment
- feature/*: feature development
- hotfix/*: emergency fixes

### Review Process
1. Follow PR template
2. Minimum 1 approval required
3. Merge after CI passes

### Claude Usage Notes
- Individual settings in personal CLAUDE.local.md
- Consult before changing team settings
- Important changes must go through review
```

### Personal Settings File

```markdown
# CLAUDE.local.md (personal use, gitignore target)

## Personal Settings

### Development Environment
- Node.js: v20.x
- Editor: VS Code
- Terminal: iTerm2

### Personal Constraints
- No production environment changes after 6 PM
- No major refactoring on Fridays
- Stop new feature development before vacation

### Frequently Used Commands
```bash
# Personal shortcuts
alias ctest="npm run test -- --watch"
alias cbuild="npm run build && npm run typecheck"
```
```

## Troubleshooting

### Common Problems and Solutions

#### 1. Claude Ignores Instructions

**Cause:**
- Vague CLAUDE.md descriptions
- Multiple conflicting instructions

**Solution:**
```markdown
# CLAUDE.md Improvement Example

## 🚨 Top Priority Rules (override other instructions)
1. Do not break tests
2. Do not cause type errors
3. Do not change configuration files without approval

## Actions When in Doubt
1. Stop changes
2. Report current situation
3. Request detailed instructions
```

#### 2. Unexpected Changes with Auto-approval

**Cause:**
- Auto-approval scope too broad
- Insufficient checking functionality

**Solution:**
```markdown
# Strengthening Auto-approval Restrictions

## Auto-approval Conditions
Auto-approve only when ALL of the following are met:
- 2 or fewer files changed
- 20 or fewer lines changed
- Test files or documentation only
- Does not include package.json or configuration files

## Confirmation Flow
1. Display changes with git diff
2. Wait 5 seconds
3. Request user confirmation
```

#### 3. Performance Issues

**Cause:**
- CLAUDE.md is too long
- Too much unnecessary information

**Solution:**
```markdown
# CLAUDE.md Optimization

## File Structure Review
- CLAUDE.md: Basic rules only (within 100 lines)
- rules/coding.md: Coding conventions
- rules/workflow.md: Workflow
- rules/security.md: Security-related

## Reference Method
Please refer to [Detailed Coding Conventions](./rules/coding.md).
```

### Error Handling

#### Context Limit Error

```bash
# Error: Context window exceeded

## Solutions
1. Make CLAUDE.md more concise
2. Add unnecessary files to .claudeignore
3. Split project into smaller units
```

#### Permission Error

```bash
# Error: Permission denied

## Solutions
1. Check file permissions
2. Check git configuration
3. Review Claude Code permission settings
```

## Summary

The key points for controlling Claude Code's autonomy are:

### 🎯 Success Points

1. **Clear CLAUDE.md Settings**
   - Specific and unambiguous instructions
   - Clear prioritization
   - Staged approval system

2. **Appropriate Automation Balance**
   - Automate safe operations
   - Manual confirmation for important changes
   - Set checkpoints

3. **Team Standardization**
   - Establish common rules
   - Separate shared and personal settings
   - Regular reviews

### 🔄 Continuous Improvement

- Observe Claude's behavior
- Update CLAUDE.md when problems occur
- Share knowledge within the team
- Regular configuration reviews

With appropriate control settings, Claude Code becomes a powerful and safe development partner. Start with stricter constraints and gradually expand the automation scope as you become more familiar.

## Related Articles

- [Claude Code Best Practices](claude-code-best-practices.md)
- [AI Development Tools Comparison](ai-development-tools.md)
- [MkDocs Site Operations Guide](../MkDocs/サイト運用ガイド.md)

## Reference Links

- [Claude Code Official Documentation](https://docs.anthropic.com/claude-code)
- [Anthropic Engineering Blog](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)