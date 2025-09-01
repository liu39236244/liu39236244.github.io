## ⚠️ **不建议直接执行，需要修改后使用**

这个脚本有几个地方需要**手动修改**才能正常工作：

### **需要修改的地方：**

## 📝 **修改后的完整脚本**

```bash
#!/bin/bash

# Clash + Docker 代理配置脚本
# 使用前请修改订阅链接！

set -e  # 遇到错误就停止

echo "=== 开始配置 Clash + Docker 代理 ==="

# ⚠️ 重要：请替换为你的实际订阅链接
SUBSCRIPTION_URL="你的订阅链接"  # 👈 这里必须修改！

# 检查是否修改了订阅链接
if [[ "$SUBSCRIPTION_URL" == "你的订阅链接" ]]; then
    echo "❌ 错误：请先修改脚本中的订阅链接！"
    echo "请编辑脚本，将 SUBSCRIPTION_URL 改为你的实际订阅地址"
    exit 1
fi

# 检查系统架构
ARCH=$(uname -m)
if [[ "$ARCH" == "x86_64" ]]; then
    CLASH_FILE="clash-linux-amd64-v1.18.0.gz"
    CLASH_URL="https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-amd64-v1.18.0.gz"
elif [[ "$ARCH" == "aarch64" ]]; then
    CLASH_FILE="clash-linux-arm64-v1.18.0.gz"
    CLASH_URL="https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-arm64-v1.18.0.gz"
else
    echo "❌ 不支持的系统架构: $ARCH"
    exit 1
fi

echo "✅ 检测到系统架构: $ARCH"

# 1. 创建目录并下载Clash
echo "📥 下载 Clash..."
mkdir -p ~/clash && cd ~/clash

# 检查是否已存在
if [[ -f "clash" ]]; then
    echo "⚠️  Clash 已存在，是否重新下载？(y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -f clash
    else
        echo "跳过下载步骤"
    fi
fi

if [[ ! -f "clash" ]]; then
    wget "$CLASH_URL" -O "$CLASH_FILE"
    gunzip "$CLASH_FILE"
    mv "${CLASH_FILE%.gz}" clash
    chmod +x clash
    echo "✅ Clash 下载完成"
fi

# 2. 下载配置文件
echo "📥 下载配置文件..."
if wget -O config.yaml.tmp "$SUBSCRIPTION_URL"; then
    mv config.yaml.tmp config.yaml
    echo "✅ 配置文件下载成功"
else
    echo "❌ 配置文件下载失败，请检查订阅链接"
    exit 1
fi

# 3. 停止可能存在的Clash进程
echo "🔄 停止现有 Clash 进程..."
pkill -f clash || true

# 4. 启动Clash
echo "🚀 启动 Clash..."
nohup ./clash -d . > clash.log 2>&1 &
CLASH_PID=$!

# 等待Clash启动
sleep 3

# 检查Clash是否正常启动
if ps -p $CLASH_PID > /dev/null; then
    echo "✅ Clash 启动成功 (PID: $CLASH_PID)"
else
    echo "❌ Clash 启动失败，查看日志:"
    cat clash.log
    exit 1
fi

# 5. 测试代理连接
echo "🧪 测试代理连接..."
if curl -x http://127.0.0.1:7890 --connect-timeout 10 -s https://www.google.com > /dev/null; then
    echo "✅ 代理连接测试成功"
else
    echo "⚠️  代理连接测试失败，但继续配置Docker"
fi

# 6. 配置Docker代理
echo "🐳 配置 Docker 代理..."

# 备份现有配置
if [[ -f "/etc/systemd/system/docker.service.d/http-proxy.conf" ]]; then
    sudo cp /etc/systemd/system/docker.service.d/http-proxy.conf /etc/systemd/system/docker.service.d/http-proxy.conf.bak
    echo "✅ 已备份现有Docker代理配置"
fi

sudo mkdir -p /etc/systemd/system/docker.service.d

sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf > /dev/null <<EOF
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
EOF

# 7. 重启Docker服务
echo "🔄 重启 Docker 服务..."
sudo systemctl daemon-reload
sudo systemctl restart docker

# 等待Docker启动
sleep 5

# 8. 验证配置
echo "✅ 验证配置..."

# 检查Clash端口
if netstat -tlnp 2>/dev/null | grep -q ":7890"; then
    echo "✅ Clash HTTP代理端口 7890 正常监听"
else
    echo "⚠️  Clash HTTP代理端口 7890 未监听"
fi

if netstat -tlnp 2>/dev/null | grep -q ":9090"; then
    echo "✅ Clash 管理界面端口 9090 正常监听"
else
    echo "⚠️  Clash 管理界面端口 9090 未监听"
fi

# 检查Docker代理配置
if sudo systemctl show --property=Environment docker | grep -q "HTTP_PROXY"; then
    echo "✅ Docker 代理配置成功"
else
    echo "❌ Docker 代理配置失败"
fi

# 9. 测试Docker拉取
echo "🧪 测试 Docker 镜像拉取..."
if timeout 30 docker pull hello-world > /dev/null 2>&1; then
    echo "✅ Docker 镜像拉取测试成功"
else
    echo "⚠️  Docker 镜像拉取测试失败，可能需要手动调试"
fi

# 10. 显示结果
echo ""
echo "🎉 配置完成！"
echo "=================================="
echo "📊 服务状态:"
echo "   Clash PID: $CLASH_PID"
echo "   HTTP代理: http://127.0.0.1:7890"
echo "   SOCKS代理: socks5://127.0.0.1:7891"
echo "   管理界面: http://$(curl -s ifconfig.me):9090"
echo ""
echo "📋 常用命令:"
echo "   查看Clash日志: tail -f ~/clash/clash.log"
echo "   停止Clash: pkill -f clash"
echo "   重启Clash: cd ~/clash && nohup ./clash -d . > clash.log 2>&1 &"
echo "   测试代理: curl -x http://127.0.0.1:7890 https://www.google.com"
echo ""
echo "🔧 Docker代理管理:"
echo "   禁用代理: sudo rm /etc/systemd/system/docker.service.d/http-proxy.conf && sudo systemctl daemon-reload && sudo systemctl restart docker"
echo "   查看配置: sudo systemctl show --property=Environment docker"
echo ""
echo "⚠️  注意: 请妥善保管你的订阅链接，定期更新配置文件"
```

## 🚀 **使用方法：**

### **1. 创建脚本文件**
```bash
nano setup_clash_docker.sh
```

### **2. 复制上面的脚本内容，并修改订阅链接**
```bash
# 找到这一行并修改
SUBSCRIPTION_URL="https://你的实际订阅链接"
```

### **3. 给脚本执行权限**
```bash
chmod +x setup_clash_docker.sh
```

### **4. 执行脚本**
```bash
./setup_clash_docker.sh
```

## ⚠️ **执行前检查清单：**

- [ ] 已修改订阅链接
- [ ] 确保有sudo权限
- [ ] 确保网络连接正常
- [ ] 确保Docker已安装

## 🛠️ **如果出现问题：**

### **查看详细日志**
```bash
# Clash日志
tail -f ~/clash/clash.log

# Docker状态
sudo systemctl status docker
```

### **手动回滚**
```bash
# 删除Docker代理配置
sudo rm /etc/systemd/system/docker.service.d/http-proxy.conf
sudo systemctl daemon-reload
sudo systemctl restart docker

# 停止Clash
pkill -f clash
```

这样修改后的脚本更安全可靠，你觉得怎么样？



## 脚本



nano setup_clash_docker.sh

chmod +x setup_clash_docker.sh

./setup_clash_docker.sh

```sh
#!/bin/bash

# Clash + Docker 代理配置脚本
# 使用前请修改订阅链接！

set -e  # 遇到错误就停止

echo "=== 开始配置 Clash + Docker 代理 ==="

# ⚠️ 重要：请替换为你的实际订阅链接
SUBSCRIPTION_URL="https://cyberguard.cfd/api/v1/client/subscribe?token=3c56203dc70c21274e2f28b12f95cb83"  # 👈 这里必须修改！

# 检查是否修改了订阅链接
if [[ "$SUBSCRIPTION_URL" == "你的订阅链接" ]]; then
    echo "❌ 错误：请先修改脚本中的订阅链接！"
    echo "请编辑脚本，将 SUBSCRIPTION_URL 改为你的实际订阅地址"
    exit 1
fi

# 检查系统架构
ARCH=$(uname -m)
if [[ "$ARCH" == "x86_64" ]]; then
    CLASH_FILE="clash-linux-amd64-v1.18.0.gz"
    CLASH_URL="https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-amd64-v1.18.0.gz"
elif [[ "$ARCH" == "aarch64" ]]; then
    CLASH_FILE="clash-linux-arm64-v1.18.0.gz"
    CLASH_URL="https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-arm64-v1.18.0.gz"
else
    echo "❌ 不支持的系统架构: $ARCH"
    exit 1
fi

echo "✅ 检测到系统架构: $ARCH"

# 1. 创建目录并下载Clash
echo "📥 下载 Clash..."
mkdir -p ~/clash && cd ~/clash

# 检查是否已存在
if [[ -f "clash" ]]; then
    echo "⚠️  Clash 已存在，是否重新下载？(y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -f clash
    else
        echo "跳过下载步骤"
    fi
fi

if [[ ! -f "clash" ]]; then
    wget "$CLASH_URL" -O "$CLASH_FILE"
    gunzip "$CLASH_FILE"
    mv "${CLASH_FILE%.gz}" clash
    chmod +x clash
    echo "✅ Clash 下载完成"
fi

# 2. 下载配置文件
echo "📥 下载配置文件..."
if wget -O config.yaml.tmp "$SUBSCRIPTION_URL"; then
    mv config.yaml.tmp config.yaml
    echo "✅ 配置文件下载成功"
else
    echo "❌ 配置文件下载失败，请检查订阅链接"
    exit 1
fi

# 3. 停止可能存在的Clash进程
echo "🔄 停止现有 Clash 进程..."
pkill -f clash || true

# 4. 启动Clash
echo "🚀 启动 Clash..."
nohup ./clash -d . > clash.log 2>&1 &
CLASH_PID=$!

# 等待Clash启动
sleep 3

# 检查Clash是否正常启动
if ps -p $CLASH_PID > /dev/null; then
    echo "✅ Clash 启动成功 (PID: $CLASH_PID)"
else
    echo "❌ Clash 启动失败，查看日志:"
    cat clash.log
    exit 1
fi

# 5. 测试代理连接
echo "🧪 测试代理连接..."
if curl -x http://127.0.0.1:7890 --connect-timeout 10 -s https://www.google.com > /dev/null; then
    echo "✅ 代理连接测试成功"
else
    echo "⚠️  代理连接测试失败，但继续配置Docker"
fi

# 6. 配置Docker代理
echo "🐳 配置 Docker 代理..."

# 备份现有配置
if [[ -f "/etc/systemd/system/docker.service.d/http-proxy.conf" ]]; then
    sudo cp /etc/systemd/system/docker.service.d/http-proxy.conf /etc/systemd/system/docker.service.d/http-proxy.conf.bak
    echo "✅ 已备份现有Docker代理配置"
fi

sudo mkdir -p /etc/systemd/system/docker.service.d

sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf > /dev/null <<EOF
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
EOF

# 7. 重启Docker服务
echo "🔄 重启 Docker 服务..."
sudo systemctl daemon-reload
sudo systemctl restart docker

# 等待Docker启动
sleep 5

# 8. 验证配置
echo "✅ 验证配置..."

# 检查Clash端口
if netstat -tlnp 2>/dev/null | grep -q ":7890"; then
    echo "✅ Clash HTTP代理端口 7890 正常监听"
else
    echo "⚠️  Clash HTTP代理端口 7890 未监听"
fi

if netstat -tlnp 2>/dev/null | grep -q ":9090"; then
    echo "✅ Clash 管理界面端口 9090 正常监听"
else
    echo "⚠️  Clash 管理界面端口 9090 未监听"
fi

# 检查Docker代理配置
if sudo systemctl show --property=Environment docker | grep -q "HTTP_PROXY"; then
    echo "✅ Docker 代理配置成功"
else
    echo "❌ Docker 代理配置失败"
fi

# 9. 测试Docker拉取
echo "🧪 测试 Docker 镜像拉取..."
if timeout 30 docker pull hello-world > /dev/null 2>&1; then
    echo "✅ Docker 镜像拉取测试成功"
else
    echo "⚠️  Docker 镜像拉取测试失败，可能需要手动调试"
fi

# 10. 显示结果
echo ""
echo "🎉 配置完成！"
echo "=================================="
echo "📊 服务状态:"
echo "   Clash PID: $CLASH_PID"
echo "   HTTP代理: http://127.0.0.1:7890"
echo "   SOCKS代理: socks5://127.0.0.1:7891"
echo "   管理界面: http://$(curl -s ifconfig.me):9090"
echo ""
echo "📋 常用命令:"
echo "   查看Clash日志: tail -f ~/clash/clash.log"
echo "   停止Clash: pkill -f clash"
echo "   重启Clash: cd ~/clash && nohup ./clash -d . > clash.log 2>&1 &"
echo "   测试代理: curl -x http://127.0.0.1:7890 https://www.google.com"
echo ""
echo "🔧 Docker代理管理:"
echo "   禁用代理: sudo rm /etc/systemd/system/docker.service.d/http-proxy.conf && sudo systemctl daemon-reload && sudo systemctl restart docker"
echo "   查看配置: sudo systemctl show --property=Environment docker"
echo ""
echo "⚠️  注意: 请妥善保管你的订阅链接，定期更新配置文件"

```