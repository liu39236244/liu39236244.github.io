# GitLab Docker Compose 配置优化

我来帮您修改这个配置，解决域名问题、卷挂载路径，并说明管理员账号设置。

## 修改后的配置

```yaml
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
        # gitlab_rails['initial_root_password'] = 'your_secure_password_here'
    ports:
      - '80:80'
      - '443:443'
      - '22:22'
    volumes:
      - '/home/shenyabo/my-docker/gitlab/config:/etc/gitlab'
      - '/home/shenyabo/my-docker/gitlab/logs:/var/log/gitlab'
      - '/home/shenyabo/my-docker/gitlab/data:/var/opt/gitlab'
```

## 关于域名的说明

**hostname 不能完全注释掉**，但可以这样处理：

### 选项1：使用 localhost（推荐用于测试）

```yaml
hostname: 'localhost'
environment:
  GITLAB_OMNIBUS_CONFIG: |
    external_url 'http://localhost'
```

### 选项2：使用服务器IP

```yaml
hostname: '192.168.1.100'  # 替换为您的服务器IP
environment:
  GITLAB_OMNIBUS_CONFIG: |
    external_url 'http://192.168.1.100'  # 替换为您的服务器IP
```

## GitLab 管理员账号说明

### 默认管理员账号

- **用户名**: `root`
- **初始密码**: 在第一次启动时自动生成

### 获取初始密码的方法

**方法1：查看容器日志**

```bash
docker logs gitlab | grep "Password"
```

**方法2：在容器内查看密码文件**

```bash
docker exec gitlab cat /etc/gitlab/initial_root_password
```

**方法3：通过挂载的卷查看**

```bash
cat /home/shenyabo/my-docker/gitlab/config/initial_root_password
```

### 设置自定义管理员密码（可选）

在第一次启动后，可以修改配置设置自定义密码：

```yaml
environment:
  GITLAB_OMNIBUS_CONFIG: |
    external_url 'http://localhost'
    gitlab_rails['initial_root_password'] = 'YourSecurePassword123'
```

## 完整的部署步骤

### 1. 创建目录结构

```bash
mkdir -p /home/shenyabo/my-docker/gitlab/{config,logs,data}
```

### 2. 创建 docker-compose.yml 文件

将上面的配置保存为 `docker-compose.yml`

### 3. 启动 GitLab

```bash
cd /home/shenyabo/my-docker/gitlab
docker-compose up -d
```

### 4. 等待初始化完成

GitLab 启动需要几分钟时间，查看状态：

```bash
docker logs gitlab -f
```

### 5. 访问 GitLab

- 访问: `http://localhost` 或 `http://您的服务器IP`
- 用户名: `root`
- 密码: 通过上述方法获取的初始密码

## 第一次登录后的重要操作

1. **立即修改 root 密码**
2. **配置管理员邮箱**
3. **设置 SMTP（如果需要邮件功能）**
4. **备份初始密码文件**

## 注意事项

1. **资源要求**: GitLab 需要至少 4GB RAM，首次启动较慢
2. **端口冲突**: 确保 80、443、22 端口没有被占用
3. **数据备份**: 定期备份挂载的卷数据
4. **域名后续配置**: 以后有域名时，修改 `external_url` 并重启即可

## 验证部署

```bash
# 检查容器状态
docker ps

# 检查服务状态
docker exec gitlab gitlab-ctl status

# 查看运行日志
docker logs gitlab
```

这样配置后，您就可以在没有域名的情况下正常使用 GitLab 了。
