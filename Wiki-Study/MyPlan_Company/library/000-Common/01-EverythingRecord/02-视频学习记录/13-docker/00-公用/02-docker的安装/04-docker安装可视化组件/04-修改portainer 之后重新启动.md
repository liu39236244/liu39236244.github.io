如果您修改了 Portainer 的配置文件（比如端口），在不重新下载镜像的前提下执行，有以下几种方法：

## 方法1：直接重启容器（如果只改了端口映射）

```bash
# 停止当前容器
docker stop portainer

# 用新的端口映射重新启动
docker run -d \
  -p 8000:8000 \  # 修改为您想要的新端口
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

## 方法2：使用 Docker Compose（推荐）

如果您使用 `docker-compose.yml`，只需修改文件后重启：

```yaml
version: '3'

services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: always
    ports:
      - "8000:8000"  # 修改为您想要的新端口
      - "9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data

volumes:
  portainer_data:
```

然后执行：

```bash
docker-compose down
docker-compose up -d
```

## 方法3：修改容器配置（不删除容器）

```bash
# 停止容器
docker stop portainer

# 提交容器为新的镜像（可选，如果需要保存当前状态）
docker commit portainer portainer-custom

# 删除旧容器（数据在 volume 中，不会丢失）
docker rm portainer

# 用新配置重新创建容器
docker run -d \
  -p 新端口:9000 \  # 例如 -p 8000:9000
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

## 方法4：使用环境变量配置文件

创建环境变量文件 `portainer.env`：

```bash
# 创建环境变量文件
cat > portainer.env << EOF
PORTAINER_HTTP_PORT=8000
PORTAINER_HTTPS_PORT=9443
EOF

# 使用环境变量文件启动
docker run -d \
  --env-file portainer.env \
  -p 8000:8000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

## 重要提醒

1. **数据安全**：Portainer 的数据存储在 `portainer_data` volume 中，只要不删除这个 volume，您的配置和数据都会保留。
2. **端口冲突**：确保新端口没有被其他服务占用：

   ```bash
   netstat -tulpn | grep :8000
   ```
3. **防火墙**：如果修改了端口，记得更新防火墙规则：

   ```bash
   sudo ufw allow 8000/tcp
   sudo ufw allow 9443/tcp
   ```

**推荐使用 Docker Compose 方式**，这样配置文件化，便于管理和版本控制。
