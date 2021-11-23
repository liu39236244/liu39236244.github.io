# java程序备份sqlserver数据库

## 参考

https://blog.csdn.net/pjh163_2010/article/details/7713266


* 暂时未测试


```java
import java.io.*;
import java.text.SimpleDateFormat;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.*;
//---------------------------------
// java mssql数据库的备份与还原
//---------------------------------
public class SqlBak extends javax.servlet.http.HttpServlet implements javax.servlet.Servlet
{
    static final long serialVersionUID = 1L;
    public SqlBak() {super();} 
    //----------------------------------
    // POST请求
    //----------------------------------
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        doGet(request,response);
    }
    //----------------------------------
    // Get请求
    //----------------------------------
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        Connection conn = null;
        try
        {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver").newInstance();
            String url="jdbc:sqlserver://localhost:1433;databaseName=db_test;user=sa;password=123";
            conn= DriverManager.getConnection(url);
            //----------------------
            // 数据库备份
            // 参数:
            //     存盘路径
            //     要备份的数据库名称
            //     数据库连接对象
            //     返回结果:备份名称
            //----------------------
            //String bkname = bkData("C:\\", "db_test", conn);
            //response.getWriter().print("back name:"+bkname);//输出备份的名称
            //----------------------
            // 数据库还原  
            // 参数:
            //     备份文件存盘路径
            //     备份文件名称
            //     要还原的数据库名称
            //     数据库连接对象
            //     返回结果:true | false
            //----------------------
            //boolean result = hfData("C:\\","20091118104911.bak","db_test",conn);
            //response.getWriter().print("result:"+result);
        }
        //异常
        catch(Exception e)
        {
            e.printStackTrace();
        }
        //释放连接
        finally
        {
            try{conn.close();}catch(Exception e){}
        }
    }  
    //----------------------------------
    // 数据库备份
    // 参数:
    //     存盘路径
    //     要备份的数据库名称
    //     数据库连接对象
    //----------------------------------
    public static String  bkData(String path,String db_name,Connection conn)
    {
        String bk_name = ""; //要返回的备份名称
        //盘名是否正确
        if(path.lastIndexOf("\\") == -1) path += "\\";
        //------------------------
        // 与数据库进行操作
        //------------------------
        PreparedStatement stmt = null;
        String sql = "";
        try
        {
            String file = new SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date())+".bak";
            sql = "backup database "+db_name+" to disk='"+path+file+"' with format,name='full backup of "+db_name+"'";
            stmt = conn.prepareStatement(sql);
            stmt.executeUpdate();
            bk_name = file; //返回的文件名
        }
        //异常
        catch(Exception e)
        {
            e.printStackTrace();
        }
        //状态集释放
        finally
        {
            try{stmt.close();} catch(Exception e){}
        }
        //返回
        return bk_name;
    }
    //----------------------------------
    // 数据库恢复
    // 参数:
    //     备份文件存盘路径
    //     备份文件名称
    //     要还原的数据库名称
    //     数据库连接对象
    //----------------------------------
    public static boolean hfData(String path,String bk_name,String db_name,Connection conn)
    {
        boolean result = false; //要返回的备份名称
        //盘名是否正确
        if(path.lastIndexOf("\\") == -1) path += "\\";
        //------------------------
        // 与数据库进行操作
        //------------------------
        PreparedStatement stmt = null;
        String sql = "";
        try
        {
            sql = "alter database "+db_name+" set offline with rollback immediate;";
            sql += "restore database  "+db_name+"  from disk='" + path+bk_name + "'";
            sql += "with replace "; //解决备尚未备份数据库 数据库 的日志尾部
            sql += "alter database  "+db_name+"  set onLine with rollback immediate;";
            stmt = conn.prepareStatement(sql);
            stmt.executeUpdate();
            result = true;
        }
        //有异常
        catch(Exception e)
        {
            e.printStackTrace();
        }
        //数据库操作释放
        finally
        {
            try{stmt.close();} catch(Exception e){}
        }
        //返回
        return result;
    }           
}
```