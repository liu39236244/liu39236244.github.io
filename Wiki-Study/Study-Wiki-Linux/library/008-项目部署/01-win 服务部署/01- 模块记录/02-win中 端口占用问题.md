# win端口占用

## win 中查看对应端口占用，并且kill进程
```
netstat -aon|findstr "6014"

tasklist|findstr "16432"

taskkill /T /F /PID 16432 

```
