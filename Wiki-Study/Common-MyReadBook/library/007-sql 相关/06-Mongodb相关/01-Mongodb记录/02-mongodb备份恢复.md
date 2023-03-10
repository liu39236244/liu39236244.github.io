# mongodb 的恢复以及备份以及导出整个库



## 总结

注意路径不能有空格

```java
mongodump -h IP --port 27017  -d zzzh -o C:\Users\Administrator\Desktop\
mongorestore -d zzzh --drop C:\Users\Administrator\Desktop\zzzh

mongodump -h 10.0.2.4 --port 27017  -d xzpx_mongodb -o C:\Users\Administrator\Desktop\

// 恢复的时候如果不加-h 默认是恢复本机的mongo，否则就是指定服务器上的mongodb
mongorestore -h 10.0.2.4:27017 -d xzpx_mongodb --drop C:\Users\Administrator\Desktop\xzpx_mongodb
```

/opt/module/mongodb-linux-x86_64-4.0.1/bin/mongodump -h 127.0.0.1 --port 27017  -d gp-gcwz  -o /home/sysadm/guochu_bug_fixed_need/data_backup/gp-gcwz


mongodump -h 10.0.2.4 --port 27017  -d gp-yjyl -o C:\Users\Administrator\Desktop\
mongorestore -h 10.0.2.4:27017 -d gs-yjyl-three --drop C:\Users\Administrator\Desktop\gp-yjyl