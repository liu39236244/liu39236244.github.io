# Docker rm 删除已停止的容器
已经停止的容器并不会自动删除，而是需要我们手动删除它们，这时候就要用到 docker rm 命令了

`docker rm <container_id>`


我们可以使用 docker ps -a 查看所有的容器状态

```
[root@localhost ~]# docker ps -a
CONTAINER ID   ...  STATUS                       ...
e66458d65564   ...  Up 8 minutes                 ...
b3b54da0   ...  Exited (137) 31 minutes ago  ...
e08201b591cd   ...  Exited (0) 45 minutes ago    ...
e4604a32   ...  Exited (0) About an hour ago ...
```

那些 STATUS 栏以 Exited 开头的都是已经退出停止了的容器

我们可以使用下面的命令删除容器 6801e4604a32

```
[root@localhost ~]# docker rm 6801e4604a32
e4604a32
```

docker rm 命令删除成功后会返回已经删除的容器的 ID

有一点需要注意，docker rm 命令只能删除已经停止的容器的 ID，还未停止的容器会报错

```
[root@localhost ~]# docker rm e66458d65564
Error response from daemon: You cannot remove a running container e66458d655640933e15196c5d60715b235f34f1b104fac00159e708e4e3c77b3. Stop the container before attempting removal or force remove

```

错误信息很好理解，就是未停止的溶脂不能删除，如果要删除必须先停止它

更多 docker rm 命令使用方法，可以访问 docker rm 命令