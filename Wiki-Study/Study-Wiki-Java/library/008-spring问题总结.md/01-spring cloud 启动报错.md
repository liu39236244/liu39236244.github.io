# spring cloud 启动报错总结


## spring cload 报错

```java
Description:

Field shortMessageConfig in com.szdp.dp_government.sevice.impl.MessageRecordServiceImpl required a bean of type 'com.szdp.dp_government.config.ShortMessageConfig' that could not be found.

The injection point has the following annotations:
 - @org.springframework.beans.factory.annotation.Autowired(required=true)


Action:

Consider defining a bean of type 'com.szdp.dp_government.config.ShortMessageConfig' in your configuration.
```