# 命令帮助

## 

答案就是列出 Docker 所支持的所有命令


很长的命令列表，不过只要关注最后一行就好了

大概意思是说可以通过命令 docker command –help 更深入的了解指定的 Docker 命令使用方法

例如我们要查看 docker stats 指令的具体使用方法

可以输入如下的命令

```
[root@localhost ~]# docker stats --help
Usage:  docker stats [OPTIONS] [CONTAINER...]
Display a live stream of container(s) resource usage statistics
Options:
  -a, --all             Show all containers (default shows just running)
      --format string   Pretty-print images using a Go template
      --no-stream       Disable streaming stats and only pull the first result
      --no-trunc        Do not truncate output
```