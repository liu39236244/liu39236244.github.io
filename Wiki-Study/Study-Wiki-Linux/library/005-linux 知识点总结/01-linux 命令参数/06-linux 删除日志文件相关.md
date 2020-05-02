# linux 删除历史数据相关

## linux 删除对应文件，日志

```shell
清除Other01(10.10.48.49)上gps程序产生的20天前日志
cd /home/gps/gpsserver/logs （切换日志路径）
du -sh * （查看文件大小）
find ./ -type f -size +1G（查找大于1G的文件）
find /home/gps/gpsserver/logs/ -type f -name "*.log*" -mtime +20 （查询20天前所有日志）
find /home/gps/gpsserver/logs/ -type f -name "*.log*" -mtime +20 |xargs rm -f （删除20天前所有日志）
rm -f *log.2015* （删除2015年的所有日志）


db02数据库日志
cd /u01/app/oracle/diag/tnslsnr/SH_GPS_DB02/listener/trace/（切换日志路径）
stat listener.log（查看文件详情）
大文件路径：/u01/app/oracle/oradata/shkomatsu
```
