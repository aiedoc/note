# GitHub Copilot Custom Instructions Complete Guide - Practical Approaches to Optimize Team Development

![Badge](https://img.shields.io/badge/GitHub-Copilot-blue.svg)

## What You Can Achieve

<div class="grid cards" markdown>

-   :material-robot: **Personalized AI Assistance**
    
    Effectively guide Copilot with project-specific rules

-   :material-account-group: **Team Development Consistency**
    
    Unified quality and style through shared guidelines

-   :material-speedometer: **Enhanced Development Efficiency**
    
    Accurate code generation without repetitive explanations

-   :material-book-open: **Documentation-Driven Development**
    
    Clear guidelines accessible to both humans and AI

</div>

## 📖 What is GitHub Copilot Custom Instructions

GitHub Copilot Custom Instructions is a feature that became fully practical in 2024, allowing you to pre-configure project-specific development policies and coding conventions for Copilot. This enables receiving project-appropriate code generation and suggestions without providing detailed instructions each time.

### Current Feature Overview (2025)

- **64k Token Context Window**: Significantly expanded through GPT-4o utilization
- **Repository-Level Support**: Organization-wide standardization via `.github/copilot-instructions.md`
- **Multi-Platform**: Available in VS Code, GitHub.com, GitHub Mobile, and GitHub CLI
- **Code Review Integration**: Same instructions utilized in Copilot Code Review

## 🎯 Context Size and File Design Best Practices

### File Size Constraints and Recommendations

While current GitHub Copilot has a 64k token (approximately 48,000 characters) context window, **it's important to keep the custom instructions file itself concise**.

!!! warning "Important File Size Guidelines"
    Directly writing large amounts of context in custom instruction files is not recommended. Instead, **leveraging external document reference patterns** enables efficient operation.

### Recommended Approach

```markdown
# ❌ Not Recommended: Direct large context description
Coding Standards:
1. Use camelCase for variables
2. Function names start with verbs
3. Use PascalCase for class names
4. Indent with 2 spaces
5. Use double quotes for string literals
6. Don't omit semicolons
... (extensive detailed conventions continue)

# ✅ Recommended: Leverage reference patterns
Refer to [coding-standards.md](./docs/coding-standards.md) for coding conventions.
Follow [debugging-guide.md](./docs/debugging-guide.md) for debugging procedures.
Check [api-design.md](./docs/api-design.md) for API design policies.
```

## 🏗️ File Structure and Documentation System

### Basic File Layout

```
project-root/
├── .github/
│   ├── copilot-instructions.md      # Main custom instructions
│   └── instructions/                # Additional instruction files
│       ├── frontend.instructions.md
│       ├── backend.instructions.md
│       └── testing.instructions.md
├── docs/
│   ├── coding-standards.md          # Detailed coding standards
│   ├── debugging-guide.md           # Debugging procedures
│   ├── api-design.md               # API design guidelines
│   ├── deployment-guide.md         # Deployment procedures
│   └── troubleshooting.md          # Troubleshooting
└── README.md
```

### Main Instruction File Configuration Example

```markdown
# Project Development Guidelines

## Basic Policy
This project is built with Next.js + TypeScript + Tailwind CSS.

## Reference Documents
- Coding Standards: [docs/coding-standards.md](./docs/coding-standards.md)
- API Design Policy: [docs/api-design.md](./docs/api-design.md)
- Testing Strategy: [docs/testing-strategy.md](./docs/testing-strategy.md)
- Deployment Procedures: [docs/deployment-guide.md](./docs/deployment-guide.md)

## Technology Stack Specific Instructions
- Use TypeScript in strict mode
- Avoid abbreviations in Tailwind CSS class names, use clear ones
- Always specify proper dependency arrays for React Hooks
- Always implement error handling

## File Naming and Directory Structure
- Component files: PascalCase.tsx
- Utility files: camelCase.ts
- Constant files: UPPER_SNAKE_CASE.ts
```

## 💡 Effective Instruction Design Patterns

### 1. Layered Reference Pattern

```markdown
# Providing graduated detail levels

## Level 1: Immediately necessary information
- Technology: React 18 + TypeScript + Vite
- Package Manager: pnpm (npm/yarn prohibited)
- Code Formatter: Prettier + ESLint

## Level 2: Detailed Guidelines
- Detailed coding standards: [docs/detailed-coding-standards.md](./docs/detailed-coding-standards.md)
- Architecture design: [docs/architecture-guide.md](./docs/architecture-guide.md)

## Level 3: Special Case Handling
- Performance optimization: [docs/performance-guide.md](./docs/performance-guide.md)
- Security guidelines: [docs/security-guidelines.md](./docs/security-guidelines.md)
```

### 2. Role-Based Instructions

```markdown
# Role-separated instructions

## Frontend Development
Refer to [#file:./instructions/frontend.instructions.md](./instructions/frontend.instructions.md)

## Backend Development
Refer to [#file:./instructions/backend.instructions.md](./instructions/backend.instructions.md)

## DevOps & Infrastructure
Refer to [#file:./instructions/devops.instructions.md](./instructions/devops.instructions.md)
```

### 3. Context Separation Pattern

```markdown
# Project-specific short-term context
- Current sprint goal: Authentication feature implementation
- Priority bugs: [docs/current-issues.md](./docs/current-issues.md)

# Long-term project policies
- Product strategy: [docs/product-strategy.md](./docs/product-strategy.md)
- Technical debt handling: [docs/technical-debt.md](./docs/technical-debt.md)
```

## 🛠️ Practical Implementation Examples

### Design for New Engineer Onboarding

As the user pointed out, designing with the premise that "**when an exceptionally talented new engineer joins, they can understand the project background, development policies, and debugging procedures**" is crucial.

```markdown
# New Engineer Onboarding

## 🚀 Essential Initial Reading
1. [Project Overview](./docs/project-overview.md) - Complete project understanding in 10 minutes
2. [Development Environment Setup](./docs/setup-guide.md) - Complete environment setup procedures
3. [Coding Standards](./docs/coding-standards.md) - Minimum rules to follow

## 🔧 Daily Development References
- [Debugging Procedures](./docs/debugging-guide.md) - Investigation methods when issues occur
- [Testing Methods](./docs/testing-guide.md) - Local and CI testing procedures
- [Release Process](./docs/release-process.md) - Deployment and release workflow

## 💬 Q&A References
- [FAQ](./docs/faq.md) - Frequently asked questions and answers
- [Troubleshooting](./docs/troubleshooting.md) - Known issues and solutions
```

### Team Development Implementation Example

```markdown
# Team Development Guidelines

## 🔄 Development Flow
1. Before implementation: Create [Feature Design Template](./docs/templates/feature-design.md)
2. Code implementation: Follow [Coding Standards](./docs/coding-standards.md)
3. Test creation: Based on [Testing Strategy](./docs/testing-strategy.md)
4. Review request: Check [Review Guidelines](./docs/review-guidelines.md)

## 🚨 Emergency Response
- Production incidents: [Incident Response Procedures](./docs/incident-response.md)
- Security issues: [Security Incident Procedures](./docs/security-incident.md)
```

## 📝 Specific Examples and Anti-patterns

### ✅ Recommended Examples

```markdown
# Effective instruction examples

## Technology Choice Instructions
- Use Prisma ORM for database queries (avoid raw SQL)
- Use Zustand for state management (don't use Redux)
- Implement UI components based on shadcn/ui

## File Output Instructions
- Always specify target file names when outputting code
- When multiple files need changes, display them separately by file

## Error Handling Instructions
- Ask clear questions instead of guessing when uncertain
- Follow [Debug Guide](./docs/debugging-guide.md) procedures when errors occur

## Reference Documents
- Detailed API specification: [api-spec.yaml](./docs/api-spec.yaml)
- Design system: [design-system.md](./docs/design-system.md)
```

### ❌ Anti-patterns to Avoid

```markdown
# Problematic examples

## External Resource Dependencies (avoid)
- Refer to style guide at https://external-site.com/styleguide
- Follow styleguide.md in external my-org/my-repo repository

## Vague Instructions (avoid)
- "Answer in friendly colleague style"
- "Answer within 1000 characters"
- "Use words no longer than 12 characters"

## Context Overload (avoid)
Directly writing extensive coding standards, API specifications, design documents...
```

## ⚙️ VS Code Configuration and Workflow Integration

### Additional Configuration in settings.json

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "github.copilot.chat.codeGeneration.instructions": [
    "Project-specific supplementary instructions",
    "Special local environment settings"
  ],
  "chat.instructionsFilesLocations": {
    ".github/instructions/**/*.instructions.md": true,
    "docs/instructions/**/*.md": true
  }
}
```

### Git Hook Integration

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Check for custom instruction file changes
if git diff --cached --name-only | grep -q "copilot-instructions.md"; then
    echo "📝 Copilot instructions updated. Team notification recommended."
fi
```

## 🔍 Effectiveness Measurement and Continuous Improvement

### Verifying Instruction Effectiveness

1. **Reference Check**: Verify instruction files are referenced in Copilot Chat's "References" in responses
2. **Response Quality**: Regularly evaluate if expected code generation/suggestions occur
3. **Team Feedback**: Regularly collect user experience and improvement suggestions from developers

### Continuous Improvement Process

```markdown
# Instruction Improvement Cycle

## Monthly Review
- [ ] Reflect new technologies/tools added
- [ ] Collect and address team feedback
- [ ] Verify currency of reference documents

## Quarterly Review
- [ ] Reflect project policy changes
- [ ] Organize infrequently used instructions
- [ ] Consider introducing new best practices
```

## 🎯 Summary: Effective Custom Instruction Strategy

### Key Points

1. **Maintain Conciseness**: Keep custom instruction files concise, manage details in external documents
2. **Leverage Reference Patterns**: Efficiently reference documents using `[file](path)` and `#file:path` syntax
3. **Optimize for Both Humans and AI**: Clarity that new engineers can understand
4. **Graduated Detail Levels**: Hierarchical structure from immediately necessary information to detailed guidelines
5. **Continuous Improvement**: Regular reviews and updates to adapt to project changes

### Implementation Priority

1. **Basic Setup**: Create `.github/copilot-instructions.md`
2. **Core Documents**: Establish coding standards and debugging guides
3. **Reference Patterns**: Design effective external document references
4. **Team Adoption**: Share configurations and educate on usage methods
5. **Continuous Improvement**: Establish regular review cycles

GitHub Copilot Custom Instructions is not just a configuration file, but **an important tool for systematizing team development knowledge bases**. When properly designed and operated, it can simultaneously achieve AI-assisted development efficiency and quality improvement.

## 🔗 Related Articles

- [Claude Code Tips Collection](./claude-code-tips.md) - Practical AI-assisted development techniques
- [Development Efficiency Tips](./development-efficiency-tips.md) - General development efficiency methods
- [CLAUDE.md Best Practices](../AI/claude-md-best-practices.md) - Project configuration file utilization

---

*Last updated: 2025-01-13*