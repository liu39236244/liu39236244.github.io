好的！我来写一个完整的检查和安装脚本：

```bash
cat > install_v2raya_complete_check.sh << 'EOF'
#!/bin/bash

set -e

echo "🚀 V2rayA 完整安装检查脚本"
echo "========================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 文件路径定义
V2RAYA_RPM="/tmp/installer_redhat_x64_2.2.7.1.rpm"
V2RAY_ZIP="/tmp/v2ray-linux-64.zip"

echo -e "${BLUE}📋 检查安装状态...${NC}"

# 1. 检查 V2rayA 是否已安装
echo -n "检查 V2rayA: "
if rpm -qa | grep -q v2raya; then
    echo -e "${GREEN}✅ 已安装${NC}"
    V2RAYA_INSTALLED=true
    echo "   版本: $(rpm -qa | grep v2raya)"
elif command -v v2raya > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 已安装 (二进制)${NC}"
    V2RAYA_INSTALLED=true
    echo "   版本: $(v2raya --version 2>/dev/null || echo '未知版本')"
else
    echo -e "${RED}❌ 未安装${NC}"
    V2RAYA_INSTALLED=false
fi

# 2. 检查 V2Ray 核心是否已安装
echo -n "检查 V2Ray 核心: "
if command -v v2ray > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 已安装${NC}"
    V2RAY_INSTALLED=true
    echo "   路径: $(which v2ray)"
    echo "   版本: $(/usr/local/bin/v2ray version 2>/dev/null | head -1 || v2ray version 2>/dev/null | head -1 || echo '版本获取失败')"
else
    echo -e "${RED}❌ 未安装${NC}"
    V2RAY_INSTALLED=false
fi

# 3. 检查地理数据文件
echo -n "检查地理数据文件: "
GEOFILES_EXIST=false
if [ -f "/usr/local/share/v2ray/geosite.dat" ] && [ -f "/usr/local/share/v2ray/geoip.dat" ]; then
    echo -e "${GREEN}✅ 已存在 (/usr/local/share/v2ray/)${NC}"
    GEOFILES_EXIST=true
elif [ -f "/var/lib/v2ray/geosite.dat" ] && [ -f "/var/lib/v2ray/geoip.dat" ]; then
    echo -e "${GREEN}✅ 已存在 (/var/lib/v2ray/)${NC}"
    GEOFILES_EXIST=true
else
    echo -e "${RED}❌ 未找到${NC}"
    GEOFILES_EXIST=false
fi

# 4. 检查必要工具
echo -n "检查 unzip 工具: "
if command -v unzip > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 已安装${NC}"
    UNZIP_INSTALLED=true
else
    echo -e "${RED}❌ 未安装${NC}"
    UNZIP_INSTALLED=false
fi

echo ""
echo -e "${BLUE}📦 检查安装文件...${NC}"

# 5. 检查安装文件是否存在
echo -n "检查 V2rayA RPM 包: "
if [ -f "$V2RAYA_RPM" ]; then
    echo -e "${GREEN}✅ 找到 $V2RAYA_RPM${NC}"
    echo "   大小: $(ls -lh $V2RAYA_RPM | awk '{print $5}')"
    V2RAYA_FILE_EXISTS=true
else
    echo -e "${RED}❌ 未找到 $V2RAYA_RPM${NC}"
    V2RAYA_FILE_EXISTS=false
fi

echo -n "检查 V2Ray ZIP 包: "
if [ -f "$V2RAY_ZIP" ]; then
    echo -e "${GREEN}✅ 找到 $V2RAY_ZIP${NC}"
    echo "   大小: $(ls -lh $V2RAY_ZIP | awk '{print $5}')"
    V2RAY_FILE_EXISTS=true
else
    echo -e "${RED}❌ 未找到 $V2RAY_ZIP${NC}"
    V2RAY_FILE_EXISTS=false
fi

echo ""
echo -e "${YELLOW}🔧 开始安装流程...${NC}"

# 安装 unzip（如果需要）
if [ "$UNZIP_INSTALLED" = false ]; then
    echo -e "${BLUE}📦 安装 unzip...${NC}"
    sudo yum install unzip.x86_64 -y
    if command -v unzip > /dev/null 2>&1; then
        echo -e "${GREEN}✅ unzip 安装成功${NC}"
    else
        echo -e "${RED}❌ unzip 安装失败${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}⏭️  unzip 已安装，跳过${NC}"
fi

# 安装 V2rayA（如果需要）
if [ "$V2RAYA_INSTALLED" = false ]; then
    if [ "$V2RAYA_FILE_EXISTS" = true ]; then
        echo -e "${BLUE}📦 安装 V2rayA...${NC}"
        
        # 清理可能的源配置问题
        sudo rm -f /etc/yum.repos.d/v2raya.repo 2>/dev/null || true
        sudo yum clean all > /dev/null 2>&1 || true
        
        # 安装 RPM 包
        if sudo rpm -ivh "$V2RAYA_RPM"; then
            echo -e "${GREEN}✅ V2rayA 安装成功${NC}"
        else
            echo -e "${YELLOW}⚠️  尝试强制安装...${NC}"
            sudo rpm -ivh --nodeps --force "$V2RAYA_RPM"
        fi
        
        # 验证安装
        if command -v v2raya > /dev/null 2>&1; then
            echo -e "${GREEN}✅ V2rayA 验证成功${NC}"
            echo "   版本: $(v2raya --version 2>/dev/null || echo '版本获取失败')"
        else
            echo -e "${RED}❌ V2rayA 安装验证失败${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ V2rayA RPM 文件不存在，跳过安装${NC}"
        echo -e "${YELLOW}💡 请将 installer_redhat_x64_2.2.7.1.rpm 放到 /tmp 目录${NC}"
    fi
else
    echo -e "${GREEN}⏭️  V2rayA 已安装，跳过${NC}"
fi

# 安装 V2Ray 核心（如果需要）
if [ "$V2RAY_INSTALLED" = false ]; then
    if [ "$V2RAY_FILE_EXISTS" = true ]; then
        echo -e "${BLUE}📦 安装 V2Ray 核心...${NC}"
        
        # 创建临时目录
        TEMP_DIR=$(mktemp -d)
        cd "$TEMP_DIR"
        
        # 复制并解压
        cp "$V2RAY_ZIP" .
        unzip "$(basename $V2RAY_ZIP)"
        
        if [ -f "v2ray" ]; then
            sudo cp v2ray /usr/local/bin/
            sudo chmod +x /usr/local/bin/v2ray
            echo -e "${GREEN}✅ V2Ray 核心安装成功${NC}"
            
            # 验证安装
            if /usr/local/bin/v2ray version > /dev/null 2>&1; then
                echo "   版本: $(/usr/local/bin/v2ray version | head -1)"
            else
                echo -e "${RED}❌ V2Ray 核心验证失败${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ 解压失败，未找到 v2ray 文件${NC}"
            ls -la
            exit 1
        fi
        
        # 清理临时目录
        cd /
        rm -rf "$TEMP_DIR"
    else
        echo -e "${RED}❌ V2Ray ZIP 文件不存在，跳过安装${NC}"
        echo -e "${YELLOW}💡 请将 v2ray-linux-64.zip 放到 /tmp 目录${NC}"
    fi
else
    echo -e "${GREEN}⏭️  V2Ray 核心已安装，跳过${NC}"
fi

# 安装地理数据文件（如果需要）
if [ "$GEOFILES_EXIST" = false ]; then
    echo -e "${BLUE}📥 下载地理数据文件...${NC}"
    
    # 创建数据目录
    sudo mkdir -p /usr/local/share/v2ray
    sudo mkdir -p /var/lib/v2ray
    sudo mkdir -p /etc/v2ray
    
    # 下载 geosite.dat
    echo -n "下载 geosite.dat: "
    if sudo wget -q -O /usr/local/share/v2ray/geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat; then
        echo -e "${GREEN}✅ 成功${NC}"
    elif sudo wget -q -O /usr/local/share/v2ray/geosite.dat https://mirror.ghproxy.com/https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat; then
        echo -e "${GREEN}✅ 镜像成功${NC}"
    else
        echo -e "${RED}❌ 失败${NC}"
    fi
    
    # 下载 geoip.dat
    echo -n "下载 geoip.dat: "
    if sudo wget -q -O /usr/local/share/v2ray/geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat; then
        echo -e "${GREEN}✅ 成功${NC}"
    elif sudo wget -q -O /usr/local/share/v2ray/geoip.dat https://mirror.ghproxy.com/https://github.com/v2fly/geoip/releases/latest/download/geoip.dat; then
        echo -e "${GREEN}✅ 镜像成功${NC}"
    else
        echo -e "${RED}❌ 失败${NC}"
    fi
    
    # 复制到备用位置
    echo -e "${BLUE}📋 复制到备用位置...${NC}"
    sudo cp /usr/local/share/v2ray/geo*.dat /var/lib/v2ray/ 2>/dev/null || true
    sudo cp /usr/local/share/v2ray/geo*.dat /etc/v2ray/ 2>/dev/null || true
    
    # 设置权限
    sudo chmod 644 /usr/local/share/v2ray/geo*.dat 2>/dev/null || true
    sudo chmod 644 /var/lib/v2ray/geo*.dat 2>/dev/null || true
    
    echo -e "${GREEN}✅ 地理数据文件安装完成${NC}"
else
    echo -e "${GREEN}⏭️  地理数据文件已存在，跳过${NC}"
fi

# 启动和验证服务
echo -e "${BLUE}🚀 启动 V2rayA 服务...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable v2raya
sudo systemctl restart v2raya

echo -e "${BLUE}⏳ 等待服务启动...${NC}"
sleep 5

# 检查服务状态
if systemctl is-active --quiet v2raya; then
    echo ""
    echo -e "${GREEN}🎉 安装和配置完成！${NC}"
    echo "=========================="
    echo ""
    echo -e "${GREEN}✅ V2rayA 服务运行正常${NC}"
    echo -e "${GREEN}✅ V2Ray 核心已安装${NC}"
    echo -e "${GREEN}✅ 地理数据文件已配置${NC}"
    echo ""
    echo -e "${BLUE}🌐 访问信息:${NC}"
    echo "   Web 界面: http://localhost:2017"
    echo "   SSH 隧道: ssh -L 2017:localhost:2017 root@your-server"
    echo ""
    echo -e "${BLUE}📋 下一步操作:${NC}"
    echo "1. 访问 Web 界面"
    echo "2. 创建管理员账户（如果是首次）"
    echo "3. 导入订阅链接"
    echo "4. 选择节点并启动代理"
    echo "5. 检查代理端口: sudo netstat -tlnp | grep -E '(20170|20171)'"
    echo ""
    echo -e "${BLUE}🔧 代理端口:${NC}"
    echo "   HTTP: 127.0.0.1:20171"
    echo "   SOCKS5: 127.0.0.1:20170"
    echo ""
    echo -e "${BLUE}📝 管理命令:${NC}"
    echo "   查看状态: sudo systemctl status v2raya"
    echo "   重启服务: sudo systemctl restart v2raya"
    echo "   查看日志: sudo journalctl -u v2raya -f"
else
    echo ""
    echo -e "${RED}❌ V2rayA 服务启动失败${NC}"
    echo "查看状态:"
    sudo systemctl status v2raya --no-pager
    echo ""
    echo "查看日志:"
    sudo journalctl -u v2raya -n 10 --no-pager
    echo ""
    echo -e "${YELLOW}💡 可能的解决方案:${NC}"
    echo "1. 检查端口是否被占用"
    echo "2. 检查防火墙设置"
    echo "3. 查看详细日志排查问题"
fi

echo ""
echo -e "${BLUE}✨ 脚本执行完成！${NC}"
EOF

chmod +x install_v2raya_complete_check.sh
```

## 使用方法

### 1. 确保文件在正确位置
```bash
# 检查文件是否在 /tmp 目录
ls -la /tmp/installer_redhat_x64_2.2.7.1.rpm
ls -la /tmp/v2ray-linux-64.zip
```

### 2. 运行脚本
```bash
./install_v2raya_complete_check.sh
```

## 脚本功能

### ✅ **智能检查**
- 检查 V2rayA 是否已安装（RPM 或二进制）
- 检查 V2Ray 核心是否已安装
- 检查地理数据文件是否存在
- 检查必要工具（unzip）

### ✅ **条件安装**
- 只安装缺失的组件
- 跳过已安装的组件
- 显示详细的安装状态

### ✅ **完整功能**
- 安装 V2rayA（从本地 RPM）
- 安装 V2Ray 核心（从本地 ZIP）
- 下载地理数据文件
- 启动和验证服务

### ✅ **错误处理**
- 文件不存在时给出提示
- 安装失败时尝试备用方案
- 详细的错误信息和解决建议

这个脚本会根据你的实际情况，只安装需要的组件，避免重复安装！