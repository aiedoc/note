# Claude Code Complete Installation Guide

![Badge](https://img.shields.io/badge/Claude_Code-Installation-blue.svg)

## What You Can Achieve

<div class="grid cards" markdown>

-   :material-download: **Quick Setup**
    
    Get Claude Code's powerful features running in just 3 steps

-   :material-monitor: **Cross-Platform Support**
    
    Optimal configuration methods for Windows, macOS, and Linux

-   :material-wrench: **Problem Resolution**
    
    Proactive troubleshooting and efficient solutions for common issues

-   :material-rocket: **Performance Optimization**
    
    High-speed operation settings leveraging OS-specific features

</div>

## 📖 Overview

Claude Code is a terminal-based AI coding assistant developed by Anthropic. This guide provides comprehensive installation instructions for each platform and solutions to common issues.

### Supported Platforms
- **macOS**: Full support
- **Linux**: Ubuntu 20.04+, Debian 10+ recommended
- **Windows**: Requires WSL2 (recommended)

## 🔧 System Requirements

### Common Requirements
- **Node.js**: 18.0.0 or later (LTS version recommended)
- **npm**: 9.0.0 or later
- **Memory**: 4GB+ (8GB recommended for large projects)
- **Storage**: 500MB+ free space

### API Requirements
- **Anthropic API Key**: Valid subscription required
- **Internet Connection**: For API communication

## 🍎 macOS Installation

### Step 1: Install Node.js

```bash
# Via Homebrew (recommended)
brew install node

# Or official installer
# Download from https://nodejs.org

# Verify versions
node --version  # v18.0.0 or later
npm --version   # 9.0.0 or later
```

### Step 2: Install Claude Code

```bash
# Global installation
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### Step 3: Initial Setup

```bash
# Navigate to project directory
cd /path/to/your/project

# Launch Claude Code
claude
```

### macOS-Specific Optimization

```bash
# Verify Xcode command line tools
xcode-select --install

# Fix Homebrew permissions (if needed)
sudo chown -R $(whoami) $(brew --prefix)/*
```

## 🐧 Linux Installation

### Ubuntu/Debian Systems

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
sudo apt-get update
sudo apt-get install -y build-essential curl git

# Install Claude Code
npm install -g @anthropic-ai/claude-code
```

### CentOS/RHEL Systems

```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs npm

# Install development tools
sudo yum groupinstall -y "Development Tools"

# Install Claude Code
npm install -g @anthropic-ai/claude-code
```

### Linux-Specific Optimization

```bash
# Configure npm permissions (avoid sudo)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Increase file watch limits (for large projects)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 🪟 Windows Installation

### WSL2 Setup (Recommended)

```powershell
# Run PowerShell as Administrator
wsl --install

# Install Ubuntu
wsl --install -d Ubuntu

# After restart, launch Ubuntu
wsl
```

### Setup Within Windows

```bash
# Follow Linux instructions within WSL2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Claude Code
npm install -g @anthropic-ai/claude-code
```

### Windows-Specific Optimization

```bash
# Configure WSL2 memory limits
# Create %USERPROFILE%\.wslconfig file
echo "[wsl2]
memory=8GB
processors=4" > /mnt/c/Users/$(whoami)/.wslconfig

# Work in Linux filesystem (recommended)
cd ~  # Use Linux home instead of Windows /mnt/c/
```

## ⚙️ API Authentication Setup

### Get Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Register/Login to your account
3. Generate key in **API Keys** section
4. Store key securely

### Authentication Methods

```bash
# Method 1: Environment variable (recommended)
export ANTHROPIC_API_KEY="your-api-key-here"
echo 'export ANTHROPIC_API_KEY="your-key"' >> ~/.bashrc

# Method 2: Set during Claude startup
claude auth login

# Method 3: Configuration file
mkdir -p ~/.config/claude
echo "api_key: your-api-key-here" > ~/.config/claude/config.yaml
```

## 🚀 Verification

### Basic Operation Test

```bash
# Launch Claude Code
claude

# Test with prompt
"Hello, Claude! Tell me about the system information"

# Test file operations
claude "Check the contents of package.json"
```

### Performance Test

```bash
# Test with large project
cd /path/to/large/project
claude "Analyze project structure and report issues"

# Measure response time (expected: 2-5 seconds)
time claude "Create a simple Hello World script"
```

## ⚠️ Common Troubleshooting

### Installation Errors

```bash
# Permission errors
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Network errors
npm config set registry https://registry.npmjs.org/
npm cache clean --force

# Node.js version errors
nvm install 18  # if using nvm
nvm use 18
```

### Startup Errors

```bash
# Check PATH configuration
echo $PATH | grep npm

# Check config file permissions
ls -la ~/.config/claude/

# Check log files
cat ~/.claude/logs/debug.log
```

### API Connection Errors

```bash
# Test connection
curl -H "x-api-key: your-key" https://api.anthropic.com/v1/models

# Proxy configuration (corporate environments)
export HTTPS_PROXY=http://proxy.company.com:8080
export HTTP_PROXY=http://proxy.company.com:8080
```

## 💡 Recommended Post-Installation Configuration

### Project Settings

```bash
# Create CLAUDE.md file
cat > CLAUDE.md << 'EOF'
# Project Configuration

## Development Environment
- Node.js 18+
- TypeScript
- React

## Coding Standards
- ESLint/Prettier compliant
- Tests required
- Security-focused

## Common Commands
- Development: npm run dev
- Testing: npm test
- Build: npm run build
EOF
```

### Performance Optimization

```bash
# Enable cloud caching
claude config set cache.enabled true

# Adjust parallel processing
claude config set max_concurrent_requests 3

# Optimize response time
claude config set timeout 30
```

## 🔗 Related Articles

- [Claude Code Complete Guide](./claude-code-complete-guide.md)
- [Claude Code Troubleshooting](./claude-code-troubleshooting-guide.md)
- [Claude Code Tips Collection](../Tips/claude-code-tips.md)
- [Claude Code 2025 New Features](./claude-code-2025-features.md)

## 📞 Support

### Official Resources
- [Claude Code Documentation](https://docs.anthropic.com/claude/code)
- [Anthropic Community](https://community.anthropic.com)
- [GitHub Issues](https://github.com/anthropics/claude-code/issues)

### Emergency Procedures
1. **Immediate Check**: API limits, network connectivity
2. **Log Review**: Files in `~/.claude/logs/` directory
3. **Temporary Workaround**: Use browser version (claude.ai)

---

*Last Updated: 2025-01-14*