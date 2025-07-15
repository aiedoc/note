# Complete Guide to Using Claude Code Remotely

![Remote Access](https://img.shields.io/badge/Claude%20Code-Remote%20Access-blue.svg) ![Security](https://img.shields.io/badge/Security-High-green.svg) ![Mobile](https://img.shields.io/badge/Mobile-Friendly-orange.svg)

## What You Can Achieve

<div class="grid cards" markdown>

-   🚀 **Remote Development Continuity**
    
    Seamlessly access your home development environment from anywhere

-   🔒 **Secure Remote Access**
    
    Encrypted, safe connections via Tailscale + SSH

-   📱 **Mobile Optimization**
    
    Efficient remote development with minimal data usage

-   ⚡ **Persistent Sessions**
    
    Interrupt and resume development sessions with tmux

</div>

## 📖 Overview

Claude Code is a powerful AI development tool, but using it remotely requires careful planning. This guide covers how to efficiently use Claude Code while traveling, balancing security and data efficiency.

## 🏠 Method 1: Home PC SSH Connection (Recommended)

### Tailscale + SSH Configuration

The most secure and stable approach, providing end-to-end encryption without VPN complexity.

#### Prerequisites

```bash
# Start SSH server on home PC (WSL2 environment)
sudo service ssh start

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

#### Remote Connection Steps

1. **Connect via Termius App**
   ```bash
   ssh username@tailscale-ip-address
   ```

2. **Resume tmux Session**
   ```bash
   tmux attach-session -t claude-session
   ```

3. **Launch Claude Code**
   ```bash
   claude
   ```

### Pros and Cons

**✅ Advantages**
- Use existing development environment as-is
- Highest security level
- Minimal data usage
- Low setup cost

**❌ Disadvantages**
- Requires home PC power management
- Dependent on connection quality
- Static IP recommended

### Security Configuration

```bash
# Set up SSH key authentication
ssh-keygen -t ed25519 -C "mobile-access"
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@tailscale-ip

# Disable password authentication
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo service ssh restart
```

## ☁️ Method 2: GitHub Codespaces

### Cloud Development Environment

Cloud-based development using GitHub Codespaces infrastructure.

#### Setup Process

1. **Repository Preparation**
   ```bash
   # Create .devcontainer/devcontainer.json
   {
     "name": "Claude Code Environment",
     "image": "mcr.microsoft.com/vscode/devcontainers/python:3.11",
     "features": {
       "ghcr.io/devcontainers/features/node:1": {},
       "ghcr.io/devcontainers/features/git:1": {}
     },
     "postCreateCommand": "npm install -g @anthropic-ai/claude-code"
   }
   ```

2. **Launch Codespace**
   - Access repository on GitHub
   - "Code" → "Codespaces" → "Create codespace"

3. **Initialize Claude Code**
   ```bash
   claude auth login
   claude init
   ```

### Pricing Structure

| Plan | Hourly Rate | Monthly Free Tier |
|------|-------------|-------------------|
| 2 core | $0.18/hour | 120 hours |
| 4 core | $0.36/hour | 60 hours |
| 8 core | $0.72/hour | 30 hours |

### Pros and Cons

**✅ Advantages**
- No infrastructure management
- Consistent environment anywhere
- Scalable resources
- Automatic backups

**❌ Disadvantages**
- Usage-based billing
- Network latency
- Customization limitations

## 📊 Data Efficiency Strategies

### Claude Code Usage Monitoring

```bash
# Install Claude Code Usage Monitor
npm install -g claude-code-usage-monitor
claude-monitor start
```

### Token Optimization Tips

1. **Session Management**
   - Understand 5-hour rolling windows
   - Use parallel sessions for efficiency

2. **Command Optimization**
   ```bash
   # Efficient query example
   claude "Continue from previous work, please add tests"
   
   # Inefficient example (avoid)
   claude "Review entire file and translate all comments to Japanese"
   ```

3. **CLAUDE.md Utilization**
   ```markdown
   # Project-specific settings
   ## Coding Standards
   - Indentation: 2 spaces
   - Comments: English
   - Testing: Jest framework
   ```

### Data Usage Estimates

| Activity | Data per Hour |
|----------|---------------|
| SSH + Claude Code | 5-10MB |
| Codespaces | 50-100MB |
| VS Code Spaces | 30-80MB |

## 🔒 Security Considerations

### Security Levels by Method

| Method | Security | Setup Difficulty | Recommendation |
|--------|----------|------------------|----------------|
| Tailscale + SSH | ⭐⭐⭐⭐⭐ | ⭐⭐ | 🥇 |
| GitHub Codespaces | ⭐⭐⭐⭐ | ⭐ | 🥈 |
| VS Code Spaces | ⭐⭐⭐ | ⭐ | 🥉 |

### Security Best Practices

1. **Authentication Hardening**
   ```bash
   # Enable 2FA
   gh auth login --with-token < token.txt
   ```

2. **Access Restrictions**
   ```bash
   # IP restrictions (when using Tailscale)
   sudo ufw allow from 100.64.0.0/10 to any port 22
   ```

3. **Log Monitoring**
   ```bash
   # Check SSH connection logs
   sudo tail -f /var/log/auth.log
   ```

## 💰 Cost Comparison

### Monthly Usage Cost Estimates

**Assumptions**: 2 hours weekdays, 3 hours weekends remote work

| Method | Monthly Cost | Breakdown |
|--------|--------------|-----------|
| SSH Connection | $20 | Claude Pro: $20 (total) |
| Codespaces | $90 | Claude Pro + Codespaces usage |
| VS Code Spaces | $70 | Claude Pro + VS Code usage |

### Cost-Performance Analysis

1. **SSH Connection**: Best value, for technical users
2. **Codespaces**: Moderate value, for team development
3. **VS Code Spaces**: Balanced option, for individual development

## 🛠️ Complete Setup Guide

### Full SSH Connection Setup

```bash
# Step 1: Prepare home environment
sudo apt update && sudo apt install openssh-server tmux
sudo systemctl enable ssh

# Step 2: Tailscale setup
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --advertise-routes=192.168.1.0/24

# Step 3: tmux configuration
cat > ~/.tmux.conf << EOF
set -g mouse on
set -g default-terminal "screen-256color"
bind r source-file ~/.tmux.conf
EOF

# Step 4: Create Claude Code session
tmux new-session -d -s claude-session
tmux send-keys -t claude-session 'claude' C-m
```

### Troubleshooting

**Connection Issues**
```bash
# Check Tailscale status
tailscale status
tailscale ping target-machine

# Verify SSH configuration
sudo systemctl status ssh
sudo tail /var/log/auth.log
```

**Performance Degradation**
```bash
# Check bandwidth
iperf3 -s  # Server side
iperf3 -c server-ip  # Client side

# Monitor Claude Code usage
claude-monitor stats
```

## 📱 Mobile Optimization Tips

### Recommended Apps and Tools

1. **Termius**: Premium SSH client
   - Multi-tab support
   - Key management
   - Port forwarding

2. **Working Copy**: Git client
   - SSH key management
   - Local editing capabilities
   - Shortcuts integration

3. **Shortcuts**: Automation
   ```
   SSH Connect → tmux Resume → Claude Launch
   ```

### Battery Optimization

```bash
# Limit CPU usage
nice -n 19 claude
cpulimit -l 50 -p $(pgrep claude)

# Power saving mode
echo powersave | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
```

## 🔗 Related Articles

- [Claude Code Best Practices Guide](./claude-code-best-practices.en.md)
- [GitHub Actions Auto-Deploy Setup](../Tips/Mkdocs/GitHub-Actions自動デプロイ設定.en.md)
- [AI Development Tools Comparison](./ai-development-tools.en.md)

---

