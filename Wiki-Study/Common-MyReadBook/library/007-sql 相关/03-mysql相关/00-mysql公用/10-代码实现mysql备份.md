# 代码实现mysql备份


https://blog.csdn.net/zhangxin09/article/details/104251200



```java
 Process process = Runtime.getRuntime().exec("C:\\Program Files\\MySQL\\MySQL Workbench 6.3 CE\\mysqldump -h"
		+ hostIP + " -u" + userName + " -p" + password + " --set-charset=UTF8 " + databaseName);
String sql = IoHelper.byteStream2string(process.getInputStream());
FileHelper.saveText("c:/temp/" + CommonUtil.now("yyyy-MM-dd_HH-mm-ss") + ".sql", sql);

```


前提是执行的 Java 程序得与 MySQL 命令行在本机上，但是通常应用服务器和数据库服务器不是放在一块的儿，是否可以通过纯 Java 或 JDBC 来实现备份呢？答案是可以的，笔者根据此思路进行了与 AJAXJS 库的整合，代码行数更精简，只有 200 多行代码。

但是，必须指出，这种思路有不少缺点，自然是不能代替官方工具的了。备份表结构通过 SHOW CREATE TABLE 语句完成，——这个没问题，只是备份实体数据时，是通过 SELECT * FROM table 备份所有行的，200 多行的代码可见考虑的情况不是很全，有其数据类型没有加进来，只能说可以应付普通的情况了。第二是效率问题，通过 JDBC 和 SELECT * 扫描表，数据量大的时候可见是不理想的。

要说靠谱自然是官方的工具完善，本文提供的思路权且当作一种应急的功能，“有备份总比没有好”，而且也不用央求运维帮忙啦

完整代码如下。

```java
package com.ajaxjs.backup;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.ajaxjs.orm.JdbcReader;
import com.ajaxjs.util.CommonUtil;
import com.ajaxjs.util.io.FileHelper;
import com.ajaxjs.util.logger.LogHelper;

/**
 * 免 mysqldump 命令备份 SQL
 * 
 * @author frank
 *
 */
public class MysqlExport {
	private static final LogHelper LOGGER = LogHelper.getLog(MysqlExport.class);

	/**
	 * 创建 MysqlExport 对象
	 * 
	 * @param conn         数据库连接对象
	 * @param databaseName 数据库库名
	 * @param saveFolder   保存目录
	 */
	public MysqlExport(Connection conn, String databaseName, String saveFolder) {
		this.databaseName = databaseName;
		this.saveFolder = saveFolder;

		try {
			stmt = conn.createStatement();
		} catch (SQLException e) {
			LOGGER.warning(e);
		}
	}

	private static final String SQL_START_PATTERN = "-- start";
	private static final String SQL_END_PATTERN = "-- end";

	private Statement stmt;
	private String databaseName;
	private String saveFolder;

	/**
	 * 获取当前数据库下的所有表名称
	 * 
	 * @return List\<String\> 所有表名称
	 */
	private List<String> getAllTables() {
		List<String> tables = new ArrayList<>();

		JdbcReader.rsHandle(stmt, "SHOW TABLE STATUS FROM `" + databaseName + "`;", rs -> {
			try {
				while (rs.next())
					tables.add(rs.getString("Name"));
			} catch (SQLException e) {
				LOGGER.warning(e);
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

		JdbcReader.rsHandle(stmt, "SHOW CREATE TABLE `" + table + "`;", rs -> {
			try {
				while (rs.next()) {
					String qtbl = rs.getString(1), query = rs.getString(2);
					query = query.trim().replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS");

					sql.append("\n\n--");
					sql.append("\n").append(SQL_START_PATTERN).append("  table dump : ").append(qtbl);
					sql.append("\n--\n\n");
					sql.append(query).append(";\n\n");
				}

				sql.append("\n\n--\n").append(SQL_END_PATTERN).append("  table dump : ").append(table)
						.append("\n--\n\n");
			} catch (SQLException e) {
				LOGGER.warning(e);
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
		StringBuilder sql = new StringBuilder();
		JdbcReader.rsHandle(stmt, "SELECT * FROM " + "`" + table + "`;", rs -> {
			try {
				rs.last();
//				int rowCount = rs.getRow();
//			if (rowCount <= 0)
//				return sql.toString();

				sql.append("\n--").append("\n-- Inserts of ").append(table).append("\n--\n\n");
				sql.append("\n/*!40000 ALTER TABLE `").append(table).append("` DISABLE KEYS */;\n");
				sql.append("\n--\n").append(SQL_START_PATTERN).append(" table insert : ").append(table)
						.append("\n--\n");
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
							sql.append("'").append(val).append("', ");
						}
					}

					sql.deleteCharAt(sql.length() - 1).deleteCharAt(sql.length() - 1);
					sql.append(rs.isLast() ? ")" : "),\n");
				}
			} catch (SQLException e) {
				LOGGER.warning(e);
			}
		});

		sql.append(";\n--\n").append(SQL_END_PATTERN).append(" table insert : ").append(table).append("\n--\n");
		// enable FK constraint
		sql.append("\n/*!40000 ALTER TABLE `").append(table).append("` ENABLE KEYS */;\n");

		return sql.toString();
	}

	/**
	 * 导出所有表的结构和数据
	 *
	 * @return String
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
	 * 执行导出
	 *
	 */
	public void export() {
		String sqlFile = saveFolder + FileHelper.separator + CommonUtil.now("yyyy_MM_dd_HH_mm_ss") + "_" + databaseName
				+ "_database_dump.sql";

		FileHelper.saveText(sqlFile, exportToSql());
		// 压缩 zip

//		// zip the file
//		zipFileName = saveFolder + "/" + sqlFileName.replace(".sql", ".zip");
//		File generatedZipFile = new File(zipFileName);
//		ZipUtil.pack(sqlFolder, generatedZipFile);
//
//		// clear the generated temp files
//		clearTempFiles(true);
	}

}

```



## php 方式

http://www.voidcn.com/article/p-qfagwwjl-btg.html

```

```