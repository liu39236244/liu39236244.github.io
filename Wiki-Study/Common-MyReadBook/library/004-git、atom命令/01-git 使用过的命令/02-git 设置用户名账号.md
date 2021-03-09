# git 设置用户名、邮箱


## 总结

> git 查看用户名密码

```
查看git用户名和邮箱地址命令：

$ git config user.name

$ git config user.email

修改用户名和邮箱地址：

$ git config--global user.name "username"

$ git config--global user.email "email"


```

> 设置记住用户名密码

```
在idea中设置记住git的用户名和密码

1、在项目根目录下执行以下git命令：
git config --global credential.helper store

2、执行上述命令后，在idea中第一次pull或push需要输入用户名和密码，之后就不用再输入了。
```

> 3 或者修改当前项目的用户名

```
D:\YDProjectIdea>git config user.name
oldname

D:\YDProjectIdea>git config user.name newname
D:\YDProjectIdea>git config user.name
newname

// 同样的方法可以修改邮箱
git config user.email newemail

```

## 参考

* git设置用户名账号：https://blog.csdn.net/maofenghua/article/details/72967511?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase

