# java 中的Properties的解析


## 1-解析方式
原文地址：https://blog.csdn.net/qq_27093465/article/details/71108181
```
/**
   * 输出properties的key和value
   */
  public static void printProp(Properties properties) {
      System.out.println("---------（方式一）------------");
      for (String key : properties.stringPropertyNames()) {
          System.out.println(key + "=" + properties.getProperty(key));
      }

      System.out.println("---------（方式二）------------");
      Set<Object> keys = properties.keySet();//返回属性key的集合
      for (Object key : keys) {
          System.out.println(key.toString() + "=" + properties.get(key));
      }

      System.out.println("---------（方式三）------------");
      Set<Map.Entry<Object, Object>> entrySet = properties.entrySet();//返回的属性键值对实体
      for (Map.Entry<Object, Object> entry : entrySet) {
          System.out.println(entry.getKey() + "=" + entry.getValue());
      }

      System.out.println("---------（方式四）------------");
      Enumeration<?> e = properties.propertyNames();
      while (e.hasMoreElements()) {
          String key = (String) e.nextElement();
          String value = properties.getProperty(key);
          System.out.println(key + "=" + value);
      }
  }


```
