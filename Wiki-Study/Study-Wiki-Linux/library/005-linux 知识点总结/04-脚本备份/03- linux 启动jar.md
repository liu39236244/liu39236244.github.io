# 1-linux 启动一个进程与结束

## 2-linux 启动jar的shell脚本

start.sh
```
#!/bin/sh

java -jar udfs-1.0.jar > udfs-1.0.out &
echo $! > /var/run/udfs-1.0.pid
```

stop.sh

```
#!/bin/sh

PID=$(cat /var/run/udfs-1.0.pid)
kill -9 $PID

```
