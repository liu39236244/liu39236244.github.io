# 前端域名访问 websocket


## ngixn 配置

参考博客：https://www.jb51.net/article/145390.htm

参考博客2： https://www.cnblogs.com/xiedy001/p/16347379.html


nginx


注意点

1. 进行路径转发前端域名地址需要用wss （我本地前端尝试用ws 能访问但是部署到线上 就提示只能用wss）

2. nginx 配置转发的websocket 需要写http://websocket后端ip:端口/路径/...., 对没错 就是http； （ 注意 这里 我是用的spring cloud 项目，这里的端口配置网关端口还是 对应websocket 服务端口 都能连接websocket)

3. 设置需要设置 httpversion 1.1 

4. 主要配置，就是如下两行

```
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
```

```
    proxy_pass http://websocket;
    proxy_read_timeout 300s;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
 
```


### demo

前端配置路径：

 ws://10.0.2.151:20162/message/webSocketHandler/80800895-5d3a-4410-bcb7-5e9e528999b6

 VITE_APP_WS_URL = wss://域名/websocket
