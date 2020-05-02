# Myservice tomcat 80 端口问题
## 设置方式

* 设置tomcat 的端口为 80  
* 如果不可以访问，就在防火墙中添加http 、https 的协议；或者添加端口80
如下：
打开：
```
vi /etc/firewalld/zones/public.xml

在防火墙中添加协议：

<service name="http"/>
<service name="https"/>
完整文件如下；

<?xml version="1.0" encoding="utf-8"?>
<zone>
  <short>Public</short>
  <description>For use in public areas. You do not trust the other computers on networks to not harm your computer. Only selected incoming connections are accepted.</description>
  <service name="dhcpv6-client"/>
  <service name="ssh"/>
  <service name="http"/>
  <service name="https"/>
  <port protocol="tcp" port="7001"/>
  <port protocol="tcp" port="7002"/>
  <port protocol="tcp" port="7003"/>
</zone>
```
