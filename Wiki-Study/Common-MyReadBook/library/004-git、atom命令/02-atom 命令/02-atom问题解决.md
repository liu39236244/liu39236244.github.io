# 章节记录atom使用过程中的

## atom 使用过程中遇到的问题

### spell-check cannot load the ..

* 问题

```
The package spell-check cannot load the system dictionary for zh-CN. See the settings for ways of changing the languages used, resolving missing dictionaries, or hiding this warning.
```

* 解决

博主过程：

https://blog.csdn.net/jahonn/article/details/80654364


* 最终解决



点Settings进去，发现设置里会根据系统语言自己选择相应的拼写检查设置文件，然而文件夹中只有en-US的设置，所以有两个选择可以解决这个问题

1. 取消掉Use Locales前面的勾选

或者

2. 手动填写en-US设置文件名称
