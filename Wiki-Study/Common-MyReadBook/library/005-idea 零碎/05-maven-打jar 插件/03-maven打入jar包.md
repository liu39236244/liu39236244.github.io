# maven 打入第三方jar包 


## 命令打入


mvn install:install-file -Dfile=C:\Users\Administrator\Desktop\ojdbc6-11.1.0.7.0.jar -DgroupId=com.oracle -DartifactId=ojdbc6 -Dversion=11.1.0.7.0 -Dpackaging=jar


mvn install:install-file -Dfile=C:\Users\Administrator\Desktop\sigar-1.6.5.132-6.jar -DgroupId=org.hyperic -DartifactId=sigar -Dversion=1.6.5.132-6 -Dpackaging=jar



mvn install:install-file -Dfile=E:\shenyabo-work\idea_working_space\2021_QDSWJT\bamboocloud_Codec-0.0.3.jar -DgroupId=com.bamboocloud.Codec.bamboocloud_Codec -DartifactId=bamboocloud_Codec -Dversion=0.0.3 -Dpackaging=jar