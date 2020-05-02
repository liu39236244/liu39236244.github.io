# java 流的使用中关闭问题

## 1-java 总结

### 1-1

> 1 关闭顺序

```
1. 关闭流的顺序，先创建的后关闭，后创建的先关闭。就是先关闭外层在关闭里层。
2. 流使用的是装饰设计模式，所以关闭外层的流的时候也会调用里层包装的流对象的close。
3. 1.7 中关闭流很繁琐，但是1.7 之后 有try-with-resources
      在java7以后,我们可以使用,将需要关闭的流对象放在try的()中创建,需要注意的是只有实现Closeable接口的对象才可以放在这里创建

      try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));) {
          String s;
          while ((s = reader.readLine()) != null) {
              if (s.equalsIgnoreCase("quit")){
                  break;
              }
              System.out.println(s.toUpperCase());
          }
      } catch (Exception e) {
          e.printStackTrace();
      }
```

## 2-
