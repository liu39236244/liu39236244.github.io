# mybatis 基础增删改查以及简单标签

## mybatis知识点总结

> 1 知识点

对原生态jdbc 程序（单独使用jdbc 开发）的问题所在
mybatis框架原理
mybatis入门程序
    用户增删改查
mybatis开发dao两种方式
    原始dao开发方法(程序需要编写dao接口和dao实现)（可以掌握  一些前身ibatis ）
    mybatis的mapper接口（相当于dao接口）代理开发方法(重点要掌握)
mybatis配置文件SqlMapConfig.xml
mybatis核心:
    mybatis 输入映射
    mybatis 输出映射
mybatis动态sql


> 2进阶 

订单商品数据模型
高级结果集映射(一对一、一对多、多对多)
mybatis延迟加载
mybatis 查询缓存(一级缓存、二级缓存)
mybatis喝spring进行整合(掌握)
mybatis逆向工程


## mybatis介绍

### 概念

mybatis是一个持久层的框架、是appache下的顶级项目。后来托管到google下，后来有托管到github上了。(https://github.com/mybatis/mybatis-3/releases)

主要是mybatis 让程序主要将精力放在sql上，通过mybatis提供的映射方式，自由灵活生成(半自动化，大部分需要程序员编写sql ) 满足需要sql语句

mybatis 可以将 preparedStatement 中的输入参数自动进行**输入映射**，将查询结果灵活映射成java对象。（**输出映射**）


![](assets/009/03/01/02-1644123491838.png)


## 入门程序 selectOne


准备mybatis 依赖包；数据库驱动包；


### log4j 配置


![](assets/009/03/01/02-1644123976787.png)

项目基本工程架构

![](assets/009/03/01/02-1644124047626.png)

### 基本的mybatis 的查询配置xml 

#### 参数类型 parameterType

![](assets/009/03/01/02-1644124583446.png)

parameterMap: 早期的类型，现在基本不用
parameterType :指定参数类型

### 参数类型为简单类型的话，那么占位符中的名称可以任意


![](assets/009/03/01/02-1644124794857.png)


#### resultType 指定返回结果集中每条对象需要映射的java 对象


![](assets/009/03/01/02-1644124988157.png)

#### 映射文件 最终代码

![](assets/009/03/01/02-1644125059547.png)


### 加载配置文件


![](assets/009/03/01/02-1644125128567.png)


加载进配置文件

![](assets/009/03/01/02-1644125165806.png)


### 基本查询代码


![](assets/009/03/01/02-1644125646357.png)


## 入门程序 修改  根据名称 查询

### 多条记录结果集的错误示范

![](assets/009/03/01/02-1644126028238.png)


### 根据名称模糊查询 #{} 代表占位符；

![](assets/009/03/01/02-1644126290197.png)

### ${} 占位符替换，使得参数中的 ？ 固定到sql中，


* 注意，这里占位符是直接把给出的参数直接不加任何修饰直接拼到sql上，会有**sql注入**问题。

![](assets/009/03/01/02-1644126390137.png)

> 1 sql 注入如下案例

![](assets/009/03/01/02-1644126497259.png)

### 注意 ${} 参数 注意 value 问题

${} 这种形式，参数是基本类型的话，那么里面只能是value 

![](assets/009/03/01/02-1644126613997.png)

## 总结 

parameterType
resultType

#{} 和 ${} ：
    #{} 占位符
    ${} 拼接符，不建议使用

selectOne

selectList


## 添加的使用

User.xml 配置添加

### parameterType指定pojo


![](assets/009/03/01/02-1644132990174.png)

如果数据库中设置id是自增的话，那么可以在sql中不写 id 

![](assets/009/03/01/02-1644133164388.png)


### 代码

![](assets/009/03/01/02-1644133250588.png)


### 获取新增的主键(mysql)

mysql 自增主键，执行insert 提交之前自动生成一个自增主键。
通过mysql 函数获取到岗插入记录的自增主键：
LAST_INSERT_ID()


不加 selectKey 用户id 就是0 ， (int默认为0)

![](assets/009/03/01/02-1644133559481.png)

### 非自增主键的返回（mysql）

![](assets/009/03/01/02-1644133911572.png)

### oracle 获取序列值

![](assets/009/03/01/02-1644134182712.png)

![](assets/009/03/01/02-1644134612690.png)


```
使用序列：
create sequence S_TABLE1
minvalue 1
maxvalue 1000000000000000000000000000
start with 1
increment by 1
cache 20;
用上面的语句建立序列后
使用s_table1.nextval生成下一个新序号
s_table1.currval取得当前序号（要使用了nextval后才能用）
```


## 删除

![](assets/009/03/01/02-1644134745540.png)


## 更新


![](assets/009/03/01/02-1644134868533.png)


## 总结 #{}  与 ${}


![](assets/009/03/01/02-1644135856921.png)


## mybatis 与 hibernate 区别 和应用场景

![](assets/009/03/01/02-1644136655690.png)



## mybatis 开发dao 与sqlsession 应用


### sqlsession 使用范围

#### SqlSessionFactoryBuilder 

通过 SqlSessionFactoryBuilder  创建会话工厂 SqlSessionFactory
将 SqlSessionFactoryBuilder  当成一个工具类使用即可，不需要使用单利管理 SqlSessionFactoryBuilder

需要 SqlSessionFactory 的时候只需要new 一次 SqlSessionFactoryBuilder就行


#### SqlSessionFactory

通过 SqlSessionFacotry穿件sqlSession ，使用单例模式管理 sqlSessionFactory


#### sqlSession 属于多例


sqlSession  是一个面向用户(程序员)的接口
sqlSession中提供了很多操作数据库的方法： selectOne() 、selectList()


sqlSession 是线程不安全的，在sqlSession 实现类中除了有借口中的方法（操作数据库的方法）还有数据域属性

所以sqlSession 最佳应用场合在方法体内，定义成局部变量使用


## 原始dao开发方法（开发需要些dao接口 和 dao实现类）

需要写dao接口 和dao 实现类。
需要向 dao实现类中注入 sqlSessionFactory ，在方法体内，通过工厂来创建 SqlSession



### dao接口 


![](assets/009/03/01/02-1644138502841.png)





### dao接口实现类


构造函数以及属性定义




![](assets/009/03/01/02-1644138943163.png)

查

![](assets/009/03/01/02-1644139317374.png)

增

![](assets/009/03/01/02-1644138975793.png)

删

![](assets/009/03/01/02-1644138955824.png)




#### 测试类





![](assets/009/03/01/02-1644139206280.png)



### 原始dao 问题总结

> 1 dao接口实现类方法中存在大量模板方法，需要提取这些重复代码减轻歌工作量

> 2 调用sqlSession 方法时将statement的id硬编码了

> 3 调用sqlSession 方法时传入的变量，由于sqlSession方法使用泛型，变量类型就算是传错了，编译也不会给你提醒出来，不利于及时纠错。

## mapper 代理方法(只需要mapper接口(相当于dao 接口))

### 思路


程序员还要编写mapper.xml  映射文件

程序员只需要编写mapper接口(就是以前dao 接口）

mybatis可以自动生成mapper 接口实现类代理对象


开发规范:
 1、 在mapper.xml 中 namespace等于接口地址

 ![](assets/009/03/01/02-1644140380482.png)



2、 mapper.java 接口中的方法名和 mapper.xml 中statement 的id一致

3、 mapper.java 接口中的方法输入参数类型 和mapper.xml 中statement 的parameterType 指定的类型一致

4、 mapper.java 接口中的方法返回值类型和mapper.xml 中 statement 的restulType指定的类型一致。

![](assets/009/03/01/02-1644140582112.png)


### mapper.java

![](assets/009/03/01/02-1644141206194.png)


### mapper.xml

![](assets/009/03/01/02-1644141175209.png)


### 需要在 SqlMapConfig.xml   中加载mapper.xml 

![](assets/009/03/01/02-1644141531184.png)



### 总结 

以上开发规范主要是对下边的代码进行统一生成:

User user =sqlSession.selectOne("test.findUserById",id);
sqlSession.insert("test.insertUser“,user);





### 测试


![](assets/009/03/01/02-1644141262524.png)

![](assets/009/03/01/02-1644141364083.png)


### 问题总结 selectOne 和 selectList 


selectOne 表示查询一条记录。如果使用selectOne 可以实现使用selectList也可以实现(LIst中只有一个对象)

selectList表示 查询出一个列表(多条记录)进行映射。如果使用selectList查询多条记录，不能使用selectOne.

如果使用了，就报错； org.apache.ibatis.exceptions.TooManyResultsException




## SqlMapConfig——properties 定义


SqlMapConfig.xml 中配置内容和顺序如下：

properties（属性）
settings （全局配置参数）
typeAliases(类型别名)
typeHandlers(类型处理器)
objectFactory（对象工厂）
plugins(插件)
enviroments(环境集合属性对象)
    enviroment(环境紫属性对象)
        transactionManager(事务管理)
        dataSource（数据源）
mappers（映射器）


### properties（属性）

将数据库的连接参数单独的配置在db.properties 中，只需要在SqlMapConfig.xml中加载db.properties  的属性值。
在SQLMapConfig.xml 中就不需要对数据库连接参数硬编码。

将数据库连接参数只配置在db.properties中，原因： 方便参数进行统一管理，其他xml可以引用改db.properties



xml中通过引用的方式直接调用properties中的配置

![](assets/009/03/01/02-1644150286174.png)

![](assets/009/03/01/02-1644150250135.png)

> 1 加载完成以后，可以在xml中调用

![](assets/009/03/01/02-1644150459696.png)


### xml中的 <properties>标签 

![](assets/009/03/01/02-1644150959844.png)


注意：MyBatis将按照下面的顺序加载属性

* 1 在properties元素体内定义的属性首先被读取

* 2 然后读取properties元素中resource 活 url 加载的属性，它会覆盖已读取的同名属性。

* 3 最后读取parameterType传递的属性，他会覆盖已读取的同名属性。(就是mapper.xml 中 ${} 占位符随便写的 属性名在 db.properties中也有，也是会被读取到调用的sql中的)

因此，通过parameterType传递的属性最高优先级，resource或者url 加载的属性次之，最低的优先级是properteies元素体内的定义的属性。

建议：
不要再properties元素体内添加任何属性值，只将属性值定义在properties文件中。在properties文件中订一束姓名要有一定的特殊性，如：XXX.XXX.XXX  多来几层



## ## SqlMapConfig——setting 定义

### 介绍

全局setting 配置

mybatis框架运行时可以调整一些参数，
比如：开启二级缓存、开启延迟加载。。

全局参数会影响mybatis运行行为，
参考 mybatis-settings.xlsx 文件

ibatis中会有一些 线程数以及最大超时时间有的参数在mybatis中已经做了自动优化，这里知道就行了

## typeAliases(别名)重点



### mybatis 有一些类型的默认别名



![](assets/009/03/01/02-1644151933045.png)


### 自定义别名


![](assets/009/03/01/02-1644152050245.png)

引用别名

![](assets/009/03/01/02-1644152093897.png)

批量定义别名
可以定义多个包名
![](assets/009/03/01/02-1644152424387.png)


### SqlMapConfig-类型处理器

typeHandlers

mybatis 中 通过 typeHandlers 完成 jdbc类型和java 类型的转换， 所以mapper.xml 中 其实是把java 类型最终还是转化为jdbc 去执行的；


![](assets/009/03/01/02-1644153016697.png)



## SqlMapConfig-mapper加载

![](assets/009/03/01/02-1644153081868.png)



单个加载，批量加载

![](assets/009/03/01/02-1644153729746.png)



## 输入映射-pojo包装类型-定义pojo包装类型

### 需求

查询用户信息；需要很复杂的查询条件（比如其他表的查询条件）

在包装类型的pojo中将复杂的查询条件包装进去

![](assets/009/03/01/02-1644154534894.png)


语句中通过vo 传递 属性参数

![](assets/009/03/01/02-1644154870846.png)


测试使用


![](assets/009/03/01/02-1644155176759.png)

## 输出映射


![](assets/009/03/01/02-1644155252980.png)


### resultType

使用resultType输出的映射，只有查询出来的列明和pojo中的属性名一致，该列才可以映射成功
如果查询出来的列明和pojo中的属性名全部不一致，没有创建pojo对象。
只要查询出来的列名和pojo中的属性有一个一致，就会创建pojo对象


#### resultType简单类型

* mapper.xml 

![](assets/009/03/01/02-1644155779916.png)

* mapper.java接口

查询出来的结果集有且只有一行一列，可以使用简单类型进行输出映射。


#### 输出pojo类型

输出pojo列表还是pojo对象

![](assets/009/03/01/02-1644156219106.png)


### resultMap

高级输出映射，查询出来的列名和pojo的属性名不一致，通过定一个resultMap 对列名和pojo属性名之间做一个映射关系.

1、定义resultMap

![](assets/009/03/01/02-1644156790207.png)

2、 使用resultMap 作为statement 的输出映射类型

![](assets/009/03/01/02-1644156830449.png)


### 总结 

使用resultType输出的映射，只有查询出来的列明和pojo中的属性名一致，该列才可以映射成功

高级输出映射，查询出来的列名和pojo的属性名不一致，通过定一个resultMap 对列名和pojo属性名之间做一个映射关系.


## 动态sql-if判断

### 概念

mybatis 核心对sql 语句进行灵活操作，通过表达式进行判断，对sql 进行灵活拼接、组装

### 需求 

用户信息总和查询列表和用户信息查询列表总数这两个statement的定义使用动态sql
对查询条件进行，如果输入参数不为空才进行查询条件拼接。



![](assets/009/03/01/02-1644157353468.png)


测试代码


![](assets/009/03/01/02-1644157580107.png)


### 动态sql 片段

#### 需求
将上边实现的动态sql判断代码块抽取出来，组成一个slq片段，其他的statement就可以引用slq片段

#### 定义sql 片段


```
<sql>

</sql>
```
* 注意sql 片段中最好不要加where ，因为可能会引用多个sql片段会重复

![](assets/009/03/01/02-1644157806980.png)


使用

![](assets/009/03/01/02-1644157937338.png)


 将上面 动态sql 判断代码块抽取出来，组成一个sql片段，其他的statement钟就可以引用sql片段。方便开发


 ## foreach片段

在输入参数类型中添加 List<Integer> ids 传入多个id

 ![](assets/009/03/01/02-1644158173257.png)


 ![](assets/009/03/01/02-1644158481517.png)


 ### 测试代码

 ![](assets/009/03/01/02-1644158547247.png)


### and id in () 形式

 ![](assets/009/03/01/02-1644158626487.png)