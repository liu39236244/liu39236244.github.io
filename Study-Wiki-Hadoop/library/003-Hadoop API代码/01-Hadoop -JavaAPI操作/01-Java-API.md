# 这里记录了java 操作hadoop 的代码记录

## java 操作 hdfs文件

### 总结java 操作hdfs 工具类


```Java

public static Configuration conf = new Configuration();
private static final String clusterID = "mycluster";
//    private static final String clusterID = "NUC-2:8020";

//单独使用需自行加载配置
static {
    conf.set("fs.defaultFS", "hdfs://" + clusterID);
    conf.set("dfs.nameservices", clusterID);
    conf.set("dfs.ha.namenodes." + clusterID, "nn1,nn2");
    // 设置 地址可以根据是否是本地设置
    conf.set("dfs.namenode.rpc-address." + clusterID + ".nn1", "ip:端口");
    conf.set("dfs.namenode.rpc-address." + clusterID + ".nn2", "ip:端口");
    conf.set("dfs.client.failover.proxy.provider." + clusterID, "org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider");
}

// 0. 判断文件是否存在

public static boolean exists(String path) throws Exception {
    FileSystem fs = FileSystem.get(conf);
    return fs.exists(new Path(path));
}

// 0.1 上传本地文件到集群
/**
 * 上传本地文件
 *
 * @param src 本地源路径
 * @param dst hdfs目标路径
 * @throws IOException
 */
public static void uploadFile(String src, String dst) throws IOException {
    FileSystem fs = FileSystem.newInstance(conf);
    Path srcPath = new Path(src); //原路径
    Path dstPath = new Path(dst); //目标路径
    //调用文件系统的文件复制函数,前面参数是指是否删除原文件，true为删除，默认为false
    fs.copyFromLocalFile(false, srcPath, dstPath);
}

// 0.2 重命名集群文件
/**
     * hadoop集群上文件重名名
     * 注意：参数均为全路径
     *
     * @param oldName 老文件名
     * @param newName 新文件名
     * @return 如果成功返回true否则返回false
     * @throws IOException
     */
    public static boolean rename(String oldName, String newName) throws IOException {
        FileSystem fs = FileSystem.get(conf);
        return fs.rename(new Path(oldName), new Path(newName));
    }

// 0.3 删除hdfs上的文件
/**
    * 删除hdfs上的文件
    *
    * @param filePath  文件全路径
    * @param recursive 是否递归
    * @return 如果成功返回true否则返回false
    * @throws IOException
    */
   public static boolean delete(String filePath, boolean recursive) throws IOException {
       FileSystem fs = FileSystem.get(conf);
       return fs.delete(new Path(filePath), recursive);
   }

// 0.4 创建文件夹
/**
     * hsfs创建文件夹
     *
     * @param path 文件夹路径
     * @return 如果成功返回true否则返回false
     * @throws IOException
     */
    public static boolean mkdir(String path) throws IOException {
        FileSystem fs = FileSystem.get(conf);
        return fs.mkdirs(new Path(path));
    }

// 0.5 下载到本地

/**
    * 下载文件到本地
    *
    * @param hdfsPath  hdfs全路径
    * @param localPath 本地全路径
    * @throws IOException
    */
   public static void downloadFile(String hdfsPath, String localPath) throws IOException {
       FileSystem fs = FileSystem.get(conf);
       Path srcPath = new Path(hdfsPath);
       FSDataInputStream in = fs.open(srcPath);
       OutputStream out = new FileOutputStream(localPath);
       IOUtils.copyBytes(in, out, 4096, true); //复制到标准输出流
   }

/**
* 文件的写入
*/
// 1. 写入List

    public static void writeList(String path, List<String> list) throws IOException {
        FileSystem fs = FileSystem.newInstance(URI.create(path), conf);
        FSDataOutputStream out = fs.create(new Path(path));
        for (String str : list) {
            out.write(str.getBytes("utf-8"));
            out.write("\n".getBytes("utf-8"));
        }
        out.flush();
        out.close();
    }


// 2. 追加写入

    /**
     * hdfs文件追加文件内容
     *
     * @param src 本地文件路径
     * @param dst 追加到的文件路径
     * @throws IOException
     */
    public static void appendLocalFile(String src, String dst) throws IOException {
        FileSystem fs = FileSystem.newInstance(conf);
        InputStream in = new BufferedInputStream(new FileInputStream(src));
        FSDataOutputStream out = fs.append(new Path(dst));
        IOUtils.copyBytes(in, out, 4096, true); // true代表是否关闭 输入输出源在结束的时候
    }

// 3. 写入tuple2类型数据

/**
 * writeMap<String, Object>
 *
 * @param fileName
 * @param results
 * @param charsetName
 * @return
 */
public boolean writerddList(String remotepath,String fileName, List<Tuple2<String, String>> results, String charsetName) {
  boolean flag = false;
  FileSystem fs = null;
  OutputStream os = null;
  BufferedWriter bw = null;
  OutputStreamWriter osWeiter = null;
  try {
    String target = remotepath + fileName.substring(0, fileName.length()-4) + ".tmp";
    logger.warn("target " + target);

    Configuration config = new Configuration();
    fs = FileSystem.newInstance(URI.create(target), config);
    os = fs.create(new Path(target)); //打开创建目标文件

    osWeiter = new OutputStreamWriter(os, charsetName);
    bw = new BufferedWriter(osWeiter);
    int num = 0;

    for (Tuple2<String, String> tuple2: results) {
      String line = tuple2._1+"|"+tuple2._2 + "\n";
      bw.write(line);
      num++;
      if (num >= 500) {
        bw.flush();
        num = 0;
      }
    }
    bw.flush();

    flag = true;
  } catch (Exception e) {
    logger.error("", e);
  } finally {
    if (bw != null) {
      try {
        bw.close();
        bw = null;
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    if (osWeiter != null) {
      try {
        osWeiter.close();
        osWeiter = null;
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    if (os != null) {
      try {
        os.close();
        os = null;
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    if (fs != null) {
      try {
        fs.close();
        fs = null;
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }
  return flag;
}

// 4. 追加List到hdfs上面
    public static void appendWriteList(String path, List<String> list) throws IOException {
        FileSystem fs = FileSystem.newInstance(URI.create(path), conf);
        FSDataOutputStream out = fs.append(new Path(path));
        for (String str : list) {
            out.write(str.getBytes("utf-8"));
            out.writeUTF("\n");
        }
        out.flush();
        out.close();
    }


```


### 代码javaUtils 工具类

```Java
package cn.netcommander.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.io.IOUtils;

import scala.Tuple2;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

/**
 *
 */
public class HDFSUtils implements Serializable{
	private final static Log logger = LogFactory.getLog(HDFSUtils.class);
    public static Configuration conf = new Configuration();
    private static final String clusterID = "mycluster";
//    private static final String clusterID = "NUC-2:8020";

    //单独使用需自行加载配置
    static {
        conf.set("fs.defaultFS", "hdfs://" + clusterID);
        conf.set("dfs.nameservices", clusterID);
        conf.set("dfs.ha.namenodes." + clusterID, "nn1,nn2");
        // 设置 地址可以根据是否是本地设置
        conf.set("dfs.namenode.rpc-address." + clusterID + ".nn1", "ip:端口");
        conf.set("dfs.namenode.rpc-address." + clusterID + ".nn2", "ip:端口");
        conf.set("dfs.client.failover.proxy.provider." + clusterID, "org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider");
    }

    /**
     * hdfs文件追加文件内容
     *
     * @param src 本地文件路径
     * @param dst 追加到的文件路径
     * @throws IOException
     */
    public static void appendLocalFile(String src, String dst) throws IOException {
        FileSystem fs = FileSystem.newInstance(conf);
        InputStream in = new BufferedInputStream(new FileInputStream(src));
        FSDataOutputStream out = fs.append(new Path(dst));
        IOUtils.copyBytes(in, out, 4096, true);
    }


    public static void main(String[] args) {
    	List<String> list= new ArrayList<String>();
    	list.add("1");
    	list.add("1");
    	list.add("1");
    	list.add("1");
    	try {
			writeList("hdfs://ras224/opt/TRAS/yujing/YD_1513045445394",list);
		} catch (IOException e) {
			e.printStackTrace();
		}
    }

    public static void writeList(String path, List<String> list) throws IOException {
        FileSystem fs = FileSystem.newInstance(URI.create(path), conf);
        FSDataOutputStream out = fs.create(new Path(path));
        for (String str : list) {
            out.write(str.getBytes("utf-8"));
            out.write("\n".getBytes("utf-8"));
        }
        out.flush();
        out.close();
    }

    /**
	 * writeMap<String, Object>
	 *
	 * @param fileName
	 * @param results
	 * @param charsetName
	 * @return
	 */
	public boolean writerddList(String remotepath,String fileName, List<Tuple2<String, String>> results, String charsetName) {
		boolean flag = false;
		FileSystem fs = null;
		OutputStream os = null;
		BufferedWriter bw = null;
		OutputStreamWriter osWeiter = null;
		try {
			String target = remotepath + fileName.substring(0, fileName.length()-4) + ".tmp";
			logger.warn("target " + target);

			Configuration config = new Configuration();
			fs = FileSystem.newInstance(URI.create(target), config);
			os = fs.create(new Path(target)); //打开创建目标文件

			osWeiter = new OutputStreamWriter(os, charsetName);
			bw = new BufferedWriter(osWeiter);
			int num = 0;

			for (Tuple2<String, String> tuple2: results) {
				String line = tuple2._1+"|"+tuple2._2 + "\n";
				bw.write(line);
				num++;
				if (num >= 500) {
					bw.flush();
					num = 0;
				}
			}
			bw.flush();

			flag = true;
		} catch (Exception e) {
			logger.error("", e);
		} finally {
			if (bw != null) {
				try {
					bw.close();
					bw = null;
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (osWeiter != null) {
				try {
					osWeiter.close();
					osWeiter = null;
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (os != null) {
				try {
					os.close();
					os = null;
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			if (fs != null) {
				try {
					fs.close();
					fs = null;
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return flag;
	}

    public static void appendWriteList(String path, List<String> list) throws IOException {
        FileSystem fs = FileSystem.newInstance(URI.create(path), conf);
        FSDataOutputStream out = fs.append(new Path(path));
        for (String str : list) {
            out.write(str.getBytes("utf-8"));
            out.writeUTF("\n");
        }
        out.flush();
        out.close();
    }

    /**
     * 查看HDFS文件是否存在
     *
     * @param path 文件路径
     * @return 是否存在
     * @throws Exception
     */
    public static boolean exists(String path) throws Exception {
        FileSystem fs = FileSystem.get(conf);
        return fs.exists(new Path(path));
    }

    /**
     * 上传本地文件
     *
     * @param src 本地源路径
     * @param dst hdfs目标路径
     * @throws IOException
     */
    public static void uploadFile(String src, String dst) throws IOException {
        FileSystem fs = FileSystem.newInstance(conf);
        Path srcPath = new Path(src); //原路径
        Path dstPath = new Path(dst); //目标路径
        //调用文件系统的文件复制函数,前面参数是指是否删除原文件，true为删除，默认为false
        fs.copyFromLocalFile(false, srcPath, dstPath);
    }

    /**
     * hadoop集群上文件重名名
     * 注意：参数均为全路径
     *
     * @param oldName 老文件名
     * @param newName 新文件名
     * @return 如果成功返回true否则返回false
     * @throws IOException
     */
    public static boolean rename(String oldName, String newName) throws IOException {
        FileSystem fs = FileSystem.get(conf);
        return fs.rename(new Path(oldName), new Path(newName));
    }

    /**
     * 删除hdfs上的文件
     *
     * @param filePath  文件全路径
     * @param recursive 是否递归
     * @return 如果成功返回true否则返回false
     * @throws IOException
     */
    public static boolean delete(String filePath, boolean recursive) throws IOException {
        FileSystem fs = FileSystem.get(conf);
        return fs.delete(new Path(filePath), recursive);
    }

    /**
     * hsfs创建文件夹
     *
     * @param path 文件夹路径
     * @return 如果成功返回true否则返回false
     * @throws IOException
     */
    public static boolean mkdir(String path) throws IOException {
        FileSystem fs = FileSystem.get(conf);
        return fs.mkdirs(new Path(path));
    }

    /**
     * 下载文件到本地
     *
     * @param hdfsPath  hdfs全路径
     * @param localPath 本地全路径
     * @throws IOException
     */
    public static void downloadFile(String hdfsPath, String localPath) throws IOException {
        FileSystem fs = FileSystem.get(conf);
        Path srcPath = new Path(hdfsPath);
        FSDataInputStream in = fs.open(srcPath);
        OutputStream out = new FileOutputStream(localPath);
        IOUtils.copyBytes(in, out, 4096, true); //复制到标准输出流
    }
}

```
### 操作本地写入

```Java
public static boolean writeJavaList(String path, List<String> results, String charsetName) {
        boolean flag = false;
        FileSystem fs = null;
        OutputStream os = null;
        BufferedWriter bw = null;
        OutputStreamWriter osWeiter = null;
        try {
            String target = path.substring(0, path.indexOf(".")) + ".tmp";
            logger.warn("target " + target);

            conf = new Configuration();
            fs = FileSystem.newInstance(URI.create(target), conf);
            os = fs.create(new Path(target)); //打开创建目标文件

            osWeiter = new OutputStreamWriter(os, charsetName);
            bw = new BufferedWriter(osWeiter);
            int num = 0;

            for (String list : results) {
                String line = list + "\n";
                bw.write(line);
                num++;
                if (num >= 500) {
                    bw.flush();
                    num = 0;
                }
            }
            bw.flush();

            flag = true;
        } catch (Exception e) {
            logger.error("", e);
        } finally {
            if (bw != null) {
                try {
                    bw.close();
                    bw = null;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (osWeiter != null) {
                try {
                    osWeiter.close();
                    osWeiter = null;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (os != null) {
                try {
                    os.close();
                    os = null;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            if (fs != null) {
                try {
                    fs.close();
                    fs = null;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return flag;
    }
```
### 总结java 操作xml

```Java
package cn.netcommander.utils;

import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.util.Date;
import java.util.List;

public class XmlUtils {

    public static void main(String[] args) {

    }


    public static void updateElementValue(String path, List<String> list) {

        File xmlFile = new File(path);
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder;
        try {
            dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(xmlFile);
            doc.getDocumentElement().normalize();
            for (String str : list) {
                String[] s = str.split("\\|", -1);
                String key = s[0], value = s[1];
                NodeList nodes = doc.getElementsByTagName(key);
                //在队列中选择要修改的节点
                Node n = nodes.item(0);
                //修改该节点的文本
                n.setTextContent(value);
            }
            //创建一个用来转换DOM对象的工厂对象  
            TransformerFactory factory = TransformerFactory.newInstance();
            //获得转换器对象  
            Transformer t = factory.newTransformer();
            //定义要转换的源对象  
            DOMSource xml = new DOMSource(doc);
            //定义要转换到的目标文件  
            StreamResult s = new StreamResult(new File(path));
            //开始转换  
            t.transform(xml, s);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /*
    *
    * java代码中调用linux脚本
    * XmlUtils.executeLinuxCmd("bash /root/script/ftp_put_YuJing.sh")
    * */
    public String executeLinuxCmd(String cmd) {
        System.out.println(new Date()+"got cmd job : " + cmd);
        Runtime run = Runtime.getRuntime();
        try {
            Process process = run.exec(cmd);
            InputStream in = process.getInputStream();
            BufferedReader bs = new BufferedReader(new InputStreamReader(in));
            // System.out.println("[check] now size \n"+bs.readLine());
            String result = null;
            while (in.read() != -1) {
                result = bs.readLine();
                System.out.println("job result [" + result + "]");
            }
            in.close();
            // process.waitFor();
            process.destroy();
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * xml格式化工具
     *
     * @param str
     * @return
     * @throws Exception
     */
    public static String format(String str) throws Exception {
        SAXReader reader = new SAXReader();

        // System.out.println(reader);
        // 注释：创建一个串的字符输入流
        StringReader in = new StringReader(str);
        org.dom4j.Document doc = reader.read(in);

        // System.out.println(doc.getRootElement());
        // 注释：创建输出格式
        OutputFormat formater = OutputFormat.createPrettyPrint();
        //formater=OutputFormat.createCompactFormat();
        // 注释：设置xml的输出编码
        formater.setEncoding("utf-8");
        // 注释：创建输出(目标)
        StringWriter out = new StringWriter();
        // 注释：创建输出流
        XMLWriter writer = new XMLWriter(out, formater);
        // 注释：输出格式化的串到目标中，执行后。格式化后的串保存在out中。
        writer.write(doc);

        writer.close();
        // 注释：返回我们格式化后的结果
        return out.toString();
    }
}

```
