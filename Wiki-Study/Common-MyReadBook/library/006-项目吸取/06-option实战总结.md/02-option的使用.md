# option的使用

## option 的使用

* org.apache.commons.cli.Option  配置类

```Scala
options.addOption("cmd", true, "执行单个命令")
options.addOption("group", true, "执行一组命令")
```
源码解释
```scala
/**
    * Add an option that only contains a short-name.
    * It may be specified as requiring an argument.
    *
    * @param opt Short single-character name of the option.
    * @param hasArg flag signally if an argument is required after this option // 是否此命令后面需要加参数
    * @param description Self-documenting description
    * @return the resulting Options instance
    */
   public Options addOption(String opt, boolean hasArg, String description)
   {
       addOption(opt, null, hasArg, description);

       return this;
   }

```

搭配使用的：

org.apache.commons.cli.CommandLine

args: Array[String]
val ops = genericOptions()
var cmd: CommandLine = null

* 解析配置参数
 cmd = new PosixParser().parse(ops, args)

* 获取解析出来的配置文件个数

cmd.getOptions.length

* 判断是否有配置，并获取对应的值
 if (cmd.hasOption("date")) {
      otherArgs.append(cmd.getOptionValue("date"))
