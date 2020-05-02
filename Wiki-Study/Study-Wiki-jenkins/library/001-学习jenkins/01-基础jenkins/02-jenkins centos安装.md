# jenkins 


## 测试

### jenkins 的安装配置[原文链接](https://blog.csdn.net/weixin_34214500/article/details/92345194)

### 部署jenkins 项目部署

[参考1](https://blog.csdn.net/zjh_746140129/article/details/80904876)

[自动化部署项目,从零开始](https://blog.csdn.net/qq_37372007/article/details/81586751)

[插件下载失败 修改镜像地址](https://blog.csdn.net/tianhua79658788/article/details/78249908)

[yum rpm安装 下载jenkins]()

* 在线安装
[配置build 前后脚本：](https://blog.csdn.net/yoyo328/article/details/77859512)
[centos yum /rpm 安装jenkins:](https://www.cnblogs.com/loveyouyou616/p/8714544.html)

* 中间插件部分使用
[部署 配置 执行命令](https://blog.csdn.net/yoyo328/article/details/77859512)

* 修改workspace 默认路径

[修改jenkins默认路径](https://blog.csdn.net/liudinglong1989/article/details/78665998)

> 下载地址：


### centos:

pd:123456
## 地址总结

### 访问地址
* http://192.168.92.128:8084

* 修改镜像路径：http://192.168.92.128:8084/pluginManager/advanced

[https->http](http://updates.jenkins.io/update-center.json)
[清华大学镜像地址](https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json)

* 插件下载：
[war/plugin下载地址](http://updates.jenkins-ci.org/download/),可以直接下载

[官网插件下载地址](https://plugins.jenkins.io/)
[官网插件](https://wiki.jenkins-ci.org/display/JENKINS/Plugins )

* 定时任务：
[定时任务：](https://www.cnblogs.com/linjiqin/p/10676963.html)



* maven:项目地址 https://10.0.2.84:8881/svn/2019HResh/code/myhuachuang

### jenkins安装 路径

#### 插件安装

Maven Integration Plugin 这个插件
　插件1：Publish over SSH
　插件2：Deploy to container Plugin

* jenkins自己安装 的插件目录：
* jenkins默认安装插件目录：/root/.jenkins/plugins/

* maven 路径问题

```sh
查找maven 的配置：find / -name settings.xml

* settings.xml配置

/root/.jenkins/tools/hudson.tasks.Maven_MavenInstallation/maven_3.6.2/conf/settings.xml
```

* jenkins 自定义安装java 配置

```sh
find / -name javaws.jar

找到了jenkins自己安装路径：
/root/.jenkins/tools/hudson.model.JDK/jenkins_java8/jre/lib/javaws.jar

java:/root/.jenkins/tools/hudson.model.JDK/jenkins_java8/bin
```
maven:/root/.jenkins/plugins/maven-plugin/META-INF/maven
默认仓库地址：
/root/.m2/repository/org/apache/maven
/root/.m2/repository/org/apache/maven/maven

#### 启动jenkins 

```sh
# 正常启动
java -jar jenkins.war --httpPort=8084 

# 后台启动
nohup java -jar /home/shenyabo/jenkins/jenkins_install/jenkins.war --httpPort=8084  > /home/shenyabo/jenkins/jenkins_install/jenkins_log.txt &
```



### 步骤

* 1 目录：
cd /home/shenyabo/jenkins/jenkins_install


* 查看并配置端口

```
vi /etc/default/jenkins
```

* 2 查看端口，开端口

> 查看端口占用：https://www.cnblogs.com/gavin-yao/p/10505619.html

```shell
firewall-cmd --zone=public --permanent --add-port=8084/tcp
查看端口占用：

netstat -tlnp|grep port

重启防火墙：

systemctl restart firewalld.service 

关闭防火墙：

systemctl stop firewalld.service 

```

* 3重启服务器ok

* 4 输入密码进入系统

```
密码地址：vi /root/.jenkins/secrets/initialAdminPassword
aa7cda21abe4ba7bff27818c4072b9b
```

* 5 新手配置

这里选择了社区默认插件：


![](assets/001/01/02-1571801535468.png)


* 部分插件安装失败、


![](assets/001/01/02-1571802291347.png)


# 配置自动化springboot项目

## 前提 安装 jdk maven  svn


### jdk


* 找到系统java路径

[参考博主](https://www.cnblogs.com/YuyuanNo1/p/10383780.html)

### 插件安装
  插件：	Locale plugin、	Localization: Chinese (Simplified) 设置语言的两个插件
  需要安装jdk、maven 在配置中进行自定义安装（如果安装好也可以直接配置路径即可）
  svn插件：Subversion Plug-in
　插件1:Publish over SSH 
　插件2:Deploy to container Plugin

* jenkins自己安装 的插件目录：在当前用户home目录下会有一个.jenkins目录
* jenkins默认安装插件目录：/root/.jenkins/plugins/
* jdk jenkins 默认安装目录：/root/.jenkins/tools/hudson.model.JDK/jenkins_java8/
* maven插件默认安装目录：/root/.jenkins/tools/hudson.tasks.Maven_MavenInstallation/maven_3.6.2/
    * maven 配置文件：/root/.jenkins/tools/hudson.tasks.Maven_MavenInstallation/maven_3.6.2/conf/settings.xml
    * maven仓库地址：/root/.m2/repository/org/apache/maven
    * 指定svn的时候指定本地模块的路径：/home/shenyabo/online/2019HR