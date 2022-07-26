# Nginx 启动命令


# 总结

```shell

1.首先利用配置文件启动nginx。

命令:nginx -t -c /usr/local/nginx/conf/nginx.conf



重启服务：service nginx restart



2.快速停止或关闭Nginx：nginx -s stop



3. 正常停止或关闭Nginx：nginx -s quit



4. 配置文件修改重装载命令：nginx -s reload




```

# 参考博主


# nginx 限制页面访问资源问题


## 以下是项目中要吧zuul中的 api/swagger页面给禁用，但是尝试过的n种方法都不起效果

下属方式有待研究，不过最终还是临时去掉zuul服务启动类上的 enableSwagger注解才暂时解决了

```

if ($request_uri ~* "^/api/swagger-ui.html$") {
    return 404;
}

location ~ /.*/swagger-ui.html.* {
    return 404;
}
location ~ /api/xx/xx/doc.html {
    return 403;
}
if ($request_uri  ~* "/swagger-ui"){
    return 404;
}
 if ($request_uri ~* "^/api/swagger-ui.html$") {
    return 404;
}

location ~* /(swagger-ui.html)$ {
 deny all;
}
location ~* /(swagger-ui.html)$ {
			deny all;
		}

location ~ /.*/swagger-ui.html.* {
    return 404;
}
```
