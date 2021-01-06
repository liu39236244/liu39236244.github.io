# tomcat 热部署

一、配置方法
对于较新版本（5.5 之后）的 tomcat 服务器来说，只需要修改 \conf\context.xml 文件，给 Context 标签加上 reloadable="true" 这个属性即可。比如原来 context.xml 是这个样子的：

```xml

<Context>

    <WatchedResource>WEB-INF/web.xml</WatchedResource>
    <WatchedResource>WEB-INF/tomcat-web.xml</WatchedResource>
    <WatchedResource>${catalina.base}/conf/web.xml</WatchedResource>

</Context>
```

修改之后

```xml
<Context reloadable="true">

    <WatchedResource>WEB-INF/web.xml</WatchedResource>
    <WatchedResource>WEB-INF/tomcat-web.xml</WatchedResource>
    <WatchedResource>${catalina.base}/conf/web.xml</WatchedResource>

</Context>
```

旧版 tomcat（5.5 之前，目前很少用），则需要在\conf\server.xml 中的 <Host> 元素里加入 <Context reloadbale="true">。

这就算完成任务了。当然，要是需要说的就这么多，就用不着不单独开一篇文章啦。主要是在应用的过程中，我遇到了一些让我疑惑的地方，在网上又不好搜到相关的解答，于是进行了一点实验，并在这里记录一下。