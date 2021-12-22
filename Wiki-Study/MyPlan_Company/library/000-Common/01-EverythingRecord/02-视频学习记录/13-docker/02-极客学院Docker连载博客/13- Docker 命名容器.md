# Docker 命名容器

不知道你是否注意到了 docker ps -a 中最后那列 name ，这个 name 就是容器的名字

当我们创建一个容器的时候，docker 会自动对它进行命名，比如我们运行下面的命令两次

docker run ubuntu:17.10 /bin/echo "Hello world"

就会创建两个容器，而且两个容器的名字是随机的 (字段有节选)

```
[root@localhost ~]# docker run ubuntu:17.10 /bin/echo "Hello world"
[root@localhost ~]# docker run ubuntu:17.10 /bin/echo "Hello world"
[root@localhost ~]# docker ps -a
CONTAINER ID        NAMES
eb43182ab7c7        unruffled_kirch
dce90ca6db7        practical_mclean
cf38bec0c26f        admiring_wing
e66458d65564        dazzling_ritchie
b3b54da0        vibrant_neumann
e08201b591cd        hopeful_wing
```

当然了，我们也可以通过 --name [name] 参数来为容器指定名字

```
[root@localhost ~]# docker run --name hello_world ubuntu:17.10 /bin/echo "Hello world"
[root@localhost ~]# docker ps -a
CONTAINER ID        NAMES
b65b02799e        hello_world
eb43182ab7c7        unruffled_kirch
dce90ca6db7        practical_mclean
cf38bec0c26f        admiring_wing
e66458d65564        dazzling_ritchie
b3b54da0        vibrant_neumann
e08201b591cd        hopeful_wing
```

名称必须唯一的，且不能包含空格等特殊字符，例如再执行一次下面的命令会报错


```
[root@localhost ~]# docker run --name hello_world ubuntu:17.10 /bin/echo "Hello world"
docker: Error response from daemon: Conflict. The container name "/hello_world" is already in use by container "40b65b02799eb5d65afdc591692ebe95fc89ac6a0824c9891bd96511f6da16ab". You have to remove (or rename) that container to be able to reuse that name.
See 'docker run --help'.
```
意思是 hello_world 已经存在了