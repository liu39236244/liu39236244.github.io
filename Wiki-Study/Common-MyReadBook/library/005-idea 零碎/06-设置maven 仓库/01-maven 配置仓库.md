# maven 阿里云仓库地址

```xml

<!-- 阿里仓库1 -->

<mirror>
	  <id>alimaven</id>
	  <mirrorOf>central</mirrorOf>
	  <name>aliyun maven</name>
	  <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
	</mirror> 



<!-- 阿里仓库2 -->
	<mirror>
		<id>aliyunmaven</id>
		<mirrorOf>*</mirrorOf>
		<name>阿里云</name>
		<url>https://maven.aliyun.com/repository/public</url>
	</mirror>


	<!-- 设置本地路径jar、仓库 -->


	 <!-- <mirror> -->
            <!-- <id>central</id> -->
            <!-- <name>central</name> -->
            <!-- <url>file://D:/shenyabo-work/xuzhoujar</url> -->
            <!-- <mirrorOf>*</mirrorOf> -->
     <!-- </mirror> -->
	
	<!-- 设置自定义maven 私服 -->

		<mirror>
            <id>nexus</id>
            <mirrorOf>*</mirrorOf>
            <name>local maven server</name>
            <url>http://ip:8081/repository/maven-public/</url>
     </mirror> -->

```


