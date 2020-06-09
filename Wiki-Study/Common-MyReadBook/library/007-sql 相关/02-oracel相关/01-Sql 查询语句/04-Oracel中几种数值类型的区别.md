# Oracel 中的几种数据类型的区别


## 我的总结

在9i之前，ORACLE为我们提供了Number数值类型，在10g中，ORACLE又引入了BINARY_FLOAT和BINARY_DOUBLE数据类型。除此之外，还有integer，smallint等数据类型，但这些类型的底层实现依然是NUMBER、BINARY_FLOAT、BINARY_DOUBLE。因此，我们可以认为ORACLE总共为我们提供了三种存储数值的数据类型：NUMBER、BINARY_FLOAT、BINARY_DOUBLE。通过这三种数值类型，可以存储正值，负值，0，无穷大和NAN（not a number）。



## 参考地址

[地址](https://blog.csdn.net/yidian815/article/details/12966207)
