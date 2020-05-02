# mysql 连接所需工具类

## 1-连接池类

### 2-1 连接池案例1

```java
package cn.netcommander.klcm.common.dao;


import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import cn.netcommander.klcm.common.SysData;
import org.apache.commons.dbcp.BasicDataSource;
import org.apache.commons.dbcp.BasicDataSourceFactory;
import org.apache.commons.dbcp.SQLNestedException;
import org.apache.log4j.Logger;

import com.sun.xml.internal.bind.util.Which;
/**
 * Title : ConnectionPool.java
 * Description: 数据库连接池
 * Copyright: Copyright (c)May 22, 2008
 * Company: jadosoft
 * @author: xuxin
 * @version 1.0
 */
public class ConnectionPool {
    public static final Logger logger = Logger.getLogger(ConnectionPool.class);
    private static BasicDataSource dataSource = null;
    private static BasicDataSource dataSource_yd = null;
    private static BasicDataSource dataSource_pr = null;

    public ConnectionPool() {

    }

    public static Properties init(String date) throws SQLException {
        Properties p=null;
        p = new Properties();
        p.setProperty("driverClassName", SysData.jc.getDrivername());
        p.setProperty("url", SysData.jc.getUrl1().replace("nc_yd", date));
        p.setProperty("password", SysData.jc.getPasswrod());
        p.setProperty("username", SysData.jc.getUsername());
        p.setProperty("maxActive", "500");
        p.setProperty("maxIdle", "100");
        p.setProperty("maxWait", "5000");
        p.setProperty("removeAbandoned", "false");
        p.setProperty("removeAbandonedTimeout", "120");
        p.setProperty("testOnBorrow", "true");
        p.setProperty("testOnReturn", "true");
        p.setProperty("testWhileIdle", "false");
        p.setProperty("logAbandoned", "true");
        p.setProperty("validationQuery", "SELECT COUNT(*) FROM DUAL");
        return p;
    }

    public static Connection getConnection() throws SQLException {
        if (dataSource == null) {
            Properties p = init("nc_kl_cm"); //nc_kl_cm
            try {
                dataSource = (BasicDataSource) BasicDataSourceFactory.createDataSource(p);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Connection conn = null;

        if (dataSource != null) {
            try {
                conn = dataSource.getConnection();
            } catch (SQLNestedException e) {
                logger.error("数据库连接池不能取到连接异常 ：", e);
            }
        }

        return conn;
    }

    public static Connection getConnection_lt() throws SQLException {
        if (dataSource == null) {
            Properties p = init("nc_laotai"); //nc_kl_cm
            try {
                dataSource = (BasicDataSource) BasicDataSourceFactory.createDataSource(p);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Connection conn = null;

        if (dataSource != null) {
            try {
                conn = dataSource.getConnection();
            } catch (SQLNestedException e) {
                logger.error("数据库连接池不能取到连接异常 ：", e);
            }
        }

        return conn;
    }

    public static Connection getConnection_yc() throws SQLException {
        if (dataSource == null) {
            Properties p = init("nc_yc"); //nc_kl_cm
            try {
                dataSource = (BasicDataSource) BasicDataSourceFactory.createDataSource(p);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Connection conn = null;

        if (dataSource != null) {
            try {
                conn = dataSource.getConnection();
            } catch (SQLNestedException e) {
                logger.error("数据库连接池不能取到连接异常 ：", e);
            }
        }

        return conn;
    }

    public static Connection getConnection_yd() throws SQLException {
        if (dataSource_yd == null) {
            Properties p = init("nc_yd");
            try {
                dataSource_yd = (BasicDataSource) BasicDataSourceFactory.createDataSource(p);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Connection conn = null;

        if (dataSource_yd != null) {
            try {
                conn = dataSource_yd.getConnection();
            } catch (SQLNestedException e) {
                logger.error("数据库连接池不能取到连接异常 ：", e);
            }
        }

        return conn;
    }


    public static Connection getConnection_pr() throws SQLException {
        if (dataSource_pr == null) {
            Properties p = init("nc_pr");
            try {
                dataSource_pr = (BasicDataSource) BasicDataSourceFactory.createDataSource(p);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Connection conn = null;

        if (dataSource_pr != null) {
            try {
                conn = dataSource_pr.getConnection();
            } catch (SQLNestedException e) {
                logger.error("数据库连接池不能取到连接异常 ：", e);
            }
        }

        return conn;
    }


}

```

## 2-sql Connection 类1

### 2-1：commonDao

```java
package cn.netcommander.klcm.common.dao;

import org.apache.log4j.Logger;

import java.sql.*;


/**
 * Title: CommonDAO Description: CommonDAO Copyright: Copyright (c) 2008
 * Company: jadosoft
 *
 * @author WangYukun
 * @version 1.0
 */
public class CommonDAO { // 所有初始化工作在这里完成
							// logger

	private final Logger infoLogger = Logger.getLogger(CommonDAO.class);
	private Connection conn = null;
	private Statement st = null;
	private ResultSet rs = null;
	private PreparedStatement ps = null;

	/**
	 * construct
	 *
	 */
	public CommonDAO() throws SQLException {
		try {
			this.conn = ConnectionPool.getConnection();
			//this.conn.setAutoCommit(false);
			this.st = conn.createStatement();
		} catch (Exception e2) {
			infoLogger.error("初始化数据库连接异常： ", e2);
		}
	}
	/**
	 * 查出所需字段
	 *
	 *
	 * */
	/*public Map<String, Integer> getAtress(){
		Map<String, Integer> map = new HashMap<String, Integer>();
		String msg = null;
		StringBuffer str = null;
		String sql = "select LAT,ALT,CITY,COUNTY from k_lac order by COUNTY";
		try {
			PreparedStatement pps = conn.prepareStatement(sql);
			ResultSet rs = pps.executeQuery();
			while(rs.next()){
				String lat = rs.getString("LAT");
				String alt = rs.getString("ALT");
				String city = rs.getString("CITY");
				String county = rs.getString("COUNTY");
				int i = map.size()+1;
				String date = OtherUtil.getNowDate(new Date(),"HH:mm:ss");
				msg = lat+"|"+alt+"|"+city+"|"+county+"|"+date+" No."+i;
				map.put(msg,i);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return OtherUtil.sortByValue(map);
	}*/
/*	*//**
	 * 公路字段信息入库
	 * *//*
	public boolean addCountyRoad(String path){
		boolean flag =false;
		List<String> list = fu.readFileByLines(path, "utf-8");
		String time = OtherUtil.getNowDate(new Date(),"yyyyMMddHH");
		String sql = "insert into a_countyareacounts(city,county,counts,time) " +
				"values(?,?,?,?)";
		try {
			rf.getBaseTypeName();
			PreparedStatement ps = conn.prepareStatement(sql);
			int i = 0;
			for(String str:list){
				String[] filed = str.split(KEY_VALUE);
				String city = filed[0];
				String county = filed[1];
				String counts = filed[2];
				ps.setString(1,city);
				ps.setString(2,county);
				ps.setInt(3,Integer.parseInt(counts));
				ps.setString(4,time);
				ps.addBatch();
				i++;
				if(i==200){
					ps.executeBatch();
				}
			}
			System.out.println(i);
			ps.executeBatch();
			infoLogger.info("county添加成功");
			ParameterMetaData data = ps.getParameterMetaData();
			ps.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return flag;
	}
	public boolean addCityRoad(String path){
		boolean flag =false;
		List<String> list = fu.readFileByLines(path, "utf-8");
		String time = OtherUtil.getNowDate(new Date(),"yyyyMMddHH");
		String sql = "insert into a_cityareacounts(city,counts,time) " +
		"values(?,?,?)";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			int i = 0;
			for(String str:list){
				String[] filed = str.split(KEY_VALUE);
				String city = filed[0];
				String counts = filed[1];
				ps.setString(1,city);
				ps.setInt(2,Integer.parseInt(counts));
				ps.setString(3,time);
				ps.addBatch();
				i++;
				if(i==200){
					ps.executeBatch();
				}
			}
			ps.executeBatch();
			infoLogger.info("city添加成功");
			ps.close();
			conn.close();
		} catch (SQLException e) {
			System.err.println("入库失败");
			e.printStackTrace();
		}
		return flag;
	}
	public boolean addAreaRoad(Map<String, Integer> map){
		boolean flag =false;
		String time = OtherUtil.getNowDate(new Date(),"yyyyMMddHH");
		String sql = "insert into a_area_counts(area_name,counts,time) " +
				"values(?,?,?)";
		Set<String> keys = map.keySet();
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			int i = 0;
			for (String area : keys) {
				if(area.length()==0){
					continue;
				}
				Integer counts = map.get(area);
				ps.setString(1,area);
				ps.setInt(2,counts);
				ps.setString(3,time);
				ps.addBatch();
				i++;
				if(i==200){
					ps.executeBatch();
				}
			}
			for(String str:list){
				String[] filed = str.split(KEY_VALUE);
				String area = filed[0];
				String counts = filed[1];
				if(area.length()==0&&counts.length()==0){
					System.out.println(area+"|||"+counts);
				}
			}
			System.out.println(i);
			ps.executeBatch();
			infoLogger.info("area添加成功");
			ps.close();
		} catch (SQLException e) {
			System.out.println("sql错误： "+e.hashCode());
			e.printStackTrace();
		} finally{
		}
		return flag;
	}*/
	public boolean setCommitStat(boolean status) {
		boolean result = false;

		try {
			this.conn.setAutoCommit(status);
			result = true;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return result;
	}

	/**
	 * 回滚事务，数据库恢复到运行前的状态
	 *
	 * @return
	 */
	public boolean rollbackCommited() {
		boolean result = true;

		try {
			conn.rollback();
		} catch (SQLException e) {
			infoLogger.error("SQL rollback error:", e);
		} finally {
			try {
				if (ps != null) {
					ps.close();
				}
			} catch (Exception ex) {
				infoLogger.error(ex);
			}
		}

		try {
			conn.close();
		} catch (SQLException e1) {
			infoLogger.error(e1);
		}

		return result;
	}

	/**
	 * prepareStatement
	 *
	 * @param sql
	 * @return
	 */
	public PreparedStatement prepareStatement(String sql) {
		try {
			ps = conn.prepareStatement(sql);
		} catch (SQLException e) {
			infoLogger.error(e);
		}

		return ps;
	}

	/**
	 * commit
	 */
	public void commit() {
		try {
			conn.commit();
		} catch (SQLException e) {
			infoLogger.error(e);
		}
	}

	/**
	 * the method of query
	 *
	 * @param sql
	 * @return ResultSet
	 * @throws SQLException
	 */
	public ResultSet query(String sql) throws SQLException {
		rs = st.executeQuery(sql);

		return rs;
	}

	/**
	 * the method of execute
	 *
	 * @param sql
	 * @return result
	 * @throws SQLException
	 */
	public boolean execute(String sql) throws SQLException {
		int updateNum = st.executeUpdate(sql);
		boolean result = false;

		if (updateNum > 0) {
			result = true;
		}

		return result;
	}

	/**
	 * the method of executeUpdate
	 *
	 * @param sql
	 * @return result
	 * @throws SQLException
	 */
	public boolean executeUpdate(String sql) throws SQLException {
		boolean result = false;
		int count = st.executeUpdate(sql);

		if (count > 0) {
			result = true;
		}

		return result;
	}

	/**
	 * the method of destroy
	 */
	public void destroy() {
		try {
			; //
		} finally {
			try {
				if (rs != null) {
					rs.close();
					rs = null;
				}
			} catch (Exception e) {
				infoLogger.error(e);
			}
		}

		try {
			; //
		} finally {
			try {
				if (st != null) {
					st.close();
					st = null;
				}
			} catch (Exception e) {
				infoLogger.error(e);
			}
		}

		try {
			; //
		} finally {
			try {
				if (conn != null) {
					conn.close();
					conn = null;
				}
			} catch (Exception e) {
				infoLogger.error(e);
			}
		}
	}
}

```
