# win 启动脚本-spring cloud 项目

## 普通bat 启动spring


### 脚本1 ,可以指定每一个jar 所占用的内存

```bat
@echo off
start cmd /c "title zh_eureka && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_eureka-1.0-SNAPSHOT.jar"
start cmd /c "title zh_user && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms2048m -Xmx2048m  -jar C:\zhjt\parent\zh_user-1.0-SNAPSHOT.jar > user.log"
start cmd /c "title zh_mongodb && javaw -Dfile.encoding=utf-8 -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_mongodb-1.0-SNAPSHOT.jar > mongodb.log"
start cmd /c "title zh_auth && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m -jar C:\zhjt\parent\zh_auth-1.0-SNAPSHOT.jar > auth.log"
start cmd /c "title zh_change && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_change-1.0-SNAPSHOT.jar > change.log"
start cmd /c "title zh_edu && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms2048m -Xmx2048m  -jar C:\zhjt\parent\zh_edu-1.0-SNAPSHOT.jar > edu.log"
TIMEOUT /T 30
start cmd /c "title zh_hdanger && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms2048m -Xmx2048m  -jar C:\zhjt\parent\zh_hdanger-1.0-SNAPSHOT.jar > hdanger.log"
start cmd /c "title zh_inspect && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_inspect-1.0-SNAPSHOT.jar > inspect.log"
start cmd /c "title zh_message && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms2048m -Xmx2048m  -jar C:\zhjt\parent\zh_message-1.0-SNAPSHOT.jar > message.log"
start cmd /c "title zh_occupationalHealth && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms2048m -Xmx2048m  -jar C:\zhjt\parent\zh_occupationalHealth-1.0-SNAPSHOT.jar > occupationalHealth.log"
TIMEOUT /T 30
start cmd /c "title zh_post && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_post-1.0-SNAPSHOT.jar > post.log"
start cmd /c "title zh_risk && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms2048m -Xmx2048m  -jar C:\zhjt\parent\zh_risk-1.0-SNAPSHOT.jar > risk.log"
start cmd /c "title zh_share && javaw -Dfile.encoding=utf-8 -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms2048m -Xmx2048m  -jar C:\zhjt\parent\zh_share-1.0-SNAPSHOT.jar > zh_share.log"
TIMEOUT /T 30
start cmd /c "title zh_threeSimultaneousness && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_threeSimultaneousness-1.0-SNAPSHOT.jar > threeSimul.log"
start cmd /c "title zh_unitInfoManage && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_unitInfoManage-1.0-SNAPSHOT.jar > unitinfo.log"
start cmd /c "title zh-equipmentManagement && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh-equipmentManagement-1.0-SNAPSHOT.jar > equip.log"
start cmd /c "title zh_kpi && javaw -Dfile.encoding=utf-8 -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar zh_kpi-1.0-SNAPSHOT.jar > kpi.log"
start cmd /c "title zh-exchange && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_exchange-1.0-SNAPSHOT.jar > exchange.log"
TIMEOUT /T 30
start cmd /c "title zh-processManagement && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh-processManagement-1.0-SNAPSHOT.jar > processManagement.log"
start cmd /c "title zh_accident && javaw -Dfile.encoding=utf-8 -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar zh_accident-1.0-SNAPSHOT.jar > accident.log"
start cmd /c "title zh-zh_punishmentandopinion && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_punishmentandopinion-1.0-SNAPSHOT.jar > punish.log"
start cmd /c "title zh-bbs && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_bbs-0.0.1-SNAPSHOT.jar > bbs.log"
start cmd /c "title zh_safeProductionTime && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_safeProductionTime-1.0-SNAPSHOT.jar > zh_safeProductionTime.log"
start cmd /c "title zh_quartz-1.0-SNAPSHOT && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms700m -Xmx700m  -jar C:\zhjt\parent\zh_quartz-1.0-SNAPSHOT.jar > quartz.log"
start cmd /c "title zh_hseAudit && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar C:\zhjt\parent\zh_hseAudit-1.0-SNAPSHOT.jar > hseAudit.log"
start cmd /c "title zh_zuul && java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms4096m -Xmx4096m  -jar C:\zhjt\parent\zh_zuul-1.0-SNAPSHOT.jar"
start cmd /c "title zh_daex && javaw -Dfile.encoding=utf-8 -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m  -jar zh-dataexchange-1.0-SNAPSHOT.jar > dataexchange.log"
pause

```

### 脚本2 启动普通jar 


```bat
@echo off
start cmd /c "title zh_eureka && javaw -Dfile.encoding=utf-8 -jar zh_eureka-1.0-SNAPSHOT.jar > zh_eureka.log"
start cmd /c "title zh_user && javaw -Dfile.encoding=utf-8 -jar zh_user-1.0-SNAPSHOT.jar > zh_user.log"
start cmd /c "title zh_mongodb && javaw -Dfile.encoding=utf-8 -jar zh_mongodb-1.0-SNAPSHOT.jar > zh_mongodb.log"
start cmd /c "title zh_auth && javaw -Dfile.encoding=utf-8 -jar zh_auth-1.0-SNAPSHOT.jar > zh_auth.log"
start cmd /c "title zh_change && javaw -Dfile.encoding=utf-8 -jar zh_change-1.0-SNAPSHOT.jar > zh_change.log"
start cmd /c "title zh_edu && javaw -Dfile.encoding=utf-8 -jar zh_edu-1.0-SNAPSHOT.jar > zh_edu.log"
TIMEOUT /T 30
start cmd /c "title zh_hdanger && javaw -Dfile.encoding=utf-8 -jar zh_hdanger-1.0-SNAPSHOT.jar > zh_hdanger.log"
start cmd /c "title zh_inspect && javaw -Dfile.encoding=utf-8 -jar zh_inspect-1.0-SNAPSHOT.jar > zh_inspect.log"
start cmd /c "title zh_message && javaw -Dfile.encoding=utf-8 -jar zh_message-1.0-SNAPSHOT.jar > zh_message.log"
start cmd /c "title zh_occupationalHealth && javaw -Dfile.encoding=utf-8 -jar zh_occupationalHealth-1.0-SNAPSHOT.jar > zh_occupationalHealth.log"
TIMEOUT /T 30
start cmd /c "title zh_post && javaw -Dfile.encoding=utf-8 -jar zh_post-1.0-SNAPSHOT.jar > zh_post.log"
start cmd /c "title zh_risk && javaw -Dfile.encoding=utf-8 -jar zh_risk-1.0-SNAPSHOT.jar > zh_risk.log"
start cmd /c "title zh_share && javaw -Dfile.encoding=utf-8 -jar zh_share-1.0-SNAPSHOT.jar > zh_share.log"
TIMEOUT /T 30
start cmd /c "title zh_threeSimultaneousness && javaw -Dfile.encoding=utf-8 -jar zh_threeSimultaneousness-1.0-SNAPSHOT.jar > zh_threeSimultaneousness.log"
start cmd /c "title zh_unitInfoManage && javaw -Dfile.encoding=utf-8 -jar zh_unitInfoManage-1.0-SNAPSHOT.jar > zh_unitInfoManage.log"
start cmd /c "title equipmentManagement && javaw -Dfile.encoding=utf-8 -jar zh-equipmentManagement-1.0-SNAPSHOT.jar > equipmentManagement.log"
start cmd /c "title zh_kpi && javaw -Dfile.encoding=utf-8 -jar zh_kpi-1.0-SNAPSHOT.jar > zh_kpi.log"
TIMEOUT /T 30
start cmd /c "title zh_processManagement && javaw -Dfile.encoding=utf-8 -jar zh-processManagement-1.0-SNAPSHOT.jar > processManagement.log"
start cmd /c "title zh_accident && javaw -Dfile.encoding=utf-8 -jar zh_accident-1.0-SNAPSHOT.jar > zh_accident.log"
start cmd /c "title zh_punishmentandopinion && javaw -Dfile.encoding=utf-8 -jar zh_punishmentandopinion-1.0-SNAPSHOT.jar > zh_punishmentandopinion.log"
start cmd /c "title zh_zuul && javaw -Dfile.encoding=utf-8 -jar zh_zuul-1.0-SNAPSHOT.jar > zh_zuul.log"
pause



```


## 最普通java -jar 脚本


> 启动 log 目录需要自己创建

```bat
@echo off
start cmd /c "title zh_eureka && java -jar  gp_eureka-0.0.1-SNAPSHOT.jar > ./log/zh_eureka.log"
start cmd /c "title zh_zuul && java -jar  gp_zuul-0.0.1-SNAPSHOT.jar > ./log/zh_zuul.log"
start cmd /c "title zh_dform && java  -jar  gp_dform-0.0.1-SNAPSHOT.jar > ./log/zh_dform.log"
start cmd /c "title zh_mongodb && java -jar gp_mongodb-0.0.1-SNAPSHOT.jar > ./log/zh_mongodb.log"
pause
```


> 2 指定配置文件外置

```bat
@echo off
start cmd /c "title zh_dform && java -Dfile.encoding=utf-8 -jar gp_dform-0.0.1-SNAPSHOT.jar --spring.config.location=application_deform.yml > ./log/zh_dform.log"
start cmd /c "title zh_eureka && java -Dfile.encoding=utf-8 -jar  gp_eureka-0.0.1-SNAPSHOT.jar --spring.config.location=application_eureka.yml > ./log/zh_eureka.log"
start cmd /c "title zh_mongodb && java -Dfile.encoding=utf-8 -jar  gp_mongodb-0.0.1-SNAPSHOT.jar  --spring.config.location=application_mongodb.yml> ./log/zh_mongodb.log"
start cmd /c "title zh_zuul && java -Dfile.encoding=utf-8 -jar gp_zuul-0.0.1-SNAPSHOT.jar --spring.config.location=application_zuul.yml  > ./log/zh_zuul.log"
pause

```

 java  -jar  gp_dform-0.0.1-SNAPSHOT.jar --spring.config.location=application_deform.yml
 
> 关闭


```bat
@echo off
:: eureka   8761
:: zuul		8762
:: mongodb		8418
:: deform	8131

set port=8761
for /f "tokens=1-5" %%i in ('netstat -ano^|findstr ":%port%"') do (
    echo kill the process %%m who use the port %port%
    taskkill /t /f /pid %%m
)
set port=8762
for /f "tokens=1-5" %%i in ('netstat -ano^|findstr ":%port%"') do (
    echo kill the process %%m who use the port %port%
    taskkill /t /f /pid %%m
)
set port=8418
for /f "tokens=1-5" %%i in ('netstat -ano^|findstr ":%port%"') do (
    echo kill the process %%m who use the port %port%
    taskkill /t /f /pid %%m
)
set port=8131
for /f "tokens=1-5" %%i in ('netstat -ano^|findstr ":%port%"') do (
    echo kill the process %%m who use the port %port%
    taskkill /t /f /pid %%m
)
```



```

```bat
@echo off
start cmd /c "title qzq_Storage_01 && java -Dfile.encoding=utf-8 -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m  -Xms1024m -Xmx1024m --spring.config.location=.\application-prod-37001-rt1.yml -jar  .\dataStorage-1.0-SNAPSHOT.jar > .\log\qzqStorage_01.log"
pause

```


```bat
@echo off
start cmd /c "title gp_cadxlk && javaw -jar  .\cadxlk_main-1.0-SNAPSHOT.jar --spring.config.location=.\application-local-school.yml >D:\shenyabo-work\service\java_cadx\logs\cadxlk_main.log"
TIMEOUT /T 30
taskkill /f /im cmd.exe
exit
```

java -jar -Dfile.encoding=utf-8  halo-1.4.0.jar > .\log\halo.log



## win 启动jar bat （带有pom 将jar 分离开来）





### start.bat

### ### pom 


```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
<!--            全jar打包-->
<!--            <plugin>-->
<!--                <groupId>org.springframework.boot</groupId>-->
<!--                <artifactId>spring-boot-maven-plugin</artifactId>-->
<!--                <configuration>-->
<!--                    <excludes>-->
<!--                        <exclude>-->
<!--                            <groupId>org.projectlombok</groupId>-->
<!--                            <artifactId>lombok</artifactId>-->
<!--                        </exclude>-->
<!--                    </excludes>-->
<!--                </configuration>-->
<!--            </plugin>-->

            <!--            将包拆分开-->

            <!--拆分配置文件和LIB，给JAR瘦身-->
            <!--启动参考命令，再JAR目录执行，也可以指定绝对路径：
    ${project.build.directory}工程路径下的target目录
            Dloader.path:加载本地lib
            Dspring.config.location:加载本地配置
            server.port：指定端口
            /-/- 这个有转义，注命令要去掉/
            java -Dloader.path=lib/ -jar xxxx.jar /-/-Dspring.config.location=resources/ /-/-server.port=8080
            -->

<!--            定义项目的编译环境-->
<!--            <plugin>-->
<!--                <groupId>org.apache.maven.plugins</groupId>-->
<!--                <artifactId>maven-compiler-plugin</artifactId>-->
<!--                <configuration>-->
<!--                    <source>1.8</source>-->
<!--                    <target>1.8</target>-->
<!--                    <encoding>UTF-8</encoding>-->
<!--                </configuration>-->
<!--            </plugin>-->
            <!--默认执行src/test/java路径下的测试用例，建议跳过执行-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <skip>true</skip>
                </configuration>
            </plugin>
            <!--全量JAR包，最初的打包方式，springboot的默认编译插件，默认会把所有的文件打包成一个jar-->
<!--            <plugin>-->
<!--                <groupId>org.springframework.boot</groupId>-->
<!--                <artifactId>spring-boot-maven-plugin</artifactId>-->
<!--                <executions>-->
<!--                    <execution>-->
<!--                        <goals>-->
<!--                            <goal>repackage</goal>-->
<!--                        </goals>-->
<!--                    </execution>-->
<!--                </executions>-->
<!--                <configuration>-->
<!--                    <mainClass>com.example.minblog.MYApplication</mainClass>-->
<!--                    <fork>true</fork>-->
<!--                    <addResources>true</addResources>-->
<!--                    <outputDirectory>${project.build.directory}/jar</outputDirectory>-->
<!--                </configuration>-->
<!--            </plugin>-->
            <!-- 打JAR包 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.2.0</version>
                <configuration>
                    <!-- 不打包资源文件,如果放开全量JAR也不会打进去-->
<!--                    <excludes>-->
<!--                        <exclude>*.yml</exclude>-->
<!--                        <exclude>*.properties</exclude>-->
<!--                    </excludes>-->
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <!-- MANIFEST.MF 中 Class-Path 加入前缀 -->
                            <classpathPrefix>lib/</classpathPrefix>
                            <!-- jar包不包含唯一版本标识 -->
                            <useUniqueVersions>false</useUniqueVersions>
                            <!--指定springboot启动入口类 -->
                            <mainClass>com.example.minblog.MYApplication</mainClass>
                        </manifest>
                        <manifestEntries>
                            <!--MANIFEST.MF 中 Class-Path 加入资源文件目录 -->
                            <Class-Path>./resources/</Class-Path>
                        </manifestEntries>
                    </archive>
                    <outputDirectory>${project.build.directory}</outputDirectory>
                </configuration>
            </plugin>
            <!--复制关联JAR包到指定lib打包目录 ，target目录下的文件夹下，按需修改 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>3.1.2</version>
                <executions>
                    <execution>
                        <id>copy-dependencies</id>
                        <phase>package</phase>
                        <goals>
                            <goal>copy-dependencies</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>${project.build.directory}/lib/</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <!-- 复制配置文件到指定resources打包目录 ，target目录下的文件夹下，按需修改-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <version>3.2.0</version>
                <executions>
                    <execution> <!-- 复制配置文件 -->
                        <id>copy-resources</id>
                        <phase>package</phase>
                        <goals>
                            <goal>copy-resources</goal>
                        </goals>
                        <configuration>
                            <resources>
                                <resource>
                                    <directory>src/main/resources</directory>
                                    <includes>
                                        <include>*.yml</include>
                                        <include>*.properties</include>
                                    </includes>
                                </resource>
                            </resources>
                            <outputDirectory>${project.build.directory}/resources</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>


            <!--逆向工程-->
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.5</version>
                <configuration>
                    <!--配置文件的位置-->
                    <configurationFile>src/main/resources/generatorConfig.xml</configurationFile>
                    <verbose>true</verbose>
                    <overwrite>true</overwrite>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>org.mybatis.generator</groupId>
                        <artifactId>mybatis-generator-core</artifactId>
                        <version>1.3.5</version>
                    </dependency>
                    <dependency>
                        <groupId>tk.mybatis</groupId>
                        <artifactId>mapper</artifactId>
                        <version>4.1.5</version>
                    </dependency>
                    <dependency>
                        <groupId>com.gsxz</groupId>
                        <artifactId>gsxz_base</artifactId>
                        <version>${gp.base.version}</version>
                    </dependency>
                </dependencies>
                <executions>
                    <execution>
                        <id>Generate MyBatis Artifacts</id>
                        <phase>deploy</phase>
                        <goals>
                            <goal>generate</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>


        <resources>
            <resource>
                <directory>src/main/resources</directory>
            </resource>
        </resources>
    </build>

```


### win 脚本筛选出来最新依赖中那些需要删除，哪些需要新增的jar


```bat
@echo off
setlocal enabledelayedexpansion

set NEWLIB_DIR=newlib
set LIB_DIR=lib
set ADDLIB_DIR=addlib
set DELLIB_DIR=dellib

:: 创建 addlib 和 dellib 目录
if not exist %ADDLIB_DIR% (
    mkdir %ADDLIB_DIR%
)

if not exist %DELLIB_DIR% (
    mkdir %DELLIB_DIR%
)

:: 对比 newlib 和 lib 目录中的 JAR 文件
echo Comparing JAR files...

:: 复制 newlib 中多出的文件到 addlib
for %%f in (%NEWLIB_DIR%\*.jar) do (
    if not exist "%LIB_DIR%\%%~nxf" (
        echo Copying %%~nxf to %ADDLIB_DIR%
        copy "%%f" "%ADDLIB_DIR%"
    )
)

:: 复制 lib 中少的文件到 dellib
for %%f in (%LIB_DIR%\*.jar) do (
    if not exist "%NEWLIB_DIR%\%%~nxf" (
        echo Copying %%~nxf to %DELLIB_DIR%
        copy "%%f" "%DELLIB_DIR%"
    )
)

echo Comparison and copying completed.
pause
```



```bat

@echo off
set APP_JAR=minBlog-0.0.1-SNAPSHOT.jar
set LIB_PATH=./lib
set LOG_FILE=application.log
java -Dloader.path=%LIB_PATH% -jar %APP_JAR% --spring.profiles.active=local > %LOG_FILE% 2>&1
pause
```


### stop.bat

```bat
@echo off
set PORT=25010

:: 查找占用指定端口的进程 ID
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do (
    set PID=%%a
)

:: 如果找到进程 ID，则终止该进程
if defined PID (
    echo Terminating process with PID: %PID%
    taskkill /F /PID %PID%
) else (
    echo No process found using port %PORT%.
)

pause

```
