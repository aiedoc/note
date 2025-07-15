# Claude Code GitHub Actions: Revolutionary AI-Driven Code Automation Tool

![Badge](https://img.shields.io/badge/AI-Claude_Code-blue.svg)
![Badge](https://img.shields.io/badge/Platform-GitHub_Actions-green.svg)
![Badge](https://img.shields.io/badge/Status-Beta-orange.svg)

## What You Can Achieve

<div class="grid cards" markdown>

-   :material-robot: **AI Code Review**
    
    Automatically analyze PR changes and provide improvement suggestions and bug detection

-   :material-code-tags: **Automatic Code Implementation**
    
    Generate feature additions and bug fixes PRs from natural language instructions

-   :material-chat: **Interactive Support**
    
    Chat with Claude through Issue/PR comments for real-time development assistance

-   :material-check-circle: **CI/CD Integration**
    
    Easy integration with existing GitHub Actions workflows

</div>

## 📖 Overview

Claude Code GitHub Actions is an AI-driven development automation tool provided by Anthropic. Simply mention `@claude` in GitHub Pull Requests or Issues, and Claude will automatically execute code reviews, feature implementations, and bug fixes.

Currently available as a beta version in 2025, it's gaining attention as a revolutionary tool that can significantly streamline traditional manual code reviews and task implementations.

**Important Limitations**:
- Cannot submit formal PR reviews
- Cannot approve PRs  
- Limited to one comment per interaction

### Key Features

#### 1. PR・Issue Integration
- **Comment Integration**: Instantly call AI assistant with `@claude` mentions
- **Automatic PR Creation**: Generate complete Pull Requests from requirement descriptions
- **Real-time Interaction**: Direct communication with Claude in comment sections

#### 2. Code Review Capabilities
- **Change Analysis**: Cross-file analysis of all PR modifications
- **Improvement Suggestions**: Specific advice for code quality enhancement
- **Bug Detection**: Identify potential issues and security risks

#### 3. Automatic Implementation
- **Feature Addition**: Auto-generate implementation code from new feature requirements
- **Bug Fixes**: Propose appropriate fix code from error descriptions
- **Test Generation**: Automatically create test code matching implementations

### Basic Workflow

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

## 🔧 Setup Instructions

### Prerequisites
- Repository administrator privileges
- Anthropic API key or OAuth token
- Repository with GitHub Actions enabled

### 1. Quick Setup (Recommended)

If using Claude Code in terminal:

```bash
# Execute in Claude Code terminal
/install-github-app
```

This command automates GitHub App installation and necessary secret configuration.

**Note**: This command is only available for direct Anthropic API users.

### 2. Manual Setup

#### Step 1: GitHub App Installation
```bash
# Install Claude GitHub App from the following URL
https://github.com/apps/claude
```

#### Step 2: Repository Secret Configuration
Add the following in GitHub repository Settings > Secrets:

```yaml
# For Anthropic API usage
ANTHROPIC_API_KEY: your_api_key_here

# For OAuth authentication
CLAUDE_CODE_OAUTH_TOKEN: your_oauth_token_here
```

#### Step 3: Workflow File Creation
Create `.github/workflows/claude.yml`:

```yaml
name: Claude Code Action
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, edited]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: contains(github.event.comment.body, '@claude') || contains(github.event.issue.body, '@claude') || contains(github.event.pull_request.body, '@claude') || contains(github.event.review.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${% raw %}{{ secrets.{% endraw %}ANTHROPIC_API_KEY }}
          github_token: ${% raw %}{{ secrets.{% endraw %}GITHUB_TOKEN }}
          # Optional settings
          # trigger_phrase: "@claude"  # Default value
          # additional_permissions: true  # Allow GitHub Actions access
```

### 3. Authentication Options

Claude Code GitHub Actions supports multiple authentication methods:

- **Anthropic Direct API**: Direct API key usage
- **Amazon Bedrock**: Via AWS OIDC authentication
- **Google Vertex AI**: Via Workload Identity Federation

In enterprise environments, you can use your own cloud infrastructure to control data management and billing.

### 4. Advanced Configuration Options

```yaml
- uses: anthropics/claude-code-action@beta
  with:
    anthropic_api_key: ${% raw %}{{ secrets.{% endraw %}ANTHROPIC_API_KEY }}
    github_token: ${% raw %}{{ secrets.{% endraw %}GITHUB_TOKEN }}
    trigger_phrase: "@claude"  # Customize trigger phrase
    direct_prompt: "Fix all linting errors"  # For automated workflows
    additional_permissions: true  # Allow GitHub Actions access
    allowed_tools: "edit,create"  # Restrict available tools
```

### 5. CLAUDE.md Configuration File

Create `CLAUDE.md` in project root to set project-specific guidelines:

```markdown
# Project Configuration

## Coding Standards
- Use TypeScript strict mode
- Follow ESLint + Prettier settings
- Prefer async/await over Promise chains

## Review Criteria
- Security checks mandatory
- Performance impact evaluation
- Maintain 80%+ test coverage

## Prohibited Items
- console.log in production code
- Hardcoded API keys
- Omitting async error handling
```

## 💡 Practical Usage Examples

### Code Review Request
```markdown
@claude Please review the security aspects of this PR.
Specifically check for SQL injection vulnerabilities.
```

### Feature Implementation Request
```markdown
@claude Please implement user authentication endpoints.
JWT token-based with login, logout, and refresh functionality needed.
```

### Bug Fix Request
```markdown
@claude Please fix this TypeError:
TypeError: Cannot read property 'length' of undefined at line 45
```

### Test Generation Request
```markdown
@claude Please create test cases for the newly added API endpoints.
Need coverage for both normal and error scenarios.
```

## 🔄 Workflow Examples

### 1. Developer Creates Issue
```markdown
# Issue: Add User Management Feature

@claude Please implement the following features:
- User registration, editing, deletion functionality
- Permission management (admin, user)
- API endpoint design
```

### 2. Claude Auto-Response & Implementation
- Requirement analysis and architecture design proposal
- Automatic implementation code generation
- Complete Pull Request creation
- Simultaneous test code generation

### 3. Developer Review & Feedback
```markdown
# PR Comment
@claude Please add login attempt rate limiting.
Need account lockout after 5 failed attempts.
```

### 4. Claude Additional Implementation
- Feature addition based on feedback
- Security enhancement implementation
- Related test updates

## 📊 Pros & Cons Comparison

### ✅ Advantages

| Item | Details |
|------|---------|
| **Development Efficiency** | Reduce manual coding time by up to 70% |
| **Code Quality** | Consistent AI-driven code review and quality checks |
| **Learning Support** | Enables high-quality code implementation even for beginners |
| **24/7 Availability** | Code assistance available anytime |
| **Existing Integration** | Seamless integration with GitHub Actions |

### ❌ Disadvantages & Limitations

| Item | Details |
|------|---------|
| **Processing Speed** | Complex changes can take up to 25 minutes |
| **Message Limits** | Usage limits reset every 5 hours |
| **Context Limitations** | 200K token constraint prevents full project processing |
| **Beta Limitations** | Potential feature/API changes |
| **Cost** | Anthropic API usage-based charges apply |

## 🔐 Security & Best Practices

### Security Considerations
- **Data Protection**: Code processed on GitHub runners, no external leakage
- **Permission Management**: Configure GitHub App with minimal necessary permissions
- **API Key Management**: Secure management through repository secrets

### Best Practices
1. **Gradual Adoption**: Trial with small projects before full deployment
2. **CLAUDE.md Utilization**: Document project-specific rules clearly
3. **Human Review**: Always have humans perform final checks on AI suggestions
4. **Backup**: Set branch protection before important changes

## 🔗 Related Resources

### Official Documentation
- [Claude Code GitHub Actions - Anthropic](https://docs.anthropic.com/en/docs/claude-code/github-actions)
- [Claude GitHub App](https://github.com/apps/claude)

### Implementation Examples & Blog Posts
- [Integrating Claude Code with GitHub Actions](https://azukiazusa.dev/blog/claude-code-action-github-integration/)
- [Mastering Claude Code GitHub Actions](https://zenn.dev/acntechjp/articles/3f361da473eac8)

### Related Articles
- [Claude Code Best Practices Guide](./claude-code-best-practices.en.md)
- [AI Development Tools Comparison](./ai-development-tools.en.md)
- [Claude Code Hooks Advanced Guide](./claude-code-hooks-advanced.md)

---

