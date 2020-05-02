# log4j 加载配置

# log4j 加载 配置文件准备

## 1-log4j 准备

/项目根路径(项目名)/config/log4j-config.properties
```
log4j.rootLogger = INFO , info, warn, error, stdout

###控制台输出
log4j.appender.stdout = org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target = System.out
log4j.appender.stdout.layout = org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern = %d{ABSOLUTE} %5p %c{1}:%L - %m%n


###info级别输出
log4j.logger.info = info
log4j.appender.info = org.apache.log4j.DailyRollingFileAppender
log4j.appender.info.File = logs/convert_info.log
log4j.appender.info.Append = true
log4j.appender.info.Threshold = INFO
log4j.appender.info.layout = org.apache.log4j.PatternLayout
log4j.appender.info.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss} [ %t:%r ] - [ %p ] %m%n
log4j.appender.info.datePattern='.'yyyy-MM-dd
log4j.appender.info.filter.infoFilter = org.apache.log4j.varia.LevelRangeFilter
log4j.appender.info.filter.infoFilter.LevelMin=INFO
log4j.appender.info.filter.infoFilter.LevelMax=INFO

###warn级别输出
log4j.logger.warn = warn
log4j.appender.warn=org.apache.log4j.DailyRollingFileAppender
log4j.appender.warn.File = logs/convert_warn.log
log4j.appender.warn.Append=true
log4j.appender.warn.Threshold=WARN
log4j.appender.warn.layout=org.apache.log4j.PatternLayout
log4j.appender.warn.layout.ConversionPattern=%-d{yyyy-MM-dd HH:mm:ss} [ %t:%r ] - [ %p ] %m%n
log4j.appender.warn.datePattern='.'yyyy-MM-dd
log4j.appender.warn.filter.warnFilter=org.apache.log4j.varia.LevelRangeFilter
log4j.appender.warn.filter.warnFilter.LevelMin=WARN
log4j.appender.warn.filter.warnFilter.LevelMax=WARN


###error级别输出
log4j.logger.error = error 
log4j.appender.error = org.apache.log4j.DailyRollingFileAppender
log4j.appender.error.File = logs/convert_error.log
log4j.appender.error.Append = true
log4j.appender.error.Threshold = ERROR 
log4j.appender.error.layout = org.apache.log4j.PatternLayout
log4j.appender.error.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss} [ %t:%r ] - [ %p ] %m%n
log4j.appender.error.datePattern='.'yyyy-MM-dd
log4j.appender.error.filter.errorFilter=org.apache.log4j.varia.LevelRangeFilter
log4j.appender.error.filter.errorFilter.LevelMin=ERROR
log4j.appender.error.filter.errorFilter.LevelMax=ERROR


```

## log4j 默认加载

```Java
package cn.netcommander.ptt.util;

import org.apache.log4j.PropertyConfigurator;

import java.io.FileInputStream;
import java.io.IOException;

/**
 * 加载log4j配置
 */
public class LoadLogConfig {

    public static void loadByLocal(String path) {
        FileInputStream logConfigInputStream = null;
        try {
            //加载log4j配置 -org.apache.log4j.PropertyConfigurator;
            logConfigInputStream = new FileInputStream(path);
            PropertyConfigurator.configure(logConfigInputStream);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            BaseCloseable.close(logConfigInputStream);
        }
    }
}

```

### 上述方法完善BaseCloseable完善

```Java
package cn.netcommander.ptt.util;


public class BaseCloseable {
    /**
     * 关闭操作
     * @param closeable 实现的接口类
     AutoCloseable 这样的方式注意1.7 JDK 才可以 输入流 （inputStream）
     */
    public static void close(AutoCloseable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}


```
