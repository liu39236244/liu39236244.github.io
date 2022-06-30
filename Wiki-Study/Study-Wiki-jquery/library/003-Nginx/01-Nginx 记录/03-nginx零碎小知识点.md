# nginx零碎知识点


## 关于转发路径代斜杠与不代斜杠

参考博客：https://blog.csdn.net/lihefei_coder/article/details/121033283

总结：
如果proxy_pass末尾有斜杠/，proxy_pass不拼接location的路径
如果proxy_pass末尾无斜杠/，proxy_pass会拼接location的路径

一、proxy_pass末尾有斜杠
location  /api/ {
    proxy_pass http://127.0.0.1:8000/;
}

请求地址：http://localhost/api/test
转发地址：http://127.0.0.1:8000/test

二、proxy_pass末尾无斜杠
location  /api/ {
    proxy_pass http://127.0.0.1:8000;
}

请求地址：http://localhost/api/test
转发地址：http://127.0.0.1:8000/api/test

三、proxy_pass包含路径，且末尾有斜杠
location  /api/ {
    proxy_pass http://127.0.0.1:8000/user/;
}

请求地址：http://localhost/api/test
转发地址：http://127.0.0.1:8000/user/test

四、proxy_pass包含路径，末尾无斜杠
location  /api/ {
    proxy_pass http://127.0.0.1:8000/user;
}

请求地址：http://localhost/api/test
转发地址：http://127.0.0.1:8000/usertest



## nginx黑白名单设置

```
 server {
        listen       8092;
        server_name  117.14.55.74;
    
        #charset koi8-r;

        #access_log  logs/host.access.log  main;

		location /app/devices/ {
			 allow ip;
			 allow ip;
			 deny  all;
		}
		location /app/getDeviceData {
			 allow ip;
			 allow ip; 
			 deny  all;
		}


        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
```


## ngixn tcp 的配置

```

stream {
    # 添加socket转发的代理
    upstream socket_proxy {
        hash $remote_addr consistent;
        # 转发的目的地址和端口
        server 127.0.0.1:8093 weight=5 max_fails=3 fail_timeout=30s;
    }
 
    # 提供转发的服务，即访问localhost:8092，会跳转至代理socket_proxy指定的转发地址
    server {
       listen 8092;
       proxy_connect_timeout 1s;
       proxy_timeout 3s;
       proxy_pass socket_proxy;
    }
}

stream {
  upstream redis {
   # 目标 redis server ip和host
    server 192.168.0.111:6379;
  }
  server {
   # 要监听的外部端口，比如你的域名是www.baidu.com,那么你本地连接redis的时候，host就填www.baidu.com，端口8899
    listen 8899;
    proxy_pass redis;
  }
}

```