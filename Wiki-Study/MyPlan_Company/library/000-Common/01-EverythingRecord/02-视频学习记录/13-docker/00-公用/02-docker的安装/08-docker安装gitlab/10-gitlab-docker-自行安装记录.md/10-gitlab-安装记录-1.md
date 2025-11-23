```yml
version: '3'
services:
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: 'gitlab'
    restart: always
    hostname: 'localhost'  # 使用localhost或服务器IP
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost'  # 或使用您的服务器IP
        # 可选：设置初始管理员密码（第一次启动后取消注释并修改）
        gitlab_rails['initial_root_password'] = '6wmhyVFYy0t9PwHTEgW4'
    ports:
      - '80:80'
      - '443:443'
      - '22:22'
    volumes:
      - '/home/shenyabo/my-docker/gitlab/config:/etc/gitlab'
      - '/home/shenyabo/my-docker/gitlab/logs:/var/log/gitlab'
      - '/home/shenyabo/my-docker/gitlab/data:/var/opt/gitlab'
```

启动命令：

sudo  docker-compose -f gitlab-compose.yml up -d

修改后的配置文件

```
version: '3'
services:
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: 'gitlab'
    restart: always
    hostname: 'localhost'  # 使用localhost或服务器IP
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost:8081'  # 或使用您的服务器IP
        # 可选：设置初始管理员密码（第一次启动后取消注释并修改）
        gitlab_rails['initial_root_password'] = '6wmhyVFYy0t9PwHTEgW4'
         # 设置SSH端口为2222
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        # 明确禁用 HTTPS 重定向
        # nginx['redirect_http_to_https'] = false
        # 如果启用 HTTPS，可以添加以下配置
        nginx['redirect_http_to_https'] = true
        nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.crt"
        nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.key"
    ports:
      - '8081:80'
      - '2443:443'
      - '2222:22'
    volumes:
      - '/home/shenyabo/my-docker/gitlab/config:/etc/gitlab'
      - '/home/shenyabo/my-docker/gitlab/logs:/var/log/gitlab'
      - '/home/shenyabo/my-docker/gitlab/data:/var/opt/gitlab'
      # 如果需要 HTTPS，添加证书目录
      - '/home/shenyabo/my-docker/gitlab/ssl:/etc/gitlab/ssl'
```

# 如果改了配置 先down


```
sudo docker-compose -f gitlab-compose.yml down
```



# 生成自己证书

## 创建 SSL 目录

mkdir -p /home/shenyabo/my-docker/gitlab/ssl

openssl req -x509 -nodes -days 365 -newkey rsa:2048
  -keyout /home/shenyabo/my-docker/gitlab/ssl/gitlab.key
  -out /home/shenyabo/my-docker/gitlab/ssl/gitlab.crt
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"




# 修改了配置文件以后指定配置文件进行重启



# 修改配置后的正确重启步骤

是的，修改了端口配置后需要重新创建容器。以下是正确的步骤：

## 1. 停止并删除当前容器

```bash
# 停止并删除容器（保留数据卷）
sudo docker-compose -f gitlab-compose.yml down
```

**重要**：使用 `down` 命令会停止并删除容器，但**不会删除**您在 `volumes` 中定义的数据卷，所以您的 GitLab 数据是安全的。

## 2. 重新启动服务

```bash
# 使用新配置重新启动
sudo docker-compose -f gitlab-compose.yml up -d
```

## 完整的操作流程

```bash
# 1. 进入配置文件所在目录
cd /home/shenyabo/my-docker/gitlab

# 2. 停止并删除当前运行的 GitLab 容器
sudo docker-compose -f gitlab-compose.yml down

# 3. 验证容器已停止
docker ps -a | grep gitlab

# 4. 使用新配置重新启动
sudo docker-compose -f gitlab-compose.yml up -d

# 5. 检查新容器状态
docker ps | grep gitlab

# 6. 查看启动日志（GitLab 启动较慢，可能需要等待几分钟）
sudo docker-compose -f gitlab-compose.yml logs -f gitlab
```

## 验证新端口是否生效

```bash
# 检查端口监听状态
sudo netstat -tlnp | grep -E ':(8080|2222|2443)'

# 或者使用 ss 命令
sudo ss -tlnp | grep -E ':(8080|2222|2443)'
```

## 如果遇到问题

### 端口仍然被占用

如果提示端口已被占用，可能是之前的容器没有完全停止：

```bash
# 强制删除所有与 gitlab 相关的容器
docker rm -f gitlab

# 检查是否还有残留容器
docker ps -a | grep gitlab

# 重新启动
sudo docker-compose -f gitlab-compose.yml up -d
```

### 数据持久性确认

您的数据是安全的，因为：

- `down` 命令不会删除命名卷或绑定挂载
- 您的数据保存在宿主机的 `/home/shenyabo/my-docker/gitlab/` 目录中
- 新容器会重新使用相同的数据卷

## 等待初始化完成

GitLab 启动需要一些时间（首次启动可能需要 5-10 分钟），请耐心等待直到看到类似下面的日志：

```
gitlab | ==> /var/log/gitlab/gitlab-workhorse/current <==
gitlab | {"level":"info","msg":"GitLab Workhorse started"}
gitlab | ==> /var/log/gitlab/gitaly/current <==
gitlab | {"level":"info","msg":"gitaly: service listening"}
gitlab | ==> /var/log/gitlab/gitlab-rails/application.log <==
gitlab | Started GET "/" for 172.17.0.1 at 2024-01-01 10:00:00 +0000
```

## 访问测试

启动完成后，访问测试：

```bash
# 测试 HTTP 访问
curl http://localhost:8080

# 或者在浏览器中访问
# http://你的服务器IP:8080
```

## 总结

**关键命令**：

```bash
sudo docker-compose -f gitlab-compose.yml down
sudo docker-compose -f gitlab-compose.yml up -d
```

这样操作后，GitLab 会使用新的端口配置重新启动，所有数据都会保留。
