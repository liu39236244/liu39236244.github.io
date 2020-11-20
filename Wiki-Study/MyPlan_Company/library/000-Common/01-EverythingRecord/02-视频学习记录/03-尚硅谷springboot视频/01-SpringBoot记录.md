# Spring boot 笔记

## springboot 的基本介绍

的基本使用 与内部原理 ，18 章以后就是一些整合相关的内容
SpringBoot是企业级开发的整体整合解决方案，特别用于快速构建微服务应用，旨在用最简单的方式让开发人员适应各种开发场景；

SpringBoot全套视频分为上下两部；
本视频《SpringBoot高级》属于下部，着重介绍SpringBoot的与各大场景的整合使用，内容包括：缓存（整合Redis），消息中间件（整合RabbitMQ），检索（整合ElasticSearch），任务（异步任务，定时任务，邮件任务），安全（整合SpringSecurity），分布式（整合Zookeeper/dubbo，整合SpringCloud），SpringBoot应用监管；

学习本套视频需要掌握SpringBoot；对于其他技术，视频包含快速入门讲解；


## 1 Spring boot 入门


> 1 简介

    简化spring应用开发的一个框架,
    整个spring 技术站的一个大整合；
    j2EE 开发的一站式解决方案

> 2 微服务

    2014,martin flowler 
    微服务：架构风格
    一个应用应该是一组小型服务

![](assets/000/01/02/03/01-1605777132472.png)

优点：

![](assets/000/01/02/03/01-1605777178269.png)


缺点：

spring 入门容易精通比较难，需要对spring 底层的一些框架需要比较了解




```java
    @PostMapping(value = "/getAllMediaTree", produces = "application/json;charset=UTF-8")
    @Override
    public RestMessage<Map> getAllMediaTree(@RequestBody Map<String, String> paramMap) {
        // 最终返回结果
        Map map = new HashMap();
        try {
            map = spreadManageService.getAllMediaTree(paramMap);
        } catch (Exception e) {
            e.printStackTrace();
            return new RestMessage(RespCodeAndMsg.FAIL, e.getMessage());
        }
        return new RestMessage(map);
    }

```
