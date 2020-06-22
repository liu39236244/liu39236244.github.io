# service 层 回滚问题


## 总结

手动回滚

* 添加注解



```
如果对spring配置了service层事物的管理。

在一些业务中需要回滚，正常来说抛出一个运行时异常即可

throw new RuntimeException();
只是这样的话代码就结束了，如果要返回给用户错误信息，不太方便，这时可以添加如下代码，在catch中手动回滚

TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
这样既能正常返回错误信息，而又保持了事物的原子性。

```

* other 博客记录


> 注解失效的6中场景：https://baijiahao.baidu.com/s?id=1661565712893820457&wfr=spider&for=pc

>https://www.baidu.com/link?url=PHAE55WheuqSJJNrO8i44fgumxu-dlpAw_DnCXsYzLVY8zzU2SsBqYlPgAptbtOO62a_Pf4wVLIR_RN5QDgQW5GTZxy1qufwi2SyQ4JQEy3&wd=&eqid=a40cc55a0001d5dd000000025ef0279a