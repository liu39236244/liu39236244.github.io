# mysql 备份脚本

## mysql 备份脚本
crontab -e

30 1/1 * * * sh  /shenyabo/MySh/mysqlback/sqlback.sh >> /shenyabo/MySh/mysqlback/sqlback.log
```shell
#!bin/bash

# 计算今日日期，创建文件夹使用
nowDate=`date +"%Y-%m-%d_%I:%M_%A"`
nowDay=`date +"%Y-%m-%d"`
delBoolean=""
# 创建文件夹
todayMake="/shenyabo/MySh/mysqlback/$nowDay/"
yesterday="`date -d  " $nowDay -1 day " +"%Y-%m-%d"`"
yesterdayDir="/shenyabo/MySh/mysqlback/$yesterday"
ls ${yesterdayDir} && echo "显示昨天目录下的文件"

# 判断是否存在昨日的目录
if [ ! -d "${yesterdayDir}/" ];then
# 不存在
echo "昨日目录《${yesterdayDir}》不存在！无需删除！"
else
echo "昨日目录《${yesterdayDir}》存在！删除！"
sudo rm -rf ${yesterdayDir};  && echo "删除昨日${yesterdayDir}目录成功！"
fi

# 判断是否存在今天的目录
if [ ! -d "${todayMake}/" ];then
# 不存在
echo "今日目录《${todayMake}》不存在！需要创建"
sudo mkdir -p  ${todayMake} && echo "创建《 ${todayMake} 》目录成功！"
else
echo "今日目录《${todayMake}》存在！清空已经存在的sql文件"

# 删除命令 中的目录不能加上双引号
sudo rm -rf ${todayMake}*.sql  && echo "删除今日${todayMake}目录下的而所有sql文件成功！"
fi
# 开始备份：
mysqldump --opt -h localhost -uroot -pshenyabo123  zrlog_demo > /shenyabo/MySh/mysqlback/$nowDay/${nowDate}_zrlog_demo.sql
result=$?
system=`uname -s`
if [ $system = "Linux" ] ; then
 echo "Linux系统"
 if [ $result -eq 0 ] ; then # -eq 比较的是数字 $? 赋值给一个变量，那么这个变量就是数类型的了  $? 是字符，需要用 =判断
  echo "备份成功!"
 else
  echo "备份失败！"
 fi
else
 echo "非Linux"
fi

```
