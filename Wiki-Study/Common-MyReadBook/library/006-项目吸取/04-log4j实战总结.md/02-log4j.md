# 项目架构中所学习到的

## log4j
   Logger.getLogger("org").setLevel(Level.ERROR)
   //源码解释
```
/**
   * Retrieve a logger named according to the value of the
   * <code>name</code> parameter. If the named logger already exists,
   * then the existing instance will be returned. Otherwise, a new
   * instance is created.  
   *
   * <p>By default, loggers do not have a set level but inherit it
   * from their neareast ancestor with a set level. This is one of the
   * central features of log4j.
   *
   * @param name The name of the logger to retrieve.  
  */
  static
  public
  Logger getLogger(String name) {
    return LogManager.getLogger(name);
  }

```
