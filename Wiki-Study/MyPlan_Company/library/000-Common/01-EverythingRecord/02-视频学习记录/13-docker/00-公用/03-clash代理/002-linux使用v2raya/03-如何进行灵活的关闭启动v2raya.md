好的！我来写一个完整的 V2rayA 管理脚本：

```bash
cat > v2raya-manager.sh << 'EOF'
#!/bin/bash

# V2rayA 管理脚本
# 用于控制 V2rayA 服务和代理状态

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 配置信息
V2RAYA_WEB="http://localhost:2017"
HTTP_PROXY="127.0.0.1:20171"
SOCKS_PROXY="127.0.0.1:20170"

# 显示标题
show_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════╗"
    echo "║           V2rayA 管理工具            ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}"
}

# 检查服务状态
check_service_status() {
    if systemctl is-active --quiet v2raya; then
        echo -e "${GREEN}✅ V2rayA 服务运行中${NC}"
        return 0
    else
        echo -e "${RED}❌ V2rayA 服务未运行${NC}"
        return 1
    fi
}

# 检查代理端口状态
check_proxy_status() {
    local http_port=$(netstat -tlnp 2>/dev/null | grep ":20171" | wc -l)
    local socks_port=$(netstat -tlnp 2>/dev/null | grep ":20170" | wc -l)
    
    if [ $http_port -gt 0 ] && [ $socks_port -gt 0 ]; then
        echo -e "${GREEN}✅ 代理端口已启动${NC}"
        echo -e "   HTTP: ${CYAN}$HTTP_PROXY${NC}"
        echo -e "   SOCKS5: ${CYAN}$SOCKS_PROXY${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  代理端口未启动${NC}"
        echo -e "   (需要在 Web 界面中启动代理)"
        return 1
    fi
}

# 显示当前状态
show_status() {
    echo -e "${BLUE}📊 当前状态${NC}"
    echo "============"
    
    # 服务状态
    check_service_status
    
    # 代理状态
    check_proxy_status
    
    # 系统代理状态
    echo ""
    echo -e "${BLUE}🌐 系统代理状态${NC}"
    if [ -n "$http_proxy" ] || [ -n "$HTTP_PROXY" ]; then
        echo -e "${GREEN}✅ 系统代理已设置${NC}"
        echo -e "   HTTP_PROXY: ${CYAN}${HTTP_PROXY:-$http_proxy}${NC}"
        echo -e "   HTTPS_PROXY: ${CYAN}${HTTPS_PROXY:-$https_proxy}${NC}"
    else
        echo -e "${YELLOW}⚠️  系统代理未设置${NC}"
    fi
    
    # Web 界面状态
    echo ""
    echo -e "${BLUE}🌐 Web 界面${NC}"
    if curl -s --connect-timeout 3 "$V2RAYA_WEB" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Web 界面可访问: ${CYAN}$V2RAYA_WEB${NC}"
    else
        echo -e "${RED}❌ Web 界面无法访问${NC}"
    fi
}

# 启动服务
start_service() {
    echo -e "${BLUE}🚀 启动 V2rayA 服务...${NC}"
    
    if systemctl is-active --quiet v2raya; then
        echo -e "${YELLOW}⚠️  服务已在运行${NC}"
        return 0
    fi
    
    sudo systemctl start v2raya
    sleep 3
    
    if systemctl is-active --quiet v2raya; then
        echo -e "${GREEN}✅ V2rayA 服务启动成功${NC}"
        echo -e "${CYAN}🌐 Web 界面: $V2RAYA_WEB${NC}"
        echo -e "${YELLOW}💡 请在 Web 界面中选择节点并启动代理${NC}"
    else
        echo -e "${RED}❌ V2rayA 服务启动失败${NC}"
        echo "查看错误日志:"
        sudo journalctl -u v2raya -n 5 --no-pager
    fi
}

# 停止服务
stop_service() {
    echo -e "${BLUE}🛑 停止 V2rayA 服务...${NC}"
    
    if ! systemctl is-active --quiet v2raya; then
        echo -e "${YELLOW}⚠️  服务已停止${NC}"
        return 0
    fi
    
    sudo systemctl stop v2raya
    sleep 2
    
    if ! systemctl is-active --quiet v2raya; then
        echo -e "${GREEN}✅ V2rayA 服务已停止${NC}"
        echo -e "${YELLOW}💡 代理功能已关闭${NC}"
    else
        echo -e "${RED}❌ V2rayA 服务停止失败${NC}"
    fi
}

# 重启服务
restart_service() {
    echo -e "${BLUE}🔄 重启 V2rayA 服务...${NC}"
    
    sudo systemctl restart v2raya
    sleep 3
    
    if systemctl is-active --quiet v2raya; then
        echo -e "${GREEN}✅ V2rayA 服务重启成功${NC}"
        echo -e "${CYAN}🌐 Web 界面: $V2RAYA_WEB${NC}"
    else
        echo -e "${RED}❌ V2rayA 服务重启失败${NC}"
        sudo journalctl -u v2raya -n 5 --no-pager
    fi
}

# 设置系统代理
set_system_proxy() {
    echo -e "${BLUE}🔧 设置系统代理...${NC}"
    
    # 检查代理端口是否可用
    if ! netstat -tlnp 2>/dev/null | grep -q ":20171"; then
        echo -e "${RED}❌ 代理端口未启动，请先在 Web 界面启动代理${NC}"
        return 1
    fi
    
    # 设置环境变量
    export http_proxy="http://$HTTP_PROXY"
    export https_proxy="http://$HTTP_PROXY"
    export HTTP_PROXY="http://$HTTP_PROXY"
    export HTTPS_PROXY="http://$HTTP_PROXY"
    export no_proxy="localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
    export NO_PROXY="localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
    
    echo -e "${GREEN}✅ 系统代理已设置${NC}"
    echo -e "   HTTP: ${CYAN}$HTTP_PROXY${NC}"
    echo -e "   HTTPS: ${CYAN}$HTTP_PROXY${NC}"
    echo ""
    echo -e "${YELLOW}💡 要在当前会话中生效，请运行:${NC}"
    echo -e "${CYAN}source <($0 export-proxy)${NC}"
    echo ""
    echo -e "${YELLOW}💡 要永久生效，请运行:${NC}"
    echo -e "${CYAN}$0 save-proxy${NC}"
}

# 取消系统代理
unset_system_proxy() {
    echo -e "${BLUE}🚫 取消系统代理...${NC}"
    
    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY no_proxy NO_PROXY
    
    echo -e "${GREEN}✅ 系统代理已取消${NC}"
    echo ""
    echo -e "${YELLOW}💡 要在当前会话中生效，请运行:${NC}"
    echo -e "${CYAN}source <($0 export-unproxy)${NC}"
}

# 导出代理设置命令
export_proxy() {
    cat << 'PROXY_EXPORT'
export http_proxy="http://127.0.0.1:20171"
export https_proxy="http://127.0.0.1:20171"
export HTTP_PROXY="http://127.0.0.1:20171"
export HTTPS_PROXY="http://127.0.0.1:20171"
export no_proxy="localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
export NO_PROXY="localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
PROXY_EXPORT
}

# 导出取消代理命令
export_unproxy() {
    cat << 'UNPROXY_EXPORT'
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY no_proxy NO_PROXY
UNPROXY_EXPORT
}

# 保存代理到配置文件
save_proxy() {
    echo -e "${BLUE}💾 保存代理配置到系统...${NC}"
    
    sudo tee /etc/profile.d/v2raya-proxy.sh << 'PROXY_CONFIG'
#!/bin/bash
# V2rayA 代理配置

# 检查 V2rayA 代理是否可用
if netstat -tlnp 2>/dev/null | grep -q ":20171"; then
    export http_proxy="http://127.0.0.1:20171"
    export https_proxy="http://127.0.0.1:20171"
    export HTTP_PROXY="http://127.0.0.1:20171"
    export HTTPS_PROXY="http://127.0.0.1:20171"
    export no_proxy="localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
    export NO_PROXY="localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
fi
PROXY_CONFIG
    
    sudo chmod +x /etc/profile.d/v2raya-proxy.sh
    echo -e "${GREEN}✅ 代理配置已保存到 /etc/profile.d/v2raya-proxy.sh${NC}"
    echo -e "${YELLOW}💡 新的终端会话将自动应用代理设置${NC}"
}

# 删除保存的代理配置
remove_saved_proxy() {
    echo -e "${BLUE}🗑️  删除保存的代理配置...${NC}"
    
    if [ -f "/etc/profile.d/v2raya-proxy.sh" ]; then
        sudo rm -f /etc/profile.d/v2raya-proxy.sh
        echo -e "${GREEN}✅ 代理配置文件已删除${NC}"
    else
        echo -e "${YELLOW}⚠️  代理配置文件不存在${NC}"
    fi
}

# 测试代理连接
test_proxy() {
    echo -e "${BLUE}🧪 测试代理连接...${NC}"
    
    # 检查代理端口
    if ! netstat -tlnp 2>/dev/null | grep -q ":20171"; then
        echo -e "${RED}❌ 代理端口未启动${NC}"
        return 1
    fi
    
    echo "测试 HTTP 代理..."
    if curl --proxy "http://$HTTP_PROXY" --connect-timeout 10 -s -I "https://www.google.com" | grep -q "200 OK"; then
        echo -e "${GREEN}✅ HTTP 代理连接正常${NC}"
    else
        echo -e "${RED}❌ HTTP 代理连接失败${NC}"
    fi
    
    echo "测试 SOCKS5 代理..."
    if curl --socks5 "$SOCKS_PROXY" --connect-timeout 10 -s -I "https://www.google.com" | grep -q "200 OK"; then
        echo -e "${GREEN}✅ SOCKS5 代理连接正常${NC}"
    else
        echo -e "${RED}❌ SOCKS5 代理连接失败${NC}"
    fi
    
    echo "测试国内网站直连..."
    if curl --connect-timeout 5 -s -I "https://www.baidu.com" | grep -q "200 OK"; then
        echo -e "${GREEN}✅ 国内网站直连正常${NC}"
    else
        echo -e "${YELLOW}⚠️  国内网站连接异常${NC}"
    fi
}

# 查看日志
show_logs() {
    echo -e "${BLUE}📋 V2rayA 服务日志${NC}"
    echo "=================="
    echo -e "${YELLOW}按 Ctrl+C 退出日志查看${NC}"
    echo ""
    sudo journalctl -u v2raya -f
}

# 打开 Web 界面
open_web() {
    echo -e "${BLUE}🌐 V2rayA Web 界面信息${NC}"
    echo "======================"
    echo -e "本地访问: ${CYAN}$V2RAYA_WEB${NC}"
    echo -e "SSH 隧道: ${CYAN}ssh -L 2017:localhost:2017 root@$(hostname -I | awk '{print $1}')${NC}"
    echo ""
    echo -e "${YELLOW}💡 如果需要外网访问，请配置安全组开放 2017 端口${NC}"
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}V2rayA 管理工具使用说明${NC}"
    echo "======================="
    echo ""
    echo -e "${YELLOW}服务管理:${NC}"
    echo "  start          启动 V2rayA 服务"
    echo "  stop           停止 V2rayA 服务"
    echo "  restart        重启 V2rayA 服务"
    echo "  status         查看服务状态"
    echo ""
    echo -e "${YELLOW}代理管理:${NC}"
    echo "  proxy-on       设置系统代理"
    echo "  proxy-off      取消系统代理"
    echo "  save-proxy     保存代理配置到系统"
    echo "  remove-proxy   删除保存的代理配置"
    echo "  test           测试代理连接"
    echo "  logs           查看 V2rayA 服务日志"
    echo "  web            打开 V2rayA Web 界面信息"
    echo ""
    echo -e "${YELLOW}其他:${NC}"
    echo "  export-proxy   导出代理环境变量（用于当前终端）"
    echo "  export-unproxy 导出取消代理环境变量（用于当前终端）"
    echo "  help           显示此帮助信息"
    echo ""
    echo -e "${BLUE}示例:${NC}"
    echo "  $0 start         # 启动服务"
    echo "  $0 proxy-on      # 开启系统代理"
    echo "  $0 proxy-off     # 关闭系统代理"
}

# 主程序
case "$1" in
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    status)
        show_status
        ;;
    proxy-on)
        set_system_proxy
        ;;
    proxy-off)
        unset_system_proxy
        ;;
    save-proxy)
        save_proxy
        ;;
    remove-proxy)
        remove_saved_proxy
        ;;
    test)
        test_proxy
        ;;
    logs)
        show_logs
        ;;
    web)
        open_web
        ;;
    export-proxy)
        export_proxy
        ;;
    export-unproxy)
        export_unproxy
        ;;
    help|*)
        show_help
        ;;
esac

EOF

chmod +x v2raya-manager.sh

echo "脚本已生成：v2raya-manager.sh"
echo "使用示例："
echo "  ./v2raya-manager.sh start       # 启动服务"
echo "  ./v2raya-manager.sh proxy-on    # 开启系统代理"
echo "  ./v2raya-manager.sh proxy-off   # 关闭系统代理"
echo "  ./v2raya-manager.sh status      # 查看状态"
echo "  ./v2raya-manager.sh help        # 查看帮助"

```