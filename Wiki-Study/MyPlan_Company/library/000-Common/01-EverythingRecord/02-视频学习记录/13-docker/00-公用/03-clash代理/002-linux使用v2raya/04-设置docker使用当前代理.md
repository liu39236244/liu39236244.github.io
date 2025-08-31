好的！这是修正后的完整 Docker 代理配置脚本：

```bash
cat > configure_docker_proxy.sh << 'EOF'
#!/bin/bash

# Docker 代理配置脚本 - 修正版

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROXY_HOST="127.0.0.1:20171"
SOCKS_HOST="127.0.0.1:20170"
NO_PROXY="localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"

echo -e "${BLUE}🐳 Docker 代理配置工具 (修正版)${NC}"
echo "=============================="

# 检查 V2rayA 代理是否可用
check_proxy() {
    echo -e "${BLUE}🔍 检查 V2rayA 代理状态...${NC}"
    
    if netstat -tlnp 2>/dev/null | grep -q ":20171"; then
        echo -e "${GREEN}✅ V2rayA 代理端口 20171 正常监听${NC}"
        
        # 方法1：检查状态码
        echo -n "测试代理连接（状态码）: "
        HTTP_CODE=$(curl --proxy http://$PROXY_HOST --connect-timeout 10 -s -o /dev/null -w "%{http_code}" https://www.google.com 2>/dev/null)
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ 成功 (HTTP $HTTP_CODE)${NC}"
        else
            echo -e "${RED}❌ 失败 (HTTP $HTTP_CODE)${NC}"
        fi
        
        # 方法2：检查内容
        echo -n "测试代理连接（内容）: "
        if curl --proxy http://$PROXY_HOST --connect-timeout 10 -s https://www.google.com | grep -qi "google"; then
            echo -e "${GREEN}✅ 成功${NC}"
            return 0
        else
            echo -e "${RED}❌ 失败${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ V2rayA 代理端口未监听${NC}"
        echo -e "${YELLOW}💡 请先启动 V2rayA 并在 Web 界面中启动代理${NC}"
        return 1
    fi
}

# 配置 Docker 守护进程代理
configure_daemon_proxy() {
    echo -e "${BLUE}🔧 配置 Docker 守护进程代理...${NC}"
    
    # 创建配置目录
    sudo mkdir -p /etc/systemd/system/docker.service.d
    
    # 创建代理配置文件
    sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf << PROXY_CONFIG
[Service]
Environment="HTTP_PROXY=http://$PROXY_HOST"
Environment="HTTPS_PROXY=http://$PROXY_HOST"
Environment="NO_PROXY=$NO_PROXY"
PROXY_CONFIG
    
    echo -e "${GREEN}✅ Docker 守护进程代理配置已创建${NC}"
    echo "   配置文件: /etc/systemd/system/docker.service.d/http-proxy.conf"
}

# 配置 Docker 客户端代理
configure_client_proxy() {
    echo -e "${BLUE}🔧 配置 Docker 客户端代理...${NC}"
    
    # 创建客户端配置目录
    mkdir -p ~/.docker
    
    # 创建客户端代理配置
    tee ~/.docker/config.json << CLIENT_CONFIG
{
  "proxies": {
    "default": {
      "httpProxy": "http://$PROXY_HOST",
      "httpsProxy": "http://$PROXY_HOST",
      "noProxy": "$NO_PROXY"
    }
  }
}
CLIENT_CONFIG
    
    echo -e "${GREEN}✅ Docker 客户端代理配置已创建${NC}"
    echo "   配置文件: ~/.docker/config.json"
}

# 更新 daemon.json 配置
update_daemon_json() {
    echo -e "${BLUE}🔧 更新 Docker daemon.json 配置...${NC}"
    
    # 备份原配置
    if [ -f /etc/docker/daemon.json ]; then
        BACKUP_FILE="/etc/docker/daemon.json.backup.$(date +%Y%m%d_%H%M%S)"
        sudo cp /etc/docker/daemon.json "$BACKUP_FILE"
        echo -e "${YELLOW}📋 原配置已备份到: $BACKUP_FILE${NC}"
    fi
    
    # 创建新的 daemon.json
    sudo tee /etc/docker/daemon.json << DAEMON_CONFIG
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://docker.m.daocloud.io"
  ],
  "proxies": {
    "http-proxy": "http://$PROXY_HOST",
    "https-proxy": "http://$PROXY_HOST",
    "no-proxy": "$NO_PROXY"
  },
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
DAEMON_CONFIG
    
    echo -e "${GREEN}✅ Docker daemon.json 配置已更新${NC}"
    echo "   配置文件: /etc/docker/daemon.json"
}

# 重启 Docker 服务
restart_docker() {
    echo -e "${BLUE}🔄 重启 Docker 服务...${NC}"
    
    sudo systemctl daemon-reload
    sudo systemctl restart docker
    
    # 等待服务启动
    echo "等待 Docker 服务启动..."
    sleep 5
    
    if systemctl is-active --quiet docker; then
        echo -e "${GREEN}✅ Docker 服务重启成功${NC}"
        return 0
    else
        echo -e "${RED}❌ Docker 服务重启失败${NC}"
        echo "查看服务状态:"
        sudo systemctl status docker --no-pager
        return 1
    fi
}

# 验证配置
verify_configuration() {
    echo -e "${BLUE}🔍 验证 Docker 代理配置...${NC}"
    echo "================================"
    
    # 检查环境变量
    echo -e "${YELLOW}1. Docker 服务环境变量:${NC}"
    DOCKER_ENV=$(sudo systemctl show --property=Environment docker | grep -i proxy)
    if [ -n "$DOCKER_ENV" ]; then
        echo -e "${GREEN}✅ 找到代理环境变量${NC}"
        echo "$DOCKER_ENV"
    else
        echo -e "${RED}❌ 未找到代理环境变量${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}2. Docker daemon.json 配置:${NC}"
    if [ -f /etc/docker/daemon.json ]; then
        echo -e "${GREEN}✅ daemon.json 存在${NC}"
        if command -v jq > /dev/null 2>&1; then
            sudo cat /etc/docker/daemon.json | jq .
        else
            sudo cat /etc/docker/daemon.json
        fi
    else
        echo -e "${RED}❌ daemon.json 不存在${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}3. Docker 客户端配置:${NC}"
    if [ -f ~/.docker/config.json ]; then
        echo -e "${GREEN}✅ 客户端配置存在${NC}"
        if command -v jq > /dev/null 2>&1; then
            cat ~/.docker/config.json | jq .
        else
            cat ~/.docker/config.json
        fi
    else
        echo -e "${RED}❌ 客户端配置不存在${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}4. 系统服务配置:${NC}"
    if [ -f /etc/systemd/system/docker.service.d/http-proxy.conf ]; then
        echo -e "${GREEN}✅ 系统服务代理配置存在${NC}"
        sudo cat /etc/systemd/system/docker.service.d/http-proxy.conf
    else
        echo -e "${RED}❌ 系统服务代理配置不存在${NC}"
    fi
}

# 测试代理连接
test_proxy() {
    echo -e "${BLUE}🧪 测试代理连接...${NC}"
    echo "=================="
    
    # 检查代理端口
    if ! netstat -tlnp 2>/dev/null | grep -q ":20171"; then
        echo -e "${RED}❌ 代理端口未启动${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}1. 测试 HTTP 代理访问 Google:${NC}"
    HTTP_CODE=$(curl --proxy http://$PROXY_HOST --connect-timeout 10 -s -o /dev/null -w "%{http_code}" https://www.google.com 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ HTTP 代理连接正常 (状态码: $HTTP_CODE)${NC}"
    else
        echo -e "${RED}❌ HTTP 代理连接失败 (状态码: $HTTP_CODE)${NC}"
    fi
    
    echo -e "${YELLOW}2. 测试 SOCKS5 代理访问 Google:${NC}"
    HTTP_CODE=$(curl --socks5 $SOCKS_HOST --connect-timeout 10 -s -o /dev/null -w "%{http_code}" https://www.google.com 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ SOCKS5 代理连接正常 (状态码: $HTTP_CODE)${NC}"
    else
        echo -e "${RED}❌ SOCKS5 代理连接失败 (状态码: $HTTP_CODE)${NC}"
    fi
    
    echo -e "${YELLOW}3. 测试国内网站直连:${NC}"
    HTTP_CODE=$(curl --connect-timeout 5 -s -o /dev/null -w "%{http_code}" https://www.baidu.com 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ 国内网站直连正常 (状态码: $HTTP_CODE)${NC}"
    else
        echo -e "${YELLOW}⚠️  国内网站连接异常 (状态码: $HTTP_CODE)${NC}"
    fi
    
    echo -e "${YELLOW}4. 验证代理 IP 地址:${NC}"
    echo -n "获取本地 IP: "
    LOCAL_IP=$(curl --connect-timeout 5 -s https://ipinfo.io/ip 2>/dev/null)
    if [ -n "$LOCAL_IP" ]; then
        echo -e "${CYAN}$LOCAL_IP${NC}"
    else
        echo -e "${RED}获取失败${NC}"
    fi
    
    echo -n "获取代理 IP: "
    PROXY_IP=$(curl --proxy http://$PROXY_HOST --connect-timeout 10 -s https://ipinfo.io/ip 2>/dev/null)
    if [ -n "$PROXY_IP" ]; then
        echo -e "${CYAN}$PROXY_IP${NC}"
        
        if [ "$PROXY_IP" != "$LOCAL_IP" ]; then
            echo -e "${GREEN}✅ 代理工作正常，IP 地址已改变${NC}"
        else
            echo -e "${YELLOW}⚠️  代理 IP 与本地 IP 相同，可能未生效${NC}"
        fi
    else
        echo -e "${RED}获取失败${NC}"
    fi
}

# 测试 Docker 代理
test_docker_proxy() {
    echo -e "${BLUE}🧪 测试 Docker 代理功能...${NC}"
    echo "========================="
    
    echo -e "${YELLOW}1. 测试拉取 hello-world 镜像:${NC}"
    if timeout 60 docker pull hello-world:latest; then
        echo -e "${GREEN}✅ hello-world 镜像拉取成功${NC}"
        
        # 清理测试镜像
        docker rmi hello-world:latest > /dev/null 2>&1 || true
    else
        echo -e "${RED}❌ hello-world 镜像拉取失败${NC}"
        echo "可能的原因："
        echo "1. 代理配置不正确"
        echo "2. V2rayA 代理未启动"
        echo "3. 网络连接问题"
        return 1
    fi
    
    echo -e "${YELLOW}2. 测试拉取 nginx:alpine 镜像:${NC}"
    if timeout 60 docker pull nginx:alpine; then
        echo -e "${GREEN}✅ nginx:alpine 镜像拉取成功${NC}"
        docker rmi nginx:alpine > /dev/null 2>&1 || true
    else
        echo -e "${YELLOW}⚠️  nginx:alpine 镜像拉取失败${NC}"
    fi
    
    echo -e "${YELLOW}3. 测试拉取 alpine:latest 镜像:${NC}"
    if timeout 60 docker pull alpine:latest; then
        echo -e "${GREEN}✅ alpine:latest 镜像拉取成功${NC}"
        docker rmi alpine:latest > /dev/null 2>&1 || true
    else
        echo -e "${YELLOW}⚠️  alpine:latest 镜像拉取失败${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Docker 代理测试完成！${NC}"
}

# 移除代理配置
remove_proxy_config() {
    echo -e "${BLUE}🗑️  移除 Docker 代理配置...${NC}"
    echo "=========================="
    
    # 移除守护进程代理配置
    if [ -f /etc/systemd/system/docker.service.d/http-proxy.conf ]; then
        sudo rm -f /etc/systemd/system/docker.service.d/http-proxy.conf
        echo -e "${GREEN}✅ 守护进程代理配置已移除${NC}"
    else
        echo -e "${YELLOW}⚠️  守护进程代理配置不存在${NC}"
    fi
    
    # 移除客户端代理配置
    if [ -f ~/.docker/config.json ]; then
        rm -f ~/.docker/config.json
        echo -e "${GREEN}✅ 客户端代理配置已移除${NC}"
    else
        echo -e "${YELLOW}⚠️  客户端代理配置不存在${NC}"
    fi
    
    # 恢复 daemon.json（如果有备份）
    BACKUP_FILE=$(ls /etc/docker/daemon.json.backup.* 2>/dev/null | tail -1)
    if [ -n "$BACKUP_FILE" ]; then
        sudo cp "$BACKUP_FILE" /etc/docker/daemon.json
        echo -e "${GREEN}✅ daemon.json 已从备份恢复${NC}"
        echo "   备份文件: $BACKUP_FILE"
    else
        echo -e "${YELLOW}⚠️  未找到 daemon.json 备份文件${NC}"
    fi
    
    # 重启 Docker
    if restart_docker; then
        echo -e "${GREEN}✅ Docker 代理配置已完全移除${NC}"
    else
        echo -e "${RED}❌ Docker 重启失败，请手动检查${NC}"
    fi
}

# 显示帮助
show_help() {
    echo -e "${BLUE}Docker 代理配置工具使用说明${NC}"
    echo "=========================="
    echo ""
    echo -e "${YELLOW}用法:${NC} $0 [选项]"
    echo ""
    echo -e "${YELLOW}选项:${NC}"
    echo "  install    安装 Docker 代理配置"
    echo "  test       测试代理连接功能"
    echo "  test-docker 测试 Docker 代理功能"
    echo "  verify     验证当前配置"
    echo "  remove     移除代理配置"
    echo "  help       显示帮助信息"
    echo ""
    echo -e "${YELLOW}示例:${NC}"
    echo "  $0 install      # 安装代理配置"
    echo "  $0 test         # 测试代理连接"
    echo "  $0 test-docker  # 测试 Docker 代理"
    echo "  $0 verify       # 验证配置"
    echo "  $0 remove       # 移除配置"
}

# 主安装流程
install_proxy() {
    echo -e "${BLUE}🚀 开始配置 Docker 代理${NC}"
    echo "========================"
    
    # 检查代理状态
    if ! check_proxy; then
        echo -e "${RED}❌ V2rayA 代理不可用，请先启动代理${NC}"
        echo ""
        echo -e "${YELLOW}💡 解决步骤:${NC}"
        echo "1. 启动 V2rayA 服务: ./v2raya-manager.sh start"
        echo "2. 访问 Web 界面: http://localhost:2017"
        echo "3. 在 Web 界面中选择节点并启动代理"
        exit 1
    fi
    
    echo ""
    echo -e "${YELLOW}📋 开始配置步骤:${NC}"
    
    # 配置代理
    configure_daemon_proxy
    echo ""
    configure_client_proxy
    echo ""
    update_daemon_json
    echo ""
    
    # 重启 Docker
    if restart_docker; then
        echo ""
        echo -e "${GREEN}🎉 Docker 代理配置完成！${NC}"
        echo "======================"
        
        echo ""
        echo -e "${BLUE}📋 配置摘要:${NC}"
        echo "✅ Docker 守护进程代理已配置"
        echo "✅ Docker 客户端代理已配置"
        echo "✅ Docker daemon.json 已更新"
        echo "✅ Docker 服务已重启"
        
        echo ""
        echo -e "${BLUE}🔧 代理信息:${NC}"
        echo "   HTTP 代理: http://$PROXY_HOST"
        echo "   SOCKS5 代理: $SOCKS_HOST"
        echo "   排除地址: $NO_PROXY"
        
        echo ""
        echo -e "${BLUE}📋 下一步操作:${NC}"
        echo "1. 测试代理连接: $0 test"
        echo "2. 测试 Docker 功能: $0 test-docker"
        echo "3. 验证配置: $0 verify"
        echo "4. 尝试拉取镜像: docker pull nginx"
        echo ""
        echo -e "${YELLOW}💡 如有问题，查看 Docker 日志: sudo journalctl -u docker -f${NC}"
    else
        echo -e "${RED}❌ Docker 服务重启失败，请检查配置${NC}"
        exit 1
    fi
}

# 主程序
case "$1" in
    install)
        install_proxy
        ;;
    test)
        test_proxy
        ;;
    test-docker)
        test_docker_proxy
        ;;
    verify)
        verify_configuration
        ;;
    remove)
        remove_proxy_config
        ;;
    help|*)
        show_help
        ;;
esac
EOF

chmod +x configure_docker_proxy.sh

echo "✅ 完整的 Docker 代理配置脚本已生成！"
echo ""
echo "🚀 使用方法："
echo "  ./configure_docker_proxy.sh install      # 安装代理配置"
echo "  ./configure_docker_proxy.sh test         # 测试代理连接"
echo "  ./configure_docker_proxy.sh test-docker  # 测试 Docker 代理"
echo "  ./configure_docker_proxy.sh verify       # 验证配置"
echo "  ./configure_docker_proxy.sh remove       # 移除配置"
echo "  ./configure_docker_proxy.sh help         # 查看帮助"
```

这个完整脚本包含了所有修正：

### ✅ **主要改进**
1. **准确的代理检测** - 使用 `%{http_code}` 获取状态码
2. **多重验证** - 状态码 + 内容检查 + IP 地址对比
3. **详细的测试** - 分别测试 HTTP、SOCKS5、直连
4. **完整的配置** - 守护进程、客户端、daemon.json 三重配置
5. **错误处理** - 详细的错误信息和解决建议

### ✅ **功能特性**
- 🔍 智能检测 V2rayA 代理状态
- 🔧 自动配置所有必要的 Docker 代理设置
- 🧪 全面的代理功能测试
- 📋 详细的配置验证
- 🗑️ 完整的配置移除功能
- 💾 自动备份原有配置

现在你可以放心使用这个脚本来配置 Docker 代理了！