# maven 基础


### 基础maven 笔记

```
    maven 项目管理与构建工具   activiti   

一、maven介绍

  1.使用需求
     - 企业岗位需求
     - 软件开发中遇到的问题
       1. jar包的依赖与管理  
         项目中有很多jar包： 
	   问题：不能确定jar包的完全正确性、不同技术框架版本的管理、jar包的依赖
       2. 自动构建项目
          - 软件开发： 可行性分析、需求分析、软件设计、软件开发、发布、运维
	  - 软件构建： 软件已经开发完毕，需要构建成一个产品进行发布
	    构建步骤：
	    清除--> 编译-->测试-->报告-->打包（jar\war）-->安装-->部署到远程
	  maven可以通过一个命令实现自动构建软件项目

  2.引入maven
     1. maven介绍  
       - 它是apache旗下的一款开源工具  
       - pom（项目对象模型）
       - 软件构建的生命周期
         清除--> 编译-->测试-->报告-->打包（jar\war）-->安装-->部署到远程

       - 介绍：  Maven是一个采用纯Java编写的开源项目管理工具,
      Maven采用了一种被称之为Project Object Model (POM)概念来管理项目，
      所有的项目配置信息都被定义在一个叫做POM.xml的文件中, 
      通过该文件Maven可以管理项目的整个生命周期，
      包括清除、编译，测试，报告、打包、部署等等。
       
     2. maven 解决的问题
        - jar包的声明式依赖管理与管理
	- 自动构建、发布项目
	  软件构建的生命周期：
	     清除--> 编译-->测试-->报告-->打包（jar\war）-->安装-->部署到远程
	   maven可以通过一个命令实现自动构建软件项目
     3. maven、ant、svn的区别
       - maven与ant之间的区别
          都是软件构建工具、软件管理工具，maven比ant更加强大，已经取代了ant
	   maven优点：
	    - jar包声明式依赖
	    - jar包仓库
       - maven 与svn的区别
         1.maven 软件构建工具，是软件源码已经完毕，需要构建，需要部署与发布
	 2. svn 是版本控制工具，是协同开发工具
	     svn 仓库 ：
	       1. 项目源码保存
	       2. 历史版本的备份
	       3. 每一次版本的修改情况
	  需求： maven+svn
        
二、体验Maven

  1. 下载及安装Maven

     - 在apache 官网去下载maven 
        www.apache.org 下载
     - maven 软件目录介绍   
        1.lib ：共享库。maven软件依赖的lib jar包
	2.boot ：plexus-classworlds-2.5.1.jar 
	   该文件是jar包下载的引擎 ，通过该工具来下载jar包
	    - 第三方项目依赖的jar包
	    - maven本身的软件构建的生命周期插件的jar包，默认是没有集成这些插件
	      清除插件 --编译插件 -- 打包插件
	3.conf：
	  C:\apache-maven-3.2.1\conf\settins.xml
	   maven 配置文件 ：
	     配置的是本地仓库地址 以及服务器的验证
	4.bin 
	   maven 可执行的命令
	   mvn  命令
	      
     - 测试maven是否安装成功
       命令行：mvn -version
         配置：环境变量path="C:\apache-maven-3.2.1\bin"
	        java_home 
       
  2.创建满足Maven规约的项目

    - 约定优于配置  
      1. 生活中的约定 ：红绿灯 、车方向盘
      2. 开发中的约定 ： javabean ：setXXX、getXXX
    - 按maven规约的目录结构，创建java项目
      Hello项目
        - src
	  ---main
	     ---java
	       ---包和类
	         包： cn.it
		 类：Demo
	     ---resources
	        leaveBill.zip
	  ---test
	     ---java
	     ---resources
	- target  ： 该文件夹可有可无，是编译src后的输出文件的目录，没有则自动创建
	- pom.xml : (project ojbect  model):项目对象模型 ，它是maven核心配置文件
       
    - 生命周期命令插件构建项目

     1. 配置本地仓库的路径
     2.通过maven生命周期命令插件来构建项目  
        maven 默认是没有生命周期命令插件
	  进入到项目目录：
	 生命周期命令：
	  - mvn clean ：清除
	  - mvn compile ：编译
	  - mvn  package ：打包
	  - mvn clean  install ： 安装到本地仓库
	  -mvn deploy ：部署 ，部署到私服 （局域网或者是外网）

  3.思考：

    - 从什么地方下载maven命令插件或者第三方依赖jar包，并且存放在哪里
      1. 从哪里下载
        C:\apache-maven-3.2.1\lib\maven-model-builder-3.2.1.jar
	   pom.xml文件配置
	  
 <!--第三方jar包下载的地址-->
 <repositories>
    <repository>
      <id>central</id>
      <name>Central Repository</name>
      <url>http://repo.maven.apache.org/maven2</url>
      <layout>default</layout>
      <snapshots>
        <enabled>false</enabled>
      </snapshots>
    </repository>
  </repositories>
 <!--maven的生命周期插件的下载地址-->
  <pluginRepositories>
    <pluginRepository>
      <id>central</id>
      <name>Central Repository</name>
      <url>http://repo.maven.apache.org/maven2</url>
      <layout>default</layout>
      <snapshots>
        <enabled>false</enabled>
      </snapshots>
      <releases>
        <updatePolicy>never</updatePolicy>
      </releases>
    </pluginRepository>
  </pluginRepositories>

   2. jar包存放在哪里：
     C:\apache-maven-3.2.1\conf\settins.xml 配置输出的地址 仓库
      | Default: ${user.home}/.m2/repository
  <localRepository>/path/to/local/repo</localRepository>
  -->
  <!--配置本地maven仓库的路径  默认 是${user.home}/.m2/repository -->
  <localRepository>C:/mvn_repo/repository</localRepository>


三、maven管理jar包依赖

  1. maven术语

     - maven软件构建的生命周期
         清除--> 编译-->测试-->报告-->打包（jar\war）-->安装-->部署
     - maven生命周期命令插件
        命令：mvn clean
	 clean--compile--test--package--install-deploy
     - maven坐标
        maven通过坐标的概念来唯一标识jar包或者war包 
	1. 坐标的组成： groupId + artifactId+ version
	  - groupId：组id ,机构名，公司名：好比公司的id，或者是公司包名 
	    alibaba ——-》高德--》5.01版本
	  - artifactId：构建物id ，产品名或者产品的id
	  - version ：版本号 
	2. jar包组成：
	   artifactId-version.jar
   
      
     - maven仓库
       1. 本地仓库  localRepository
          通过settings.xml 设置
       2. 公司私服仓库 ：存放局域网的服务器中
          nexus 软件来发布maven私服
       3. 中心仓库 ，面向全球的  
          地址 ：http://search.maven.org/ 或者 http://repo.maven.apache.org/maven2
      
  2. pom.xml介绍 :project object model 项目对象模型 ，它是maven核心配置文件
    

    
  3. jar包依赖管理
     


四、练习 Maven
   1. 把maven 环境搭建好，设置环境变量
   2. 测试maven是否ok 
       mvn -version
   3. 创建一个安照Maven约定的java项目Hello
   4. 通过mvn测试Hello项目，并且把Hello项目安装到本地仓库去
     配置C:\apache-maven-3.2.1\conf\settings.xml 
     <!-- localRepository
   | The path to the local repository maven will use to store artifacts.
   |
   | Default: ${user.home}/.m2/repository
    -->
	<!--设置个人仓库的地址-->
    <localRepository>C:/mvn_repo/repository</localRepository>
    5. 拷贝提供的下载插件和jar包的仓库内容repository.rar到本地仓库

    6. 用maven的生命周期命令插件 测试 项目
       1. test   clean   compile   package  install


    7. 创建HelloFriend项目，并且要依赖Junit和Hello jar包
    8. 测试HelloFriend项目，并且把项目发布到本地仓库中
       - 当Hello项目在本地仓库删除时，再编译HelloFriend项目是否有异常
      

五、MyEclipse 与 Maven整合

   1.配置MyEclipse

     - 配置Maven插件
       1. myeclispe已经集成了maven插件 
       2. 设置myeclipse的maven插件的版本
          - myeclise的 maven集成设置 
          - installations  ：设置maven版本 ，自定义设置
	     指定自己下载的maven版本 c:\apache-maven-3.2.1
          - user settings ：用来配置当前用户的设置信息
	     比如 ：本地仓库地址
	  
   2. 创建满足maven规约的java项目
      - archetype ：骨架、框架 、模型
        1. maven-archetype-quickstart : 快速构建项目的骨架  ，简单的满足maven规范的java项目
    
   3. 创建满足maven规约的web项目
      骨架：maven-archetype-webapp

 
六、搭建Maven的私有服务器

 网线 ：外网 ：ip地址 （动态的  ）
 
   1.nexus介绍  .是开源的框架，属于sonatype 机构的开源框架，用该框架架设maven 私有服务器
     
     
     
     
   2.nexus私服环境搭建
      - 从 www.sonatype.org/nexus/  下载
      - 把nexus.war 包放到tomcat的webapp下面
      - 浏览且登录
        用户名（admin）和密码 （admin123）  
    
   3.nexus 仓库的分类   
      - hosted ：宿主仓库 ，该仓库属于该公司私有的
        1. 3rd part ： 第三方的jar包，但是该jar包没有在中心仓库保存，驱动.jar
	2. snapshot ：测试版本、镜像版本  easyNet.war
	3. release  : 发行版本
      - proxy  : 代理仓库  :代理中心仓库的jar包
        
      - public ：仓库组 ：虚拟的概念
        可以包含其他的仓库
        
     
     
   4.通过私服上传下载jar包
     - 上传jar包

       - 直接上传jar包
         通过网站直接上传
       - 把myEclispe项目上传到私服
        
     - 从私服中依赖jar包（下载jar包）
       
       

  重点：
    1. maven 特点
       - jar依赖
       - 自动构建项目
    2. maven目录结构
    3. maven专业术语
       - 坐标
       - pom.xml
    4. 在myeclispe中创建maven java项目   maven web项目

    5. 私服
      -nexus
      - 从私服中下载jar包 、 上传jar包
   <!-- 加载的是 第三方项目使用的jar包 -->
   <repositories>
    <repository>
      <snapshots>
        <enabled>true</enabled>
      </snapshots>
      <id>public</id>
      <name>public</name>
      <url>http://127.0.0.1:8080/nexus-2.6.2/content/groups/public/</url>
    </repository>
  </repositories>
   <!-- 加载的是maven生命周期插件的jar包 -->
  <pluginRepositories>
    <pluginRepository>
      <releases>
        <updatePolicy>never</updatePolicy>
      </releases>
      <snapshots>
        <enabled>true</enabled>
      </snapshots>
      <id>public</id>
      <name>public</name>
      <url>http://127.0.0.1:8080/nexus-2.6.2/content/groups/public/</url>
    </pluginRepository>
  </pluginRepositories>
  <!-- 分销管理 ，把jar包发布到私服中 -->
  	<!--配置服务器
	 <server>
      <id>releases</id>
      <username>admin</username>
      <password>admin123</password>
    </server>
	<server>
      <id>snapshots</id>
      <username>admin</username>
      <password>admin123</password>
    </server>
    
    -->
  <distributionManagement>
  <!-- 发布到 快照版本的仓库，即 测试版本仓库 -->
  <snapshotRepository>
  <id>snapshots</id>
  <url>http://127.0.0.1:8080/nexus-2.6.2/content/repositories/snapshots/</url>
  </snapshotRepository>
  <!-- 发布到 发行版本的仓库中，也可以发布到3rd party 仓库 -->
  <repository>
    <id>releases</id>
  <url>http://127.0.0.1:8080/nexus-2.6.2/content/repositories/releases/</url>
  </repository>
  
  </distributionManagement>
       
       
```




## 1 介绍、环境配置

### 1.1 Maven介绍


Maven是一个采用纯Java编写的开源项目管理工具, Maven采用了一种被称之为Project Object Model (POM)概念来管理项目，所有的项目配置信息都被定义在一个叫做POM.xml的文件中, 通过该文件Maven可以管理项目的整个声明周期，包括清除、编译，测试，报告、打包、部署等等。目前Apache下绝大多数项目都已经采用Maven进行管理. 而Maven本身还支持多种插件, 可以方便更灵活的控制项目, 开发人员的主要任务应该是关注商业逻辑并去实现它, 而不是把时间浪费在学习如何在不同的环境中去依赖jar包,项目部署等。Maven正是为了将开发人员从这些任务中解脱出来而诞生的

### 1.2  Maven能够做什么

```
	Jar的声明式依赖性管理
	项目自动构建

```


### 1.3 安装配置

有解压版本的，安装之前安装jdk，配置环境变量

验证安装成功 ：mvn -version 

下载安装这里就不再写了。


### 1.4 maven 目录分析

```
	bin：含有mvn运行的脚本
	boot：含有plexus-classworlds类加载器框架
	conf：含有settings.xml配置文件
	lib：含有Maven运行时所需要的java类库
	Settings.xml 中默认的用户库: ${user.home}/.m2/repository
	Maven默认仓库下载地址在: maven的lib目录下maven-model-builder-3.0.4.jar的pom.xml中

```