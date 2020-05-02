# linux 下的 卸载mysql

## 卸载原生

```
# rpm -qa | grep mariadb

rpm -e --nodeps mariadb-libs-5.5.50-1.el7_2.x86_64
rpm -qa | grep -i mysql*
find / -name mysql


```

## rpm
rpm -qa |grep mysql
rpm -e mysql*


## yum


yum -y remove mysql*
rpm -qa |grep -i mysql*


rm -rf /etc/my.cnf
rm -rf /var/log/mysqld.log
rm -rf /var/lib/mysql
[root@boloveshi webapps]# find / -name mysql
就没了

* 再次检查 ： rpm -qa | grep -i mysql*
