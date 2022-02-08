# mongodb 的恢复以及备份以及导出整个库



## 总结

注意路径不能有空格

```java
mongodump -h IP --port 27017  -d zzzh -o C:\Users\Administrator\Desktop\
mongorestore -d zzzh --drop C:\Users\Administrator\Desktop\zzzh

mongodump -h 10.0.2.4 --port 27017  -d xzpx_mongodb -o C:\Users\Administrator\Desktop\
mongorestore -d xzpx_mongodb --drop C:\Users\Administrator\Desktop\xzpx_mongodb
```

