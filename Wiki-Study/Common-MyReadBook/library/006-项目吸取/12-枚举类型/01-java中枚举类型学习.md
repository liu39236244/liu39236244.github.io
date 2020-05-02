# java 中枚举类型

## 1-java 枚举类型


## 2-枚举类型优势


## 10-博客总结

### 10-1 博主总结1

原文链接：https://blog.csdn.net/javazejian/article/details/71333103

```java
package com.zejian.enumdemo;

/**
 * Created by zejian on 2017/5/8.
 * Blog : http://blog.csdn.net/javazejian [原文地址,请尊重原创]
 */
public enum Day2 {
    MONDAY("星期一"),
    TUESDAY("星期二"),
    WEDNESDAY("星期三"),
    THURSDAY("星期四"),
    FRIDAY("星期五"),
    SATURDAY("星期六"),
    SUNDAY("星期日");//记住要用分号结束

    private String desc;//中文描述

    /**
     * 私有构造,防止被外部调用
     * @param desc
     */
    private Day2(String desc){
        this.desc=desc;
    }

    /**
     * 定义方法,返回描述,跟常规类的定义没区别
     * @return
     */
    public String getDesc(){
        return desc;
    }

    public static void main(String[] args){
        for (Day2 day:Day2.values()) {
            System.out.println("name:"+day.name()+
                    ",desc:"+day.getDesc());
        }
    }

    /**
     输出结果:
     name:MONDAY,desc:星期一
     name:TUESDAY,desc:星期二
     name:WEDNESDAY,desc:星期三
     name:THURSDAY,desc:星期四
     name:FRIDAY,desc:星期五
     name:SATURDAY,desc:星期六
     name:SUNDAY,desc:星期日
     */
}
```

```
package cn.netcommander.kpiengine.bean.EnumBean;

/**
 * 枚举类型，这里定义贵州移动元数据
 * 归属ID|手机号|用户信息|基站经度|基站维度|归属省|归属地市|路段编码|路段区间编码|城市网格编码|时间戳|区域编码
 */
public enum BaseMoveEnum {
    HomeID(0),
    PhoneNumber(1),
    UserInfo(2),
    StationLng(3),
    StationLat(4),
    Province(5),
    HomeCity(6),
    RoadCode(7),
    RoadAreaCode(8),
    CityGridCode(9),
    LangTime(10),
    ZipCode(11);
    private int desc = -1;

    private BaseMoveEnum(int desc){
        this.desc=desc;
    }

    public int getDesc(){
        return this.desc;
    }

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {
        for(BaseMoveEnum bme: BaseMoveEnum.values()){
            System.out.println("bme.name:"+bme.name()+"   |  getDesc  "+bme.getDesc());
        }
    }
}


```
