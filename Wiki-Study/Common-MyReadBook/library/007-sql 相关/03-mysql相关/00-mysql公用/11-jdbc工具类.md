# jdbc工具类


```java
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.mysql.jdbc.PreparedStatement;
/**
 * 
 * 类名: JdbcUtils
 * 包名：  com.hospital.test.utils
 * 作者：  Zhangyf
 * 时间：  2019年3月7日 下午5:15:00
 * 描述: TODO(请在此处详细描述类)
 * @since 1.0.0
 *
 * 修改历史 :
 * 1. [2019年3月7日]新建类 by Zhangyf
 *
 * @param <T>
 */
public abstract class JdbcUtils<T> {
    private String jdbcUrl;
    
    private String user;

    private String password;

    public String getJdbcUrl() {
        return jdbcUrl;
    }
   /**
    * 数据库链接地址
    *
    * 参数: @param jdbcUrl
    * 返回类型： void
    * @exception
    * @since  1.0.0
    */
    public void setJdbcUrl(String jdbcUrl) {
        this.jdbcUrl = jdbcUrl;
    }

    public String getUser() {
        return user;
    }
    /**
     * 
     * 数据库连接用户名
     *
     * 参数: @param user
     * 返回类型： void
     * @exception
     * @since  1.0.0
     */
    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }
    /**
     * 
     * 数据库连接密码
     *
     * 参数: @param password
     * 返回类型： void
     * @exception
     * @since  1.0.0
     */
    public void setPassword(String password) {
        this.password = password;
    }

    static {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError();
        }
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(jdbcUrl, user, password);
    }

    public static void free(Connection conn, Statement stmt, ResultSet rs) {
        try {
            if (rs != null) rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (stmt != null) stmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                if (conn != null) try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }

    }

    /**
     * 通过反射的方式给对象赋值
     */
    public static Object setValByJavaName(String javaName, Object value, Object obj) {
        @SuppressWarnings("rawtypes")
        Class c = obj.getClass();
        try {
            Field f = c.getDeclaredField(javaName);
            // 取消语言访问检查
            f.setAccessible(true);
            //给变量赋值
            f.set(obj, value);
        } catch (NoSuchFieldException e) {
            System.out.println("没有对应字段");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return obj;
    }

    public static byte[] toByteArray(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int n = 0;
        while (-1 != (n = input.read(buffer))) {
            output.write(buffer, 0, n);
        }
        output.close();
        return output.toByteArray();
    }
    
    /**
     * 根据类型来进行转换
     * @throws IOException 
     */
    private static Object changValueType(ResultSet rs, String t, int i) throws SQLException, IOException {
        switch (t) {
            case "java.math.BigInteger":
                return rs.getLong(rs.getMetaData().getColumnName(i));
            case "java.sql.Date":
                return rs.getDate(rs.getMetaData().getColumnName(i));
            case "java.sql.Timestamp":
                return rs.getTimestamp(rs.getMetaData().getColumnName(i));
            case "java.lang.Integer":
                if ("TINYINT".equals(rs.getMetaData().getColumnTypeName(i))) {
                    return (byte) rs.getInt(rs.getMetaData().getColumnName(i));
                }else if("SMALLINT".equals(rs.getMetaData().getColumnTypeName(i))){
                    return (short) rs.getInt(rs.getMetaData().getColumnName(i));
                }
                return rs.getInt(rs.getMetaData().getColumnName(i));
            case "java.lang.Boolean":
                return rs.getBoolean(rs.getMetaData().getColumnName(i));
            case "java.lang.Float":
                return rs.getFloat(rs.getMetaData().getColumnName(i));
            case "java.math.BigDecimal":
                return rs.getBigDecimal(rs.getMetaData().getColumnName(i));
            case "java.lang.Double":
                return rs.getDouble(rs.getMetaData().getColumnName(i));
            case "java.lang.Short":
                return rs.getShort(rs.getMetaData().getColumnName(i));
            case "java.sql.Time":
                return rs.getTime(rs.getMetaData().getColumnName(i));
            case "java.sql.Byte":
                return rs.getByte(rs.getMetaData().getColumnName(i));
            case "[B":
                if("BINARY".equals(rs.getMetaData().getColumnTypeName(i))){
                    byte b = rs.getByte(rs.getMetaData().getColumnName(i));
                    return new byte[]{b};
                }else if("VARBINARY".equals(rs.getMetaData().getColumnTypeName(i))){
                    byte b = rs.getByte(rs.getMetaData().getColumnName(i));
                    return new byte[]{b};
                }else if("BLOB".equals(rs.getMetaData().getColumnTypeName(i))){
                    Blob picture = rs.getBlob(i);//得到Blob对象
                    //开始读入文件
                    InputStream in = picture.getBinaryStream();
                    ByteArrayOutputStream output = new ByteArrayOutputStream();
                    byte[] buffer = new byte[1024];
                    int len = 0;
                    while((len = in.read(buffer)) != -1){
                        output.write(buffer, 0, len);
                    }
                    output.close();
                    return output.toByteArray();
                }
                return rs.getString(rs.getMetaData().getColumnName(i));
            default:
                return rs.getString(rs.getMetaData().getColumnName(i));
        }
    }

    /*@SuppressWarnings("rawtypes")
    protected abstract Class getEntityClassType();*/
    /**
     * 
     * 功能: 查询单条数据
     * 描述: 该方法只适合单条数据查询 
     *
     * 参数: @param sql
     * 参数: @return
     * 参数: @throws SQLException
     * 参数: @throws InstantiationException
     * 参数: @throws IllegalAccessException
     * 参数: @throws IOException
     * 返回类型： T
     * @exception
     * @since  1.0.0
     */
    @SuppressWarnings("unchecked")
    public T query(String sql) throws SQLException, InstantiationException, IllegalAccessException, IOException {
        Class<T> entityClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        T t = entityClass.newInstance();
        Connection conn = this.getConnection();
        PreparedStatement p;
        p = (PreparedStatement) conn.prepareStatement(sql);
        ResultSet rs = p.executeQuery();
        int col = rs.getMetaData().getColumnCount();
        while (rs.next()) {
            for (int i = 1; i < col+1; i++) {
                //System.out.println("name: "+rs.getMetaData().getColumnName(i) + "  java-type: " + rs.getMetaData().getColumnClassName(i)+"  column-type: "+rs.getMetaData().getColumnTypeName(i));
                t = (T) setValByJavaName(rs.getMetaData().getColumnName(i), changValueType(rs, rs.getMetaData().getColumnClassName(i), i), t);
            }
        }
        p.close();
        conn.close();
        return t;
    }
    /**
     * 
     * 功能: 批量查询方法
     * 描述: 该方法可进行批量查询操作 
     *
     * 参数: @param sql
     * 参数: @return
     * 参数: @throws SQLException
     * 参数: @throws InstantiationException
     * 参数: @throws IllegalAccessException
     * 参数: @throws IOException
     * 返回类型： List<T>
     * @exception
     * @since  1.0.0
     */
    @SuppressWarnings("unchecked")
    public List<T> queryList(String sql) throws SQLException, InstantiationException, IllegalAccessException, IOException {
        Class<T> entityClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        T t = entityClass.newInstance();
        List<T> list=new ArrayList<>();
        Connection conn = this.getConnection();
        PreparedStatement p;
        p = (PreparedStatement) conn.prepareStatement(sql);
        ResultSet rs = p.executeQuery();
        int col = rs.getMetaData().getColumnCount();
        while (rs.next()) {
            for (int i = 1; i < col; i++) {
                //System.out.println("name: "+rs.getMetaData().getColumnName(i) + "  java-type: " + rs.getMetaData().getColumnClassName(i)+"  column-type: "+rs.getMetaData().getColumnTypeName(i));
                t = (T) setValByJavaName(rs.getMetaData().getColumnName(i), changValueType(rs, rs.getMetaData().getColumnClassName(i), i), t);
            }
            list.add(t);
        }
        p.close();
        conn.close();
        return list;
    }
    
    /**
     * 
     * 功能: 新增或修改
     * 描述: update和insert通用 
     *
     * 参数: @param sql
     * 参数: @return
     * 参数: @throws SQLException
     * 返回类型： int
     * @exception
     * @since  1.0.0
     */
    public int insert(String sql) throws SQLException{
        Connection conn = this.getConnection();
        PreparedStatement p;
        p = (PreparedStatement) conn.prepareStatement(sql);
        int rs = p.executeUpdate(sql);
        p.close();
        conn.close();
        return rs;
    }
    
}
```



```java
public class Test {
    public static void main(String[] args) {
        JdbcUtils<PHONE> t = new JdbcUtils<PHONE>() {
        };
        t.setJdbcUrl("jdbc:mysql:///epay?characterEncoding=UTF-8");
        t.setUser("root");
        t.setPassword("123");
        //query(t);
        //insert(t);
        update(t);
    }

    private static <T> void query(JdbcUtils<T> t) {
        String sql = "SELECT * FROM phone WHERE id=1";
        try {
            T user = t.query(sql);
            System.out.println(user);
            /*List<T> userList = t.queryList(sql);
            System.out.println(userList);*/
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static <T> void insert(JdbcUtils<T> t) {
        String sql = "INSERT into phone (`name`,`age`,`add`,`time`,`date`,`gmt`,`iphone`,`vivo`,`oppo`,`huawei`,`xiaomi`,`xiaodong`,`xiaoxi`,`xiaohu`,`xiaoqi`)"
                + " values('宇翊','21','23',now(),now(),now(),1,2,3,4,5,6,7,8,9)";
        try {
            int user = t.insert(sql);
            System.out.println(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private static <T> void update(JdbcUtils<T> t) {
        String sql = "update phone set name='予以I' where id=2 ";
        try {
            int user = t.insert(sql);
            System.out.println(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
