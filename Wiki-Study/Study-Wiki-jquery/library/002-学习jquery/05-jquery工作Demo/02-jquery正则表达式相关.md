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
## 正则记录


### 整数

```js
reg_float_int: /^0$|^[1-9]\d*$|^0\.\d+$|^[1-9]\d*\.\d+$/,
```

### 验证小数

```js
reg: /^[0-9]+\.?[0-9]+?$/,
```

### 电话

```js
 var reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
```

###  密码正则验证

```js
if (!(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{12,18}$/.test(value))) {
          callback(new Error('密码需有小写字母,大写字母和数字,且密码不少于12位！'));
        } else {
          callback();
}

```

## js正则工具类

```js

// 判断数组不能为空
export const arrayNotEmpty = (rule, value, callback) => {
    let newvalue;
    if (value instanceof Array) {
        newvalue = value;
    } else {
        newvalue = [];
    }
    if (rule.required && newvalue.length === 0) {
        return callback(new Error('必填项不能为空'));
    } else {    
        callback();
    }
};
// 只能为数字
export const NotEmptyNumber = (rule, value, callback) => {
    if (rule.required && !value) {
        return callback(new Error('必填项不能为空'));
    }
    if (!/^\d+$/g.test(value)) {
        return callback(new Error('只能为数字'));
    }
    callback();
};
// 手机号验证
export const checkPhone = (rule, value, callback) => {
    if (rule.required && !value) {
        return callback(new Error('必填项不能为空'));
    } else if (!rule.required && !value) {
        callback();
    } else {
        const reg = /^1[3456789]\d{9}$/; // /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error('请输入正确的手机号'));
        }
    }
};
// 带区号的固定电话验证
export const checkFixedPhone = (rule, value, callback) => {
    if (rule.required && !value) {
        return callback(new Error('必填项不能为空'));
    } else if (!rule.required && !value) {
        callback();
    } else {
        const reg = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/; 
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error('请输入正确的固定电话'));
        }
    }
};
// 邮箱验证
export const checkEmail = (rule, value, callback) => {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (rule.required && !value) {
        callback();
    } else if (reg.test(value)) {
        callback();
    } else {
        return callback(new Error('请输入正确的邮箱'));
    }
};
// 身份证号校验
export const checkIDCard = (rule, value, callback) => {
    const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (rule.required && !value) {
        callback(new Error('请输入正确的身份证号'));
    } else if (reg.test(value)) {
        callback();
    } else {
        return callback(new Error('请输入正确的身份证号'));
    }
};
// 统一社会信用代码正则表达式
export const checkPositiveLettertAndRequired = (
    rule,
    value,
    callback,
) => {
    const reg = /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{17})$/;
    let newvalue;
    if (value !== null && value !== undefined) {
        newvalue = value.toString();
    } else {
        newvalue = '';
    }
    if (rule.required && newvalue.trim() === '') {
        return callback(new Error('必填项不能为空'));
    } else {
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error('请统一社会信用代码，格式由18位数字或大写拉丁字母组成'));
        }
    }
};
// 地址链接验证
export const checkLink = (rule, value, callback) => {
    if (rule.required && !value) {
        return callback(new Error('必填项不能为空'));
    } else if (!rule.required && !value) {
        callback();
    } else {
        const reg = new RegExp(
            "^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
            "i"
          )
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error('请输入正确的链接地址'));
        }
    }
};
```