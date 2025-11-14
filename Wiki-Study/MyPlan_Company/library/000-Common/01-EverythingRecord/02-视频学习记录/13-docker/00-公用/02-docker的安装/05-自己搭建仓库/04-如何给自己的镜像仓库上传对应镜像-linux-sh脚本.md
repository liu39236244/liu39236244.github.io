# 好的！我来帮你整理并创建一个完整的镜像下载和推送脚本。

## 📦 **镜像清单整理**

### 🌐 **Web 服务**
- nginx (官方)

### ☕ **开发环境**
- openjdk:8, openjdk:17(JDK)
- golang (Go)
- continuumio/miniconda3 (Miniconda)
- python (官方 Python)

### 🗄️ **数据库**
- mongodb
- redis
- mysql:8.0, mysql:9.0
- postgres (PostgreSQL)
- ibmcom/db2 (DB2)

### 📊 **ELK 日志系统**
- elasticsearch
- logstash
- kibana
- file日志收集)
- metricbeat (指标收集，可选)

## 🚀 **一键下载推送脚本**

```bash
cat > sync_images_to_registry.sh << 'EOF'
#!/bin/bash

# 镜像同步到私有仓库脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 私有仓库地址
PRIVATE_REGISTRY="47.95.43.103:5000"

echo -e "${BLUE}🐳 镜像同步到私有仓库${NC}"
echo "======================="
echo -e "目标仓库: ${CYAN}$PRIVATE_REGISTRY${NC}"
echo ""

# 镜像列表定义
declare -A IMAGE_CATEGORIES

# Web 服务
IMAGE_CATEGORIES[web]="
nginx:latest
nginx:alpine
nginx:1.25
"

# 开发环境
IMAGE_CATEGORIES[dev]="
openjdk:8
openjdk:8-alpine
openjdk:17
openjdk:17-alpine
golang:latest
golang:1.21
golang:alpine
continuumio/miniconda3:latest
python:3.9
python:3.10
python:3.11
python:3.12
python:alpine
"

# 数据库
IMAGE_CATEGORIES[database]="
mongo:latest
mongo:7.0
redis:latest
redis:7
redis:alpine
mysql:8.0
mysql:9.0
postgres:latest
postgres:15
ibmcom/db2:latest
"

# ELK 日志系统
IMAGE_CATEGORIES[elk]="
elasticsearch:8.11.0
elasticsearch:7.17.15
logstash:8.11.0
logstash:7.17.15
kibana:8.11.0
kibana:7.17.15
elastic/filebeat:8.11.0
elastic/filebeat:7.17.15
elastic/metricbeat:8.11.0
"

# 函数：拉取并推送镜像
sync_image() {
    local image=$1
    local category=$2
    
    echo -e "${BLUE}📥 处理镜像: ${CYAN}$image${NC}"
    
    # 1. 拉取镜像
    echo -n "  拉取镜像... "
    if docker pull "$image" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌ 拉取失败${NC}"
        return 1
    fi
    
    # 2. 标记镜像
    local target_image="$PRIVATE_REGISTRY/$image"
    echo -n "  标记镜像... "
    if docker tag "$image" "$target_image" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌ 标记失败${NC}"
        return 1
    fi
    
    # 3. 推送镜像
    echo -n "  推送镜像... "
    if docker push "$target_image" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌ 推送失败${NC}"
        return 1
    fi
    
    # 4. 清理本地镜像（可选）
    echo -n "  清理本地... "
    docker rmi "$image" "$target_image" > /dev/null 2>&1
    echo -e "${YELLOW}🧹${NC}"
    
    echo ""
}

# 函数：同步分类镜像
sync_category() {
    local category=$1
    local images=${IMAGE_CATEGORIES[$category]}
    
    echo -e "${YELLOW}📂 同步分类: $category${NC}"
    echo "================================"
    
    local count=0
    local success=0
    
    for image in $images; do
        if [ -n "$image" ]; then
            ((count++))
            if sync_image "$image" "$category"; then
                ((success++))
            fi
        fi
    done
    
    echo -e "${BLUE}📊 $category 分类统计: ${GREEN}$success${NC}/${BLUE}$count${NC} 成功"
    echo ""
}

# 函数：检查私有仓库连通性
check_registry() {
    echo -e "${BLUE}🔍 检查私有仓库连通性...${NC}"
    
    if curl -s "http://$PRIVATE_REGISTRY/v2/" > /dev/null; then
        echo -e "${GREEN}✅ 私有仓库连接正常${NC}"
        return 0
    else
        echo -e "${RED}❌ 私有仓库连接失败${NC}"
        echo "请确保:"
        echo "1. Registry 服务正在运行"
        echo "2. 网络连接正常"
        echo "3. Docker 配置了 insecure-registries"
        return 1
    fi
}

# 函数：显示镜像统计
show_statistics() {
    echo -e "${BLUE}📊 镜像统计信息${NC}"
    echo "================"
    
    for category in "${!IMAGE_CATEGORIES[@]}"; do
        local images=${IMAGE_CATEGORIES[$category]}
        local count=$(echo "$images" | wc -w)
        echo -e "${CYAN}$category${NC}: $count 个镜像"
    done
    
    local total=0
    for category in "${!IMAGE_CATEGORIES[@]}"; do
        local images=${IMAGE_CATEGORIES[$category]}
        local count=$(echo "$images" | wc -w)
        total=$((total + count))
    done
    
    echo -e "${YELLOW}总计: $total 个镜像${NC}"
    echo ""
}

# 函数：显示帮助
show_help() {
    echo "镜像同步脚本使用说明"
    echo "===================="
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  all           同步所有镜像"
    echo "  web           同步 Web 服务镜像"
    echo "  dev           同步开发环境镜像"
    echo "  database      同步数据库镜像"
    echo "  elk           同步 ELK 日志系统镜像"
    echo "  stats         显示镜像统计"
    echo "  check         检查仓库连通性"
    echo "  help          显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 all        # 同步所有镜像"
    echo "  $0 database   # 只同步数据库镜像"
    echo "  $0 elk        # 只同步 ELK 镜像"
}

# 主函数
main() {
    case "$1" in
        "all")
            if check_registry; then
                show_statistics
                echo -e "${YELLOW}⚠️  这将下载并推送大量镜像，可能需要较长时间${NC}"
                echo "是否继续? (y/N)"
                read -r response
                if [[ "$response" =~ ^[Yy]$ ]]; then
                    for category in web dev database elk; do
                        sync_category "$category"
                    done
                    echo -e "${GREEN}🎉 所有镜像同步完成！${NC}"
                fi
            fi
            ;;
        "web")
            check_registry && sync_category "web"
            ;;
        "dev")
            check_registry && sync_category "dev"
            ;;
        "database")
            check_registry && sync_category "database"
            ;;
        "elk")
            check_registry && sync_category "elk"
            ;;
        "stats")
            show_statistics
            ;;
        "check")
            check_registry
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 执行主函数
main "$1"
EOF

chmod +x sync_images_to_registry.sh

echo "✅ 镜像同步脚本已生成！"
echo ""
echo "🚀 使用方法："
echo "  ./sync_images_to_registry.sh stats     # 查看统计信息"
echo "  ./sync_images_to_registry.sh check     # 检查仓库连通性"
echo "  ./sync_images_to_registry.sh database  # 同步数据库镜像"
echo "  ./sync_images_to_registry.sh elk       # 同步 ELK 镜像"
echo "  ./sync_images_to_registry.sh all       # 同步所有镜像"
```

## 📋 **分步执行建议**

### 1. 先检查连通性
```bash
./sync_images_to_registry.sh check
```

### 2. 查看统计信息
```bash
./sync_images_to_registry.sh stats
```

### 3. 分类同步（推荐）
```bash
# 先同步基础镜像
./sync_images_to_registry.sh web

# 再同步开发环境
./sync_images_to_registry.sh dev

# 然后数据库
./sync_images_to_registry.sh database

# 最后 ELK（镜像较大）
./sync_images_to_registry.sh elk
```

### 4. 或者一次性同步所有
```bash
./sync_images_to_registry.sh all
```

## 🔍 **验证同步结果**

同步完成后可以：

1. **浏览器查看**：http://47.95.43.103:5001/
2. **命令行查看**：
```bash
# 查看私有仓库中的镜像
curl http://47.95.43.103:5000/v2/_catalog

# 测试拉取镜像
docker pull 47.95.43.103:5000/nginx:latest
```

## ⚠️ **注意事项**

- 📶 **网络要求**：需要稳定的网络连接
- 💾 **磁盘空间**：确保有足够的磁盘空间
- ⏱️ **时间消耗**：全部镜像可能需要 1-2 小时
- 🔄 **断点续传**：可以分批执行，中断后重新运行

现在可以开始同步镜像了！建议先从小的分类开始测试。🚀