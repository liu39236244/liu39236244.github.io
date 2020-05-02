
## json 工具类

```

object JsonUtil {

  private val mapper = new ObjectMapper().registerModule(DefaultScalaModule)

  def toJson(obj: Any): String = mapper.writeValueAsString(obj)

  def toObject(json: String, valueType: Class[Any]): Any = mapper.readValue(json, valueType)

}

```

需要掌握：
com.fasterxml.jackson.databind.ObjectMapper

能够把类对象转化成json ，也能把json 转换成指定的对象
