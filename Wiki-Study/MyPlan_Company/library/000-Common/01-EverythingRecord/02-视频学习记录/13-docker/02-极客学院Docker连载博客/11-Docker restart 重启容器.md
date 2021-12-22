# Docker restart 重启容器

就像很多常驻后台应用程序动不动可能就需要重启操作一样，有时候我们可能也需要重启容器

而重启容器使用的就是 docker restart 命令

`docker restart <container_id>`

我们先使用下面的命令启动一个常驻后台的容器

```sh
[root@localhost ~]# docker run -d ubuntu:17.10 /bin/sh -c "while true; do echo hello world ; sleep 1; done"
e66458d655640933e15196c5d60715b235f34f1b104fac00159e708e4e3c77b3

```

我们得到一个容器 ID e66458d655640933e15196c5d60715b235f34f1b104fac00159e708e4e3c77b3

然后我们就可以通过这个容器 ID 的前 12 位来重启这个容器

```sh
[root@localhost ~]# docker restart e66458d65564
e66458d65564

```

跟 docker stop 命令一样，它会返回重启的容器 ID

更多 docker restart 命令使用方法，可以访问 docker restart 命令