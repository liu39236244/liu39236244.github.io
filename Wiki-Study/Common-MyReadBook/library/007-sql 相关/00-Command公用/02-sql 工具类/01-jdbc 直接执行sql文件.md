# jdbc 直接执行sql 文件

## 参考博客

https://blog.csdn.net/iteye_15570/article/details/82394637


### 案例1 
```sql

public class AntExecSql {
	public static void execSqlFile(String url, String userID, String pwd,	String sqlFile) {
		SQLExec2 sqlExec = new SQLExec2();
		// 设置数据库参数
		sqlExec.setDriver("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		sqlExec.setUrl(url);
		sqlExec.setUserid(userID);
		sqlExec.setPassword(pwd);
		File file = new File(sqlFile);
		sqlExec.setSrc(file);
		sqlExec.setPrint(true); // 设置是否输出
		// 输出到文件 sql.out 中；不设置该属性，默认输出到控制台
		// sqlExec.setOutput(new File("d:/script/sql.out"));
		sqlExec.setProject(new Project());	// 要指定这个属性，不然会出错
		sqlExec.execute();
	}

	public static void main(String[] args) {
		String file1 = "C:/1.sql";
		String url = "jdbc:sqlserver://localhost:1433;database=master";
		String username = "sa";
		String pwd = "sa@jiaj";

		try {
			AntExecSql.execSqlFile(url, username, pwd, file1);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}
```

### 案例2 


jdbc执行sql 文件

原文：http://blog.itpub.net/12593811/viewspace-720396/

```java
// 调用JDBC API  executeBatch（）方法。
// 不知道有没有直接调用sqlplus 的API。。
// sqlplus username/pwd@oracle @1.sql

import java.sql.*;
import java.awt.*;
import java.util.List;
import java.util.ArrayList;
import java.io.*;
import java.lang.*;

public class Test {

    /**
     * @param args the command line arguments
     */
    public Test() {
        try {
            Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");
        } catch (Exception e) {
            System.out.println("加载驱动程序出错");
            return;
        }
    }

    List loadSql(String sqlFile) throws Exception {
        List sqlList = new ArrayList();
        try {
            InputStream sqlFileIn = new FileInputStream(sqlFile);
            StringBuffer sqlSb = new StringBuffer();
            byte[] buff = new byte[1024];
            int byteRead = 0;
            while ((byteRead = sqlFileIn.read(buff)) != -1) {
                sqlSb.append(new String(buff, 0, byteRead));
            } // Windows 下换行是 \r\n, Linux 下是 \n

            String[] sqlArr = sqlSb.toString().split("(;\\s*\\r\\n)(;\\s*\\n)");
            for (int i = 0; i < sqlArr.length; i++) {
                String sql = sqlArr[i].replaceAll("--.*", "").trim();

                if (!sql.equals("")) {
                    sqlList.add(sql);
                }
            }
            return sqlList;
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }
    }
    public static void main(String[] args) throws Exception {
        String url = "jdbc:odbc:friends";
        Connection con;
        String sqlFile = "E:\\friends.sql";
      
        try {
            con = DriverManager.getConnection(url);
            List sqlList = new Test().loadSql(sqlFile);
            Statement smt = con.createStatement();

            for (String sql : sqlList) {
                smt.addBatch(sql);
            }
            smt.executeBatch();

        } catch (SQLException e) {
        }

    }
}

// sql文件内不能有注释，friends.sql文件内容为
// CREATE TABLE [dbo].[friends](
//     [name] [varchar](50) COLLATE NOT NULL,
//     [address] [varchar](50) COLLATE NULL,
//     [phone] [bigint] NULL,
//     [hireDate] [datetime] NULL,
//     [salary] [int] NULL
)
```


### java 使用mybatis 执行sql 文件

* 原文
https://www.cnblogs.com/jwentest/p/8761357.html

```java
/**
     * 执行xx库下的表备份脚本
     *
     * @param tableName
     */
    public static void runSqlInStat(String tableName) {

        String className = Configurations.INSTANCE.get("jdbc.xx.driver");
        String dbUrl = Configurations.IN
        STANCE.get("jdbc.xx.url");
        String dbUsername = Configurations.INSTANCE.get("jdbc.xx.username");
        String dbPassword = Configurations.INSTANCE.get("jdbc.xx.password");

        try {
            Class.forName(className);
            Connection conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
            ScriptRunner runner = new ScriptRunner(conn);
            runner.setAutoCommit(true);

            String fileName = String.format("src/main/resources/db/%s.sql", tableName);
            File file = new File(fileName);

            try {
                if (file.getName().endsWith(".sql")) {
                    runner.setFullLineDelimiter(false);
                    runner.setDelimiter(";");//语句结束符号设置
                    runner.setLogWriter(null);//日志数据输出，这样就不会输出过程
                    runner.setSendFullScript(false);
                    runner.setAutoCommit(true);
                    runner.setStopOnError(true);
                    runner.runScript(new InputStreamReader(new FileInputStream(fileName), "utf8"));
                    logger.info(String.format("【%s】回滚成功", tableName));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {

            e.printStackTrace();
        }

    }
```