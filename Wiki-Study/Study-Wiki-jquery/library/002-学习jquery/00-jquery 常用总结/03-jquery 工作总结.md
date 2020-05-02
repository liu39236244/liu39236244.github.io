# jquery 工作中遇到的一些问题，虽然不是系统性的总结，但是都是走过的坑的总结


## 总jquery 参考学习地址：

### MDN 中jquery 学习地址[路径](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 记录地址


[jquery对象在线查询地址](http://tool.oschina.net/apidocs/apidoc?api=jquery)


# jquery 使用总结


##  jquery tabs 的用法


### 我的总结

### 记录Demo


### 博主记录


####  

* 博主1：[地址](https://www.cnblogs.com/bestfc/archive/2009/06/08/1498737.html )

* 菜鸟教程

tabs easyui中的教程使用：[地址](https://www.runoob.com/jeasyui/plugins-layout-tabs.html)

博主：
https://blog.csdn.net/isringring/article/details/82663235

菜鸟教程：
http://www.runoob.com/try/try.php?filename=jqueryui-example-tabs&basepath=0


## jquery ajax 记录

### 规范学习地址：

w3school[地址](http://www.w3school.com.cn/jquery/jquery_ref_ajax.asp):

### jquery 中ajax 入坑总结

### jquery 中 ajax 属性值

### jquery 中 ajax 方法、



### Demo案例


### Jquery 中


## jquery on 绑定事件


### 我的总结

* on与click 区别

on() 和 click() 的区别:

二者在绑定静态控件时没有区别，但是如果面对动态产生的控件，只有 on() 能成功的绑定到动态控件中。

以下实例中原先的 HTML 元素点击其身后的 Delete 按钮就会被删除。而动态添加的 HTML 元素，使用 click() 这种写法，点击 Delete 按钮无法删除；使用 On() 方式可以。

```html
$("#newclick").click(function(){
    $(".li").append('<li>动态添加的HTML元素click<button class="deleteclick">Delete</button></li>');
});
$("#newon").click(function(){
    $(".li").append('<li>动态添加的HTML元素on<button class="deleteon">Delete</button></li>');
});
$(".delete").click(function(){
    $(this).parent().remove();
});

$(".li").on('click', ".deleteon", function(){
    $(this).parent().remove();
})
$(".deleteclick").click(function(){
    $(this).parent().remove();
});
```

* 注意绑定时间的时候 如果加上() 则说明绑定的同时执行一次

### jquery 的几种绑定事件的方法

#### 第一种绑定事件方法（1）

如果不加(),什么意思呢，下面如果使用on 添加点击事件的话 ，如果后面的函数有方法则说明执行一次这个方法，如果说不添加括号，则说明吧函数赋值给click 点击事件

$("#nuclide_water_btn_add").on('click', func.nucliwater_addItem（）);
$("#nuclide_water_btn_del").on('click', func.nucliwater_deleteItem（）);

$("#nuclide_water_btn_add").on('click', func.nucliwater_addItem);
$("#nuclide_water_btn_del").on('click', func.nucliwater_deleteItem);


#### 第二种绑定事件方法（2）

绑定点击事件：$("#id").click(function(){})


```html
  $("#divIdName div/li/span.className.className").click(function () {
      $("#water_condition .nucText.selected").removeClass("selected");
      $(this).addClass("selected");
      func.setWaterOrgId($(this).parent().attr("value"))
      func.setWaterOrgName($(this).parent().attr("data-parentname"))
  func.setWaterOrgName($(this).parent().data("parentname"))
  $(this).parent().addClass('selected').siblings().removeClass('selected');
      // li 是当前点击事件元素本身，判断当前选中的li 属于父亲组织下的第几个孩子
  var li_index = li.index(this);
  $("#water_navigationTab > .conItem0").eq(li_index).show().siblings().hide();

  }

  Html 页面中绑定内容如下：
  <li class="getvalue" :value="[country.tags]" :data-parentid="[country.parentid]"
      :data-parentname="[country.text]" :org_lenvel="1">
      <label class="nucText" style="margin-left: 0;width:80px;">{{country.text}}</label>
      <span v-if="country.nodes!=undefined && country.nodes.length>0"
            @click.self="pull_down_click" style="margin-right: 0" class="arrow"></span>
      </span>
  </li>

```

#### 第三种绑定事件写法


```javascript
New vue 在vue 中定义方法 ： 上面 html中的
@click.self="pull_down_click"
绑定的就是vue中定义的方法,代码如下

success: function (result) {
  // data 后台类型： List<TreeInfoWaterTbnuc>
  var data = result.data;
  func.setnucliTreeData(data)
  var nucvue = new Vue({
      // el: '#water_tbnucfacorg',
      el: '#water_nucinfo_Tree',
      data: func.treeVue,
      mounted: function () {
          // doSomethingElse
          this.initlabelclick()
          this.clickNullNote()
      },
      methods: {
          pull_down_click: function () {
              // 点击箭头隐藏或者显示节点下目录树
              if (($(event.target).parent().parent().parent().next("div").is(":hidden"))) {
                  // $(event.target).parent().parent().parent().next("div").show()
                  $(event.target).parent().parent().parent().next("div").slideToggle()
              } else {
                  // $(event.target).parent().parent().parent().next("div").hide()
                  $(event.target).parent().parent().parent().next("div").slideToggle()
              }
          },
          clickNullNote: function () {
              func.initBodyOnloadEvent()
              func.clickOneLabel()
          },
          initlabelclick: function () {
              // 如果初始化成功了在调用初始化点击事件
              func.initTreeViewClick()
              $("#water_addTbnucfacorg").on('click', func.addTbnucfacorg);
              $("#water_delTbnucfacorg").on('click', func.delTbnucfacorg);
              // alert("激活第一个点击事件"+$("#water_condition #country_0").prop("tagName"))
          }
      },
  });

$(event.target)  : 代表的就是点击事件本身的一个这个元素

```

### jquery 触发绑定事件

#### 触发绑定事件写法（1）

$("#water_condition label.nucText")[0].click()

### 记录Demo

#### Demo1


### 博主记录

####  


* 菜鸟教程

tabs easyui中的教程使用：[地址](https://www.runoob.com/jquery/event-on.html)


## jquery 元素显示与隐藏


### 总结


### 博主记录

[地址](https://www.jb51.net/article/49760.htm)

## jquery on 冒泡事件分析


### 我的总结

### 记录Demo

#### body 的on click 点击事件

* 页面点击事件，判断点击的目标标签名字

```js
$("body").on("click", function(e) {
            if(e.target.tagName == "CANVAS") {
                $("#nucSpreadWater #searchOrgMessionWater").hide();
                $("#nucConfigureWater").hide();
            }
        });
```


### 博主记录

####  

* 菜鸟教程

jqueyr中 on 冒泡事件：[地址](https://www.cnblogs.com/tengj/p/4794947.html)

* 博主记录[原文地址](https://www.cnblogs.com/zhangzongle/p/5521159.html)


## jquery mouseover 事件

### 我的总结

### 记录Demo

#### 某一类元素的鼠标划过事件

* 鼠标划过，mouseover 第一个参数指定鼠标划过的时候的css样式

```js
 $(".classname").mouseover("click",function () {
            $("#idname").show();
            $(this).children("#元素名").children("img").attr("src",'img/map/photo_mouseover.png');
        }).mouseout(function(){
            $("#idname").hide();
            $(this).children("#元素名").children("img").attr("src",'img/map/photo_mouseout.png');
        });
```

### mouseenter 与 mouseover 区别

不论鼠标指针穿过被选元素或其子元素，都会触发 mouseover 事件。
只有在鼠标指针穿过被选元素时，才会触发 mouseenter 事件。

[mouseenter 与 mouseover 区别Demo地址](http://www.w3school.com.cn/tiy/t.asp?f=jquery_event_mouseenter_mouseover)

### 博主记录

####  

* 菜鸟教程




## jquery  中 val 的使用


### 我的总结

指定新值
元素的值是通过 value 属性设置的。该方法大多用于 input 元素。
W3school : http://www.w3school.com.cn/jquery/attributes_val.asp
指定 input的值

$("#tbnucfacorg_water_add #parentOrgname").val(parent_orgname);
$("#tbnucfacorg_water_add input[name=parentid]").val(orgid);

// current_layerid=$("#tbnucfacorg_water_add input[id=water_add_layerid]").attr("value");
current_layerid=$("#tbnucfacorg_water_add input[id=water_add_layerid]").val()

Jquery中 的val() 无参数的话 则返回当前 input 的值 ，有参数的话重新指定input 文本框中的值


### 记录Demo


### 博主记录

####  


* 菜鸟教程


## jquery  中 .data 的使用


### 我的总结
```html
<html>
<head>
<script type="text/javascript" src="/jquery/jquery.js"></script>
<script type="text/javascript">
$(document).ready(function(){
  $("#btn1").click(function(){
    $("div").data("par", "Hello World"); // par 自定义参数，随便起名
  });
  $("#btn2").click(function(){
    alert($("div").data("par")); // par ，获取div 中指定的 变量的值
  });
});
</script>
</head>
<body>
<button id="btn1">把数据添加到 div 元素</button><br />
<button id="btn2">获取已添加到 div 元素的数据</button>
<div></div>
</body>
</html>
```

指定一个元素的一个属性与属性值 ，这个很有用，可以随意定义好多个值，并且自定义名字

### 记录Demo


### 博主记录

####  


* w3school

[地址](http://www.w3school.com.cn/jquery/data_jquery_data.asp)


## jquery  中 .prop


### 我的总结
定义和用法
prop() 方法设置或返回被选元素的属性和值。

当该方法用于返回属性值时，则返回第一个匹配元素的值。

当该方法用于设置属性值时，则为匹配元素集合设置一个或多个属性/值对。

注意：prop() 方法应该用于检索属性值，例如 DOM 属性（如 selectedIndex, tagName, nodeName, nodeType, ownerDocument, defaultChecked, 和 defaultSelected）。

提示：如需检索 HTML 属性，请使用 attr() 方法代替。

提示：如需移除属性，请使用 removeProp() 方法。

语法
返回属性的值：

$(selector).prop(property)
设置属性和值：

$(selector).prop(property,value)
使用函数设置属性和值：

$(selector).prop(property,function(index,currentvalue))
设置多个属性和值：

$(selector).prop({property:value, property:value,...})

### 记录Demo


### 博主记录

####  地址

* 菜鸟驿站prop 使用：[地址] (https://www.runoob.com/jquery/html-prop.html)


## jquery  中 attr


### 我的总结


### 记录Demo


### 博主记录

####  地址

* w3school 案例：[地址] (http://www.w3school.com.cn/jquery/attributes_attr.asp)


## jquery attr、prop、data的区别


###  我的总结

### attr、prop、data

对于HTML元素本身就带有的固有属性，在处理时，使用prop方法。
对于HTML元素我们自己自定义的DOM属性，在处理时，使用attr方法。


### 分析经过

### attr 与 prop 区别

attr 与 prop 区别

[博主1](https://www.cnblogs.com/Showshare/p/different-between-attr-and-prop.html)

要点：

对于HTML元素本身就带有的固有属性，在处理时，使用prop方法。
对于HTML元素我们自己自定义的DOM属性，在处理时，使用attr方法。

* Demo

```html
上面的描述也许有点模糊，举几个例子就知道了。

<a href="http://www.baidu.com" target="_self" class="btn">百度</a>
 这个例子里<a>元素的DOM属性有“href、target和class"，这些属性就是<a>元素本身就带有的属性，也是W3C标准里就包含有这几个属性，或者说在IDE里能够智能提示出的属性，这些就叫做固有属性。处理这些属性时，建议使用prop方法。

<a href="#" id="link1" action="delete">删除</a>
这个例子里<a>元素的DOM属性有“href、id和action”，很明显，前两个是固有属性，而后面一个“action”属性是我们自己自定义上去的，<a>元素本身是没有这个属性的。这种就是自定义的DOM属性。处理这些属性时，建议使用attr方法。使用prop方法取值和设置属性值时，都会返回undefined值。



再举一个例子：

<input id="chk1" type="checkbox" />是否可见
<input id="chk2" type="checkbox" checked="checked" />是否可见
像checkbox，radio和select这样的元素，选中属性对应“checked”和“selected”，这些也属于固有属性，因此需要使用prop方法去操作才能获得正确的结果。

$("#chk1").prop("checked") == false
$("#chk2").prop("checked") == true
如果上面使用attr方法，则会出现：

$("#chk1").attr("checked") == undefined
$("#chk2").attr("checked") == "checked"
```

### attr 与 data 区别

$.attr()和$.data()本质上属于DOM属性和Jquery对象属性的区别。

$.attr()每次都从DOM元素中取属性的值，即和视图中标签内的属性值保持一致。

$.attr('data-foo')会从标签内获得data-foo属性值；

$.attr('data-foo', 'world')会将字符串'world'塞到标签的'data-foo'属性中；

$.data()是从Jquery对象中取值，由于对象属性值保存在内存中，因此可能和视图里的属性值不一致的情况。

$.data('foo')会从Jquery对象内获得foo的属性值，不是从标签内获得data-foo属性值；

$.data('foo', 'world')会将字符串'world'塞到Jquery对象的'foo'属性中，而不是塞到视图标签的data-foo属性中。

结合上面代码和解释，大家应该能够理解两者的区别。

所以$.attr()和$.data()应避免混合用，也就是应该尽量避免如下两种情况的出现：

通过$.attr()来进行set属性，然后通过$.data()进行get属性值；

通过$.data()来进行set属性，然后通过$.attr()进行get属性值。

同时从性能的角度来说，建议使用$.data()来进行set和get操作，因为它仅仅修改的Jquey对象的属性值，不会引起额外的DOM操作。


### 记录Demo

### 博主记录


## jquery - $(function(){})

jquery 中 $(function(){}) 解释

$(function(){ }是$(document).ready(function()的简写，相当于window.onload = function(){ } ,虽然这段jquery代码与javascript代码在功能上可以互换，但执行的时间不一样，前者页面框架加载完成就执行，后者页面中所有内容加载完成才执行


## jquery 中的 深浅 拷贝 -extend


### 公用地址

### 我的总结


### 分析过程

#### 1-深浅拷贝

var object1 = {
    apple: 0,
    banana: {
        weight: 52,
        price: 100
    },
    cherry: 97
};
var object2 = {
    banana: {
        price: 200
    },
    durian: 100
};

//默认情况浅拷贝
//object1--->{"apple":0,"banana":{"price":200},"cherry":97,"durian":100}
//object2的banner覆盖了object1的banner，但是weight属性未被继承
//$.extend(object1, object2);

//深拷贝
//object1--->{"apple":0,"banana":{"weight":52,"price":200},"cherry":97,"durian":100}
//object2的banner覆盖了object1的banner，但是weight属性也被继承了呦
$.extend(true,object1, object2);

console.log('object1--->'+JSON.stringify(object1));

extend源码：
if ( deep && copy && ( jQuery.isPlainObject( copy ) || ( copyIsArray = Array.isArray( copy ) ) ) ) {

if ( copyIsArray ) {
copyIsArray = false;
clone = src && Array.isArray( src ) ? src : [];

} else {
clone = src && jQuery.isPlainObject( src ) ? src : {};
}

// Never move original objects, clone them
target[ name ] = jQuery.extend( deep, clone, copy );

// Don't bring in undefined values
}


### other


## jquery - trigger


### 地址记录

* w3school : [地址](http://www.w3school.com.cn/jquery/event_trigger.asp)


### 我的总结

### trigger

用于触发指定元素指定类型的事件

trigger() 方法触发被选元素的指定事件类型。

* Demo

触发 input 元素的 select 事件：

```html
$("button").click(function(){
  $("input").trigger("select");
});
```


## jquery 自定义属性

### 地质记录


### 我的记录

自定义属性:

<div id="text" value="黑哒哒的盟友"><div>
jQuery取值： $("#text").attr("value");

//获取自定义属性值 2
<div id="text" value="123"  data_obj="黑哒哒的盟友"><div>
JQUERY取值：$("#text").attr("data_obj");

//获取data值 3
<div id="text" value="123"  data-name="黑哒哒的盟友"><div>
JQUERY取值：$("#text").data("name");

data 获取的数据属性前面有 data- ,使用data 方法获取只需要后面部分


###
//获取属性值 1


### Demo

### other


## jquery-  localstorage.setItem()


## 公用


### 我的总结




## Demo

```js
localStorage存储
我们通过以下方式将数据储存到localStorage中
window.localStorage.setItem('key',value)
    1
但有时value为一个对象Object,以上面的方式写入,会出现读取的返回值为
{object Object}的情况,但这并不是我们想要的,此时我们需要使用新的方式
传入Object
window.localStorage.setItem('param',JSON.stringify(Object))
    2
通过JSON.stringify(Object)方法将对象转化为一个json格式的字符串进行存储
localStorage读取
我们通过以下方式来读取localStorage中的值
window.localStorage.getItem("key")
    3
相对的在读取json格式字符串只有我们也无法直接使用,需要将它转换为josn对象之后才是我们想要的结果,所以我们需要调用 JSON.parse()方法来进行转化,
之后在继续使用
JSON.parse(window.localStorage.getItem("key"))
    4
localStorage删除
我们通过以下方法来删除对应key以及key中的内容
window.localStorage.removeItem('key')
    5
localStorage清空所有的key
清空localStorage中所有的key;
注意:请谨慎使用,它会清空所有的本地存储数据
window.localStorage.clear()

```


## jquery- eq() 与 [0] 的比较


### 公用


### 我的总结



### Demo


### 参考文章


* 博主1[原文地址](https://blog.csdn.net/weixin_39003573/article/details/81915998 )



##  jquery pageX、ClientX、offsetX 等区别

* 鼠标事件以及clientX、offsetX、screenX、pageX、x的区别

### 公用


### 我的总结


### Demo


### 参考文章


* 博主1[原文地址](https://blog.csdn.net/weixin_41342585/article/details/80659736)



## jquery 中的排序sort


### 公用


### 我的总结

sort 对字符按照字符表进行排序

### Demo

#### 字符排序：

```javascript

<script type="text/javascript">
var arr = new Array(6)
arr[0] = "George"
arr[1] = "John"
arr[2] = "Thomas"
arr[3] = "James"
arr[4] = "Adrew"
arr[5] = "Martin"

document.write(arr + "<br />")
document.write(arr.sort())

</script>

```

```
George,John,Thomas,James,Adrew,Martin
Adrew,George,James,John,Martin,Thomas
```
### 自定义排序

```javascript
<script type="text/javascript">

function sortNumber(a,b)
{
return a - b
}

var arr = new Array(6)
arr[0] = "10"
arr[1] = "5"
arr[2] = "40"
arr[3] = "25"
arr[4] = "1000"
arr[5] = "1"

document.write(arr + "<br />")
document.write(arr.sort(sortNumber))

</script>
```

```
10,5,40,25,1000,1
1,5,10,25,40,1000
```

### 参考文章


[地址](https://www.cnblogs.com/CreateMyself/p/5516858.html)


## jquery中的done 与 then 区别



### 我的总结

then 返回 新的deferred object，
then后必定传入后面方法自己的返回结果，不管then下面是done 还是then ，所以 done，then上有then的 ，函数参数都为上个then返回的值

### 参考文章：

[地址](https://www.jb51.net/article/130911.htm)


## jquery- jquery中的选择器


## jquery-jquery 中保存 数据到本地文件


### 我的

* 示例代码

*  测试不可用
```
var fso;
                    try {
                        fso=new ActiveXObject("Scripting.FileSystemObject");
                    } catch (e) {
                        alert("当前浏览器不支持导出txt");
                        return;
                    }
                    var f1 = fso.createtextfile("C:\\Users\\Administrator\\Desktop\\data.json",true);
因为fso会因为浏览器的兼容问题出错，所以需要异常处理
createtextfile包含三个参数，1. 文件的绝对路径；2. 文件的常数 只读为1，只写为2 等；3. 允许新建为true，相反为false；
```

###


## jquery中 toFixed() 的使用




### 我的

保留小数使用的
例如： var val = (Value / 100).toFixed(1);

toFixed(1)  保留2位小数

```

```

### 案例


* 博主案例


```
最近一段时候公司的项目中遇到这么个事情，需要计算手续费，而这个手续费必须是保留小数点后面两位，且是由小数点后面第三位四舍五入，就这么个场景：

说说我计算的过程,下面是前两个数是测试用的：

howMuch = 119;

allow_sum = 116;

interest = 0.005;//这是利率

计算出来的是(119-116)*0.005 = 0.015,按照业务要求四舍五入保留小数点后2位，结果应该是0.02

1.一开始直接使用的toFixed方法计算的手续费：

　　计算方式：value = (((howMuch-allow_sum)*interest*100)/100).toFixed(2);

　　计算结果：0.01

　　原因：toFixed它是一个四舍六入五成双的诡异的方法，"四舍六入五成双"含义：对于位数很多的近似数，当有效位数确定后，其后面多余的数字应该舍去，只保留有效数字最末一位，这种修约（舍入）规则是“四舍六入五成双”，也即“4舍6入5凑偶”这里“四”是指≤4 时舍去，"六"是指≥6时进上，"五"指的是根据5后面的数字来定，当5后有数时，舍5入1；当5后无有效数字时，需要分两种情况来讲：①5前为奇数，舍5入1；②5前为偶数，舍5不进。（0是偶数）  

2.发现问题后我就换了一种方法[Math.round()]，这种方法避免了上面的问题：

　　计算方式：value = Math.round((howMuch-allow_sum)*interest*100)/100;

　　计算结果：0.02

　　虽然避免了上面的问题，在特定的情况下有引发了新的问题，比如：

　　　　howMuch = 119;

　　　　allow_sum = 100;

　　　　计算方式：value = Math.round((howMuch-allow_sum)*interest*100)/100;

　　　　计算结果：计算出来的是(119-100)*0.005 = 0.095，四舍五入就变成了0.1了，而业务需求是小数点后面两位，也就是0.10

3.发现上一个问题后，我决定把两个方法结合起来使用：

　　计算方式：value = (Math.round((howMuch-allow_sum)*interest*100)/100).toFixed(2);

　　计算结果:计算出来的是(119-100)*0.005 = 0.095，四舍五入后是0.10，刚好符合业务的要求
```

### 参考博主

####

[原文地址](https://www.cnblogs.com/zengguowang/p/5981626.html)


## !! 的使用


### 我的总结

```javascript
if(!!a){
  alert(“不为空！”)
}ele{
  alert("为空！")
}
```

### 博主总结

* 博主1

[原文地址](https://www.cnblogs.com/aaronjs/archive/2013/06/09/3129256.html)

#### 博主1 记录

var foo;  
alert(!foo);//undifined情况下，一个感叹号返回的是true;  
alert(!goo);//null情况下，一个感叹号返回的也是true;  
var o={flag:true};  
var test=!!o.flag;//等效于var test=o.flag||false;  
alert(test);  
var test1=8;
alert(!!8) // true 因为  8 本身就是 true  双否定为肯定，则为true

## js 中 数组的 find、filter、forEach、map 四个方法的使用



### 我的总结


MDN:array 的属性以及方法：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

 find、filter、forEach、map
上面的四个语法以及参数的意义是一样的，而且都不会对空数组进行检测，也不会改变原始数组

现在说说各自的意义：

```java

find()方法主要用来返回数组中符合条件的第一个元素（没有的话，返回undefined）

filter()方法主要用来筛选数组中符合条件的所有元素，并且放在一个新数组中，如果没有，返回一个空数组

map()方法主要用来对数组中的元素调用函数进行处理，并且把处理结果放在一个新数组中返回（如果没有返回值，新数组中的每一个元素都为undefined）

forEach()方法也是用于对数组中的每一个元素执行一次回调函数，但它没有返回值（或者说它的返回值为undefined，即便我们在回调函数中写了return语句，返回值依然为undefined）

```




### 博主总结

* 博主1

* [原文地址](https://blog.csdn.net/lhjuejiang/article/details/80112547)


### 数组的原型操作

> 给数组原型加上一个方法

```js
Array.prototype.test = function(){
  console.log(123);
}
let arr = [1,2,3,4,5];
arr.name = "xiaoming";
for (let i in arr) {
  console.log(i);
  console.log(typeof i);
  console.log(arr[i]);  
}
输出
0
string
1

1
string
2

2
string
3

3
string
4

4
string
5

name
string
xiaoming

test
string
[Function]

这次我们在数组原型上加了一个方法，并手动加了一个属性，当我们再用for in遍历的时候，会将原型上的方法和属性都打印出来，当我们单纯想要数组里的值的时候，for in并不适合，那我们可以使用在ES6中新增加的for of来循环遍历

```

## jquery 中的 let 与var 的区别

### 我的总结


### Demo 案例


### 博主总结 


* 博主1 
* [原文地址](https://www.jb51.net/article/138643.htm)




## 严格模式 "use strict"

### 我的总结

####  MDN中

* MDN 的严格模式的介绍
    [原文地址](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)


>放在脚本第一行，则整个脚本都以严格模式执行，

```bash
1、介绍严格模式

2、严格模式影响范围

变量：  var、delete、变量关键字
对象： 只读属性、 对象字面量属性重复申明
函数：参数重名、arguments对象、申明
其他：this、eval、关键字...
严格模式

 ECMAScript 5 引入严格模式('strict mode')概念。通过严格模式，在函数内部选择进行较为严格的全局或局部的错误条件检测，使用严格模式的好处是可以提早知道代码中的存在的错误，

及时捕获一些可能导致编程错误的ECMAScript行为。在开发中使用严格模式能帮助我们早发现错误。

 

设立"严格模式"的目的，主要有以下几个：错误检测、规范、效率、安全、面向未来

　　- 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;

　　- 消除代码运行的一些不安全之处，保证代码运行的安全；

　　- 提高编译器效率，增加运行速度；

　　- 为未来新版本的Javascript做好铺垫。

 

进入"严格模式"的编译指示（pragma），是下面这行语句：　　

"use strict";  
这个语法从ECMAScript 3 开始支持。向后兼容不支持严格模式的浏览器，他们就当遇到了一个普通字符串，编译时忽略。

  

将"use strict"放在脚本文件的第一行，则整个脚本都将以"严格模式"运行。

如果这行语句不在第一行，则无效，整个脚本以"正常模式"运行。

如果不同模式的代码文件合并成一个文件，这一点需要特别注意。

(严格地说，只要前面不是产生实际运行结果的语句，"use strict"可以不在第一行，比如直接跟在一个空的分号后面。) 
```


### 博主参考

#### 博主1

* [原文地址](https://www.cnblogs.com/liaojie970/p/7154144.html)



## jquery中的 'let ' 的使用




### 我的总结

#### 总记录

* MDN 地址let 描述[地址](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)


>let 语句声明一个块级作用域的本地变量，并且可选的将其初始化为一个值。let允许你声明一个作用域被限制在块级中的变量、语句或者表达式。与var关键字不同的是，let声明的变量只能是全局或者整个函数块的。

点[这里](https://stackoverflow.com/questions/37916940/why-was-the-name-let-chosen-for-block-scoped-variable-declarations-in-javascri)可以明白我们为什么选取“let”这个名字。


### 博主地址

## jquery 设置按钮不可用


### 我的总结:
设置 disable 属性

## Demo

* 设置按钮不可用 prop设置prop

```js
 $("#divWaterTaskInfo #btnRun").prop("disabled",disabled);
```

## 判断是否具有某些class


### 我的总结


### Demo


* 判断是否有某一属性 hasClass

```js
$("#divWaterTaskInfo #liCheckRun").hasClass("bgColor2")
```


## jquery input 输入框判断值


### 我的总结

* 控件.on("input",funcion(){
    let obj=event.target;
    let value=obj.value;
})

绑定input：在内部可以使用event调用值


## jquery .serialize();  方法
### [官方文档总结 serizlize](http://www.w3school.com.cn/jquery/ajax_serialize.asp)

### 我的总结


### jquery other 总结


```
.serialize() 方法可以操作已选取个别表单元素的 jQuery 对象，比如 <input>, <textarea> 以及 <select>。不过，选择 <form> 标签本身进行序列化一般更容易些：

$('form').submit(function() {
  alert($(this).serialize());
  return false;
});
输出标准的查询字符串：

a=1&b=2&c=3&d=4&e=5
注释：只会将”成功的控件“序列化为字符串。如果不使用按钮来提交表单，则不对提交按钮的值序列化。如果要表单元素的值包含到序列字符串中，元素必须使用 name 属性。
```

## jquery $.param 方法

### [官方文档 param](http://www.w3school.com.cn/jquery/ajax_param.asp)

## 序列化


```html
<html>
<head>
<script type="text/javascript" src="/jquery/jquery.js"></script>
<script type="text/javascript">
$(document).ready(function(){
  personObj=new Object();
  personObj.firstname="Bill";
  personObj.lastname="Gates";
  personObj.age=60;
  personObj.eyecolor="blue"; 
  $("button").click(function(){
    $("div").text($.param(personObj));
  });
});
</script>
</head>
<body>


<button>序列化对象</button>
<div></div>
</body>
</html>

```

## jquery 中冻结一个对象


### 我的总结

* Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。

```
被冻结对象自身的所有属性都不可能以任何方式被修改。任何修改尝试都会失败，无论是静默地还是通过抛出TypeError异常（最常见但不仅限于strict mode）。

数据属性的值不可更改，访问器属性（有getter和setter）也同样（但由于是函数调用，给人的错觉是还是可以修改这个属性）。如果一个属性的值是个对象，则这个对象中的属性是可以修改的，除非它也是个冻结对象。数组作为一种对象，被冻结，其元素不能被修改。没有数组元素可以被添加或移除。

这个方法返回传递的对象，而不是创建一个被冻结的副本。
```

### 地址记录

[MDN技术栈总结](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

### 

## jquery 拷贝对象 


### 我的总结


### jquery 拷贝对象方法

```js
 //用来拷贝对象
    var cloneObj = function (obj) {
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
        }
        return newObj;
    };  

```

## jquery 操作对象



### 我的总结：


其实就是操作对象属性的不一样的方式了，a[] 可以是变量，参数要与a中一个属性名一样，也可以为int数值，但是 . 操作属性就不行了，得写死，而且不能是数字


```
点方法后面跟的必须是一个指定的属性名称，而中括号方法里面可以是变量。例如
var haha = "name";
console.log(obj.haha); // undefined
console.log(obj[haha]); // cedric
中括号方法里面的属性名可以是数字，而点方法后面的属性名不可以是数字
当动态为对象添加属性时，必须使用 中括号 []， 不可以用点方法
```


### 博主总结：
* https://www.cnblogs.com/cckui/p/9887544.html


## Ztree 记录


### checkNode:参数

taskCheckedTree.checkNode(item, false, false);

checkNode (node, checked, checkTypeFlag, callbackFlag)

![](assets/002/00/03-1564735488286.png)


### jquery 中ztree构建


> jquery 中可以通过中括号副属性值

``` 
var $tree: 对象可以通过

$tree[属性（可以不存在）]="值"



```


> jquery 中 函数里面可以定义一个函数，然后去掉用


```js
 function getAllParentNode(treeNode) {//获取祖先节点到本节点的所有节点
        var parents = new Array();
        var getPnodes = function (treeNode) {
            var parentNode = treeNode.getParentNode();
            if (parentNode != null) {
                parents.push(parentNode.name);
                getPnodes(parentNode)
            }
        }
        getPnodes(treeNode);
 
 }

```

> jquery 中 构建 ztree 树


```js
 taskCheckedTree = $.fn.zTree.init($("#pills-current-tree"), setting, checkedNodeArr);
```



### jquery 中ztree 获取目录树，然后 获取到某一个目录树，并且触发事件


```
var node = $tree2.getNodes();
var nodes = $tree2.transformToArray(node);
nodes.forEach(function (item) {
    if (item.chname == "核设施") {
        if (item.getParentNode().id == orgid) {
            $tree2.checkNode(item, true, true);

            item.getParentNode().children.forEach(function (item) {
                if (item.chname == "应急计划区") {
                    item.children.forEach(function (item) {
                        $tree2.checkNode(item, true, true);
                    })
                }
            })
        }
    }
});
```

## jquery 数组与json 转换方法



### 总结

```
serializeArray()  : 序列化表格元素 ,返回JSON数据结构数据。

JSON.parse(text)  ： 用于将一个 JSON 字符串转换为JSON对象。

JSON.stringify() ： 用于将一个"值"转换为 JSON 字符串。

```

## jquery 对象转化为数组


### 总结

> 对象转化为数组

 taskCheckedTree.transformToArray(node); //获取树所有节点


### 博主

[jquery json  转换](http://www.aijquery.cn/Html/jqueryjiqiao/179.html)


> checkNode (node, checked, checkTypeFlag, callbackFlag)




## jquery 箭头函数 与普通函数


### 我的总结

使用new关键字

使用函数声明或表达式创建的普通函数是“可构造的”和“可调用的”。由于普通函数是可构造的，因此可以使用'new'关键字调用它们。但是，箭头函数只是“可调用”而不是可构造的。因此，在尝试使用new关键字构造不可构造的箭头函数时，我们将得到一个运行时错误。

### 其他博主

[较规整](https://www.cnblogs.com/moqiutao/p/7886277.html)
[地址1](https://www.php.cn/js-tutorial-417173.html)




# jquery中json问题

## jquery 前端 数组 到后台数组 ，json  互转

### 自己总结


```java

 var taskids = new Array();
    
    if(userid!=""){
        for (let i = 0; i < selRows.length; i++) {
            if(selRows[i].creater==userid){
                taskids.push(selRows[i].taskid);
            }
        }
    } else {
        for (let i = 0; i < selRows.length; i++) {
            taskids.push(selRows[i].taskid);
        }
    }

data: {
    "taskids": JSON.stringify(taskids)


},

//java 后台 转换
 - 注意后台 参数是一个字符串，转化为 List
 public String delByTaskids(String taskids,HttpServletRequest request){
        Tbuser user = GetUser.getuser(request);
        JSONObject json = new JSONObject();
        List<String> list=JSONObject.parseArray(taskids,String.class);
 }


```

## jquery构建json数据

### 我的总结1 

```js
// 数据
"array": [
        {
            "id": 0,
            "name": "test"
        },
        {
            "id": 1,
            "name": "test"
        },
        {
            "id": 2,
            "name": "test"
        }
    ]


// 构建方法

 Json::Value arrayObj;   // 构建对象
for (int i = 0; i < 3; i++)
{
    Json::Value new_item;
    new_item["id"] = i + 1;
    new_item["name"] = "test";
    //组装数组的时候，需要使用append
    arrayObj["array"].append(new_item);
}
std::string strData = arrayObj.toStyledString();
map<int, std::string> cameraInfoMap;
Json::Reader readerinfo;
Json::Value root;
if (readerinfo.parse(strData, root))
{
    if (root["array"].isArray())
    {
        int nArraySize = root["array"].size();
        for (int i = 0; i < nArraySize; i++)
        {
            int nID = root["array"][i]["id"].asInt();
            std::string strName = root["array"][i]["name"].asString();
            cameraInfoMap[nID] = strName;
        }
    }
}


// 容易出问题的

const char* str = "{\"uploadid\": \"UP000000\",\"code\": 100,\"msg\": \"\",\"files\": \"\"}";  
 
    Json::Reader reader;  
    Json::Value root;  
    if (reader.parse(str, root))  // reader将Json字符串解析到root，root将包含Json里所有子元素  
    {  
        std::string upload_id = root["uploadid"].asString();  // 访问节点，upload_id = "UP000000"  
        int code = root["code"].asInt();    // 访问节点，code = 100 
    }

```

### 博主记录

> [博主记录1](https://blog.csdn.net/blackbattery/article/details/84787389)


jquery中json 结束



## unbind 解除绑定 与绑定

## 我的



### 案例1

```js
 $('#preaccTermAddTbl .glyphicon-plus').unbind('click');
$('#preaccTermAddTbl .glyphicon-plus').on('click', func.addRow)//为添加按钮添加点击事件
```



## for 中 in  与 of  区别

区别：

### 我的

> for in  ： 适合遍历对象 ，会遍历原型添加的属性与 .属性名 添加的属性

* 原始数组
```js
let arr = [1,2,3,4,5]
我们用arr作为遍历的数组对象

for (let i in arr) {
  console.log(i);
  console.log(typeof i);
  console.log(arr[i]);  
}
输出：
0
string
1

1
string
2

2
string
3

3
string
4

4
string
5

```

* 修改之后的数组操作


可以看到，for in 循环遍历有这么几个特点：
1.遍历中的i是数组里的下标，这跟普通的for循环没区别
2.这里的i是string类型，在普通for循环中是nubmer类型

我们再对代码进行改造
```js
Array.prototype.test = function(){
  console.log(123);
}
let arr = [1,2,3,4,5];
arr.name = "xiaoming";
for (let i in arr) {
  console.log(i);
  console.log(typeof i);
  console.log(arr[i]);  
}
输出
0
string
1

1
string
2

2
string
3

3
string
4

4
string
5

name
string
xiaoming

test
string
[Function]


```

>这次我们在数组原型上加了一个方法，并手动加了一个属性，当我们再用for in遍历的时候，会将原型上的方法和属性都打印出来，当我们单纯想要数组里的值的时候，for in并不适合，那我们可以使用在ES6中新增加的for of来循环遍历

* for of 
let arr = [1,2,3,4,5]
我们还是用arr作为遍历的数组对象

```js

Array.prototype.test = function(){
  console.log(123);
}
let arr = [1,2,3,4,5];
arr.name = "xiaoming";
for(let i of arr){
  console.log(i);
  console.log(typeof i);
}
输出
1
number

2
number

3
number

4
number

5
number

```

for of循环遍历数组的特点:
1.遍历中的i是数组的值，不是数组下标
2.这里的i是number类型，不用for in那样要转化类型
3.不会去遍历数组外增加的属性和原型上的方法

3.总结和补充
1.for in不适合遍历数组，适合遍历对象
2.for in除了有下标类型、原型属性问题外，遍历数组的时候可能不是按照数组内部的顺序遍历
3.for of可以遍历ES6中iterable类型的数据类型，Array、Map和Set都属于iterable类型

### 博主总结

[区别](https://blog.csdn.net/jzq950522/article/details/88056762)



## 元素操作之append after


### 我的

```
append是在一个元素内部的最后追加
 
 - $('#preaccTermAddTbl').append(html);

after 跟 当前元素同级别，追加元素
 $('#preaccTermAddTbl .glyphicon-plus').on('click', func.addRow)//为添加按钮添加点击事件
addRow: function () 
{
 var tr = $(this).parent().parent();//当前操作的行
var nulnum = tr.find('td').eq(0).find('input').val();
var nulname = tr.find('td').eq(0).text();
var html = "<tr>" +
    "<td><input type='hidden' name='nulnum' value='" + nulnum + "'>" + nulname + "</td>" +
    "<td>0</td><td><input name='ctime'></td><td><input name='amount'></td>" +
    "<td><span class='glyphicon glyphicon-plus'></span>&nbsp;&nbsp;&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></td></tr>";
tr.after(html);
}
```


## jquery 中的几种循环


### 我的


### Demo案例

> each 操作某元素中的所有元素，并且判断tr中td 中的值 进行一系列操作


```js


删除表格中指定行
$('#preaccTermAddTbl').find('tr').each(function () {
if ($(this).find('td').eq(0).find('input').val() == nulnum) {
    $(this).remove();
}
;
})
```

## html input 的全部操作


### checkbox操作


* 获取名字为hs 的选中的checkbox 
// 选中状态 ，只要有 checked 就是选中
<input type="checkbox" id="4" name="hs" checked>

 var selHSArr = $("input[name='hs']:checked");