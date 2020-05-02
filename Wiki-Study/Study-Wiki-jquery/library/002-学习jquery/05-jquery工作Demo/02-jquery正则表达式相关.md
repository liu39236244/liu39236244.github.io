# 这里记录jquery中 使用正则表达式的记录

## 正则表达式常用记录


### jquery中使用


```
## jquery 正则表达式验证

```javascript
需求说明：

　　前端页面使用正则表达式验证文本输入框输入的数据为固定电话。

代码说明：

　　这里只介绍正则表达式部分，其他部分的代码不做介绍。如有其它需要可自行修改。

步骤一：建立一个页面可以是html、jsp等，引入jquery-3.2.1.min.js（其他版本亦可）。

步骤二：编写正则表达式。

代码部分如下：

复制代码
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="jquery-3.2.1.min.js" ></script>
</head>
<body>

</body>
<script>
    //这里默认页面加载时验证输入数据
    $(function () {
        var value="0451-828039832";
        if(phone(value)){
            console.log("参数:符合验证要求");
        }else{
            console.log("参数: 不符合验证要求");
        }
    })

    //固定电话
    function phone(value)
    {
        var reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        var re = new RegExp(reg);
        if (re.test(value))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
</script>
</html>
```

## 正则表达式验证 小数/数字/电话

```
// 整数或小数

* 1：reg_float_int: /^0$|^[1-9]\d*$|^0\.\d+$|^[1-9]\d*\.\d+$/,

* 2：int: /^[-\+]?\d+(\.\d+)?$/,

// 验证小数
reg: /^[0-9]+\.?[0-9]+?$/,



//电话
 var reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
```

```