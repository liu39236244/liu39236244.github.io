这是 MySQL 8.0 中一个常见的问题！错误是由于 `lower_case_table_names` 设置不一致导致的。这通常发生在：

1. **数据卷中已存在旧数据**，但设置不同
2. **Windows/macOS 系统**（默认大小写不敏感）运行 Linux 容器（默认大小写敏感）

## 🔧 解决方案

### **方法1：清理数据卷并重新初始化（推荐）**

```batch
@echo off
echo 🔧 修复 MySQL lower_case_table_names 问题...

echo 1. 停止 MySQL 容器
docker-compose -f src\main\docker\mysql.yml down

echo 2. 删除 MySQL 数据卷（会清空所有数据）
docker volume rm myjhipsterstudy_jhipster_mysql_data 2>nul
docker volume rm jhipster_mysql_data 2>nul

echo 3. 清理容器
docker rm jhipster-mysql-local 2>nul

echo 4. 重新启动 MySQL
docker-compose -f src\main\docker\mysql.yml up -d

echo 5. 等待 MySQL 完全启动...
timeout /t 30 >nul

echo 6. 检查 MySQL 状态
docker logs jhipster-mysql-local --tail 20

pause
```

### **方法2：修改 MySQL 配置（保留数据）**

修改 MySQL 配置以适应现有数据，更新 `src\main\docker\mysql.yml`：

```yaml
# MySQL Database (Fixed lower_case_table_names)
name: myjhipsterstudy
services:
  mysql:
    image: jhipster-mysql:local
    container_name: jhipster-mysql-local
    environment:
      - MYSQL_ALLOW_EMPTY_PASSWORD=yes
      - MYSQL_DATABASE=myjhipsterstudy
      - MYSQL_USER=jhipster
      - MYSQL_PASSWORD=jhipster
    ports:
      - "3307:3306"
    # 移除 lower_case_table_names 设置，使用默认值
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --innodb-use-native-aio=0
    restart: unless-stopped
    volumes:
      - jhipster_mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "--silent"]
      interval: 30s
      timeout: 10s
      retries: 5
volumes:
  jhipster_mysql_data:
```

### **方法3：创建自定义 MySQL 配置文件**

创建一个 MySQL 配置文件来解决这个问题：

```batch
REM 创建 MySQL 配置目录
if not exist "src\main\docker\config" mkdir "src\main\docker\config"
if not exist "src\main\docker\config\mysql" mkdir "src\main\docker\config\mysql"

REM 创建自定义 MySQL 配置
(
echo [mysqld]
echo character-set-server=utf8mb4
echo collation-server=utf8mb4_unicode_ci
echo lower_case_table_names=0
echo innodb-use-native-aio=0
echo skip-host-cache
echo skip-name-resolve
echo default-authentication-plugin=mysql_native_password
) > "src\main\docker\config\mysql\my.cnf"
```

然后更新 `mysql.yml`：

```yaml
# MySQL Database (With Custom Config)
name: myjhipsterstudy
services:
  mysql:
    image: jhipster-mysql:local
    container_name: jhipster-mysql-local
    environment:
      - MYSQL_ALLOW_EMPTY_PASSWORD=yes
      - MYSQL_DATABASE=myjhipsterstudy
      - MYSQL_USER=jhipster
      - MYSQL_PASSWORD=jhipster
    ports:
      - "3307:3306"
    restart: unless-stopped
    volumes:
      - jhipster_mysql_data:/var/lib/mysql
      - ./config/mysql/my.cnf:/etc/mysql/conf.d/custom.cnf:ro
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "--silent"]
      interval: 30s
      timeout: 10s
      retries: 5
volumes:
  jhipster_mysql_data:
```

## 🛠️ 更新脚本中的 MySQL 配置函数

让我更新脚本中的 MySQL 配置创建函数：

```batch
:create_mysql_config
echo 创建 MySQL 配置目录...
if not exist "src\main\docker\config" mkdir "src\main\docker\config"
if not exist "src\main\docker\config\mysql" mkdir "src\main\docker\config\mysql"

echo 创建自定义 MySQL 配置文件...
(
echo [mysqld]
echo character-set-server=utf8mb4
echo collation-server=utf8mb4_unicode_ci
echo lower_case_table_names=0
echo innodb-use-native-aio=0
echo skip-host-cache
echo skip-name-resolve
echo default-authentication-plugin=mysql_native_password
echo sql-mode="STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO"
) > "src\main\docker\config\mysql\my.cnf"

echo 创建 MySQL Docker Compose 配置...
(
echo # MySQL Database ^(Fixed for Windows/macOS^)
echo name: myjhipsterstudy
echo services:
echo   mysql:
echo     image: jhipster-mysql:local
echo     container_name: jhipster-mysql-local
echo     environment:
echo       - MYSQL_ALLOW_EMPTY_PASSWORD=yes
echo       - MYSQL_DATABASE=myjhipsterstudy
echo       - MYSQL_USER=jhipster
echo       - MYSQL_PASSWORD=jhipster
echo       - MYSQL_ROOT_HOST=%%
echo     ports:
echo       - "3307:3306"
echo     restart: unless-stopped
echo     volumes:
echo       - jhipster_mysql_data:/var/lib/mysql
echo       - ./config/mysql/my.cnf:/etc/mysql/conf.d/custom.cnf:ro
echo     healthcheck:
echo       test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "--silent"]
echo       interval: 30s
echo       timeout: 10s
echo       retries: 5
echo     # 给 MySQL 更多时间启动
echo     deploy:
echo       resources:
echo         limits:
echo           memory: 1G
echo         reservations:
echo           memory: 512M
echo volumes:
echo   jhipster_mysql_data:
) > "src\main\docker\mysql.yml"
goto :eof
```

## 🎯 推荐操作步骤

1. **立即修复（清理重建）**：
   ```cmd
   docker-compose -f src\main\docker\mysql.yml down
   docker volume rm myjhipsterstudy_jhipster_mysql_data
   ```

2. **更新配置**：使用上面的新配置替换现有的 `mysql.yml`

3. **重新启动**：
   ```cmd
   docker-compose -f src\main\docker\mysql.yml up -d
   ```

4. **验证启动**：
   ```cmd
   docker logs jhipster-mysql-local -f
   ```

5. **测试连接**：
   ```cmd
   docker exec -it jhipster-mysql-local mysql -ujhipster -pjhipster -e "SHOW DATABASES;"
   ```

这样应该就能解决 `lower_case_table_names` 的问题了！如果你不介意清空数据库数据，推荐使用**方法1**最简单直接。🔧