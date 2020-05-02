# 使用过的脚本总结

# 多个服务器共同执行命令 查找服务器上有 redis 的 d 文件

```shell
# 网段
NETW_SE=192.168.20
IP_LAST=$(seq 60 69)
PORT=36928
# 命令:多个命令之间用分号.
COMMAND="find / -name "*redis*" -type d"
#################################

for IP in ${IP_LAST}
do
   echo -e "\n \033[36m ${NETW_SE}.$IP \033[0m"
   ssh -p ${PORT} ${NETW_SE}.$IP ${COMMAND}
done
[ $? -eq 0 ] && exit 0

```

注意事项：
如果在命令行下面* 不添加转移符的话则会报错
```
[root@NUC-1 data]# find . -name \*1812\*dat -type f  
./1490718125000.dat
./1490718129000.dat
./1490718123000.dat
./1490718121000.dat
./1490718127000.dat
[root@NUC-1 data]# find . -name "*1812*dat" -type f
./1490718125000.dat
./1490718129000.dat
./1490718123000.dat
./1490718121000.dat
./1490718127000.dat
```
