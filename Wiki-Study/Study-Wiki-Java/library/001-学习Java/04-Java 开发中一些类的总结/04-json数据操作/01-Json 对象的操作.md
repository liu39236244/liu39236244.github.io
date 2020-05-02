# JSON 对象操作

## JSON 数组转换

```
前端参数js

data:{taskids:JSON.stringify([taskid]),language:language},
```

```java
 JSONObject json = new JSONObject();
        List<String> ids = JSONObject.parseArray(taskids,String.class);
```