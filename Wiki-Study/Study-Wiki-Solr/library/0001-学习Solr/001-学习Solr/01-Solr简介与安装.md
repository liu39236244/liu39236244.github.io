

# 一、Solr 的介绍

##  Solr

### Solr 网站
[Solr官网](http://lucene.apache.org/solr/)
###  Solr 简介：(摘自百度文库)

> 1 介绍：Solr是一个独立的企业级搜索应用服务器，它对外提供类似于Web-service的API接口。用户可以通过http请求，向搜索引擎服务器提交一定格式的XML文件，生成索引；也可以通过Http Get操作提出查找请求，并得到XML格式的返回结果。


> 2 特点:Solr是一个高性能，采用Java5开发，基于Lucene的全文搜索服务器。同时对其进行了扩展，提供了比Lucene更为丰富的查询语言，同时实现了可配置、可扩展并对查询性能进行了优化，并且提供了一个完善的功能管理界面，是一款非常优秀的全文搜索引擎。


> 3 工作方式：<br/>
文档通过Http利用XML 加到一个搜索集合中。
查询该集合也是通过http收到一个XML/JSON响应来实现。它的主要特性包括：高效、灵活的缓存功能，垂直搜索功能，高亮显示搜索结果，通过索引复制来提高可用性，提供一套强大Data Schema来定义字段，类型和设置文本分析，提供基于Web的管理界面等。

#### Solr 其他简介：

* [csdn时光倒流者：solr简介以及最初的搭建与API](http://blog.csdn.net/shao_zhiqiang/article/details/51879763)
* 以下总结源自于上述博主↑还是蛮详细的,这里的不少内容都是出自于以上博主

* 1 优点：
```
 ①高级的全文搜索功能；
 ②专为高通量的网络流量进行的优化；
 ③基于开放接口（XML和HTTP）的标准；
 ④综合的HTML管理界面；
 ⑤可伸缩性－能够有效地复制到另外一个Solr搜索服务器；
 ⑥使用XML配置达到灵活性和适配性；
 ⑦可扩展的插件体系。
```
* 2 与lucene对比

> 其实，Solr与Lucene 并不是竞争对立关系，恰恰相反Solr 依存于Lucene，因为Solr底层的核心技术是使用Lucene 来实现的，Solr和Lucene的本质区别有以下三点：搜索服务器，企业级和管理。Lucene本质上是搜索库，不是独立的应用程序，而Solr是。Lucene专注于搜索底层的建设，而Solr专注于企业应用。Lucene不负责支撑搜索服务所必须的管理，而Solr负责。所以说，一句话概括 Solr: Solr是Lucene面向企业搜索应用的扩展。

>> lucene:Lucene是一个基于Java的全文信息检索工具包，它不是一个完整的搜索应用程序，而是为你的应用程序提供索引和搜索功能。Lucene 目前是 Apache Jakarta(雅加达) 家族中的一个开源项目。也是目前最为流行的基于Java开源全文检索工具包。目前已经有很多应用程序的搜索功能是基于 Lucene ，比如Eclipse 帮助系统的搜    索功能。Lucene能够为文本类型的数据建立索引，所以你只要把你要索引的数据格式转化的文本格式，Lucene 就能对你的文档进行索引和搜索。

> ![Solr与lucene之间的图解关系](assets/0001/20180322-535ce77c.png)  

````
a. 一个真正的拥有动态字段(Dynamic Field)和唯一键(Unique Key)的数据模式(Data Schema)
b. 对Lucene查询语言的强大扩展！
c. 支持对结果进行动态的分组和过滤
d. 高级的，可配置的文本分析
e. 高度可配置和可扩展的缓存机制
f. 性能优化
g. 支持通过XML进行外部配置
h. 拥有一个管理界面
i. 可监控的日志
j. 支持高速增量式更新(Fast incremental Updates)和快照发布(Snapshot Distribution)
````
---

> 后续解释...


---

# 二、Solr的安装

## solr 注意事项：

一、保证环境必须在JDK1.7上；

二、tomCat建议在tomcat7以上版本；

三、如若不是solr4.9版本的，solr5.0以上建议tomCat在tomcat8以上；

四、solr4.9版本的核心类及常用的属性，和solr5.0以上的差不多，但是还有细微的区别，请注意！

## 一、安装solr步骤

### 步骤一、配置solr与TomCat集成

先把solr的压缩包去官网 http://archive.apache.org/dist/lucene/solr/ 下载并解压，名称为 .zip 压缩文件（win）
，解压到特定的文件夹下，最好不要有中文

### 步骤二、与tomcat 进行集成

由于4.9的跟之后的不一样，所以我在网上又找了其他博主的安装。源自于博主[kaiwen666](http://blog.csdn.net/kaiwen666/article/details/78068837)
但还都是吧一个项目让tomcat启动。
* 1- 需要首先安装1.7以上的jdk、tomcat、solr-\**版本
* 2- 拷贝solr-7.0.0\server\solr-webapp\webapp文件夹至%TOMCAT_HOME%\webapps\下，并重命名webapp为solr，如下图

![安装所需copy到tomcat/webapp下的项目](assets/0001/20180322-65f52aa1.png)  

* 3- 将solr-7.0.0\server\lib\ext下的所有jar包，以及solr-7.0.0\server\lib下以metrics开头的jar、gmetric4j-1.0.7.jar复制到apache-tomcat-8.5.15\webapps\solr\WEB-INF\lib下，等于说下面三部分的jar包

![tomcat 下面所需要的jar包](assets/0001/20180322-3b5f9b18.png)  

* 4- 在%TOMCAT_HOME%\webapps\webapp\WEB-INF中，新建classes文件夹，将solr-7.0.0\server\resources下的log4j.properties文件拷贝到里面。
* 5- 修改tomcat脚本catalina.bat，增加solr.log.dir系统变量，指定solr日志记录存放地址。

![配置log存放目录](assets/0001/20180322-0df5543a.png)  

* 注意：如果不进行这里的配置，日志将不能正常打印。log4j.properties中有依赖此变量。

* 6- 创建SOLR HOME目录（solr_home），这里标记为%SOLR_HOME%。
* 7- 拷贝solr-7.0.0\server\solr\下所有文件、文件夹至%SOLR_HOME%目录下。
* 8- 在刚才tomcat中配置的logs路径，就是这里solr_home里面的一个文件夹。
* 9- 拷贝solr-7.0.0 下contrib和dist文件夹至%SOLR_HOME%目录下。
* 10- 在%SOLR_HOME%目录下新建new_core文件夹；并拷贝solr-7.0.0\server\solr\configsets_default\目录下conf文件夹至%SOLR_HOME%\new_core下。
* 11- 修改%SOLR_HOME%\new_core\conf\solrconfig.xml文件，如下。

![配位文件中的修改](assets/0001/20180322-ed564385.png)  
> 而对于这一行配置，上方给出了英文注释：
“dir”选项本身添加了在目录中找到的任何文件。
对于类路径，这对于包括所有jar都很有用。
目录中。
当“regex”被指定为“dir”时，只指定。
与正则表达式完全匹配的目录中的文件。
(锚定在两端)将被包括在内。

* 12- 修改%TOMCAT_HOME%\webapps\solr\WEB-INF中的web.xml文件，
> 1. 修改<env-entry-value>中的路径为刚才的scala_home 路径，
> 2. 然后注释掉<security-constraint>下的内容，目的应该是不让清楚错误信息

![在tomcat 中复制的solr 的web.xml 进行配置](assets/0001/20180322-72559da7.png)  

![应该是不清楚错误信息](assets/0001/20180322-837a8c15.png)  

* 13- 启动tomcat 访问 http://localhost:8080/solr/index.html

* 补充：这样安装的solr 没有办法导入数据，并且连接数据库mysql也是不可以的。原因是没有导入两个jar包，dist目录中的两个包，然后在进行[配置](https://blog.csdn.net/duck_genuine/article/details/5426897  )
![要导入数据到solr 中需要 导入量外的两个包](assets/0001/20180322-db93aa65.png)
![另外添加的配置](assets/0001/20180322-f76d333c.png)  


具体配置如下
```xml
1）在solrconfig.xml增加

 <!--新增加的配置-->
   <requestHandler name="/dataimport" class="org.apache.solr.handler.dataimport.DataImportHandler">
    <lst name="defaults">
      <str name="config">data-config.xml</str>
    </lst>
  </requestHandler>
2）然后在solrconfig.xml同一个目录下，即是solr home目录下增加 data-config.xml 文件
<dataConfig>
    <dataSource driver="com.mysql.jdbc.Driver" url="jdbc:mysql://localhost:3306/你的mysql要链接的数据库" user="root" password="你的数据库密码"/>
    <document name="movieDoc">
        <entity name="movie" transformer="RegexTransformer,DataToIntTransformer" query="select * from movie" >

            <field column="actors" splitBy="," sourceColName="actors"/>
            <field column="director" splitBy="," sourceColName="director"/>

            <entity name="type" query="select id as tid from movie_type where mid='${movie.mid}'">
                <field name="tid" column="tid" />
            </entity>
             <entity name="language" query="select id as lid from movie_language where mid='${movie.mid}'">
                <field name="lid" column="lid" />
            </entity>
             <entity name="zone" query="select id as zid from movie_zone where mid='${movie.mid}'">
                <field name="zid" column="zid" />
            </entity>
             <entity name="detail" query="select sub_index,title,vid  from movie_detail where mid='${movie.mid}' and chk_yn='y'">
                <field name="sub_index" column="sub_index" />
                <field name="title" column="title" />
                <field name="vid" column="vid" />
            </entity>
            <!--
            <entity name="item_category" query="select CATEGORY_ID from item_category where item_id='${item.ID}'">
                <entity name="category" query="select description from category where id = '${item_category.CATEGORY_ID}'">
                    <field column="description" name="cat" />
                </entity>
            </entity>
            -->
        </entity>
    </document>
</dataConfig>

3）加入相关的jar包，apache-solr-dataimporthandler-1.4.0.jar，apache-solr-dataimporthandler-extras-1.4.0.jar，mysql-connector-java-5.1.10.jar

启动tomcat，访问http://localhost:8080/solr/dataimport?command=full-import 将数据全部导入solr服务器进行索引

访问http://localhost:8080/solr/dataimport?command=status可以查看运行状态

当修改data-config.xml 文件配置时运行http://localhost:8080/solr/dataimport?command=reload-config可以进行重新加载配置文件

如果想终止运行http://localhost:8080/solr/dataimport?command=abort
```



### 步骤三、 查看Solr
* 1- 如果不进行11步中对 dir中的../后面的给修改了则点击log会报错！

![log 点击报错](assets/0001/20180322-92b3cf6e.png)  

* 2- 点击Core Admin,没有Core则提示添加

```java

    instanceDir
    对应%SOLR_HOME%\new_core.
    dataDir
    对应%SOLR_HOME%\new_core\data
    config
    对应%SOLR_HOME%\new_core\conf\solrconfig.xml
    schema
    对应%SOLR_HOME%\new_core\conf\managed-schema

    name：给core随便起个名字；
    instanceDir：core的安装目录，这里就是之前在tomcat/solrhome/目录下创建的core1文件夹；
    dataDir：指定用于存放lucene索引和log日志文件的目录路径，该路径是相对于core根目录(在单core模式下，就直接是相对于solr_home了)，默认值是当前core目录下的data；
    config：用于指定solrconfig.xml配置文件的文件名，启动时会去core1/config目录下去查找；
    schema：即用来配置你的schema.xml配置文件的文件名的，schema.xml配置文件应该存放在当前core目录下的conf目录下。但是下载的solr里没有这个文件，所以我也不管了；
    属性都填上，然后点击Add Core，就创建完成了。
```
但是如果你添加的new_core 还是这个名字的话，那么就会报错，新添加的名字不能重复
![新添加报错！](assets/0001/20180322-77e0367a.png)  

### 在jetty 下面安装运行
这里直接给了官方指导，以后还是得多看英文安装促组件：http://lucene.apache.org/solr/7_0_0/quickstart.html

* 参考链接：

    http://www.cnblogs.com/x113773/p/7054858.html

    http://lucene.apache.org/solr/7_0_0/quickstart.html

再次指明一下吧：上述原文出处：http://blog.csdn.net/kaiwen666/article/details/78068837

---
# end
