# 90分钟了解 spring boot  课堂总结


# spring boot 介绍

## 1 springboot 简单介绍

![](assets/000/02/01/01/01-1587173178062.png)


* 1 spring 使用的话有许多不方便的地方

spring boot 对spring 平台和第三方库进行了整合，可创建可以运行的、独立的、生产级的基于Spring 的应用程序（大多数springboot 应用程序只需要很少的spring 配置）
 

```
1. 整合redis  mq 等其他第三方jar ，而且jar引入之后执行会各种报错，这就是jar 的版本与现有的 spring 或者其他组件版本不兼容导致
2. 需要配置 许多的xml 文件
3. 管理bean 都需要配置  
```

* 2 springboot 架构层次



![](assets/000/02/01/01/01-1587174366244.png)

properties  并不是spring 之前的 xml 配置文件，属性赋值使用，正常就是配置plugin 插件用于生成 mybatis 或者tkmybatis 生成的  mapper接口 ，bean ，maperxml 文件 ；

> 而且springboot 内置了一个tomcat ，其实就是扭一个Tomcat 类，把相关的配置放入bean 并且开启tomcat 即可，内置tomcat 并不是springboot牛逼的地方


* 3 spring 零配置文件


![](assets/000/02/01/01/01-1587174694991.png)

spring 中 配置bean 并且对bean 进行管理 ，其实spring中有xml配置 也有 @Configuration @Bean 注解 ，但是他们的本质其实都是操作底层的一个Map ，当然是一个严格线程安全的map （ConcurrentHashMap, 介绍https://www.jianshu.com/p/d0b37b927c48）,但是springboot中呢 基本很少有说用右边第二种注解的形式 ，那么到底怎么做了呢咱们继续往下看；


## 2 spring boot 优势快速阅览


![](assets/000/02/01/01/01-1587175639731.png)
 
* 2.1 spring 中的缺点

```
1.配置文件
2.外部部署
3.第三方依赖复杂引入    
```

* 2.2 spring-boot 中的缺点

```
1. 全java 代码，少配置
2. 内置服务器容器  
3. 傻瓜式引入第三方组件
```

## 3 springboot帮助我们解决了那些问题：


![](assets/000/02/01/01/01-1587176051423.png)


* 3.1 为什么引入包都是 starter 呢？

![](assets/000/02/01/01/01-1587176140292.png)


* 3.2  springboot 引入mybatis 的包需要引入mybatis 以及mybatis与spring、的整合包，但是现在只需要一个集成结合器，也就是开始者starter ，点进去会发现starter 这个已经帮你解决了需要的包依赖


![](assets/000/02/01/01/01-1587176576182.png)


![](assets/000/02/01/01/01-1587176585266.png)


* 3.3 mybatis starter 中的其他依赖包

![](assets/000/02/01/01/01-1587177149653.png)

--- 

> autoconfiguration 自动配置依赖点进去观察 ！

![](assets/000/02/01/01/01-1587177243851.png)


* 属性、条件设置 ，但是先不用管，只用知道 这里用sqlSessionFactory 返回 sqlsession

![](assets/000/02/01/01/01-1587177346926.png)


## 4 探究starter 秘密之一

![](assets/000/02/01/01/01-1587177434990.png)


* 4.1 autoConfiguration 

> 那么内置的这么多依赖都加载出来吗，而且如果不添加properties 数据库配置springboot 能启动吗？（会报错，但是可以配置不配置datasource 启动）

![](assets/000/02/01/01/01-1587177518797.png)

以tomcat 为例，主要是注解上的区别

![](assets/000/02/01/01/01-1587177805773.png)


>  有tomcat的jdbc注解 ，且没有datasource 实例的时候才会有tomcat bean 注入

第一个条件，有某个class（Datasource ）条件才会进行加载，也就是引入jar ，比如mysql  oracel 等
![](assets/000/02/01/01/01-1587177873115.png)

> 第二个条件没有datasource 实例


> 第三个条件

且配置文件中必须有spring.datasource.type  且 为tomcat 的datasource 的时候tomcat 才会加载

![](assets/000/02/01/01/01-1587178115716.png)


* 4.2 这就是spring boot 自动配置的秘密

![](assets/000/02/01/01/01-1587178349643.png)


## 5 spring boot 秘密之2 

![](assets/000/02/01/01/01-1587178947673.png)

![](assets/000/02/01/01/01-1587179077011.png)


* 5.1 mybatis 配置的前缀 都做了规定

![](assets/000/02/01/01/01-1587179181734.png)

* 5.2 yml配置使用

![](assets/000/02/01/01/01-1587179278873.png)


* 5.3 spring boot 启动过程中datasource 配置


![](assets/000/02/01/01/01-1587179429594.png)


## 6 spring boot 启动类加载对应bean 问题

* 只会启动应用程序同等级包以及下面的所有包中的@Bean 

![](assets/000/02/01/01/01-1587180134375.png)

* 但是mybatis 等其他bean 是如何呗spring 加载的呢？？不是自相矛盾吗跟上面的


![](assets/000/02/01/01/01-1587180247904.png)

* spring boot 会读取加载每个包下面对应的spirng.factories 去寻找对应的Configuration(mybatis 就是 MybatiesAutoConfiguration)

![](assets/000/02/01/01/01-1587180363231.png)


## 7 开发自己的spring-boot-Starter


* 7.2 starter 主要是自动配置、 引入jar 


![](assets/000/02/01/01/01-1587180727614.png)


![](assets/000/02/01/01/01-1587180796248.png)


* 7.3 架构 

![](assets/000/02/01/01/01-1587180969764.png)



![](assets/000/02/01/01/01-1587180979923.png)


![](assets/000/02/01/01/01-1587181073730.png)


![](assets/000/02/01/01/01-1587181208912.png)


* 7.4 springcloud 注册中心，一定是通过自动注入机制执行的，自动注入机制加载流程



## 8 热门技术栈


![](assets/000/02/01/01/01-1587188207557.png)




