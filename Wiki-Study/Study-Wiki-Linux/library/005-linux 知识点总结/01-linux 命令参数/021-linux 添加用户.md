# linux用户的添加

## 1-linux 添加用户介绍


## 2-linux 添加用户用途


## 3-linux 添加用户命令参数
## 3-0 简单总结
> 0-user command

```
通过cat /etc/passwd 可以查看用户的pass
cat /etc/shadow 可以查看用户名
cat /etc/group 可以查看 组
```

* 1- 用户

>1-实质：增加用户账号就是在/etc/passwd文件中为新用户增加一条记录，同时更新其他系统文件如/etc/shadow, /etc/group等。
注意这里可能创建 othergroup1,othergroup2.。等一系列用户组
```
useradd -d /user's主目录 -m /user's主目录 -g newGroup -G othergroup1,ohergroup2... -c 添加描述  -u 777、587 新用户名字
```

>2-删除用户

```
userdel -r
常用的选项是-r，它的作用是把用户的主目录一起删除。
```

>3-修改用户

```
* 1
 usermod -s /bin/ksh -d /home/z –g developer sam
此命令将用户sam的登录Shell修改为ksh，主目录改为/home/z，用户组改为developer。

* 2
-l 修改用户名参数
这个选项指定一个新的账号，即将原来的用户名改为新的用户名。
```

* 2 用户组
>1- group add

```
代码:
# groupadd group1

此命令向系统中增加了一个新组group1，新组的组标识号是在当前已有的最大组标识号的基础上加1。


```

> 2- group del
```
#groupdel group1
此命令从系统中删除组group1。

```

### 3-1 创建用户，删除用户等操作
* 原文地址：https://www.cnblogs.com/clicli/p/5943788.html
```
用户账号的管理工作主要涉及到用户账号的添加、修改和删除。
添加用户账号就是在系统中创建一个新账号，然后为新账号分配用户号、用户组、主目录和登录Shell等资源。刚添加的账号是被锁定的，无法使用。
1、添加新的用户账号使用 useradd命令，其语法如下：
代码:
useradd 选项 用户名
其中各选项含义如下：
代码:
-c comment 指定一段注释性描述。
-d 目录 指定用户主目录，如果此目录不存在，则同时使用-m选项，可以创建主目录。
-g 用户组 指定用户所属的用户组。
-G 用户组，用户组 指定用户所属的附加组。
-s Shell文件 指定用户的登录Shell。
-u 用户号 指定用户的用户号，如果同时有-o选项，则可以重复使用其他用户的标识号。
用户名 指定新账号的登录名。
例1：
代码:
# useradd –d /usr/sam -m sam
此命令创建了一个用户sam，
其中-d和-m选项用来为登录名sam产生一个主目录/usr/sam（/usr为默认的用户主目录所在的父目录）。
例2：
代码:
# useradd -s /bin/sh -g group –G adm,root gem
此命令新建了一个用户gem，该用户的登录Shell是/bin/sh，它属于group用户组，同时又属于adm和root用户组，其中group用户组是其主组。
这里可能新建组：#groupadd group及groupadd adm　
增加用户账号就是在/etc/passwd文件中为新用户增加一条记录，同时更新其他系统文件如/etc/shadow, /etc/group等。
Linux提供了集成的系统管理工具userconf，它可以用来对用户账号进行统一管理。
2、删除帐号
如果一个用户的账号不再使用，可以从系统中删除。删除用户账号就是要将/etc/passwd等系统文件中的该用户记录删除，必要时还删除用户的主目录。删除一个已有的用户账号使用userdel命令，其格式如下：
代码:
userdel 选项 用户名
常用的选项是-r，它的作用是把用户的主目录一起删除。
例如：
代码:
# userdel sam
此命令删除用户sam在系统文件中（主要是/etc/passwd, /etc/shadow, /etc/group等）的记录，同时删除用户的主目录。
3、修改帐号
修改用户账号就是根据实际情况更改用户的有关属性，如用户号、主目录、用户组、登录Shell等。
修改已有用户的信息使用usermod命令，其格式如下：
代码:
usermod 选项 用户名
常用的选项包括-c, -d, -m, -g, -G, -s, -u以及-o等，这些选项的意义与useradd命令中的选项一样，可以为用户指定新的资源值。另外，有些系统可以使用如下选项：
代码:
-l 新用户名
这个选项指定一个新的账号，即将原来的用户名改为新的用户名。
例如：
代码:
# usermod -s /bin/ksh -d /home/z –g developer sam
此命令将用户sam的登录Shell修改为ksh，主目录改为/home/z，用户组改为developer。
4、用户口令的管理
用户管理的一项重要内容是用户口令的管理。用户账号刚创建时没有口令，但是被系统锁定，无法使用，必须为其指定口令后才可以使用，即使是指定空口令。
指定和修改用户口令的Shell命令是passwd。超级用户可以为自己和其他用户指定口令，普通用户只能用它修改自己的口令。命令的格式为：
代码:
passwd 选项 用户名
可使用的选项：
代码:
-l 锁定口令，即禁用账号。
-u 口令解锁。
-d 使账号无口令。
-f 强迫用户下次登录时修改口令。
如果默认用户名，则修改当前用户的口令。
例如，假设当前用户是sam，则下面的命令修改该用户自己的口令：
代码:
$ passwd
Old password:******
New password:*******
Re-enter new password:*******
如果是超级用户，可以用下列形式指定任何用户的口令：
代码:
# passwd sam
New password:*******
Re-enter new password:*******
普通用户修改自己的口令时，passwd命令会先询问原口令，验证后再要求用户输入两遍新口令，如果两次输入的口令一致，则将这个口令指定给用户；而超级用户为用户指定口令时，就不需要知道原口令。
为了系统安全起见，用户应该选择比较复杂的口令，例如最好使用8位长的口令，口令中包含有大写、小写字母和数字，并且应该与姓名、生日等不相同。
为用户指定空口令时，执行下列形式的命令：
代码:
# passwd -d sam

此命令将用户sam的口令删除，这样用户sam下一次登录时，系统就不再询问口令。
passwd命令还可以用-l(lock)选项锁定某一用户，使其不能登录，例如：
代码:
# passwd -l sam
新建用户异常：
useradd -d /usr/hadoop -u 586 -m hadoop -g hadoop
1 Creating mailbox file: 文件已存在
删除即可 rm -rf /var/spool/mail/用户名
2 useradd: invalid numeric argument 'hadoop'
这是由于hadoop组不存在 请先建hadoop组
通过cat /etc/passwd 可以查看用户的pass
cat /etc/shadow 可以查看用户名
cat /etc/group 可以查看 组


linux下创建用户(二）
二、Linux系统用户组的管理

每个用户都有一个用户组，系统可以对一个用户组中的所有用户进行集中管理。不同Linux 系统对用户组的规定有所不同，如Linux下的用户属于与它同名的用户组，这个用户组在创建用户时同时创建。
用户组的管理涉及用户组的添加、删除和修改。组的增加、删除和修改实际上就是对/etc/group文件的更新。

1、增加一个新的用户组使用groupadd命令。 其格式如下：

代码:
groupadd 选项 用户组

可以使用的选项有：
代码:
-g GID 指定新用户组的组标识号（GID）。
-o 一般与-g选项同时使用，表示新用户组的GID可以与系统已有用户组的GID相同。

例1：

代码:
# groupadd group1

此命令向系统中增加了一个新组group1，新组的组标识号是在当前已有的最大组标识号的基础上加1。

例2：

代码:
#groupadd -g 101 group2

此命令向系统中增加了一个新组group2，同时指定新组的组标识号是101。

2、如果要删除一个已有的用户组，使用groupdel命令， 其格式如下：

代码:
groupdel 用户组

例如：

代码:
#groupdel group1

此命令从系统中删除组group1。

3、修改用户组的属性使用groupmod命令。 其语法如下：

代码:
groupmod 选项 用户组

常用的选项有：
代码:
-g GID 为用户组指定新的组标识号。
-o 与-g选项同时使用，用户组的新GID可以与系统已有用户组的GID相同。
-n 新用户组 将用户组的名字改为新名字

例1：

代码:
# groupmod -g 102 group2

此命令将组group2的组标识号修改为102。

例2：

代码:
# groupmod –g 10000 -n group3 group2

此命令将组group2的标识号改为10000，组名修改为group3。

4、如果一个用户同时属于多个用户组，那么用户可以在用户组之间切换，以便具有其他用户组的权限。用户可以在登录后，使用命令newgrp切换到其他用户组，这个命令的参数就是目的用户组。 例如：

代码:
$ newgrp root

这条命令将当前用户切换到root用户组，前提条件是root用户组确实是该用户的主组或附加组。类似于用户账号的管理，用户组的管理也可以通过集成的系统管理工具来完成。


权限分配
分配权限
chown -R hadoop:hadoop /usr/hadoop/

让普通用户拥有root的权限
1.root登录
2.adduser 用户名
3.passwd 用户名
确定密码
4.修改/etc/passwd即可，把用户名的ID和ID组修改成0。
```
