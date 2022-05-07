# webService 介绍

## 我的总结


* 两种方式开发webservice 
 https://blog.csdn.net/zhanglf02/article/details/73951581


* webservice 两种方式 cxf axis ：https://www.cnblogs.com/snake-hand/archive/2013/06/09/3129915.html 
    jws方式也就是java代码：https://blog.csdn.net/weixin_34130389/article/details/93404186 
    

* springboot 引入axis 的依赖

参考地址：https://blog.csdn.net/bokerr/article/details/82221117


* springboot +axis2+idea 集成
https://blog.csdn.net/weixin_39147995/article/details/103512295 

* 解决整合axis 之后无法使用awtoried 注入其他service 方法

https://www.cnblogs.com/JohnDawson/p/11171635.html

## 博客总结

Service 介绍以及使用:https://blog.csdn.net/qq_34845394/article/details/86478208

    webService 的几种方式：https://www.cnblogs.com/cyblog-eastcn/p/4960238.html 
                        脚本之家：https://www.jb51.net/article/97714.htm
    1.Axis2
    2.xfire
    这个接口如果是开放提供给其他程序调用，如c、php等不确定编程语言，那就用axis2;
    如果调用方也全部是java语言，用cxf
SOAP:菜鸟教程：https://www.runoob.com/soap/soap-tutorial.html


### 简单总结：

   WebService 也叫XML Web Service，WebService是一种可以接收从Internet或者Intranet上的其它系统中传递过来的请求，轻量级的独立的通讯技术。是通过SOAP在Web上提供的软件服务，使用WSDL文件进行说明，并通过UDDI进行注册。


* springboot整合axis 开发webservice服务端 

https://www.cnblogs.com/JohnDawson/p/11151806.html 


## webservice 三方介绍

### webService 和  http接口(api) 区别：

原文：https://www.cnblogs.com/leeego-123/p/10404631.html


 web service（SOAP）与HTTP接口的区别：

 


什么是web service？

      答：soap请求是HTTP POST的一个专用版本，遵循一种特殊的xml消息格式Content-type设置为: text/xml任何数据都可以xml化。

为什么要学习web service？

        答：大多数对外接口会实现web service方法而不是http方法，如果你不会，那就没有办法对接。

web service相对http (post/get)有好处吗？

            1.接口中实现的方法和要求参数一目了然

             2.不用担心大小写问题

            3.不用担心中文urlencode问题

            4.代码中不用多次声明认证(账号,密码)参数

            5.传递参数可以为数组，对象等...

web service相对http（post/get）快吗？

     答：由于要进行xml解析，速度可能会有所降低。

web service 可以被http（post/get）替代吗？

        答：完全可以，而且现在的开放平台都是用的HTTP（post/get）实现的。

 

httpservice通过post和get得到你想要的东西
webservice就是使用soap协议得到你想要的东西，相比httpservice能处理些更加复杂的数据类型
http协议传输的都是字符串了，webservice则是包装成了更复杂的对象。
1. webservice走HTTP协议和80端口。

2. 而你说的api，用的协议和端口，是根据开发人员定义的。

3. 这么说吧，api类似于cs架构，需要同时开发客户端API和服务器端程序。

4. 而WebService则类似于bs架构，只需要开发服务器端，不需要开发客户端，客户端只要遵循soap协议，就可以调用。

 

java用webservice作接口有什么好处？直接提供一个请求地址就行了啊
 答：对开发语言通用类型做xml映射处理，跨语言，跨平台。

 

1.1、Web Service基本概念


Web Service也叫XML Web Service WebService是一种可以接收从Internet或者Intranet上的其它系统中传递过来的请求，轻量级的独立的通讯技术。是:通过SOAP在Web上提供的软件服务，使用WSDL文件进行说明，并通过UDDI进行注册。

XML：(Extensible Markup Language)扩展型可标记语言。面向短期的临时数据处理、面向万维网络，是Soap的基础。

Soap：(Simple Object Access Protocol)简单对象存取协议。是XML Web Service 的通信协议。当用户通过UDDI找到你的WSDL描述文档后，他通过可以SOAP调用你建立的Web服务中的一个或多个操作。SOAP是XML文档形式的调用方法的规范，它可以支持不同的底层接口，像HTTP(S)或者SMTP。

WSDL：(Web Services Description Language) WSDL 文件是一个 XML 文档，用于说明一组 SOAP 消息以及如何交换这些消息。大多数情况下由软件自动生成和使用。

UDDI (Universal Description, Discovery, and Integration) 是一个主要针对Web服务供应商和使用者的新项目。在用户能够调用Web服务之前，必须确定这个服务内包含哪些商务方法，找到被调用的接口定义，还要在服务端来编制软件，UDDI是一种根据描述文档来引导系统查找相应服务的机制。UDDI利用SOAP消息机制（标准的XML/HTTP）来发布，编辑，浏览以及查找注册信息。它采用XML格式来封装各种不同类型的数据，并且发送到注册中心或者由注册中心来返回需要的数据。

1.2、XML Web Service的特点

Web Service的主要目标是跨平台的可互操作性。为了实现这一目标，Web Service 完全基于XML（可扩展标记语言）、XSD（XML Schema）等独立于平台、独立于软件供应商的标准，是创建可互操作的、分布式应用程序的新平台。因此使用Web Service有许多优点:

1、跨防火墙的通信

如果应用程序有成千上万的用户，而且分布在世界各地，那么客户端和服务器之间的通信将是一个棘手的问题。因为客户端和服务器之间通常会有防火墙或者代理服务器。传统的做法是，选择用浏览器作为客户端，写下一大堆ASP页面，把应用程序的中间层暴露给最终用户。这样做的结果是开发难度大，程序很难维护。 要是客户端代码不再如此依赖于HTML表单，客户端的编程就简单多了。如果中间层组件换成Web Service的话，就可以从用户界面直接调用中间层组件，从而省掉建立ASP页面的那一步。要调用Web Service，可以直接使用Microsoft SOAP Toolkit或.net这样的SOAP客户端，也可以使用自己开发的SOAP客户端，然后把它和应用程序连接起来。不仅缩短了开发周期，还减少了代码复杂度，并能够增强应用程序的可维护性。同时，应用程序也不再需要在每次调用中间层组件时，都跳转到相应的"结果页"。

2、应用程序集成

企业级的应用程序开发者都知道，企业里经常都要把用不同语言写成的、在不同平台上运行的各种程序集成起来，而这种集成将花费很大的开发力量。应用程序经常需要从运行的一台主机上的程序中获取数据；或者把数据发送到主机或其它平台应用程序中去。即使在同一个平台上，不同软件厂商生产的各种软件也常常需要集成起来。通过Web Service，应用程序可以用标准的方法把功能和数据"暴露"出来，供其它应用程序使用。

XML Web services 提供了在松耦合环境中使用标准协议（HTTP、XML、SOAP 和 WSDL）交换消息的能力。消息可以是结构化的、带类型的，也可以是松散定义的。

3、B2B的集成

B2B 指的是Business to Business，as in businesses doing business with other businesses,商家(泛指企业)对商家的电子商务，即企业与企业之间通过互联网进行产品、服务及信息的交换。通俗的说法是指进行电子商务交易的供需双方都是商家(或企业、公司)，她们使用了Internet的技术或各种商务网络平台，完成商务交易的过程。

Web Service是B2B集成成功的关键。通过Web Service，公司可以只需把关键的商务应用"暴露"给指定的供应商和客户，就可以了，Web Service运行在Internet上，在世界任何地方都可轻易实现，其运行成本就相对较低。Web Service只是B2B集成的一个关键部分，还需要许多其它的部分才能实现集成。 用Web Service来实现B2B集成的最大好处在于可以轻易实现互操作性。只要把商务逻辑"暴露"出来，成为Web Service，就可以让任何指定的合作伙伴调用这些商务逻辑，而不管他们的系统在什么平台上运行，使用什么开发语言。这样就大大减少了花在B2B集成上的时间和成本。

4、软件和数据重用

Web Service在允许重用代码的同时，可以重用代码背后的数据。使用Web Service，再也不必像以前那样，要先从第三方购买、安装软件组件，再从应用程序中调用这些组件；只需要直接调用远端的Web Service就可以了。另一种软件重用的情况是，把好几个应用程序的功能集成起来，通过Web Service "暴露"出来，就可以非常容易地把所有这些功能都集成到你的门户站点中，为用户提供一个统一的、友好的界面。 可以在应用程序中使用第三方的Web Service 提供的功能，也可以把自己的应用程序功能通过Web Service 提供给别人。两种情况下，都可以重用代码和代码背后的数据。

从以上论述可以看出，Web Service 在通过Web进行互操作或远程调用的时候是最有用的。不过，也有一些情况，Web Service根本不能带来任何好处，Web Service有一下缺点：

1、 单机应用程序

目前，企业和个人还使用着很多桌面应用程序。其中一些只需要与本机上的其它程序通信。在这种情况下，最好就不要用Web Service，只要用本地的API就可以了。COM非常适合于在这种情况下工作，因为它既小又快。运行在同一台服务器上的服务器软件也是这样。当然Web Service 也能用在这些场合，但那样不仅消耗太大，而且不会带来任何好处。

2、 局域网的一些应用程序

在许多应用中，所有的程序都是在Windows平台下使用COM，都运行在同一个局域网上。在这些程序里，使用DCOM会比SOAP/HTTP有效得多。与此相类似，如果一个.net程序要连接到局域网上的另一个.net程序，应该使用.net Remoting。其实在.net Remoting中，也可以指定使用SOAP/HTTP来进行Web Service 调用。不过最好还是直接通过TCP进行RPC调用，那样会有效得多。

1.3、XML Web Service的应用

1.最初的 XML Web Service 通常是可以方便地并入应用程序的信息来源，如股票价格、天气预报、体育成绩等等。

2.以 XML Web Service 方式提供现有应用程序，可以构建新的、更强大的应用程序，并利用 XML Web Service 作为构造块。

例如，用户可以开发一个采购应用程序，以自动获取来自不同供应商的价格信息，从而使用户可以选择供应商，提交订单，然后跟踪货物的运输，直至收到货物。而供应商的应用程序除了在Web上提供服务外，还可以使用XML Web Service检查客户的信用、收取货款，并与货运公司办理货运手续。


### WebService的框架JWS、Axis和CXF 比较

![](assets/003/02/01/01-1651197036512.png)


1、JWS是Java语言对WebService服务的一种实现，用来开发和发布服务。而从服务本身的角度来看JWS服务是没有语言界限的。但是Java语言为Java开发者提供便捷发布和调用WebService服务的一种途径。

2、Axis2是Apache下的一个重量级WebService框架，准确说它是一个Web Services / SOAP / WSDL 的引擎，是WebService框架的集大成者，它能不但能制作和发布WebService，而且可以生成Java和其他语言版WebService客户端和服务端代码。这是它的优势所在。但是，这也不可避免的导致了Axis2的复杂性，使用过的开发者都知道，它所依赖的包数量和大小都是很惊人的，打包部署发布都比较麻烦，不能很好的与现有应用整合为一体。但是如果你要开发Java之外别的语言客户端，Axis2提供的丰富工具将是你不二的选择。

3、XFire是一个高性能的WebService框架，在Java6之前，它的知名度甚至超过了Apache的Axis2，XFire的优点是开发方便，与现有的Web整合很好，可以融为一体，并且开发也很方便。但是对Java之外的语言，没有提供相关的代码工具。XFire后来被Apache收购了，原因是它太优秀了，收购后，随着Java6 JWS的兴起，开源的WebService引擎已经不再被看好，渐渐的都败落了。

4、CXF是Apache旗下一个重磅的SOA简易框架，它实现了ESB（企业服务总线）。CXF来自于XFire项目，经过改造后形成的，就像目前的Struts2来自WebWork一样。可以看出XFire的命运会和WebWork的命运一样，最终会淡出人们的视线。CXF不但是一个优秀的Web Services / SOAP / WSDL 引擎，也是一个不错的ESB总线，为SOA的实施提供了一种选择方案，当然他不是最好的，它仅仅实现了SOA架构的一部分。
基于以上的认识，我们可以得知，虽然有了Java6，但是我们还可以选择Axis2、XFire、CXF等。我们不能指望有了Java6 JWS，就能异想天开去实施SOA。如果要与别的语言交互，也许我们还有赖于Axis2等等，当然这不是唯一选择，仅仅是一种可供选择的方案。
还有，目前很多企业的应用还是基于Java5的，而Java5的项目不会瞬间都升级到Java6，如果要在老项目上做扩展，我们还有赖于其他开源的WS引擎。

对于现在的应用程序的迁移，如果你的应用程序是稳定而成熟的，并且在可预知的未来的情况下，只要很少的一些需求变更要做的话，那么保存你的体力，不要去做“劳民伤财“的迁移工作了。
如果你的现有应用程序BUG缠身，性能，功能等等都一片糟糕的话，那就要考虑迁移了，那选哪个框架呢？先比较一下它们的不同之处：

```

　　1、Apache CXF 支持 WS-Addressing、WS-Policy、WS-RM、WS-Security和WS-I BasicProfile
　　2、Axis2 支持 WS-Addressing、WS-RM、WS-Security和WS-I BasicProfile，WS-Policy将在新版本里得到支持
　　3、Apache CXF 是根据Spring哲学来进行编写的，即可以无缝地与Spring进行整合
　　4、Axis2 不是
　　5、Axis2 支持更多的 data bindings，包括 XMLBeans、JiBX、JaxMe 和 JaxBRI，以及它原生的 data binding（ADB）。
　　6、Apache CXF 目前仅支持 JAXB 和 Aegis，并且默认是 JAXB 2.0，与 XFire 默认是支持 Aegis 不同，XMLBeans、JiBX 和 Castor 将在 CXF 2.1 版本中得到支持，目前版本是 2.0.2
　　7、Axis2 支持多种语言，它有 C/C 版本。
　　8、Apache CXF 提供方便的Spring整合方法，可以通过注解、Spring标签式配置来暴露Web Services和消费Web Services
```

如何抉择：
1、如果应用程序需要多语言的支持，Axis2 应当是首选了；
2、如果应用程序是遵循 Spring 哲学路线的话，Apache CXF 是一种更好的选择，特别对嵌入式的 Web Services 来说；
3、如果应用程序没有新的特性需要的话，就仍是用原来项目所用的框架，比如 Axis1，XFire，Celtrix 或 BEA 等等厂家自己的 Web Services 实现，就别劳民伤财了。