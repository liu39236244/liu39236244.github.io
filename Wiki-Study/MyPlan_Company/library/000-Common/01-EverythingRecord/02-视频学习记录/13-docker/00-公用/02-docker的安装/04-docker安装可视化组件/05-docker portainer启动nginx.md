```yml
version: '3.8'

# 定义Nginx配置

configs:
  nginx_config:
    content: |
      # 第一个应用 - 主站点
      server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

      location / {
          # 处理单页应用路由
          try_files $uri $uri/ /index.html;
          add_header Cache-Control "no-cache, no-store, must-revalidate";
          add_header Pragma "no-cache";
          add_header Expires 0;
        }

      location ~*\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
          expires 1y;
          add_header Cache-Control "public, immutable";
        }
      }
      
      # 第二个应用 - 内部端口
      server {
        listen 8081;
        server_name _;
        root /usr/share/nginx/html2;
        index index.html;

      location / {
          # 处理单页应用路由
          try_files $uri $uri/ /index.html;
          add_header Cache-Control "no-cache, no-store, must-revalidate";
          add_header Pragma "no-cache";
          add_header Expires 0;
        }

      location ~*\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
          expires 1y;
          add_header Cache-Control "public, immutable";
        }
      }

services:
  nginx:
    image: nginx:alpine
    container_name: monitoring-map-nginx
    ports:
      - "3000:80"    # 第一个应用：外部 3000 -> 容器 80
      - "8081:8081"  # 第二个应用：外部 8081 -> 容器 8081
    volumes:
      - ./dist:/usr/share/nginx/html      # 第一个应用代码
      - ./dist2:/usr/share/nginx/html2    # 第二个应用代码
      # 添加日志持久化
      - /data/compose/5/logs:/var/log/nginx
      # 添加配置文件挂载（假设宿主机配置目录为/data/compose/5/conf.d）
      - /data/compose/5/conf.d:/etc/nginx/conf.d
      # 添加配置文件挂载（假设宿主机配置目录为/data/compose/5/conf）
      - /data/compose/5/conf:/etc/nginx/conf
    configs:
      - source: nginx_config
        target: /etc/nginx/conf.d/default.conf
    restart: always
    networks:
      - monitoring-map-network

networks:
  monitoring-map-network:
    driver: bridge

```


## docker 使用的命令

docker exec -it monitoring-map-nginx sh
docker inspect monitoring-map-nginx | grep -A 20 "Mounts"

 cd /etc/nginx

  cat /etc/nginx/conf.d/default.conf