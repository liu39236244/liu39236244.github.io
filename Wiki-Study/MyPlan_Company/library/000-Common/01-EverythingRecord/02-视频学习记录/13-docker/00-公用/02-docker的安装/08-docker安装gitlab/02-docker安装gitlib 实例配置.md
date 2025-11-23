

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
