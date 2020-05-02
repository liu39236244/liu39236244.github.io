
# win redis 下安装启动

## 下载启动

# 问题总结


## win下启动报错 

```
win7启动redis报错Creating Server TCP listening socket *:6379: bind: Unknown error
```

结局：

```
在cmd的redis目录中依次输入

1. redis-cli.exe
2. shutdown
3. exit
4. redis-server.exe redis.windows.conf
```