## 🚀 **RustDesk Docker部署完整教程**

### **第一步：Linux服务器准备**

#### **1. 创建RustDesk目录**

```bash
mkdir -p ~/rustdesk
cd ~/rustdesk
```

#### **2. 创建docker-compose.yml文件**

```bash
nano docker-compose.yml
```

**复制以下内容：**

```yaml
version: '3'

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
    command: hbbs -r rustdesk.example.com:21117
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
```

#### **3. 修改配置文件**

```bash
# 将 rustdesk.example.com 替换为你的服务器IP
sed -i 's/rustdesk.example.com/你的服务器IP/g' docker-compose.yml
```

**或者手动编辑：**

```bash
nano docker-compose.yml
# 找到 rustdesk.example.com 改为你的服务器IP地址
```

#### **4. 启动RustDesk服务**

```bash
# 创建数据目录
mkdir -p data

# 启动服务
docker-compose up -d

# 查看运行状态
docker-compose ps
```

#### **5. 获取密钥**

```bash
# 等待几秒让服务完全启动
sleep 10

# 查看公钥（重要！）
cat data/id_ed25519.pub

# 查看服务日志
docker-compose logs
```

#### **6. 配置防火墙**

```bash
# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=21115-21119/tcp
sudo firewall-cmd --permanent --add-port=21116/udp
sudo firewall-cmd --reload

# Ubuntu/Debian
sudo ufw allow 21115:21119/tcp
sudo ufw allow 21116/udp
sudo ufw reload

# 或者直接开放所有端口（不推荐生产环境）
sudo firewall-cmd --permanent --add-port=21115-21119/tcp
sudo firewall-cmd --permanent --add-port=21115-21119/udp
sudo firewall-cmd --reload
```

### **第二步：验证服务运行**

#### **检查服务状态**

```bash
# 查看容器状态
docker ps

# 查看端口监听
netstat -tlnp | grep 211

# 测试端口连通性
telnet 你的服务器IP 21115
```

#### **查看关键信息**

```bash
echo "=== RustDesk 服务器信息 ==="
echo "服务器地址: $(curl -s ifconfig.me)"
echo "公钥内容:"
cat data/id_ed25519.pub
echo ""
echo "需要开放的端口: 21115-21119 (TCP), 21116 (UDP)"
```

---

## 💻 **Windows客户端配置**

### **第一步：下载RustDesk客户端**

1. 访问 [RustDesk官网](https://rustdesk.com/)
2. 下载Windows版本
3. 安装到本地

### **第二步：配置自定义服务器**

#### **1. 打开RustDesk设置**

- 启动RustDesk
- 点击右上角的 **"⚙️"** (设置按钮)
- 选择 **"网络"** 标签

#### **2. 配置服务器信息**

```
ID服务器: 你的服务器IP:21116
中继服务器: 你的服务器IP:21117
公钥: [粘贴从Linux服务器获取的公钥内容]
```

**具体步骤：**

1. **ID服务器** 填入：`你的服务器IP:21116`
2. **中继服务器** 填入：`你的服务器IP:21117`
3. **公钥** 填入：从服务器 `cat data/id_ed25519.pub` 获取的内容
4. 点击 **"确定"** 保存

#### **3. 重启RustDesk**

- 完全关闭RustDesk
- 重新启动应用
- 检查是否显示新的ID

### **第三步：测试连接**

#### **在被控端（Windows）：**

1. 启动RustDesk
2. 记录显示的 **ID号码**
3. 确认状态显示为 **"就绪"**

#### **在控制端：**

1. 启动RustDesk
2. 输入被控端的ID
3. 点击连接
4. 输入密码（如果设置了）

---

## 🛠️ **一键部署脚本**

```bash
#!/bin/bash

echo "=== RustDesk 服务器一键部署脚本 ==="

# 获取服务器IP
# SERVER_IP=$(curl -s ifconfig.me)
SERVER_IP="47.95.43.103"
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

### **使用一键脚本：**

```bash
# 创建脚本
nano deploy_rustdesk.sh

# 复制上面的脚本内容，保存后执行
chmod +x deploy_rustdesk.sh
./deploy_rustdesk.sh
```

---

## 🔧 **常见问题排查**

### **1. 服务无法启动**

```bash
# 查看详细日志
docker-compose logs -f

# 检查端口占用
netstat -tlnp | grep 211
```

### **2. 客户端连接失败**

```bash
# 检查防火墙
sudo firewall-cmd --list-ports

# 测试端口连通性
telnet 服务器IP 21116
```

### **3. 获取不到公钥**

```bash
# 等待服务完全启动
sleep 30
cat data/id_ed25519.pub

# 如果还是没有，重启服务
docker-compose restart
```

### **4. 重新生成密钥**

```bash
# 停止服务
docker-compose down

# 删除旧数据
rm -rf data

# 重新启动
docker-compose up -d
```

---

## 📋 **部署检查清单**

- [X] Docker和docker-compose已安装
- [ ] 服务器防火墙已配置
- [ ] RustDesk容器正常运行
- [ ] 公钥已成功生成
- [ ] Windows客户端已下载
- [ ] 客户端服务器配置已完成
- [ ] 连接测试成功

需要我帮你调试哪个步骤吗？

## 安装

cd ~ && nano deploy_rustdesk.sh

chmod +x deploy_rustdesk.sh && ./deploy_rustdesk.sh

```sh
#!/bin/bash

echo "=== RustDesk 服务器一键部署脚本 ==="

# 获取服务器IP
# SERVER_IP=$(curl -s ifconfig.me)
SERVER_IP= '47.95.43.103'
echo "检测到服务器IP: $SERVER_IP"

# 创建目录
mkdir -p ~/rustdesk
cd ~/rustdesk

# 创建docker-compose文件
cat > docker-compose.yml <<EOF
version: '3'

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
echo "查看状态: cd ~/rustdesk && docker compose ps"
echo "查看日志: cd ~/rustdesk && docker compose logs"
echo "重启服务: cd ~/rustdesk && docker compose restart"
echo "停止服务: cd ~/rustdesk && docker compose down"
```

## 安装完毕

1. 下载RustDesk: https://rustdesk.com/
   下载地址：https://github.com/rustdesk/rustdesk/releases/tag/1.4.1
2. 设置 -> 网络
3. ID服务器: 47.95.43.103:21116
4. 中继服务器: 47.95.43.103:21117

o7Ei2Hiife+29XxFx9vvGKBhFYSXlwRRpNKAVjvUHNY=

## 阿里云添加安全组

## ✅ **对！问题就在阿里云安全组**

既然系统防火墙是关闭的，那问题肯定是**阿里云安全组**没有开放端口。

## 🌐 **阿里云安全组配置步骤**

### **第一步：登录阿里云控制台**

1. 访问 [阿里云控制台](https://ecs.console.aliyun.com/)
2. 登录你的账号

### **第二步：找到你的ECS实例**

1. 点击左侧菜单 **"实例与镜像"** → **"实例"**
2. 找到你的服务器：`iZ2ze24hli1di27jp14f9xZ`
3. 记录实例ID和安全组信息

### **第三步：配置安全组规则**

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

### **第五步：具体添加步骤**

**对于每个端口，重复以下操作：**

1. 点击 **"添加安全组规则"**
2. 填写规则信息：
   ```
   规则方向: 入方向
   协议类型: TCP (或UDP for 21116)
   端口范围: 21115/21115 (依次填写每个端口)
   源地址: 0.0.0.0/0
   描述: RustDesk服务
   ```
3. 点击 **"确定"**

## 🚀 **快速配置方法**

### **批量端口配置（如果支持）：**

```
规则方向: 入方向
协议类型: TCP  
端口范围: 21115-21119
源地址: 0.0.0.0/0
描述: RustDesk TCP端口

规则方向: 入方向
协议类型: UDP
端口范围: 21116/21116  
源地址: 0.0.0.0/0
描述: RustDesk UDP端口
```

## 🔍 **验证配置是否生效**

### **在服务器上测试：**

```bash
# 等待安全组规则生效（通常1-2分钟）
sleep 60

# 测试外网连接
telnet 47.95.43.103 21116

# 或者用这个命令
timeout 5 bash -c "</dev/tcp/47.95.43.103/21116" && echo "✅ 端口可访问" || echo "❌ 端口不可访问"
```

### **在Windows客户端测试：**

```cmd
# 打开命令提示符
telnet 47.95.43.103 21116

# 或者PowerShell
Test-NetConnection -ComputerName 47.95.43.103 -Port 21116
```

## 📱 **配置完成后的测试**

1. **等待1-2分钟** 让安全组规则生效
2. **重启RustDesk客户端**
3. **重新尝试连接**
4. **检查是否显示"就绪"状态**

## 💡 **常见问题**

### **如果找不到安全组：**

- 检查实例所在的地域是否正确
- 确认实例状态是"运行中"

### **如果规则添加失败：**

- 检查账号权限
- 确认端口范围格式正确
- 尝试逐个添加而不是批量添加

### **如果配置后仍然无法连接：**

```bash
# 在服务器上检查服务状态
cd ~/rustdesk
docker compose ps
docker compose logs
```

## 🎯 **预期结果**

配置完成后，你应该能看到：

- ✅ Windows客户端显示"就绪"状态
- ✅ 显示一个唯一的ID号码
- ✅ 可以正常建立远程连接

配置好安全组后告诉我结果如何！
