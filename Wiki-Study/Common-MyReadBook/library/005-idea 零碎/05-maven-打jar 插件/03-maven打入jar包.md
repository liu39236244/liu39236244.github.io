# maven 打入第三方jar包 


## 命令打入


mvn install:install-file -Dfile=C:\Users\Administrator\Desktop\jar\dove-common-1.0.0.jar -DgroupId=com.oracle -DartifactId=ojdbc6 -Dversion=11.1.0.7.0 -Dpackaging=jar

