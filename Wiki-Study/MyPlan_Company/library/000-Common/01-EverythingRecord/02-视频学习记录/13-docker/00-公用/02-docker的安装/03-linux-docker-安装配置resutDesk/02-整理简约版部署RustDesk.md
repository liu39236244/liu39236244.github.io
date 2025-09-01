
## docker 直接搭建rustdesk 脚本记录



## **说明**

docker 安装配置好以后可以创建如下脚本文件并执行；


### **使用一键脚本：**

```bash

# 创建脚本
nano deploy_rustdesk.sh

# 复制上面的脚本内容，保存后执行
chmod +x deploy_rustdesk.sh

# 自己定义脚本存放在哪里，但是此脚本是在家目录下面创建的，所以最终的脚本文件 dockercompose文件也是在家目录下；如果想更改地址，则可以修改目录中的位置
./deploy_rustdesk.sh
```


## 🛠️ **一键部署脚本**

```bash
#!/bin/bash

echo "=== RustDesk 服务器一键部署脚本 ==="

# 获取服务器IP
# SERVER_IP=$(curl -s ifconfig.me)
SERVER_IP="你的服务器IP"
echo "检测到服务器IP: $SERVER_IP"

# 创建目录
mkdir -p ~/rustdesk
cd ~/rustdesk

# 创建docker-compose文件
cat > docker-compose.yml <<EOF

networks:
  rustdesk-net:
    external: false

services:
  hbbs:
    container_name: hbbs
    ports:
      - 21115:21115
      - 21116:21116
      - 21116:21116/udp
      - 21118:21118
    image: rustdesk/rustdesk-server:latest
    command: hbbs -r $SERVER_IP:21117
    volumes:
      - ./data:/root
    networks:
      - rustdesk-net
    depends_on:
      - hbbr
    restart: unless-stopped

  hbbr:
    container_name: hbbr
    ports:
      - 21117:21117
      - 21119:21119
    image: rustdesk/rustdesk-server:latest
    command: hbbr
    volumes:
      - ./data:/root
    networks:
      - rustdesk-net
    restart: unless-stopped
EOF

# 创建数据目录
mkdir -p data

# 启动服务
echo "正在启动RustDesk服务..."
docker compose up -d

# 等待服务启动
echo "等待服务启动..."
sleep 15

# 配置防火墙
echo "配置防火墙..."
if command -v firewall-cmd &> /dev/null; then
	    sudo firewall-cmd --permanent --add-port=21115-21119/tcp
	        sudo firewall-cmd --permanent --add-port=21116/udp
		    sudo firewall-cmd --reload
	    elif command -v ufw &> /dev/null; then
		        sudo ufw allow 21115:21119/tcp
			    sudo ufw allow 21116/udp
		    fi

		    # 显示配置信息
echo ""
echo "🎉 RustDesk 服务器部署完成！"
echo "=================================="
echo "服务器IP: $SERVER_IP"
echo "ID服务器: $SERVER_IP:21116"
echo "中继服务器: $SERVER_IP:21117"
echo ""
echo "公钥内容:"
echo "--------------------------------"
cat data/id_ed25519.pub 2>/dev/null || echo "公钥文件尚未生成，请稍等片刻后执行: cat ~/rustdesk/data/id_ed25519.pub"
echo "--------------------------------"
echo ""
echo "Windows客户端配置:"
echo "1. 下载RustDesk: https://rustdesk.com/"
echo "2. 设置 -> 网络"
echo "3. ID服务器: $SERVER_IP:21116"
echo "4. 中继服务器: $SERVER_IP:21117"
echo "5. 公钥: [复制上面的公钥内容]"
echo ""
echo "管理命令:"
echo "查看状态: cd ~/rustdesk && docker-compose ps"
echo "查看日志: cd ~/rustdesk && docker-compose logs"
echo "重启服务: cd ~/rustdesk && docker-compose restart"
echo "停止服务: cd ~/rustdesk && docker-compose down"

```



## 云服务器需要注意


云服务器我的就是阿里的， 防火墙其实都没开，最后那些端口需要在阿里服务器上进行入栈规则的添加才可以


### **：配置安全组规则**

#### **方法1：通过实例页面**

1. 点击实例ID进入详情页
2. 点击 **"安全组"** 标签
3. 点击安全组ID
4. 点击 **"配置规则"**
5. 点击 **"添加安全组规则"**

#### **方法2：直接进入安全组管理**

1. 左侧菜单 → **"网络与安全"** → **"安全组"**
2. 找到你实例使用的安全组
3. 点击 **"配置规则"**

### **第四步：添加入方向规则**

需要添加以下规则：

```
┌─────────────────────────────────────────────────────┐
│ 规则方向 │ 协议类型 │ 端口范围    │ 源地址      │ 描述     │
├─────────────────────────────────────────────────────┤
│ 入方向   │ TCP      │ 21115/21115 │ 0.0.0.0/0   │ RustDesk │
│ 入方向   │ TCP      │ 21116/21116 │ 0.0.0.0/0   │ RustDesk │
│ 入方向   │ UDP      │ 21116/21116 │ 0.0.0.0/0   │ RustDesk │
│ 入方向   │ TCP      │ 21117/21117 │ 0.0.0.0/0   │ RustDesk │
│ 入方向   │ TCP      │ 21118/21118 │ 0.0.0.0/0   │ RustDesk │
│ 入方向   │ TCP      │ 21119/21119 │ 0.0.0.0/0   │ RustDesk │
└─────────────────────────────────────────────────────┘
```


# 扩展

### 为什么rustdesk 端口要开这么多呢
下面就是说明端口含义

这些端口是 RustDesk 远程桌面服务的不同组件所需要的，让我详细解释每个端口的作用：

## RustDesk 端口详解

### 核心服务端口

```bash
21115 (TCP) - hbbs (Heart Beat & Signal Server)
├── 作用：信号服务器，处理设备注册和连接协调
├── 功能：设备心跳检测、ID注册、连接建立
└── 必需：是（核心服务）

21116 (TCP + UDP) - hbbr (Heart Beat & Relay Server) 
├── TCP：中继服务器控制端口
├── UDP：实际的远程桌面数据传输
├── 功能：当P2P连接失败时，通过服务器中继数据
└── 必需：是（数据传输）

21117 (TCP) - hbbs Web Console
├── 作用：Web管理界面
├── 功能：通过浏览器管理RustDesk服务器
└── 必需：否（仅管理需要）

21118 (TCP) - hbbs API
├── 作用：API接口服务
├── 功能：提供REST API，供第三方应用调用
└── 必需：否（仅API调用需要）

21119 (TCP) - 额外服务端口
├── 作用：备用端口或特定功能
├── 功能：可能用于特殊协议或备用连接
└── 必需：视配置而定
```

## 端口使用场景

### 1. 基础远程桌面连接
```bash
# 最小化配置只需要这两个端口
21115/tcp  # 设备注册和信号协调
21116/tcp+udp  # 数据传输（P2P失败时的中继）
```

### 2. 完整管理功能
```bash
21115/tcp  # 核心信号服务
21116/tcp+udp  # 数据中继服务  
21117/tcp  # Web管理界面
21118/tcp  # API接口
21119/tcp  # 扩展功能
```

## 验证端口使用情况

```bash
# 1. 查看 RustDesk 进程占用的端口
sudo netstat -tlnp | grep rust
sudo ss -tlnp | grep rust

# 2. 查看具体端口监听情况
sudo lsof -i :21115
sudo lsof -i :21116
sudo lsof -i :21117
sudo lsof -i :21118
sudo lsof -i :21119

# 3. 查看 RustDesk 服务状态
sudo systemctl status rustdesk-hbbs
sudo systemctl status rustdesk-hbbr

# 4. 查看 RustDesk 配置文件
find /etc -name "*rustdesk*" 2>/dev/null
find /opt -name "*rustdesk*" 2>/dev/null
```

## 安全优化建议

### 1. 最小化端口开放
如果只需要基本远程桌面功能：
```bash
# 只开放必需端口
21115/tcp  # 必需
21116/tcp+udp  # 必需

# 关闭非必需端口（如果不需要Web管理）
# 21117/tcp  # Web管理界面
# 21118/tcp  # API接口  
# 21119/tcp  # 扩展功能
```

### 2. 限制源IP访问
```bash
# 不建议对所有IP开放，建议限制特定IP段
# 例如只允许内网访问：
源地址：192.168.0.0/16  # 内网段
源地址：10.0.0.0/8     # 内网段
源地址：172.16.0.0/12  # 内网段

# 或者只允许特定IP访问：
源地址：your.trusted.ip.address/32
```

### 3. 检查实际需求
```bash
# 查看 RustDesk 配置，确认哪些端口真正需要
cat /etc/rustdesk/config.toml 2>/dev/null || \
cat /opt/rustdesk/config.toml 2>/dev/null || \
find / -name "*.toml" -path "*rustdesk*" 2>/dev/null
```

## 端口测试

```bash
# 测试端口连通性
telnet your-server-ip 21115
telnet your-server-ip 21116
telnet your-server-ip 21117
telnet your-server-ip 21118
telnet your-server-ip 21119

# 或使用 nc 命令
nc -zv your-server-ip 21115-21119
```

**建议**：如果你只是用于个人远程桌面，可以考虑只开放 21115 和 21116 端口，其他端口可以根据实际使用需求再开放。同时建议限制源IP地址，不要对全网开放（0.0.0.0/0）。

