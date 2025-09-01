## 注意如果下载不下来修改docker 的代理

# 1. 停止服务（忽略警告）

cd ~/rustdesk
docker compose down

# 2. 配置Docker镜像源

sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://dockerproxy.com",
    "https://docker.nju.edu.cn"
  ]
}
EOF

# 3. 重启Docker

sudo systemctl daemon-reload
sudo systemctl restart docker


# 4. 拉取镜像

echo "正在下载镜像..."
docker pull rustdesk/rustdesk-server:latest

# 5. 启动服务

比如之前写好了 docker-compose.yml 文件 想要在配置完新的镜像地址以后进行测试，就进入到对应的docker-compose.yml 文件目录下进行启动

docker compose up -d


## 备份配置文件，重新设置更多的镜像地址

# 备份当前配置
sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.backup

# 配置新的镜像源（包含中科院等国内源）
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://docker.m.daocloud.io",
    "https://dockerproxy.com",
    "https://docker.nju.edu.cn",
    "https://mirror.baidubce.com",
    "https://dockerhub.azk8s.cn",
    "https://reg-mirror.qiniu.com"
  ]
}
EOF

# 重启 Docker 服务
sudo systemctl daemon-reload
sudo systemctl restart docker
sleep 5

# 验证配置
docker info | grep -A 10 "Registry Mirrors"