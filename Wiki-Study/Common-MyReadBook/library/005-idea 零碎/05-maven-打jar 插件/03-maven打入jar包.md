# maven 打入第三方jar包 


## 命令打入


mvn install:install-file -DgroupId=org.apache.axis -DartifactId=axis -Dversion=1.4 -Dpackaging=jar -Dfile=C:\Users\Administrator\Desktop\axis-1.4.jar


mvn install:install-file -DgroupId=com.aliyun -DartifactId=aliyun-java-sdk-core -Dversion=4.0.3 -Dpackaging=jar -Dfile=C:\Users\Administrator\Desktop\aliyun-java-sdk-core-4.0.3.jar
