# Calendar 日历类使用

## 属性

### 1-注意

```
注意事项：

Calendar 的 month 从 0 开始，也就是全年 12 个月由 0 ~ 11 进行表示。

而 Calendar.DAY_OF_WEEK 定义值如下，每周从 SUNDAY 开始，从 1 ~ 7：

Calendar.SUNDAY = 1
Calendar.MONDAY = 2
Calendar.TUESDAY = 3
Calendar.WEDNESDAY = 4
Calendar.THURSDAY = 5
Calendar.FRIDAY = 6
Calendar.SATURDAY = 7
```

### 2- 案例演示


```java

package demo;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.Calendar;

public class Test
{
  public Test()
  {
  }

  public static void main(String[] args)
  {
    // 字符串转换日期格式
    // DateFormat fmtDateTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    // 接收传入参数
    // String strDate = args[1];
    // 得到日期格式对象
    // Date date = fmtDateTime.parse(strDate);

    // 完整显示今天日期时间
    String str = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS")).format(new Date());
    System.out.println(str);

    // 创建 Calendar 对象
    Calendar calendar = Calendar.getInstance();

    try
    {
      // 对 calendar 设置时间的方法
      // 设置传入的时间格式
      SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-M-d H:m:s");
      // 指定一个日期
      Date date = dateFormat.parse("2013-6-1 13:24:16");
      // 对 calendar 设置为 date 所定的日期
      calendar.setTime(date);

      // 按特定格式显示刚设置的时间
      str = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS")).format(calendar.getTime());
      System.out.println(str);
    }
    catch (ParseException e)
    {
      e.printStackTrace();
    }

    // 或者另一種設置 calendar 方式
    // 分別爲 year, month, date, hourOfDay, minute, second
    calendar = Calendar.getInstance();
    calendar.set(2013, 1, 2, 17, 35, 44);
    str = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS")).format(calendar.getTime());
    System.out.println(str);

    // Calendar 取得当前时间的方法
    // 初始化 (重置) Calendar 对象
    calendar = Calendar.getInstance();
    // 或者用 Date 来初始化 Calendar 对象
    calendar.setTime(new Date());

    // setTime 类似上面一行
    // Date date = new Date();
    // calendar.setTime(date);

    str = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS")).format(calendar.getTime());
    System.out.println(str);

    // 显示年份
    int year = calendar.get(Calendar.YEAR);
    System.out.println("year is = " + String.valueOf(year));

    // 显示月份 (从0开始, 实际显示要加一)
    int month = calendar.get(Calendar.MONTH);
    System.out.println("nth is = " + (month + 1));

    // 本周几
    int week = calendar.get(Calendar.DAY_OF_WEEK);
    System.out.println("week is = " + week);

    // 今年的第 N 天
    int DAY_OF_YEAR = calendar.get(Calendar.DAY_OF_YEAR);
    System.out.println("DAY_OF_YEAR is = " + DAY_OF_YEAR);

    // 本月第 N 天
    int DAY_OF_MONTH = calendar.get(Calendar.DAY_OF_MONTH);
    System.out.println("DAY_OF_MONTH = " + String.valueOf(DAY_OF_MONTH));

    // 3小时以后
    calendar.add(Calendar.HOUR_OF_DAY, 3);
    int HOUR_OF_DAY = calendar.get(Calendar.HOUR_OF_DAY);
    System.out.println("HOUR_OF_DAY + 3 = " + HOUR_OF_DAY);

    // 当前分钟数
    int MINUTE = calendar.get(Calendar.MINUTE);
    System.out.println("MINUTE = " + MINUTE);

    // 15 分钟以后
    calendar.add(Calendar.MINUTE, 15);
    MINUTE = calendar.get(Calendar.MINUTE);
    System.out.println("MINUTE + 15 = " + MINUTE);

    // 30分钟前
    calendar.add(Calendar.MINUTE, -30);
    MINUTE = calendar.get(Calendar.MINUTE);
    System.out.println("MINUTE - 30 = " + MINUTE);

    // 格式化显示
    str = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SS")).format(calendar.getTime());
    System.out.println(str);

    // 重置 Calendar 显示当前时间
    calendar.setTime(new Date());
    str = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SS")).format(calendar.getTime());
    System.out.println(str);

    // 创建一个 Calendar 用于比较时间
    Calendar calendarNew = Calendar.getInstance();

    // 设定为 5 小时以前，后者大，显示 -1
    calendarNew.add(Calendar.HOUR, -5);
    System.out.println("时间比较：" + calendarNew.compareTo(calendar));

    // 设定7小时以后，前者大，显示 1
    calendarNew.add(Calendar.HOUR, +7);
    System.out.println("时间比较：" + calendarNew.compareTo(calendar));

    // 退回 2 小时，时间相同，显示 0
    calendarNew.add(Calendar.HOUR, -2);
    System.out.println("时间比较：" + calendarNew.compareTo(calendar));
  }
}
//结果
  //2013-06-07 23:27:34:195
  //2013-06-01 13:24:16:000
  //2013-02-02 17:35:44:197
  //2013-06-07 23:27:34:197
  //year is = 2013
  //nth is = 6
  //week is = 6
  //DAY_OF_YEAR is = 158
  //DAY_OF_MONTH = 7
  //HOUR_OF_DAY + 3 = 2
  //MINUTE = 27
  //MINUTE + 15 = 42
  //MINUTE - 30 = 12
  //2013-06-08 02:12:34:197
  //2013-06-07 23:27:34:199
  //时间比较：-1
  //时间比较：1
  //时间比较：0

// 得微秒级时间差
  long val = calendarEnd.getTimeInMillis() - calendarBegin.getTimeInMillis();
  // 换算后得到天数
  long day = val / (1000 * 60 * 60 * 24);

```





### 3-DayOf***

当月的第几天，周几，一年的第几天
```
DAY_OF_MONTH ：当月的第几天，从1开始。

DAY_OF_WEEK ：返回周几 ，返回只是Calendar定义的 SUNDAY,MONDAY, TUESDAY, WEDNESDAY,THURSDAY, FRIDAY, and SATURDAY.

DAY_OF_YEAR :当年的第几天，从1开始。

具体看jdk中Calendar的类文档。

Java是一种可以撰写跨平台应用软件的面向对象的程序设计语言。Java 技术具有卓越的通用性、高效性、平台移植性和安全性，广泛应用于PC、数据中心、游戏控制台、科学超级计算机、移动电话和互联网，同时拥有全球最大的开发者专业社群。

```

## 方法使用

### 4- 获取凌晨的时间戳


```java

// 方法一：
Calendar c = Calendar.getInstance();    
			c.set(Calendar.HOUR_OF_DAY, 0);
			c.set(Calendar.MINUTE, 0);
			c.set(Calendar.SECOND, 0);
			c.set(Calendar.MILLISECOND, 0);
			Long today=c.getTimeInMillis()/1000;

// 方法二：
long now = System.currentTimeMillis() / 1000l;
long daySecond = 60 * 60 * 24;
		long dayTime = now - (now + 8 * 3600) % daySecond;
```
