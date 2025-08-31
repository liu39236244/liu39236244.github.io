好的，我来详细指导你在 Linux 上安装和配置 Clash。

## 1. 下载和安装 Clash



## 下面两种方式地址都无法访问，只能自己下载linux安装包了

https://www.clashverge.dev/install.html

### 方法一：下载官方二进制文件（推荐）

```bash
# 1. 创建 clash 目录
sudo mkdir -p /opt/clash
cd /opt/clash

# 2. 下载 Clash Premium（支持更多功能）
# 查看系统架构
uname -m  # x86_64 或 aarch64

# 下载对应架构的版本（以 x86_64 为例）
sudo wget https://github.com/Dreamacro/clash/releases/download/premium/clash-linux-amd64-2023.08.17.gz

# 如果是 ARM64 架构
# sudo wget https://github.com/Dreamacro/clash/releases/download/premium/clash-linux-arm64-2023.08.17.gz

# 3. 解压并设置权限
sudo gunzip clash-linux-amd64-2023.08.17.gz
sudo mv clash-linux-amd64-2023.08.17 clash
sudo chmod +x clash

# 4. 创建软链接到系统路径
sudo ln -sf /opt/clash/clash /usr/local/bin/clash

# 5. 验证安装
clash -v
```

### 方法二：如果 GitHub 无法访问，使用镜像站

```bash
# 使用 GitHub 镜像站下载
sudo mkdir -p /opt/clash
cd /opt/clash

# 通过镜像站下载
sudo wget https://ghproxy.com/https://github.com/Dreamacro/clash/releases/download/premium/clash-linux-amd64-2023.08.17.gz

# 后续步骤同上
sudo gunzip clash-linux-amd64-2023.08.17.gz
sudo mv clash-linux-amd64-2023.08.17 clash
sudo chmod +x clash
sudo ln -sf /opt/clash/clash /usr/local/bin/clash
```

## 2. 创建 Clash 配置目录和文件

```bash
# 1. 创建配置目录
sudo mkdir -p /etc/clash
sudo mkdir -p /var/log/clash

# 2. 创建基础配置文件
sudo tee /etc/clash/config.yaml << 'EOF'
# Clash 配置文件
port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: 127.0.0.1:9090
secret: "your-secret-key"

# DNS 配置
dns:
  enable: true
  listen: 0.0.0.0:53
  enhanced-mode: fake-ip
  nameserver:
    - 223.5.5.5
    - 114.114.114.114
  fallback:
    - 8.8.8.8
    - 1.1.1.1

# 代理配置（这里需要替换为你的实际配置）
proxies:
  - name: "your-proxy"
    type: ss
    server: your-server.com
    port: 443
    cipher: aes-256-gcm
    password: your-password

proxy-groups:
  - name: "PROXY"
    type: select
    proxies:
      - your-proxy

rules:
  - DOMAIN-SUFFIX,google.com,PROXY
  - DOMAIN-SUFFIX,github.com,PROXY
  - DOMAIN-SUFFIX,docker.io,PROXY
  - DOMAIN-SUFFIX,docker.com,PROXY
  - GEOIP,CN,DIRECT
  - MATCH,PROXY
EOF

# 3. 设置权限
sudo chown -R root:root /etc/clash
sudo chmod 644 /etc/clash/config.yaml
```

## 3. 从 Windows 复制配置文件

```bash
# 如果你有 Windows 上的配置文件，可以这样复制：

# 方法一：通过 scp 从 Windows 复制（如果开启了 SSH）
# scp user@windows-ip:/path/to/clash/config.yaml /tmp/config.yaml
# sudo cp /tmp/config.yaml /etc/clash/config.yaml

# 方法二：手动复制内容
# 在 Windows 上打开你的 clash 配置文件，复制内容
# 然后在 Linux 上编辑：
sudo nano /etc/clash/config.yaml
# 粘贴你的配置内容

# 方法三：如果有订阅链接
# curl -o /tmp/config.yaml "你的订阅链接"
# sudo cp /tmp/config.yaml /etc/clash/config.yaml
```

## 4. 创建 Clash 系统服务

```bash
# 创建 systemd 服务文件
sudo tee /etc/systemd/system/clash.service << 'EOF'
[Unit]
Description=Clash daemon, A rule-based proxy in Go.
After=network.target

[Service]
Type=simple
Restart=always
ExecStart=/opt/clash/clash -d /etc/clash
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
EOF

# 重新加载 systemd 并启动服务
sudo systemctl daemon-reload
sudo systemctl enable clash
sudo systemctl start clash

# 检查服务状态
sudo systemctl status clash
```

## 5. 配置系统代理

### 方法一：临时设置环境变量

```bash
# 设置代理环境变量
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export no_proxy=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
export NO_PROXY=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16

# 测试代理
curl -I https://www.google.com
```

### 方法二：永久设置系统代理

```bash
# 1. 创建代理配置脚本
sudo tee /etc/profile.d/proxy.sh << 'EOF'
#!/bin/bash
# Clash 代理配置

# 检查 Clash 是否运行
if systemctl is-active --quiet clash; then
    export http_proxy=http://127.0.0.1:7890
    export https_proxy=http://127.0.0.1:7890
    export HTTP_PROXY=http://127.0.0.1:7890
    export HTTPS_PROXY=http://127.0.0.1:7890
    export no_proxy=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
    export NO_PROXY=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
fi
EOF

sudo chmod +x /etc/profile.d/proxy.sh

# 2. 创建代理管理脚本
sudo tee /usr/local/bin/proxy-control << 'EOF'
#!/bin/bash

case "$1" in
    on|enable)
        export http_proxy=http://127.0.0.1:7890
        export https_proxy=http://127.0.0.1:7890
        export HTTP_PROXY=http://127.0.0.1:7890
        export HTTPS_PROXY=http://127.0.0.1:7890
        export no_proxy=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
        export NO_PROXY=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
        echo "✅ 代理已启用"
        echo "HTTP Proxy: $http_proxy"
        ;;
    off|disable)
        unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY no_proxy NO_PROXY
        echo "❌ 代理已禁用"
        ;;
    status)
        if [ -n "$http_proxy" ]; then
            echo "✅ 代理状态: 启用"
            echo "HTTP Proxy: $http_proxy"
            echo "HTTPS Proxy: $https_proxy"
        else
            echo "❌ 代理状态: 禁用"
        fi
        ;;
    test)
        echo "测试代理连接..."
        curl -I --connect-timeout 5 https://www.google.com
        ;;
    *)
        echo "用法: $0 {on|off|status|test}"
        echo "  on/enable  - 启用代理"
        echo "  off/disable - 禁用代理"
        echo "  status     - 查看代理状态"
        echo "  test       - 测试代理连接"
        ;;
esac
EOF

sudo chmod +x /usr/local/bin/proxy-control
```

## 6. 单独配置 Docker 代理

### 方法一：为 Docker 守护进程配置代理

```bash
# 1. 创建 Docker 服务代理配置目录
sudo mkdir -p /etc/systemd/system/docker.service.d

# 2. 创建代理配置文件
sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf << 'EOF'
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1,docker-registry.example.com,.corp"
EOF

# 3. 重新加载配置并重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker

# 4. 验证 Docker 代理配置
sudo systemctl show --property=Environment docker
```

### 方法二：为 Docker 客户端配置代理

```bash
# 1. 创建 Docker 客户端配置目录
mkdir -p ~/.docker

# 2. 创建客户端代理配置
tee ~/.docker/config.json << 'EOF'
{
  "proxies": {
    "default": {
      "httpProxy": "http://127.0.0.1:7890",
      "httpsProxy": "http://127.0.0.1:7890",
      "noProxy": "localhost,127.0.0.1"
    }
  }
}
EOF
```

### 方法三：在 daemon.json 中配置代理

```bash
# 编辑 Docker daemon 配置文件
sudo tee /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ],
  "proxies": {
    "http-proxy": "http://127.0.0.1:7890",
    "https-proxy": "http://127.0.0.1:7890",
    "no-proxy": "localhost,127.0.0.1,*.local,*.internal"
  }
}
EOF

sudo systemctl restart docker
```

## 7. 创建管理脚本

```bash
# 创建 Clash 管理脚本
sudo tee /usr/local/bin/clash-control << 'EOF'
#!/bin/bash

CLASH_CONFIG="/etc/clash/config.yaml"
CLASH_LOG="/var/log/clash/clash.log"

case "$1" in
    start)
        sudo systemctl start clash
        echo "✅ Clash 已启动"
        ;;
    stop)
        sudo systemctl stop clash
        echo "❌ Clash 已停止"
        ;;
    restart)
        sudo systemctl restart clash
        echo "🔄 Clash 已重启"
        ;;
    status)
        sudo systemctl status clash
        ;;
    log)
        sudo journalctl -u clash -f
        ;;
    config)
        sudo nano $CLASH_CONFIG
        ;;
    test)
        echo "测试 Clash 连接..."
        curl -x http://127.0.0.1:7890 -I https://www.google.com
        ;;
    dashboard)
        echo "Clash Dashboard: http://127.0.0.1:9090/ui"
        echo "Secret: $(grep '^secret:' $CLASH_CONFIG | awk '{print $2}' | tr -d '"')"
        ;;
    *)
        echo "Clash 控制脚本"
        echo "用法: $0 {start|stop|restart|status|log|config|test|dashboard}"
        echo ""
        echo "命令说明:"
        echo "  start     - 启动 Clash"
        echo "  stop      - 停止 Clash"
        echo "  restart   - 重启 Clash"
        echo "  status    - 查看状态"
        echo "  log       - 查看日志"
        echo "  config    - 编辑配置"
        echo "  test      - 测试连接"
        echo "  dashboard - 显示面板地址"
        ;;
esac
EOF

sudo chmod +x /usr/local/bin/clash-control
```

## 8. 测试和验证

```bash
# 1. 检查 Clash 服务状态
clash-control status

# 2. 测试代理连接
proxy-control test

# 3. 测试 Docker 代理
docker pull hello-world

# 4. 查看 Clash 日志
clash-control log

# 5. 访问 Clash Dashboard
# 浏览器打开: http://127.0.0.1:9090/ui
clash-control dashboard
```

## 安装位置总结

```
📁 Clash 安装位置:
├── /opt/clash/clash              # Clash 主程序
├── /usr/local/bin/clash          # 系统路径软链接
├── /etc/clash/config.yaml        # 配置文件
├── /etc/systemd/system/clash.service  # 系统服务
├── /etc/profile.d/proxy.sh       # 系统代理配置
├── /usr/local/bin/proxy-control  # 代理控制脚本
├── /usr/local/bin/clash-control  # Clash 控制脚本
└── /var/log/clash/               # 日志目录
```

现在你可以：
1. 使用 `clash-control start` 启动 Clash
2. 使用 `proxy-control on` 启用系统代理
3. Docker 会自动使用配置的代理
4. 通过 `http://127.0.0.1:9090/ui` 访问 Web 管理界面

记得将配置文件中的代理信息替换为你自己的！