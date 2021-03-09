# Jenkins 自动化文档

## Jenkins介绍
Jenkins是一个开源软件项目，是基于Java开发的一种持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。 
持续集成是一种软件开发实践，即团队开发成员经常集成他们的工作，通常每个成员至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽快地发现集成错误。许多团队发现这个过程可以大大减少集成的问题，让团队能够更快的开发内聚的软件。

Jenkins只是一个平台，真正运作的都是插件。这就是jenkins流行的原因，因为jenkins什么插件都有 
Hudson是Jenkins的前身，是基于Java开发的一种持续集成工具，用于监控程序重复的工作，Hudson后来被收购，成为商业版。后来创始人又写了一个jenkins，jenkins在功能上远远超过hudson。

## 能做什么

进行自动化部署，而省去手动打包、上传服务器、部署这一系列步骤。

## jenkins 安装配置

Jenkins 路径总览
Jenkins官方下载地址：https://jenkins.io/zh/download/
Jenkins 镜像以及插件下载地址：http://updates.jenkins-ci.org/ 
Jenkins:所有镜像地址： http://mirrors.jenkins-ci.org/status.html 
Jenkins rpm包地址：http://pkg.jenkins-ci.org/redhat-stable/ ， 可用于wget 命令下载

### jenkins 下载

1 直接去官网下载 war 包（本文主要以war下载形式）
 

 ![](assets/001/02/01-1614302808724.png)

2 命令安装yum
1 wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo
2 rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key
3 yum install -y jenkins
3 命令安装 rpm
如果不能安装就到官网下载jenkis的rmp包，官网地址（http://pkg.jenkins-ci.org/redhat-stable/）
1 wget http://pkg.jenkins-ci.org/redhat-stable/jenkins-2.7.3-1.1.noarch.rpm
2 rpm -ivh jenkins-2.7.3-1.1.noarch.rpm

###  开启jenkins

4.1 命令安装jenkins 开启
配置jenkis的端口
 vi /etc/sysconfig/jenkins
找到修改端口号：
JENKINS_PORT="8080"  此端口不冲突可以不修改 
service jenkins start/stop/restart
•	安装成功后Jenkins将作为一个守护进程随系统启动
•	系统会创建一个“jenkins”用户来允许这个服务，如果改变服务所有者，同时需要修改/var/log/jenkins, /var/lib/jenkins, 和/var/cache/jenkins的所有者
•	启动的时候将从/etc/sysconfig/jenkins获取配置参数
•	默认情况下，Jenkins运行在8080端口，在浏览器中直接访问该端进行服务配置Jenkins的RPM仓库配置被加到/etc/yum.repos.d/jenkins.repo

4.2 war 包下载形式启动

# 正常启动

java -jar jenkins.war --httpPort=8084 

# 后台启动

nohup java -jar /home/shenyabo/jenkins/jenkins_install/jenkins.war --httpPort=8084  > /home/shenyabo/jenkins/jenkins_install/jenkins_log.txt &

	/home/shenyabo/jenkins/jenkins_install/jenkins.war 为war包所在路径
	--httpPort=8084 自已指定端口号（注意防火墙需要打开端口号）
具体命令以（centos为例）
	具体命令：firewall-cmd --zone=public --permanent --add-port=8084/tcp
	重启防火墙：systemctl restart firewalld.service

	一般加载启动完之后 会在当前用户家目录下自动生成 .jenkins目录，后续jenkins安装的插件都会在这里保存；本文以 /root/.jenkins 为例。
例如： /root/.jenkins  ， /xiaohong/.jenkins 等目录
5 jenkins 访问以及插件配置
安装的插件所在路径：/root/.jenkins/plugins/

5.1 浏览器输入：jenkin外网地址:端口号


![](assets/001/02/01-1614302888514.png)
 
会提示你密码文件所在路径，找到指定文件复制下来即可：
	例如： vi /root/.jenkins/secrets/initialAdminPassword

5.2 选择下载社区插件
这里不再给出图例，一般会因为镜像地址问题导致插件下在失败，后续需要手动下载插件或者修改镜像地址
6  基本插件
6.1 汉化
找到齿轮 设置，
 

![](assets/001/02/01-1614302905698.png)

* 设置中文插件
搜索 可选择一列，filter输入：Localization: Chinese (Simplified) 
我这里已经安装过，所以在已安装中才能搜到

 
已安装：
 
![](assets/001/02/01-1614302927326.png)


![](assets/001/02/01-1614302936601.png)


2 设置中设置 语言 zh_CN;
 

 ![](assets/001/02/01-1614302950499.png)
 
![](assets/001/02/01-1614302976943.png)

如果浏览器语言是英文则需要勾选下面一项，重启配置（ip:端口/reload 即可） ，还是不行，则看你的浏览器语言设置，具体自行百度。

3 自动化部署
3.1 安装所需插件以及环境
1 jdk 
安装java环境
2 maven
构建项目需要安装maven。如果服务器已经安装好，可以直接配置路径。
Jdk/maven 需要设置全局配置(以下设置为jenkins 自己下载jdk 与maven，如果系统有，则直接配置路径)，如下.
 
配置jdk、maven路径
 
注：Oracle ，jenkins 安装jdk 则需要提供oracel 官方账号与密码
    
 
这里jenkins 安装的maven 路径：
注： 在当前用户 下的.jenkins/tools 中查找，jdk默认路径也是如此这里不再给出
Maven:/root/.jenkins/tools/hudson.tasks.Maven_MavenInstallation/maven_3.6.2/
Maven库：/root/.m2/repository（自定义配置maven则不需要注意这里）
在后期如果maven 无法下载的jar包 则可以

3 svn(搜：Subversion Plug-in) 或者git 插件
 

4 Publish over SSH  插件(用于打包前后设置指定脚本以及设置打包之后访问的服务器地址)

配置一个服务器地址：
 
 

保存应用。
3.2 创建项目
1 新建
 

 
2 描述
 
3 svn 地址 账户，以及代码拉取路径
 
/root/.jenkins/workspace ： 注意这里不允许使用绝对路径，所以想知道代码拉取路径，要知道jenkins/workspace 路径，使用相对路径 ： ./Demo2
 
 
设置完之后会自动拉取代码，并且放入 workspace目录下，这里2019hrchDemo是之前的项目，不用去管
4 构建触发器
这里设定每周一凌晨两点1分执行
 
5 build 执行的命令（transfers目前有问题，不过文件copy可以ton过shell脚本即可）
 

 

也可以直接指定执行的脚本

保存，然后去手动build 一次，才会拉取代码；
6 手动build 一次，自动拉取项目
 
