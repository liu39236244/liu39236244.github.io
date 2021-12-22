# Docker start 启动容器

对于一个已经是停止状态的容器，我们可以重复使用它们，而再次启动它们的命令就是 docker start

`docker start <container_id>`


然后我们就可以使用 docker start 重启这个容器 cf38bec0c26f 了

```
[root@localhost ~]# docker start cf38bec0c26f
cf38bec0c26f
```

docker start 返回的是启动的容器的 ID，至于容器的日志，会统一保存到 Docker logs 中

然后我们就可以使用 docker logs 命令查看刚刚容器的输出

```
[root@localhost ~]#  docker logs cf38bec0c26f
Hello world
Hello world
```

docker start vs docker run
docker run 和 docker start 看起来好像都是启动一个容器，但它们是有本质区别的

1、 docker run 从一个镜像启动一个容器，多次运行同样的命令会创建多个容器
2、 docker start 从一个容器 ID 启动一个容器，多次启动同一个容器的 ID 的结果都一样