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
start cmd /c "title zh_dform && java -Dfile.encoding=utf-8 -jar --spring.config.location=application_deform.yml gp_dform-0.0.1-SNAPSHOT.jar > ./log/zh_dform.log"
start cmd /c "title zh_eureka && java -Dfile.encoding=utf-8 -jar --spring.config.location=application_eureka.yml gp_eureka-0.0.1-SNAPSHOT.jar > ./log/zh_eureka.log"
start cmd /c "title zh_mongodb && java -Dfile.encoding=utf-8 -jar --spring.config.location=application_mongodb.yml gp_mongodb-0.0.1-SNAPSHOT.jar > ./log/zh_mongodb.log"
start cmd /c "title zh_zuul && java -Dfile.encoding=utf-8 -jar --spring.config.location=application_zuul.yml gp_zuul-0.0.1-SNAPSHOT.jar > ./log/zh_zuul.log"
pause

```

 java  -jar --spring.config.location=application_deform.yml gp_dform-0.0.1-SNAPSHOT.jar
 
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