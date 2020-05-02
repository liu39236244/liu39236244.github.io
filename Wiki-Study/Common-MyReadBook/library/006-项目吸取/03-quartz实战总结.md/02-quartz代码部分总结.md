# 记录部分代码总结

## quartz 使用

### quartz 创建任务

####  1-quatrz 的上下文对象以及参数jobDetail定义
* 了解源博客地址：https://www.cnblogs.com/telwanggs/p/7237884.html

```
这里我们改一下上一节的程序作为示例，在定义JobDetail的时候，将一些数据放入JobDataMap 中:

// 定义一个job，并且绑定HelloJob类
 JobDetail job = newJob(HelloJob.class)
                  .withIdentity("job1", "group1")
                  .usingJobData("jobSays", "Hello World!")
                  .usingJobData("myFloatValue", 3.141f)
                  .build();



然后在任务执行的时候，可以获取JobDataMap 中的数据：

package org.byron4j.quartz;

import org.byron4j.utils.DateUtil;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;

/**
 * 实现org.quartz.Job接口，声明该类是一个可执行任务类
 *
 * @author Administrator
 *
 */
public class HelloJob implements Job {

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        System.out.println("现在是北京时间:" + DateUtil.getCurrDateTime() + " - helloJob任务执行");

        JobKey key = context.getJobDetail().getKey();

        JobDataMap dataMap = context.getJobDetail().getJobDataMap();

        String jobSays = dataMap.getString("jobSays");
        float myFloatValue = dataMap.getFloat("myFloatValue");

        System.err.println("Instance " + key + " of HelloJob says: " + jobSays + ", and val is: " + myFloatValue);

    }

}


控制台输出:

scheduleName = MyScheduler
现在是北京时间:2016-11-06 16:24:57 - helloJob任务执行
Instance group1.job1 of HelloJob says: Hello World!, and val is: 3.141
现在是北京时间:2016-11-06 16:24:59 - helloJob任务执行
Instance group1.job1 of HelloJob says: Hello World!, and val is: 3.141
现在是北京时间:2016-11-06 16:25:01 - helloJob任务执行
Instance group1.job1 of HelloJob says: Hello World!, and val is: 3.141



---------------------------------------————————————————————————————————————————————————————————
触发器中也添加数据：
获取数据示例如下

我们在触发器也添加数据:

JobDetail job = newJob(HelloJob.class)
                  .withIdentity("job1", "group1")
                  .usingJobData("jobSays", "Hello World!")
                  .usingJobData("myFloatValue", 3.141f)
                  .build();

// 声明一个触发器，现在就执行(schedule.start()方法开始调用的时候执行)；并且每间隔2秒就执行一次
Trigger trigger = newTrigger()
                  .withIdentity("trigger1", "group1")
                  .usingJobData("trigger_key", "每2秒执行一次")
                  .startNow()
                        .withSchedule(simpleSchedule()
                          .withIntervalInSeconds(2)
                          .repeatForever())            
                  .build();



HelloJob的execute方法改成如下:

public void execute(JobExecutionContext context) throws JobExecutionException {
        JobKey key = context.getJobDetail().getKey();

        //使用归并的JobDataMap
        JobDataMap dataMap = context.getMergedJobDataMap();

        String jobSays = dataMap.getString("jobSays");
        float myFloatValue = dataMap.getFloat("myFloatValue");
        String triggerSays = dataMap.getString("trigger_key");

        System.err.println("Instance " + key + " of HelloJob says: " + jobSays + ", and val is: " + myFloatValue
                + ";trigger says:" + triggerSays);
    }



控制台输出如下，得到了job、trigger的JobDataMap 的数据：

scheduleName = MyScheduler
Instance group1.job1 of HelloJob says: Hello World!, and val is: 3.141;trigger says:每2秒执行一次
Instance group1.job1 of HelloJob says: Hello World!, and val is: 3.141;trigger says:每2秒执行一次

Trigger触发器

Trigger触发器

Trigger触发器，可以理解为安排了一个任务，这个任务是在每年9月10日早上9点向你敬爱的老师发送一天祝福短信，触发器就是指每年9月10日早上9点触发执行这个任务。

触发器使用TriggerBuilder来实例化。
触发器有一个TriggerKey关联，这在一个Scheduler中必须是唯一的。
触发器任务计划执行表的执行”机制”。多个触发器可以指向同一个工作，但一个触发器只能指向一个工作。
触发器可以传送数据给job——通过将数据放进触发器的JobDataMap。
触发器常用属性

触发器也有很多属性，这些属性都是在使用TriggerBuilder 定义触发器时设置的。

    TriggerKey - 唯一标识触发器，这在一个Scheduler中必须是唯一的
    “startTime” - 开始时间，通常使用startAt(java.util.Date)
    “endTime” - 结束时间，设置了结束时间则在这之后，不再触发

触发器的优先级

有时候，你会安排很多任务，但是Quartz并没有更多的资源去处理它。这种情况下，你必须需要很好地控制哪个任务先执行了。这时候你可以使用设置priority 属性(使用方法withPriority(int))来控制触发器的优先级。

注意：优先级只有触发器出发时间一样的时候才有意义。
注意：当一个任务请求恢复执行时，它的优先级和原始优先级是一样的。
JobBuilder用于创建JobDetail;TriggerBuilder 用于创建触发器Trigger

JobBuilder用于创建JobDetail。总是把保持在有效状态，合理的使用默认设置在你调用build() 方法的时候。如果你没有调用withIdentity(..)指定job的名字，它会自动给你生成一个。

TriggerBuilder 用于创建触发器Trigger。如果你没有调用withSchedule(..) 方法，会使用默认的schedule 。如果没有使用withIdentity(..)会自动生成一个触发器名称给你。

Quartz通过一种领域特定语言(DSL)提供了一种自己的builder的风格API来创建任务调度相关的实体。DSL可以通过对类的静态方法的使用来调用：TriggerBuilder, JobBuilder, DateBuilder, JobKey, TriggerKey 以及其它的关于Schedule创建的实现。

客户端可以使用类似示例使用DSL：

/*静态引入builder*/
import static org.quartz.JobBuilder.newJob;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;


JobDetail job = newJob(MyJob.class)
             .withIdentity("myJob")
             .build();
 Trigger trigger = newTrigger()
             .withIdentity(triggerKey("myTrigger", "myTriggerGroup"))
             .withSchedule(simpleSchedule()
                 .withIntervalInHours(1)
                 .repeatForever())
             .startAt(futureDate(10, MINUTES))
             .build();
scheduler.scheduleJob(job, trigger);


```



####  1-创建任务1
```
需要导入：

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.xml.DOMConfigurator;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerFactory;
import org.quartz.impl.StdSchedulerFactory;
```

```Java
先设置定时任务：

//设置定时任务
			StdSchedulerFactory sf = new StdSchedulerFactory();
			sf.initialize();
			Scheduler scheduler = sf.getScheduler();

      // 这里有个错误 JobBuilder.newJob


      private static void addKpiStatisticHourJob(Scheduler sched, String groupName) {
      		try {
      			JobDetail job = newJob(KpiengineHourJob.class).withIdentity("job_" + groupName, groupName).build(); // 设置作业，具体操作在SimpleJob类里

      			CronTrigger trigger = (CronTrigger) TriggerBuilder.newTrigger().withIdentity("trigger_" + groupName, groupName)
      					.withSchedule(CronScheduleBuilder.cronSchedule(Config.all_city)).build(); // 设置触发器
      			Date ft = sched.scheduleJob(job, trigger); // 设置调度作业

      			logger.info(job.getKey() + " has been scheduled to run at: " + ft+ " and repeat based on expression: "+ trigger.getCronExpression());

      		} catch (SchedulerException e) {
      			logger.error(e);
      		}
      	}

      	private static void addKpiStatisticMinueJob(Scheduler sched, String groupName) {
      		try {

      			JobDetail job = newJob(KpiengineDayJob.class).withIdentity("job_" + groupName, groupName).build(); // 设置作业，具体操作在SimpleJob类里

      			CronTrigger trigger = (CronTrigger) TriggerBuilder.newTrigger().withIdentity("trigger_" + groupName, groupName)
      					.withSchedule(CronScheduleBuilder.cronSchedule("0 0/1 * * * ?")).build(); // 设置触发器
      			Date ft = sched.scheduleJob(job, trigger); // 设置调度作业

      			logger.info(job.getKey() + " has been scheduled to run at: " + ft+ " and repeat based on expression: "+ trigger.getCronExpression());

      		} catch (SchedulerException e) {
      			logger.error(e);
      		}
      	}
```

#### 2-创建任务2 quartz

```Java

            // 首先，必需要取得一个Scheduler的引用
            SchedulerFactory sf = new StdSchedulerFactory();
            Scheduler sched = sf.getScheduler();
            //jobs可以在scheduled的sched.start()方法前被调用

            JobDetail job = newJob(contro.class).withIdentity("job1", "group1").build();
            CronTrigger trigger = newTrigger().withIdentity("trigger1", "group1").withSchedule(cronSchedule(Config.intervalTime)).build();

            sched.scheduleJob(job, trigger);
            sched.start();
```


### 有问题代码


```Java
//		demo.shutdown();
		//实时处理启动
/*		TimelinessWork job=new TimelinessWork(Config.datayu,usDirMap,brokerListBroadcast,topicUsDirBroadcast);
		job.start();
		*/
		StdSchedulerFactory sf = new StdSchedulerFactory();
		try {
			sf.initialize();
			Scheduler sched = sf.getScheduler();

      JobDetail是个抽象类

			// 查询短信开关
			JobDetail msgSwitch_Job = new JobDetail("usr6-day-job", "usr6-day-grp", KpiengineHourJob.class);
			CronTrigger msgSwitc_Trigger = new CronTrigger("Cron-usr6-day", "Cron-usr6-day", "usr6-day-job",
					"usr6-day-grp", Config.all_city);
			sched.addJob(msgSwitch_Job, true);
			sched.scheduleJob(msgSwitc_Trigger);

			JobDetail day_Job = new JobDetail("usr7-day-job", "usr7-day-grp", KpiengineDayJob.class);
			CronTrigger day_Trigger = new CronTrigger("Cron-usr7-day", "Cron-usr7-day", "usr7-day-job",
					"usr7-day-grp", Config.day_cell_cron);
			sched.addJob(day_Job, true);
			sched.scheduleJob(day_Trigger);

			JobDetail today_Job = new JobDetail("usr8-day-job", "usr8-day-grp", KpiengineTodayJob.class);
			CronTrigger today_Trigger = new CronTrigger("Cron-usr8-day", "Cron-usr8-day", "usr8-day-job",
					"usr8-day-grp", Config.all_city);
			sched.addJob(today_Job, true);
			sched.scheduleJob(today_Trigger);

			sched.start();
    }

```


### quartz 2.2.1 添加任务


```xml
<dependency>
     <groupId>org.quartz-scheduler</groupId>
     <artifactId>quartz</artifactId>
     <version>2.2.1</version>
</dependency>
```


```java
SchedulerFactory sf = new StdSchedulerFactory();
Scheduler scheduler = sf.getScheduler();



addDownKpiHourStatisticJob(scheduler,"DownKpiHourFileJob");

```

### 结论

```java
package lnglat.boot;


import lnglat.job.Area30DayAnalysisJob;
import lnglat.job.AreaAnalysisJob;
import lnglat.job.IntervalAnalysisJob;
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;

/**
 * 任务调度主类
 */
public class SchedulerMain {
    public static void start() throws SchedulerException {
        Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();//通过调度工厂创建调度器

        //路段拥堵指标统计
        addRoadCongestionJob(scheduler);
        //路段区域指标的统计job
        addRoadRangeCongestionJob(scheduler);
        //30天路段拥堵指标统计
        addRoadCongestion30DayJob(scheduler);

        scheduler.start();
    }

    //路段拥堵指标统计
    public static void addRoadCongestionJob(Scheduler scheduler) throws SchedulerException {
        JobDetail calculation_RoadCongestion_job = JobBuilder.newJob(AreaAnalysisJob.class)
                .withIdentity("cal_RoadCongestion_job", "cal_RoadCongestion_job_group").build();//通过JobBuilder构建job
        Trigger etl_trigger = TriggerBuilder.newTrigger().withIdentity("cal_RoadCongestion_trigger", "cal_RoadCongestion_trigge_group").startNow()//立即执行
                .withSchedule(CronScheduleBuilder.cronSchedule("50 2/2 * * *  ?"))//从第0分钟开始每2分钟20秒触发一次 50 2/2 * * *  ?
                .build();//产生触发器
        scheduler.scheduleJob(calculation_RoadCongestion_job, etl_trigger);//工厂模式，组装各个组件<Job,Trigger>
    }

    //路段区域指标的统计job
    public static void addRoadRangeCongestionJob(Scheduler scheduler) throws SchedulerException {
        JobDetail calculation_RoadRangeCongestion_job = JobBuilder.newJob(IntervalAnalysisJob.class)
                .withIdentity("cal_RoadRangeCongestion_job", "cal_RoadRangeCongestion_job_group").build();
        Trigger check_trigger = TriggerBuilder.newTrigger().withIdentity("cal_RoadRangeCongestion_trigger", "cal_RoadRangeCongestion_trigger_group").startNow()//立即执行
                .withSchedule(CronScheduleBuilder.cronSchedule("40 2/2 * * *  ?"))//从第0分钟开始，每2分钟20秒触发一次 50 2/2 * * *  ?
                .build();
        scheduler.scheduleJob(calculation_RoadRangeCongestion_job, check_trigger);
    }


    //30天路段拥堵指标统计
    public static void addRoadCongestion30DayJob(Scheduler scheduler) throws SchedulerException {
        JobDetail calculation_30Day_job = JobBuilder.newJob(Area30DayAnalysisJob.class)
                .withIdentity("cal_RoadCongestion30DayJob", "cal_RoadCongestion30DayJob_group").build();
        Trigger write_transform_trigger = TriggerBuilder.newTrigger().withIdentity("cal_RoadCongestion30Day_trigger", "cal_RoadCongestion30Day_trigger_group").startNow()//立即执行
                .withSchedule(CronScheduleBuilder.cronSchedule("20 13 7 * * ?"))//每天零点第八分钟触发一次 20 8 0 * * ?
                .build();//产生触发器
        scheduler.scheduleJob(calculation_30Day_job, write_transform_trigger);
    }

}

```
