# jquery 记录


## 地址总结


### 网址记录

```
jquery之家：http://www.htmleaf.com/
    jquery 之家- 中文api 在线文档 ：http://www.htmleaf.com/jquery-doc/
jquery插件网址 ：https://jquery-plugins.net/
    jquery 插件for treeview :https://jquery-plugins.net/search?q=treeview

jquery 中文api-》

jquery 手册：http://jquery.cuishifeng.cn/index.html

jquery 中文文档 https://www.jquery123.com/

```



## 学习记录




## 经验总结

### 控制input 不可编辑


#### 解决经过 ；
*  jquery 控制input 不可编辑

html： 添加属性 contentEditable="false"
js:

```
1.开启disabled，是input不可以编辑

　　$("#id").attr("disabled","disabled");

2.关闭disabled

　　$("#id").removeAttr("disabled");

普通js中是这样写的，document.getElementById("id").disabled = false;


错误写法：$("#id").attr("disabled","false");
```

* 解决方案参考：


```

<input type="text" name="www.xxx" readonly="readonly" />

今天想总结几个很有用的html标签，开发中经常用到，不熟悉的人可能还真不太清楚，分别是：

readonly、disabled、autocomplete

readonly表示此域的值不可修改，仅可与 type="text" 配合使用，可复制，可选择,可以接收焦点，后台会接收到传值.


<input type="text" name="www.xxx" readonly="readonly" />

disabled表示禁用input元素，不可编辑，不可复制，不可选择，不能接收焦点,后台也不会接收到传值

<input type="text" name="www.xxx.com" disabled="disabled" />

另外可以通过css屏蔽输入法：<input style="ime-mode: disabled">
最后介绍一个常用的标签，浏览器通常会记录input输入框的记录，所以你在输入的时候，经常会下拉很多内容，如下图：
如果你想去掉的话，最好加上autocomplete="off"，使用方法如下：autocomplete="off"


<input type="text" autocomplete="off" id="number"/>
```

#### 最终采用方案

```
只读 ：不可编辑但是可以出发点击事件：使用readonly
<input type="text" name="www.xxx" readonly="readonly" />
```

