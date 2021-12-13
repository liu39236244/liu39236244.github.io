# log4j2 漏洞解决(通过springboot项目中切换版本)

## 时间-2021年12月11日14:14:37

## 描述

项目中springboot版本引入的底层包中有使用log4j2 ，但是springboot当前最高2.6.1版本中我看了都依然使用的是log4j2 2.11.1，所以只能通过指定log4j2 版本方式处理漏洞；

自查是否有使用Apache Log4j2，打开项目的pom.xml文件，查看log4j-core的version字段，目前受影响的Apache Log4j2版本：2.0 ≤ Apache Log4j <= 2.14.1，如有涉及，请尽快完成版本升级。
当前官方已发布最新版本，建议受影响的用户及时更新升级到最新版本。链接如下：
https://github.com/apache/logging-log4j2/releases/tag/log4j-2.15.0-rc1

下面这个
maven如何查看某个jar 是哪个包的依赖： mvn dependency:tree -Dverbose -Dincludes=要查询的内容

参考：https://blog.csdn.net/wb1046329430/article/details/113620399

springboot的一些项目：https://www.cnblogs.com/shiyanlou/p/11579108.html



> mvn dependency:tree -Dverbose -Dincludes=org.apache.logging.log4j:log4j-to-slf4j

```
[INFO] Verbose not supported since maven-dependency-plugin 3.0
[INFO] com.graphsafe:gp_xsn:jar:1.0-SNAPSHOT
[INFO] \- org.springframework.boot:spring-boot-starter-web:jar:2.1.2.RELEASE:compile
[INFO]    \- org.springframework.boot:spring-boot-starter:jar:2.1.2.RELEASE:compile
[INFO]       \- org.springframework.boot:spring-boot-starter-logging:jar:2.1.2.RELEASE:compile
[INFO]          \- org.apache.logging.log4j:log4j-to-slf4j:jar:2.11.1:compile
[INFO]             \- org.apache.logging.log4j:log4j-api:jar:2.11.1:compile
```

> 可以看到是springboot框架中使用到了对应的包

## 项目中修改版本


spring内部是有指定版本的，但如果自动指定则对应的包会被spring忽略


![](assets/000/02/01/01-1639203507539.png)

```xml
    <properties>
        <!-- log4j2 漏洞-->
        <log4j2.version>2.15.0</log4j2.version>
    </properties>



    <dependencies>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-to-slf4j</artifactId>
            <version>${log4j2.version}</version>
        </dependency>

        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>${log4j2.version}</version>
        </dependency>
    </dependencies>
```

