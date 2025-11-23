# 添加 SSH 和 HTTPS 端口配置

您需要添加 SSH 和 HTTPS 端口映射。以下是完整的配置：

```yaml
version: '3'
services:
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: 'gitlab'
    restart: always
    hostname: 'localhost'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost:8080'
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        # 如果启用 HTTPS，可以添加以下配置
        # nginx['redirect_http_to_https'] = true
        # nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.crt"
        # nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.key"
    ports:
      - '8080:80'    # HTTP Web 访问
      - '2443:443'   # HTTPS 安全访问（宿主机2443 → 容器443）
      - '2222:22'    # SSH Git 访问
    volumes:
      - '/home/shenyabo/my-docker/gitlab/config:/etc/gitlab'
      - '/home/shenyabo/my-docker/gitlab/logs:/var/log/gitlab'
      - '/home/shenyabo/my-docker/gitlab/data:/var/opt/gitlab'
      # 如果需要 HTTPS，添加证书目录
      # - '/home/shenyabo/my-docker/gitlab/ssl:/etc/gitlab/ssl'
```

## 关于 HTTPS 端口的说明

### 当前配置

- **HTTP**: `http://localhost:8080`
- **HTTPS**: `https://localhost:2443`（需要 SSL 证书）
- **SSH**: `ssh://git@localhost:2222`

### 如果您没有 SSL 证书

如果您暂时没有 SSL 证书，可以暂时禁用 HTTPS 重定向：

```yaml
environment:
  GITLAB_OMNIBUS_CONFIG: |
    external_url 'http://localhost:8080'
    gitlab_rails['gitlab_shell_ssh_port'] = 2222
    # 明确禁用 HTTPS 重定向
    nginx['redirect_http_to_https'] = false
```

## 完整的三端口访问方式

部署后，您可以通过以下方式访问：

### 1. Web 界面

```
http://localhost:8080
```

### 2. Git HTTP 克隆

```bash
git clone http://localhost:8080/username/project.git
```

### 3. Git SSH 克隆

```bash
git clone ssh://git@localhost:2222/username/project.git
```

### 4. HTTPS 访问（需要证书）

```
https://localhost:2443
```

## 如果您想使用自签名证书

可以创建自签名证书用于测试：

```bash
# 创建 SSL 目录
mkdir -p /home/shenyabo/my-docker/gitlab/ssl

# 生成自签名证书（在宿主机执行）
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /home/shenyabo/my-docker/gitlab/ssl/gitlab.key \
  -out /home/shenyabo/my-docker/gitlab/ssl/gitlab.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

然后更新配置启用 HTTPS：

```yaml
environment:
  GITLAB_OMNIBUS_CONFIG: |
    external_url 'https://localhost:2443'
    gitlab_rails['gitlab_shell_ssh_port'] = 2222
    nginx['redirect_http_to_https'] = true
    nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.crt"
    nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.key"
ports:
  - '8080:80'
  - '2443:443'
  - '2222:22'
volumes:
  - '/home/shenyabo/my-docker/gitlab/config:/etc/gitlab'
  - '/home/shenyabo/my-docker/gitlab/logs:/var/log/gitlab'
  - '/home/shenyabo/my-docker/gitlab/data:/var/opt/gitlab'
  - '/home/shenyabo/my-docker/gitlab/ssl:/etc/gitlab/ssl'
```

## 推荐配置（简单开始）

对于初次部署，建议先使用 HTTP，等一切正常后再配置 HTTPS：

```yaml
version: '3'
services:
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: 'gitlab'
    restart: always
    hostname: 'localhost'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost:8080'
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        nginx['redirect_http_to_https'] = false
    ports:
      - '8080:80'    # HTTP
      - '2222:22'    # SSH
      # 暂时不映射 443，避免证书问题
    volumes:
      - '/home/shenyabo/my-docker/gitlab/config:/etc/gitlab'
      - '/home/shenyabo/my-docker/gitlab/logs:/var/log/gitlab'
      - '/home/shenyabo/my-docker/gitlab/data:/var/opt/gitlab'
```

这样配置后，您就拥有了完整的 SSH (2222) 和 HTTP (8080) 访问功能，HTTPS 端口 (2443) 也已预留，可以在需要时启用。
