# nginx部署前端项目

## nginx 部署vue 打包dist 项目

### nginx 安装

> 1 nginx 简单配置以及启动关闭

* 启动nginx 

如果没有配置环境变量，则需要在nginx安装目录中cmd 

启动命令：start nginx 

检测配置文件是否可用：nginx -t -c D:\shenyabo-Install\Work-Install\Not_Install\nginx-1.18.0\conf\nginx.conf
修改配置文件之后执行重新加载一下配置文件：nginx -s reload


nginx 命令：https://www.cnblogs.com/jianmingyuan/p/10899917.html

6、关闭nginx服务使用以下命令，同样也是一闪而过是正常的，看一下是否进程已消失即可

快速停止
nginx -s stop

完整有序的关闭
nginx -s quit


```
 listen       7070;
        server_name  localhost;
		client_max_body_size 100M;
		 location / {
            root   D:/pxks/web;
            index  index.html index.htm;
        }
		location /api {
			proxy_pass http://10.0.2.89:9760/api;
		}

```

