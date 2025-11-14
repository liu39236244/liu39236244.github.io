这个错误表明当前有备份或恢复任务正在使用这个 repository，所以无法删除。需要先取消正在运行的任务。

## 解决步骤

### 1. 查看当前运行的备份任务

```sql
-- 查看所有备份任务状态
SHOW BACKUP FROM bridge_history_data_36;
```

### 2. 取消正在运行的备份任务

```sql
-- 取消正在运行的备份任务
CANCEL BACKUP FROM bridge_history_data_36;
```

如果有多个备份任务，可能需要指定具体的任务：

```sql
-- 查看详细的备份任务信息
SHOW BACKUP FROM bridge_history_data_36 ORDER BY CreateTime DESC LIMIT 5;

-- 如果需要取消特定任务，使用任务名称
CANCEL BACKUP FROM bridge_history_data_36 WHERE JobId = 'your_job_id';
```

### 3. 等待任务完全停止

取消命令执行后，等待几秒钟让任务完全停止：

```sql
-- 再次检查任务状态，确保没有 RUNNING 或 PENDING 状态的任务
SHOW BACKUP FROM bridge_history_data_36;
```

### 4. 删除 repository

任务停止后就可以删除 repository：

```sql
DROP REPOSITORY starrocks_backup_36_2024_09_14;
```

### 5. 重新创建 repository

```sql
CREATE REPOSITORY backup_36
WITH BROKER
ON LOCATION "s3a://36-wulipo-parquet/bak/"
PROPERTIES(
    "aws.s3.enable_ssl" = "false",
    "aws.s3.enable_path_style_access" = "true",
    "aws.s3.access_key" = "0OnU8H9YwTNTJUBC2r7F",
    "aws.s3.secret_key" = "vFQ3fIcs90woUS4200L0BYfxelE86iF6cI4vVzYC",
    "aws.s3.endpoint" = "http://10.100.5.86:9100",
    "aws.s3.region" = "us-east-1",
    "aws.s3.connection.timeout" = "60000",       -- 1分钟连接超时
    "aws.s3.socket.timeout" = "1800000"         -- 30分钟读写超时
);
```

## 完整操作序列

```sql
-- 1. 查看当前备份状态
SHOW BACKUP FROM bridge_history_data_36;

-- 2. 取消所有正在运行的备份
CANCEL BACKUP FROM bridge_history_data_36;

-- 3. 等待几秒后检查状态
SHOW BACKUP FROM bridge_history_data_36;

-- 4. 删除旧的 repository
DROP REPOSITORY starrocks_backup_36_2024_09_14;

-- 5. 创建新的 repository
CREATE REPOSITORY backup_36
WITH BROKER
ON LOCATION "s3a://36-wulipo-parquet/bak/"
PROPERTIES(
    "aws.s3.enable_ssl" = "false",
    "aws.s3.enable_path_style_access" = "true",
    "aws.s3.access_key" = "0OnU8H9YwTNTJUBC2r7F",
    "aws.s3.secret_key" = "vFQ3fIcs90woUS4200L0BYfxelE86iF6cI4vVzYC",
    "aws.s3.endpoint" = "http://10.100.5.86:9100",
    "aws.s3.region" = "us-east-1",
    "aws.s3.connection.timeout" = "60000",
    "aws.s3.socket.timeout" = "1800000"
);



-- 6. 验证新 repository
SHOW REPOSITORIES;
```

## 注意事项

- **取消任务需要时间**：`CANCEL BACKUP` 不是立即生效，需要等待当前操作完成
- **数据清理**：取消的备份可能在 MinIO 中留下部分文件，可以手动清理
- **任务状态**：确保所有相关任务状态都是 `CANCELLED` 或 `FINISHED` 后再删除 repository

如果 `CANCEL BACKUP` 命令执行后仍然无法删除 repository，可能需要重启 StarRocks 服务或等待更长时间让任务彻底清理完成。

