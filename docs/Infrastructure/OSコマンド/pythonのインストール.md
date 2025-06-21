# Python環境構築

## pyenv使用時の事前準備

### Ubuntu/Debian
```bash
# 必要なライブラリを一括インストール
sudo apt update
sudo apt install -y make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev \
    libffi-dev liblzma-dev
```

### CentOS/RHEL
```bash
# 必要なライブラリを一括インストール
sudo yum groupinstall -y "Development Tools"
sudo yum install -y zlib-devel bzip2-devel openssl-devel \
    ncurses-devel sqlite-devel readline-devel tk-devel \
    gdbm-devel db4-devel libpcap-devel xz-devel
```

## pyenvインストールと使用

```bash
# pyenvインストール
curl https://pyenv.run | bash

# 環境変数設定
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc

# 設定反映
source ~/.bashrc

# Pythonインストール
pyenv install 3.11.0
pyenv global 3.11.0

# バージョン確認
python --version
```

## パッケージ管理インストール

```bash
# システムPython使用時
sudo apt install python3-pip      # Ubuntu/Debian
sudo yum install python3-pip      # CentOS/RHEL

# 仮想環境作成
python -m venv myenv
source myenv/bin/activate

# パッケージインストール
pip install パッケージ名
```