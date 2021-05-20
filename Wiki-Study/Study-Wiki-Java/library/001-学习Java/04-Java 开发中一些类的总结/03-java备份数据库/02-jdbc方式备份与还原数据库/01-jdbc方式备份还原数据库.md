# jdbc方式备份还原数据库

## 备份mysql 

### 配置文件json ，在rsource

![](assets/001/04/03/02/01-1621473253363.png)

```json

```


### MyJdbcUtils jdbc 工具类


```java
package com.graphsafe.admin.utils.DataBack;

import com.alibaba.druid.pool.DruidDataSource;
import com.graphsafe.admin.enums.DataBaseEnum;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.jdbc.ScriptRunner;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import static com.graphsafe.admin.enums.DataBaseEnum.*;


/**
 * @Author: shenyabo
 * @date: Create in 2021/5/17 10:28
 * @Description: jdbcd工具类
 */

@Slf4j
@Data
public class MyJdbcUtils {

    // 连接池
    private DruidDataSource druidDataSource = null;
    private Connection connection;
    private Statement statement;
    // 数据库执行脚本对象
    private ScriptRunner scriptRunner;

    // 当前数据库类型枚举值
    private DataBaseEnum currDataType;

    // 配置数据库链接url
    private String sqlDataUrl;
    // 获取json配置文件的驱动
    private String sqlDriverClassName;
    private String sqlUsername;
    private String sqlPassword;

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/18 10:12
     * @Description: 初始化对应数据库配置url 驱动 数据库 用户名 密码
     * @Params: [sqlDataBackConfig]
     * @Return:
     */

    public MyJdbcUtils(String sqlServiceType, String serviceIp, String sqlServicePort, String sqlDatabaseName, String sqlUsername, String sqlPassword){
        SqlDataBackConfig sqlDataBackConfig = new SqlDataBackConfig();
        sqlDataBackConfig.setSqlServiceType(sqlServiceType);
        sqlDataBackConfig.setServiceIp(serviceIp);
        sqlDataBackConfig.setSqlServicePort(sqlServicePort);
        sqlDataBackConfig.setSqlDatabaseName(sqlDatabaseName);
        sqlDataBackConfig.setSqlUsername(sqlUsername);
        sqlDataBackConfig.setSqlPassword(sqlPassword);
        this.setSqlConfig(sqlDataBackConfig);
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/19 15:39
     * @Description: 构造函数，初始化配置
     * @Params: [sqlDataBackConfig]
     * @Return:
     */
    public MyJdbcUtils(SqlDataBackConfig sqlDataBackConfig) {

        this.setSqlConfig(sqlDataBackConfig);
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/19 15:39
     * @Description: 初始化配置文件
     * @Params: [sqlDataBackConfig]
     * @Return: void
     */
    void setSqlConfig(SqlDataBackConfig sqlDataBackConfig){

        try {
            DataBaseEnum dataBaseEnum = DataBaseEnum.getEnumBySqlName(sqlDataBackConfig.getSqlServiceType().toLowerCase());
            this.sqlDriverClassName = dataBaseEnum.getSqlDriver();
            switch (dataBaseEnum) {
                case MYSQL_DATATYPE: {
                    // mysql
                    StringBuffer sqlUrl = new StringBuffer("");
                    //sqlUrl.append("jdbc:mysql://localhost:3306/xzpxjy?characterEncoding=UTF-8");
                    sqlUrl.append("jdbc:mysql://").
                            append(sqlDataBackConfig.getServiceIp())
                            .append(":")
                            .append(sqlDataBackConfig.getSqlServicePort())
                            .append("/")
                            .append(sqlDataBackConfig.getSqlDatabaseName())
                            .append("?characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false");

                    this.sqlDataUrl = sqlUrl.toString();
                    this.sqlDriverClassName = MYSQL_DATATYPE.getSqlDriver();
                    break;
                }
                case ORACLE_DATATYPE: {
                    // oracle
                    StringBuffer sqlUrl = new StringBuffer("");
                    //sqlUrl.append("jdbc:oracle:thin:@ip:端口/ORCL");
                    sqlUrl.append("jdbc:oracle:thin:@").
                            append(sqlDataBackConfig.getServiceIp())
                            .append(":")
                            .append(sqlDataBackConfig.getSqlServicePort())
                            .append("/ORCL");
                    this.sqlDataUrl = sqlUrl.toString();
                    this.sqlDriverClassName = ORACLE_DATATYPE.getSqlDriver();

                    break;
                }
                case SQLSERVER_DATATYPE: {
                    // oracle
                    StringBuffer sqlUrl = new StringBuffer("");
                    //sqlUrl.append("jdbc:sqlserver://localhost:1433;database=master");
                    sqlUrl.append("jdbc:sqlserver://").
                            append(sqlDataBackConfig.getServiceIp())
                            .append(":")
                            .append(sqlDataBackConfig.getSqlServicePort())
                            .append(";database=")
                            .append(sqlDataBackConfig.getSqlDatabaseName());
                    this.sqlDataUrl = sqlUrl.toString();
                    this.sqlDriverClassName = SQLSERVER_DATATYPE.getSqlDriver();
                    break;
                }
                default: {
                    break;
                }
            }

            this.sqlUsername = sqlDataBackConfig.getSqlUsername();
            this.sqlPassword = sqlDataBackConfig.getSqlPassword();
            try {
                Class.forName(this.sqlDriverClassName);
            } catch (ClassNotFoundException e) {
                throw new ExceptionInInitializerError();
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("初始化jdbc链接出错！com.graphsafe.admin.utils.DataBack.jdbcUtils -> jdbcUtils(SqlDataBackConfig sqlDataBackConfig)");
        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/18 10:15
     * @Description: 初始化数据库连接池, 在构造函数中完成初始化;目前没有用这种方式
     * @Params: []
     * @Return: void
     */
    private DruidDataSource GetDbConnect() throws Exception {
        try {
            if (druidDataSource == null) {
                druidDataSource = new DruidDataSource();
                //设置连接参数
                druidDataSource.setUrl(this.sqlDataUrl);
                druidDataSource.setDriverClassName(this.sqlDriverClassName);
                druidDataSource.setUsername(this.sqlUsername);
                druidDataSource.setPassword(this.sqlPassword);
                //配置初始化大小、最小、最大
                druidDataSource.setInitialSize(1);
                druidDataSource.setMinIdle(1);
                druidDataSource.setMaxActive(10);
                //连接泄漏监测
                druidDataSource.setRemoveAbandoned(true);
                druidDataSource.setRemoveAbandonedTimeout(30);
                //配置获取连接等待超时的时间
                druidDataSource.setMaxWait(20000);
                //配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
                druidDataSource.setTimeBetweenEvictionRunsMillis(20000);
                //防止过期
                druidDataSource.setValidationQuery("SELECT 'x'");
                druidDataSource.setTestWhileIdle(true);
                druidDataSource.setTestOnBorrow(true);
            }
            return druidDataSource;
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/17 16:05
     * @Description: 获取数据库connection 对象
     * @Params: []
     * @Return: java.sql.Connection
     */
    public Connection getConnect() {
        try {
            if (connection == null) {
                // 这种数据库链接池的形式会出现经常性的没有空闲连接(可能是跟现有框架注入spring 的链接池冲突之类的)，
                // connection = GetDbConnect().getConnection();
                connection = DriverManager.getConnection(this.sqlDataUrl, this.sqlUsername, this.sqlPassword);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return connection;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/18 12:00
     * @Description: 初始化statment
     * @Params: []
     * @Return: java.sql.Statement
     */
    public Statement getSqlStatement() {
        try {
            if (statement == null) {
                statement = getConnect().createStatement();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return statement;

    }

    public void free() {
        try {
            if (statement != null) {
                statement.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (scriptRunner != null) {
                scriptRunner.closeConnection();
            }
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/17 16:50
     * @Description: 获取数据库执行脚本对象
     * @Params: []
     * @Return: org.apache.ibatis.jdbc.ScriptRunner
     */
    private ScriptRunner getScriptRunner() {
        if (scriptRunner == null) {
            scriptRunner = new ScriptRunner(this.getConnect());
        }
        return scriptRunner;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/17 16:56
     * @Description: 根据.sql 文件还原数据库
     * @Params: [filePath]
     * @Return: void
     */
    public void executeSqlScript(String filePath) {

        File file = new File(filePath);
        try {
            ScriptRunner scriptRunner = getScriptRunner();
            this.getConnection().setAutoCommit(false);
            scriptRunner.setAutoCommit(false);
            if (file.getName().endsWith(".sql")) {
                scriptRunner.setFullLineDelimiter(false);
                //语句结束符号设置
                scriptRunner.setDelimiter(";");
                //日志数据输出，这样就不会输出过程
                scriptRunner.setLogWriter(null);
                scriptRunner.setStopOnError(true);
                scriptRunner.setSendFullScript(false);
                try {
                    scriptRunner.runScript(new InputStreamReader(new FileInputStream(filePath), "utf8"));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }
                log.info(String.format("【%s】还原成功", filePath));
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(String.format("【%s】执行sql文件失败！执行回滚...", filePath));
            try {
                // 回滚
                this.getConnection().rollback();
                log.info(String.format("回滚成功！涉及Drop、Truncate 操作的表数据将无法回滚！注意查看"));
            } catch (SQLException ex) {
                // 出错回滚
                ex.printStackTrace();
                log.error(String.format("【%s】执行回滚失败！", filePath));
            }
        } finally {

            this.free();
        }

    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/19 17:26
     * @Description:  判断多级路径是否存在，不存在就创建
     * @Params: [filePath: filePath 支持带文件名的Path：如：D:\news\2014\12\abc.text，和不带文件名的Path：如：D:\news\2014\12]
     * @Return: void
     */
    public static void isExistDir(String filePath) {

        String paths[] = {""};
        //切割路径
        try {
            //File对象转换为标准路径并进行切割，有两种windows和linux
            String tempPath = new File(filePath).getCanonicalPath();
            //windows
            paths = tempPath.split("\\\\");

            //linux
            if(paths.length==1){paths = tempPath.split("/");}
        } catch (IOException e) {
            System.out.println("切割路径错误");
            e.printStackTrace();
        }
        //判断是否有后缀
        boolean hasType = false;
        if(paths.length>0){
            String tempPath = paths[paths.length-1];
            if(tempPath.length()>0){
                if(tempPath.indexOf(".")>0){
                    hasType=true;
                }
            }
        }
        //创建文件夹
        String dir = paths[0];
        // 注意此处循环的长度，有后缀的就是文件路径，没有则文件夹路径
        for (int i = 0; i < paths.length - (hasType?2:1); i++) {
            try {
                //采用linux下的标准写法进行拼接，由于windows可以识别这样的路径，所以这里采用警容的写法
                dir = dir + "/" + paths[i + 1];
                File dirFile = new File(dir);
                if (!dirFile.exists()) {
                    dirFile.mkdir();
                    System.out.println("成功创建目录：" + dirFile.getCanonicalFile());
                }
            } catch (Exception e) {
                System.err.println("文件夹创建发生异常");
                e.printStackTrace();
            }
        }
    }

}

```



### 备份数据库工具类

SqlBackUpRestore

```java
package com.graphsafe.admin.utils.DataBack;

/**
 * @Author: shenyabo
 * @Ime: 2021/5/14 21:03
 * @Version: 1.0
 */

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 *@Author: shenyabo
 *@date: Create in 2021/5/17 17:23
 *@Description: 数据库备份与恢复工具类 非执行sql cmd 命令行原理，jdbc 方式
 */
@Slf4j
public class SqlBackUpRestore {

    private List<SqlDataBackConfig> sqlDataBackConfigList = new ArrayList<>();

    public List<SqlDataBackConfig> getSqlDataBackConfigList() {
        return sqlDataBackConfigList;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/17 17:25
     * @Description: 构造函数，初始化 databackupInfo.json 中配置的备份参数
     * @Params: []
     * @Return:
     */
    public SqlBackUpRestore() {
        try {
            InputStream is = new ClassPathResource("databackupInfo.json").getInputStream();
            initBackJsonFileConfig(is);
        } catch (IOException e) {
            log.warn("备份数据库读取构造函数: databackupInfo.json 文件加载出错");

        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/17 14:41
     * @Description: 将从databackupinfo.json 中读取的配置文件转为 sqlDataBackConfigList 集合(可能设置多个数据库)
     * @Params: [reader]
     * @Return: com.alibaba.fastjson.JSONArray
     */
    private  void initBackJsonFileConfig(InputStream reader) {

        String jsonStr = "";
        try {
            int ch = 0;
            StringBuffer sb = new StringBuffer();
            while ((ch = reader.read()) != -1) {
                sb.append((char) ch);
            }
            reader.close();
            String json=sb.toString();
            json = json.replaceAll("[\\s\\t\\n\\r]", "");
            JSONArray jsonArray =  JSONArray.parseArray(json);
            // 将配置转化为实体对象
            setSqlDataBackConfig(jsonArray);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/17 13:59
     * @Description: 从JSONArray 流中读取配置文件给 sqlDataBackConfigList
     * @Params: [reader]
     * @Return: com.alibaba.fastjson.JSONArray
     */
    private  void setSqlDataBackConfig ( JSONArray jsonArray) {
        for (int i = 0; i < jsonArray.size(); i++) {
            JSONObject jsonObject = jsonArray.getJSONObject(i);
            boolean ifBack =Boolean.valueOf(jsonObject.get("ifBack").toString());
            if(ifBack){
                // 如果配置为需要备份，才会继续初始化其他配置项
                String ip = jsonObject.getString("ip");
                String port = jsonObject.getString("port");
                String user = jsonObject.getString("user");
                String password = jsonObject.getString("password");
                String dbname = jsonObject.getString("dbname");
                String savefile = "";
                // 判断当前系统是linux 还是win ，进行配置文件路径取舍
                String os = System.getProperty("os.name");
                String systemType = "";
                if(os.toLowerCase().contains("win")){
                     savefile = jsonObject.getString("savefile-windows");
                     systemType = "windows";
                }else{
                    savefile = jsonObject.getString("savefile-linux");
                    systemType = "linux";
                }
                String dbtype = jsonObject.getString("dbtype");
                JSONArray ignoredTable = jsonObject.getJSONArray("ignoredTable");
                SqlDataBackConfig sqlConfig = new SqlDataBackConfig();
                sqlConfig.setServiceIp(ip)
                        .setSqlServicePort(port)
                        .setSqlUsername(user)
                        .setSqlPassword(password)
                        .setSqlDatabaseName(dbname)
                        .setSaveFilePath(savefile)
                        .setFinallSqlFilePath()
                        .setSqlServiceType(dbtype)
                        .setSystemType(systemType)
                        .setIgnoredTable(ignoredTable.toJavaList(String.class));

                // 初始化每个配置文件对象内部的jdbcUtil
                MyJdbcUtils jdbcUtils = new MyJdbcUtils(sqlConfig);
                sqlConfig.setJdbcUtil(jdbcUtils);
                sqlDataBackConfigList.add(sqlConfig);
            }
        }
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/18 10:52
     * @Description: 导出配置文件中定义的多个数据库备份配置
     * @Params: []
     * @Return: void
     */
    public void exportAllConfigData(){
        sqlDataBackConfigList.forEach(confi->{
            confi.export();
        });

    }
}
```


### 数据库导出核心类


SqlDataBackConfig

```java
package com.graphsafe.admin.utils.DataBack;

import com.ajaxjs.orm.JdbcReader;
import com.ajaxjs.util.CommonUtil;
import com.ajaxjs.util.io.FileHelper;
import lombok.Data;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;


/**
 *@Author: shenyabo
 *@date: Created in 2021-05-17 18:53
 *@Description: 数据库备份对应配置类
 */
@Data
@Slf4j
@Accessors(chain = true)
public class SqlDataBackConfig {

    private String serviceIp;
    // 数据库类别
    private String sqlServiceType;
    private String sqlServicePort;
    // 要备份的数据库名字
    private String sqlDatabaseName;
    private String sqlUsername;
    private String sqlPassword;

    // 配置文件中配置的sql 存储路径
    private String saveFilePath;
    // 当前数据库备份最终存储的文件全路径
    private String finallSaveFilePath;

    // 服务所在操作系统类型 windows 还是linux
    private String systemType;

    // 备份数据库中索要忽略不备份的表
    private List<String> ignoredTable;


    // 单个配置文件对应所需的jdbc工具类

    private MyJdbcUtils jdbcUtil;
    private static final String SQL_START_PATTERN = "-- start";
    private static final String SQL_END_PATTERN = "-- end";

    Pattern pattern = Pattern.compile("\n");
    /**
     * 获取当前数据库下的所有表名称
     *
     * @return List\<String\> 所有表名称
     */
    private List<String> getAllTables() {
        List<String> tables = new ArrayList<>();

        JdbcReader.rsHandle(this.jdbcUtil.getSqlStatement(), "SHOW TABLE STATUS FROM `" + sqlDatabaseName + "`;", rs -> {
            try {
                while (rs.next()) {
                    String curTable = rs.getString("Name");
                    if (!this.ignoredTable.contains(curTable)) {
                        tables.add(curTable);
                    }

                }
            } catch (SQLException e) {
                log.error(e.getMessage());
            }
        });

        return tables;
    }

    /**
     * 生成create语句
     *
     * @param table 表名
     * @return String
     */
    private String getTableInsertStatement(String table) {
        StringBuilder sql = new StringBuilder();


        JdbcReader.rsHandle(this.jdbcUtil.getSqlStatement(), "SHOW CREATE TABLE `" + table + "`;", rs -> {
            try {
                while (rs.next()) {
                    String qtbl = rs.getString(1), query = rs.getString(2);
                    //query = query.trim().replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS");

                    sql.append("\n\n--");
                    sql.append("\n").append(SQL_START_PATTERN).append("  table dump : ").append(qtbl);
                    sql.append("\n--\n\n");
                    sql.append("DROP TABLE IF EXISTS `" + table + "`; \n");
                    sql.append(query).append(";\n\n");
                }

                sql.append("\n\n--\n").append(SQL_END_PATTERN).append("  table dump : ").append(table)
                        .append("\n--\n\n");
            } catch (SQLException e) {
                e.printStackTrace();
                log.error(e.getMessage());
            }
        });

        return sql.toString();
    }

    /**
     * 生成insert语句
     *
     * @param table the table to get inserts statement for
     * @return String generated SQL insert
     */
    private String getDataInsertStatement(String table) {


        if("portal_public_info".equals(table)){
            System.out.println("1");
        }
        StringBuilder sql = new StringBuilder();
        JdbcReader.rsHandle(this.jdbcUtil.getSqlStatement(), "SELECT * FROM " + "`" + table + "`;", rs -> {
            try {
                rs.last();
                int rowCount = rs.getRow();
                //			if (rowCount <= 0)
                //				return sql.toString();

                sql.append("\n--").append("\n-- Inserts of ").append(table).append("\n--\n\n");
                sql.append("\n/*!40000 ALTER TABLE `").append(table).append("` DISABLE KEYS */;\n");
                sql.append("\n--\n").append(SQL_START_PATTERN).append(" table insert : ").append(table)
                        .append("\n--\n");

                if (rowCount > 0){
                    sql.append("INSERT INTO `").append(table).append("`(");

                    ResultSetMetaData metaData = rs.getMetaData();
                    int columnCount = metaData.getColumnCount();

                    for (int i = 0; i < columnCount; i++) {
                        sql.append("`").append(metaData.getColumnName(i + 1)).append("`, ");
                    }

                    sql.deleteCharAt(sql.length() - 1).deleteCharAt(sql.length() - 1).append(") VALUES \n");

                    rs.beforeFirst();
                    while (rs.next()) {
                        sql.append("(");
                        for (int i = 0; i < columnCount; i++) {

                            int columnType = metaData.getColumnType(i + 1);
                            int columnIndex = i + 1;

                            if (Objects.isNull(rs.getObject(columnIndex))) {
                                sql.append("").append(rs.getObject(columnIndex)).append(", ");
                            } else if (columnType == Types.INTEGER || columnType == Types.TINYINT
                                    || columnType == Types.BIT) {
                                sql.append(rs.getInt(columnIndex)).append(", ");
                            } else {
                                String val = rs.getString(columnIndex).replace("'", "\\'");
                                val = val.replace("\"", "\\\"");
                                boolean b = pattern.matcher(val).find();
                                if(b){
                                    val=val.replace("\n", "\\n");
                                }
//                                val=val.replace(";", "&E；");
                                sql.append("'").append(val).append("', ");
                            }
                        }
                        sql.deleteCharAt(sql.length() - 1).deleteCharAt(sql.length() - 1);
                        sql.append(rs.isLast() ? ")" : "),\n");
                    }
                    sql.append(";");
                }else{
                    sql.append("\n -- "+ table+"表没有对应数据!  \n");
                }
            } catch (SQLException e) {
                e.printStackTrace();
                log.error(e.getMessage());
            }
        });

        sql.append("\n--\n").append(SQL_END_PATTERN).append(" table insert : ").append(table).append("\n--\n");
        // enable FK constraint
        sql.append("\n/*!40000 ALTER TABLE `").append(table).append("` ENABLE KEYS */;\n");

        return sql.toString();
    }

     /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/19 14:56
     * @Description: 导出所有表的结构和数据
     * @Params: []
     * @Return: java.lang.String
     */
    private String exportToSql() {

        StringBuilder sql = new StringBuilder();
        sql.append("--\n-- Generated by AJAXJS-Data");
        sql.append("\n-- Date: ").append(CommonUtil.now("d-M-Y H:m:s")).append("\n--");

        // these declarations are extracted from HeidiSQL
        sql.append("\n\n/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;")
                .append("\n/*!40101 SET NAMES utf8 */;\n/*!50503 SET NAMES utf8mb4 */;")
                .append("\n/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;")
                .append("\n/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;");

        List<String> tables = getAllTables();

        for (String s : tables) {
            sql.append(getTableInsertStatement(s.trim()));
            sql.append(getDataInsertStatement(s.trim()));
        }

        sql.append("\n/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;").append(
                "\n/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;")
                .append("\n/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;");

        return sql.toString();
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/18 11:04
     * @Description: 根据配置文件中指定的路径拼接当前备份sql最终路径
     * @Params: []
     * @Return: void
     */
    public SqlDataBackConfig setFinallSqlFilePath() {
        this.finallSaveFilePath = saveFilePath + FileHelper.separator + CommonUtil.now("yyyy_MM_dd_HH_mm_ss") + "_" + sqlDatabaseName + "_database_dump.sql";
        return this;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/5/18 11:03
     * @Description: 单个备份配置指定的数据库 生成指定路径sql文件
     * @Params: []
     * @Return: void
     */

    public void export() {
        this.jdbcUtil.getSqlStatement();
        MyJdbcUtils.isExistDir( this.finallSaveFilePath);
        FileHelper.saveText(this.finallSaveFilePath, exportToSql());
        this.jdbcUtil.free();
        // 压缩 zip
        //		// zip the file
        //		zipFileName = saveFolder + "/" + sqlFileName.replace(".sql", ".zip");
        //		File generatedZipFile = new File(zipFileName);
        //		ZipUtil.pack(sqlFolder, generatedZipFile);
        //		// clear the generated temp files
        //		clearTempFiles(true);
    }


}

```




### 使用

> 1 数据库备份导出.sql 文件

```java
 static void backData() {

        SqlBackUpRestore sqlBackUpRestore = new SqlBackUpRestore();
        sqlBackUpRestore.exportAllConfigData();

    }
```



> 2 还原


```java
 boolean success = true;
        try{
            MyJdbcUtils myJdbcUtils = new MyJdbcUtils(baseDataBackup.getDataType(),
                    baseDataBackup.getDbIp(),
                    baseDataBackup.getDbPort(),
                    baseDataBackup.getDbName(),
                    baseDataBackup.getDbUser(),
                    baseDataBackup.getDbPassword()
            );
            myJdbcUtils.executeSqlScript(baseDataBackup.getDataBackupFile());
        }catch (Exception e){
            success = false;
            e.printStackTrace();
            log.error("【%s】还原数据库操作失败！",baseDataBackup.getDataBackupFile());
        }
```