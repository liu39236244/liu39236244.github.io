# 查看 Docker 代理配置文件位置

## 1. 查看 Docker 守护进程配置

### 检查当前生效的配置

```bash
# 查看 Docker 服务使用的配置文件
sudo systemctl status docker
sudo systemctl cat docker.service
```

### 查看 Docker 主配置文件

```bash
# 查看 daemon.json 配置文件
sudo cat /etc/docker/daemon.json

# 如果文件不存在会提示，这是正常的
```

## 2. 查找代理相关配置文件

### 查找 systemd 代理配置

```bash
# 查看 systemd 的 Docker 服务配置目录
sudo ls -la /etc/systemd/system/docker.service.d/

# 查看具体的代理配置文件
sudo cat /etc/systemd/system/docker.service.d/http-proxy.conf
```

### 查找环境变量配置

```bash
# 查看系统环境变量
cat /etc/environment | grep -i proxy

# 查看用户环境变量
cat ~/.bashrc | grep -i proxy
cat ~/.profile | grep -i proxy
```

## 3. 查看当前 Docker 代理设置

### 查看 Docker 信息中的代理配置

```bash
# 查看 Docker 守护进程配置
sudo docker info | grep -i proxy

# 查看环境变量
sudo docker system info | grep -A 10 -B 10 -i proxy
```

### 检查容器级别的代理

```bash
# 查看运行中容器的环境变量
docker exec <container_name> env | grep -i proxy
```

## 4. 完整的配置文件查找命令

```bash
# 综合查找所有可能的代理配置位置
sudo find /etc -name "*docker*" -type f 2>/dev/null | xargs grep -l proxy 2>/dev/null

# 查找包含代理配置的文件
sudo grep -r "proxy" /etc/docker/ 2>/dev/null
sudo grep -r "PROXY" /etc/systemd/system/docker.service.d/ 2>/dev/null

# 查看所有 Docker 相关配置目录
ls -la /etc/docker/
ls -la /etc/systemd/system/docker.service.d/
```

## 5. 常见代理配置文件位置

### 主要配置文件位置：

```bash
# 1. Docker 守护进程主配置
/etc/docker/daemon.json

# 2. Systemd 服务代理配置
/etc/systemd/system/docker.service.d/http-proxy.conf
/etc/systemd/system/docker.service.d/https-proxy.conf

# 3. 环境变量配置
/etc/environment
/etc/default/docker
~/.docker/config.json

# 4. 旧版本 Docker 配置
/etc/sysconfig/docker
/etc/default/docker
```

## 6. 验证配置文件是否被加载

```bash
# 重新加载 systemd 配置并检查
sudo systemctl daemon-reload
sudo systemctl show docker --property Environment

# 检查 Docker 服务环境变量
sudo systemctl show docker | grep Environment

# 重启 Docker 服务并检查日志
sudo systemctl restart docker
sudo journalctl -u docker.service -f
```

## 7. 如果没有找到配置文件

如果上述命令都没有找到代理配置，说明 Docker 可能没有配置代理，或者代理是通过其他方式设置的：

```bash
# 检查当前网络代理状态
env | grep -i proxy

# 检查 Docker 网络设置
docker network ls
docker network inspect bridge
```

## 8. 快速检查脚本

创建一个快速检查脚本 `check-docker-proxy.sh`：

```bash
#!/bin/bash
echo "=== Docker 代理配置检查 ==="
echo "1. 检查 daemon.json:"
sudo cat /etc/docker/daemon.json 2>/dev/null || echo "未找到 /etc/docker/daemon.json"

echo -e "\n2. 检查 systemd 代理配置:"
sudo ls -la /etc/systemd/system/docker.service.d/ 2>/dev/null
sudo cat /etc/systemd/system/docker.service.d/*.conf 2>/dev/null

echo -e "\n3. 检查环境变量:"
env | grep -i proxy
systemctl show docker | grep -i proxy

echo -e "\n4. Docker 信息中的代理设置:"
docker info | grep -i proxy
```

运行脚本：

```bash
chmod +x check-docker-proxy.sh
./check-docker-proxy.sh
```

通过这些命令，您应该能够找到 Docker 代理配置文件的准确位置。
