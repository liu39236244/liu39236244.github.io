# maven 打入第三方jar包 


## 命令打入


mvn install:install-file -DgroupId=org.apache.axis -DartifactId=axis -Dversion=1.4 -Dpackaging=jar -Dfile=C:\Users\Administrator\Desktop\axis-1.4.jar


mvn install:install-file -DgroupId=com.aliyun -DartifactId=aliyun-java-sdk-core -Dversion=4.0.3 -Dpackaging=jar -Dfile=C:\Users\Administrator\Desktop\aliyun-java-sdk-core-4.0.3.jar



mvn install:install-file -Dfile=D:\shenyabo-work\项目相关\公用\jar包\gp-base-mysql-1.0.RELEASE.jar -DgroupId=org.springframework.boot -DartifactId=gp-base-mysql -Dversion=1.0.RELEASE -Dpackaging=jar
