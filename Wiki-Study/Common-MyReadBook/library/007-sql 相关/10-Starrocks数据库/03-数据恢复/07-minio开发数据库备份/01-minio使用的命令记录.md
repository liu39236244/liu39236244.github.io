# minio 命令记录

官网：

https://min.io/download#/windows


历史版本：

https://dl.min.io/server/minio/release/windows-amd64/archive/

## 基础信息

请记下这些关键信息：
API Endpoint: http://<你的服务器IP>:9000 (这是给 StarRocks 或其他程序用的地址)
Console Endpoint: http://<你的服务器IP>:9090 (这是你用来登录Web管理界面的地址)
RootUser (默认账号) : minioadmin
RootPass (默认密码) : minioadmin

## 简单启动命令

.\minio.exe server C:\minio\data --console-address ":9090"

.\minio.exe server E:\shenyabo\third-package\minio\bridge_backup --console-address ":9090"

### 如果端口被占用

.\minio.exe server E:\shenyabo\third-package\minio\bridge_backup --address ":9100" --console-address ":9101"

--address ":9100"：将 API 端口设置为 9100。
--console-address ":9101"：将 Console (Web UI) 端口设置为 9101。

### 安装nssm以后的启动命令

nssm start MinIO

或者

Start-Service MinIO

或者

你也可以打开 Windows 服务管理器（运行 services.msc），找到名为 MinIO 的服务，右键点击启动，并可以将其“启动类型”设置为“自动”，确保服务器重启后服务会自动运行。



## minio 页面操作


在 MinIO 的 Web 控制台中创建存储桶时，你会看到几个可选特性，这些特性允许你配置存储桶的行为和限制。以下是各个选项的说明及配置建议：

1. **Bucket Name (存储桶名称)**:
   - 此处定义存储桶的唯一标识符。名称需遵循命名规则（例如，使用唯一字符，不使用大写字母等）。
   - 一个合适的示例是 `36-wulipo-parquet`，但请根据具体项目和组织需求调整。

2. **Versioning (版本控制)**:
   - **ON**: 启用版本控制后，对象的每次更新都会创建一个新版本，而不是覆盖现有版本。这样可以恢复到旧版本。
   - **OFF**: 关闭版本控制，更新对象会直接替换旧版本。
   - 推荐使用 `ON`，特别是如果需要保留某些对象的历史版本以防止数据丢失或误操作。

3. **Object Locking (对象锁定)**:
   - **ON**: 启用对象锁定后，可以通过策略配置对象的保留期或法律保留，用于防止对象被删除或覆盖。
   - **OFF**: 关闭对象锁定，对象可能会被用户或程序意外删除。
   - 如果你需要确保数据在一定时期内不能被篡改或删除，建议启用 `ON`。

4. **Quota (配额)**:
   - **ON**: 启用存储桶的存储配额限制，可以控制最大存储容量。
   - **OFF**: 关闭配额限制，存储桶可以无限添加对象，直到物理存储满。
   - 根据存储需求和成本考虑是否开启。启用 `ON` 可以避免超出预算限制存储使用。

5. **Capacity (容量)**:
   - 输入框中的数字定义存储桶的最大存储容量。
   - 根据 Quota 开启或关闭，输入适量的值。单位可以切换（如 TiB）。
   - 对于大数据备份，可设置较高的容量，确保长时间内不会因容量不足而中断数据写入。

### 综合建议：

根据你的项目需求，适当调节这些设置。例如：

- **开启版本控制**：更适合需要频繁的备份和版本恢复的数据。
- **开启对象锁定**：确保关键数据不会意外被删除。
- **启用配额限制**：控制和优化存储成本。

配置完成后，点击“Create Bucket”以创建存储桶。确保在设置这些属性时充分考虑数据备份的需求、安全性和存储成本，有必要时，调整设置或寻求技术支持协助。