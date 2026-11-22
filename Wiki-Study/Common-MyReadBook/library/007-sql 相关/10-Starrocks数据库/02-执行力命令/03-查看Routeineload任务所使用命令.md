


### 已使用命令

查看任务数量
```
-- 集群全部 Routine Load job(2244 条)
SHOW PROC '/routine_loads';

-- 单个库(列更全:State / CurrentTaskNum / Progress / ErrorLogUrls)
SHOW ROUTINE LOAD FROM bridge_history_data_352;

-- FE 侧相关参数与可变性
ADMIN SHOW FRONTEND CONFIG LIKE '%routine%';
```

设置routineload任务

```
-- 每个 BE 并发执行的 task 上限(当前 800,官方默认 16)
ADMIN SET FRONTEND CONFIG ("max_routine_load_task_num_per_be" = "1600");

-- 每个 job 最大并发 task 数(当前 5,官方默认 5)
ADMIN SET FRONTEND CONFIG ("max_routine_load_task_concurrent_num" = "1");

-- 立即验证
ADMIN SHOW FRONTEND CONFIG LIKE '%routine%';
```


### 常用

SHOW ROUTINE LOAD FROM bridge_history_data_352;

SHOW all ROUTINE LOAD order by tableName asc

-- 查询当前集群的routeinload 任务包括正在跑的以及没有及时回收的
SHOW PROC '/routine_loads';
-- 查询starrocks 配置
ADMIN SHOW FRONTEND CONFIG LIKE '%routine%';
-- 修改routeinload 任务
ADMIN SET FRONTEND CONFIG ("max_routine_load_task_num_per_be" = "801");
-- 修改最大连接需要动配置文件 需要修改fe配置然后重启fe节点