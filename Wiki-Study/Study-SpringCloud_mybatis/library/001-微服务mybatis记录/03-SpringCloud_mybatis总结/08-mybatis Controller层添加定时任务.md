# mybatis添加定时任务


## 定时任务案例

```java
    // 每天凌晨10 分执行
  @Scheduled(cron = "0 10 0 * * ?")

  // 每三十分钟执行一次
   @Scheduled(cron = "0 0/30 * * * ? ")

   // 每十秒
   @Scheduled(cron = "0/10 * * * * ?")
```