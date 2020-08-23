# springboot 上传那文件过大问题




## 总结

> 最终可用的

在yml配置文件中添加配置，能解决前端formData 中文件过大导致无法进入后端接口问题

```
  servlet:
    multipart:
      max-file-size: 20MB
      max-request-size: 30MB
```

如下配置

```yml
server:
  port: 8092
  servlet:
    context-path: /synthesize
spring:
  application:
    name: tc-synthesize
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:oracle:thin:@IP:端口:ORCL
    username: TaiCang3D
    password: TaiCang3D
    driver-class: oracle.jdbc.driver.OracleDriver
    name: datasource
    druid:
      initial-size: 10
      max-active: 100
      max-wait: 60000
      min-idle: 10
      validation-query: SELECT 1 from dual
      test-on-borrow: false
      test-on-return: false
      min-evictable-idle-time-millis: 300000
      test-while-idle: true
      time-between-eviction-runs-millis: 30000
      max-pool-prepared-statement-per-connection-size: 20
      pool-prepared-statements: true
      max-open-prepared-statements: 20
 # redis:
  #  host:
   # port:
  main:
    allow-bean-definition-overriding: true
  servlet:
    multipart:
      max-file-size: 20MB
      max-request-size: 30MB
```




## 零散


在网上找了很多不同在application.properties的配置，但是没有一个适合，最后还是用上了其中一个，终于可以了，我觉得网上说的应该都有人试过，应该都对，但可能是针对不同的版本和不同请求问题，导致在我的服务里面不管用，在这里先记录一下，我现在成功的情况：

springboot版本是2.1.2

配置是：

spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=30MB

 

到底是什么原因用别人的就不对呢？暂时不太知道原因所在，不成功的配置是这样的：

spring.http.multipart.maxFileSize=100Mb
spring.http.multipart.maxRequestSize=1000Mb


## 通过设置bean
* 博客原地址：https://blog.csdn.net/qq_25446311/article/details/78600354


（2）把如下代码放在启动类上，并在类上加入@Configuration
```java
 /**
     * 文件上传配置
     * 
     * @return
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        //  单个数据大小
        factory.setMaxFileSize("10240KB"); // KB,MB
        /// 总上传数据大小
        factory.setMaxRequestSize("102400KB");
        return factory.createMultipartConfig();
    }

```