# 环境变量相关

## /etc/profile


### /etc/profile 问题

* 正常配置
```
# MySetting

JAVA_HOME=/shenyabo/MyInstall/jdk1.8.0_162/

export $PATH="$PATH:$JAVA_HOME"

```

# 环境变量相关问题

## 配置出问题

### PATH 没加$ 进不去/etc/profile

[原文地址](https://blog.csdn.net/yu0_zhang0/article/details/78595942)
```
1.编辑/etc/profile要使用的命令/usr/bin/sudo  /usr/bin/vim  /etc/profile
2. 或者 暂时改变path ：export PATH=/usr/bin:/usr/sbin:/bin:/sbin:/usr/X11R6/bin


```
