是的，可以配置！但需要注意：

## 🎯 **关键区别**

- **http://47.95.43.103:5001/** - 这是 **Web UI 界面**（浏览器查看用）
- **http://47.95.43.103:5000/** - 这是 **Registry API**（Docker 命令行用）

## 🔧 **Docker 配置位置**

### 在 `/etc/docker/daemon.json` 中添加：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ],
  "insecure-registries": [
    "47.95.43.103:5000"
  ]
}
```

**注意**：
- Docker 使用的是 **5000 端口**（Registry API）
- 需要添加到 `insecure-registries` 因为是 HTTP 而不是 HTTPS
- 添加后需要重启 Docker：`sudo systemctl restart docker`

## 📋 **使用方法**

配置后可以这样使用：

```bash
# 推送镜像
docker tag nginx 47.95.43.103:5000/nginx
docker push 47.95.43.103:5000/nginx

# 拉取镜像  
docker pull 47.95.43.103:5000/nginx

# 浏览器查看（Web UI）
http://47.95.43.103:5001/
```

**总结**：Docker 配置用 5000 端口，浏览器查看用 5001 端口！ 🚀