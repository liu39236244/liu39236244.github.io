# maven 远程仓库地址配置

## 描述

maven 的依赖下载一般都是设置阿里或者华为的


### 阿里maven 远程地址,至少我现在maven 都是用此地址

```xml
<mirror>
	  <id>alimaven</id>
	  <mirrorOf>central</mirrorOf>
	  <name>aliyun maven</name>
	  <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
	</mirror> 
```