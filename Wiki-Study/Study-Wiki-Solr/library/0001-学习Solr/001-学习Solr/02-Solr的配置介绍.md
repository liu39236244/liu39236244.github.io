>1. Solr的使用属性以及配置文件


# Solr的使用属性以及配置文件
* 1
Document 包括一个或多个 Field。Field 包括名称、内容以及告诉 Solr 如何处理内容的元数据。

例如Field，Field可以包含字符串、数字、布尔值或者日期，也可以包含你想添加的任何类型，只需用在solr的配置文件中进行相应的配置即可。Field可以使用大量的选项来描述，这些

选项告诉 Solr 在索引和搜索期间如何处理内容。
下列两个属性列出重要属性子集：

|属性名|描述|
|-|-|
|indexed|Indexed Field 可以进行搜索和排序。你还可以在indexed Fields上运行Solr分析过程，此过程可修改内容以以改进或更改结果。|
|Stored|Stored Field内容保存在索引中。这对于检索和醒目显示内容很有用，但对于实际搜索则不是必须的。列入不少应用程序存储指向内容位置的指针，而不是真的把数据存起来，比如数据库中记录用户头像。但是数据库中记录的其实是地址|

* 2
而Solr重要文件之一，就是Schema.xml配置文件.
在这就先提一下solr的重要文件之一，就是schema.xml的配置文件。

（一） schema.xml

schema.xml这个配置文件可以在你下载solr包的安装解压目录的\solr\example\solr\collection1\conf中找到，它就是solr模式关联的文件。

打开这个配置文件，你会发现有详细的注释。模式组织主要分为三个重要配置：

## 一、Fieldtype

Fieldtype：就是属性类型的意思，像int，String，Boolean种类型，而在此配置文件中，FieldType就有这种定义属性的功能，看下面的图片：
![fieldType的配置案例](assets/0001/20180322-81146baa.png)  

上述name=""中的string/boolean 就是类型了，后面的参数见下图：

![属性字段](assets/0001/20180322-4f925a3d.png)  

## 二、Field

Field：是添加到索引文件中出现的属性名称，而声明类型就需要用到上面的type，如图所示：

![Field的图片详解](assets/0001/20180322-d8422f04.png "Field的图片详解")  


> ps：①field: 固定的字段设置；②dynamicField: 动态的字段设置,用于后期自定义字段,\*号通配符.例如: test_i就是int类型的动态字段。
还有一个特殊的字段copyField,一般用于检索时用的字段这样就只对这一个字段进行索引分词就行了copyField的dest字段如果有多个source一定要设置multiValued=true,否则会报错的。

![copyField配置](assets/0001/20180322-e8278bda.png "copyField配置")  


在Field里也有一些属性需要了解，看图：

![Field的另外一些属性](assets/0001/20180322-56a1b444.png "Field的另外一些属性")  

![_version_，multiValued的配置](assets/0001/20180322-4f9047ad.png)  

## 三、其他配置
### (一) 搜索属性、查询转换模式

①uniqueKey: 唯一键，这里配置的是上面出现的fileds，一般是id、url等不重复的。在更新、删除的时候可以用到。

②defaultSearchField:默认搜索属性，如q=solr就是默认的搜索那个字段

③solrQueryParser:查询转换模式，是并且还是或者（AND/OR必须大写）

### (二)solrconfig.xml

>  solrconfig.xml这个配置文件可以在你下载solr包的安装解压目录的E:\Work\solr-4.2.0-src-idea\solr\example\solr\collection1\conf中找到，这个配置文件内容有点多,主要内容有:使 用的lib配置,包含依赖的jar和Solr的一些插件;组件信息配置;索引配置和查询配置,下面详细说一下索引配置和查询配置.


一、索引indexConfig
  Solr 性能因素，来了解与各种更改相关的性能权衡。 下表概括了可控制 Solr 索引处理的各种因素：

![索引的配置indexconfig](assets/0001/20180322-0bde2867.png "索引indexconfig的配置")  

二、查询配置query

![查询配置query](assets/0001/20180322-00d4b47a.png)  
![查询配置query2](assets/0001/20180322-bf032737.png)  

### (三)加入中文分词器

```
中文分词在solr里面是没有默认开启的，需要我们自己配置一个中文分词器。目前可用的分词器有smartcn，IK，Jeasy，庖丁。其实主要是两种，一种是基于中科院ICTCLAS的隐式马尔科夫HMM算法的中文分词器，
如smartcn，ictclas4j，优点是分词准确度高，缺点是不能使用用户自定义词库；另一种是基于最大匹配的分词器，如IK ，Jeasy，庖丁，优点是可以自定义词库，增加新词，缺点是分出来的垃圾词较多。各有优缺点看应用场合自己衡量选择吧。

下面给出两种分词器的安装方法，任选其一即可，推荐第一种，因为smartcn就在solr发行包的contrib/analysis-extras/lucene-libs/下，就是lucene-analyzers-smartcn-4.2.0.jar,首选在solrconfig.xml中加一句引用analysis-extras的配置,这样我们自己加入的分词器才会引到的solr中.
<lib dir="../../../contrib/analysis-extras/lib" regex=".*\.jar" />
```

#### 分词器的安装
一、 smartcn 分词器的安装
>   首选将发行包的contrib/analysis-extras/lucene-libs/ lucene-analyzers-smartcn-4.2.0.jar复制到\solr\contrib\analysis-extras\lib下,在solr本地应用文件夹下，打开/solr/conf/scheme.xml，编辑text字段类型如下，添加以下代码到scheme.xml中的相应位置，就是找到fieldType定义的那一段，在下面多添加这一段就好了：

```xml
<fieldType name="text_smartcn" class="solr.TextField" positionIncrementGap="0">  

      <analyzer type="index">  

        <tokenizer class="org.apache.lucene.analysis.cn.smart.SmartChineseSentenceTokenizerFactory"/>  

        <filter class="org.apache.lucene.analysis.cn.smart.SmartChineseWordTokenFilterFactory"/>  

      </analyzer>  

      <analyzer type="query">  

         <tokenizer class="org.apache.lucene.analysis.cn.smart.SmartChineseSentenceTokenizerFactory"/>  

         <filter class="org.apache.lucene.analysis.cn.smart.SmartChineseWordTokenFilterFactory"/>  

      </analyzer>  

</fieldType>  
```
如果需要检索某个字段，还需要在scheme.xml下面的field中，添加指定的字段，用text_ smartcn作为type的名字，来完成中文分词。如 text要实现中文检索的话，就要做如下的配置：
```javascript
<field name ="text" type ="text_smartcn" indexed ="true" stored ="false" multiValued ="true"/>

```
2 还有一个就是 IK分词器，因为在5.0之后才有的IKAnalyzer的jar包，这里学习用的是solr4.9版本，在这里就不多详细介绍IKAnalyzer。有兴趣的同学可以根据下面的路径下载Jar包：
路径：http://ik-analyzer.googlecode.com/files/IK%20Analyzer%202012FF_hf1.zip.
下载后解压出来文件中的三个复制到\solr\contrib\analysis-extras\lib目录中.

```
IKAnalyzer2012FF_u1.jar      分词器jar包

IKAnalyzer.cfg.xml           分词器配置文件

Stopword.dic                分词器停词字典,可自定义添加内容
```

复制后就可以像smartcn一样的进行配置scheme.xml了.

```xml
<fieldType name="text_ik" class="solr.TextField">  

 <analyzer class="org.wltea.analyzer.lucene.IKAnalyzer"/>  

</fieldType>  

<field name ="text" type ="text_ik" indexed ="true" stored ="false" multiValued ="true"/>  
```
现在来验证下是否添加成功,首先使用StartSolrJetty来启动solr服务,启动过程中如果配置出错,一般有两个原因:一是配置的分词器jar找不到,也就是你没有复制jar包到\solr\contrib\analysis-extras\lib目前下;二是分词器版本不对导致的分词器接口API不一样出的错,要是这个错的话就在检查分词器的相关文档,看一下支持的版本是否一样.

如果在启动过程中没有报错的话说明配置成功了.我们可以进入到http://localhost:8983/solr地址进行测试一下刚加入的中文分词器.在首页的Core Selector中选择你配置的Croe

后点击下面的Analysis,在Analyse Fieldname / FieldType里选择你刚才设置的字段名称或是分词器类型,在Field Value(index)中输入:中国人,点击右面的分词就行了。























# end
