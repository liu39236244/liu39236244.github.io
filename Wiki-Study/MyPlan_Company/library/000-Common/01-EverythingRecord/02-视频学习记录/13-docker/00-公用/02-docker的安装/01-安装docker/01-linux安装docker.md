# 安装依赖
sudo yum install -y yum-utils

# 添加Docker仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装Docker
sudo yum install docker-ce docker-ce-cli containerd.io

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker


# 1. 测试Docker安装
docker --version
docker run hello-world

# 2. 测试镜像拉取
docker pull nginx:alpine

# 3. 如果失败，开启代理后重试
export http_proxy=http://127.0.0.1:7890
docker pull nginx:alpine


## 安装配置clash

## 🚀 **Linux上安装配置Clash**

### **方法1：使用Clash for Linux（推荐）**

#### **1. 下载Clash**
```bash
# 创建目录
mkdir -p ~/clash
cd ~/clash

# 下载Clash（根据系统架构选择）
# x64系统：
wget https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-amd64-v1.18.0.gz

# 解压
gunzip clash-linux-amd64-v1.18.0.gz

# 重命名并添加执行权限
mv clash-linux-amd64-v1.18.0 clash
chmod +x clash
```

#### **2. 下载配置文件**
```bash
# 使用你的订阅链接下载配置
wget -O config.yaml "你的订阅链接"

# 或者手动创建配置文件
nano config.yaml
```

#### **3. 启动Clash**
```bash
# 前台运行（测试用）
./clash -d .

# 后台运行
nohup ./clash -d . > clash.log 2>&1 &
```

#### **4. 创建系统服务（开机自启）**
```bash
# 创建服务文件
sudo tee /etc/systemd/system/clash.service <<-'EOF'
[Unit]
Description=Clash daemon
After=network.target

[Service]
Type=simple
Restart=always
ExecStart=/home/你的用户名/clash/clash -d /home/你的用户名/clash
Environment="HOME=/home/你的用户名"

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable clash
sudo systemctl start clash
```

### **方法2：使用Docker运行Clash**
```bash
# 创建配置目录
mkdir -p ~/clash-config

# 下载配置文件到该目录
wget -O ~/clash-config/config.yaml "你的订阅链接"

# 运行Clash容器
docker run -d \
  --name clash \
  --restart unless-stopped \
  -p 7890:7890 \
  -p 7891:7891 \
  -p 9090:9090 \
  -v ~/clash-config:/root/.config/clash \
  dreamacro/clash
```

## 🐳 **为Docker配置代理**

### **方法1：Docker服务级代理**
```bash
# 创建Docker代理配置目录
sudo mkdir -p /etc/systemd/system/docker.service.d

# 创建代理配置文件
sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf <<-'EOF'
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
EOF

# 重载配置并重启Docker
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证代理配置
sudo systemctl show --property=Environment docker
```

### **方法2：用户级Docker代理**
```bash
# 创建用户Docker配置目录
mkdir -p ~/.docker

# 创建客户端代理配置
tee ~/.docker/config.json <<-'EOF'
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

### **方法3：临时代理（推荐测试用）**
```bash
# 设置环境变量
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890

# 测试拉取镜像
docker pull nginx

# 取消代理
unset http_proxy https_proxy
```

## 🔧 **Clash配置文件示例**

```yaml
# config.yaml 基础配置
port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: 0.0.0.0:9090

# 你的订阅内容会自动填充proxies和rules部分
proxies:
  # 这里会是你订阅的节点信息

proxy-groups:
  # 这里会是你的策略组

rules:
  # 这里会是你的分流规则
```

## 🧪 **测试步骤**

### **1. 测试Clash是否正常运行**
```bash
# 检查端口是否监听
netstat -tlnp | grep 7890

# 检查Clash进程
ps aux | grep clash

# 访问Web管理界面
curl http://127.0.0.1:9090
```

### **2. 测试代理是否生效**
```bash
# 测试HTTP代理
curl -x http://127.0.0.1:7890 https://www.google.com

# 测试Docker代理
docker pull gcr.io/google-containers/pause:3.2
```

### **3. 验证Docker代理配置**
```bash
# 查看Docker环境变量
docker info | grep -i proxy

# 或者
sudo systemctl show --property=Environment docker
```

## 📋 **完整部署脚本**

```bash
#!/bin/bash

# 1. 安装Clash
mkdir -p ~/clash && cd ~/clash
wget https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-amd64-v1.18.0.gz
gunzip clash-linux-amd64-v1.18.0.gz
mv clash-linux-amd64-v1.18.0 clash
chmod +x clash

# 2. 下载配置（替换为你的订阅链接）
wget -O config.yaml "你的订阅链接"

# 3. 启动Clash
nohup ./clash -d . > clash.log 2>&1 &

# 4. 配置Docker代理
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf <<-'EOF'
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1"
EOF

# 5. 重启Docker
sudo systemctl daemon-reload
sudo systemctl restart docker

echo "配置完成！"
echo "Clash Web界面: http://你的服务器IP:9090"
echo "测试命令: docker pull nginx"
```

## ⚠️ **注意事项**

1. **防火墙设置**
```bash
# 开放Clash端口（如果需要外部访问）
sudo firewall-cmd --permanent --add-port=9090/tcp
sudo firewall-cmd --reload
```

2. **安全建议**
- 不要在生产环境长期开启代理
- 定期更新订阅配置
- 监控代理使用情况

3. **故障排除**
```bash
# 查看Clash日志
tail -f ~/clash/clash.log

# 查看Docker服务状态
sudo systemctl status docker

# 重置Docker代理配置
sudo rm /etc/systemd/system/docker.service.d/http-proxy.conf
sudo systemctl daemon-reload
sudo systemctl restart docker
```

需要我帮你调试哪个步骤吗？