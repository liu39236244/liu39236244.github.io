# python 琐碎记录


## python 琐碎 记录



## python 字符串判空

### 参考博主

[字符串判断空 并且去除空格](https://www.cnblogs.com/blueteer/p/9961984.html)

```
1、使用字符串长度判断

    len(s) ==0  则字符串为空
    if len(username) ==0 or len(password) == 0:  #判断输入的用户名或密码是否为空
        print('用户名或密码不能为空')


2、isspace判断是否字符串全部是空格

    s.isspace() == True
    if username.isspace() or password.isspace():  #判断输入的用户名或密码是否为空
        print('用户名或密码不能为空')

3、字符串去空格及去指定字符。去掉空格后判断字符串长度，仍然可以判断字符串是不是全部为空格
Python strip() 方法用于移除字符串头尾指定的字符（默认为空格或换行符）或字符序列。

注意：该方法只能删除开头或是结尾的字符，不能删除中间部分的字符。

去两边空格：str.strip()
去左空格：str.lstrip()
去右空格：str.rstrip()
去两边字符串：str.strip('d')，相应的也有lstrip，rstrip
```
