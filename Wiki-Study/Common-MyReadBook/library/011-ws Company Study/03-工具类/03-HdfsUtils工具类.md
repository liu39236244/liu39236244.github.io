# hdfs 工具类总结

# HDFSUtils.java 工具类

## 工具类 获取HDFSFileSystem文件系统对象,包括集群namenode 的配置

```Java
Configuration conf = new Configuration();
			 String clusterID = "mycluster";
			 conf.set("fs.defaultFS", "hdfs://" + clusterID);
			 conf.set("dfs.nameservices", clusterID);
			 conf.set("dfs.ha.namenodes." + clusterID, "nn1,nn2");
			 conf.set("dfs.namenode.rpc-address." + clusterID + ".nn1", "ip.20.60:8020");
			 conf.set("dfs.namenode.rpc-address." + clusterID + ".nn2", "ip.20.61:8020");
			 conf.set("dfs.client.failover.proxy.provider." + clusterID, "org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider"); //  配置这个主要还是能够让hdfs 失败自动切换
			 HDFSUtils.init(conf);
			 FileSystem fs = HDFSUtils.getFs();
			 HDFSUtils.setFs(fs);

```

## 工具类——2
```Java
package cn.netcommander.kpiengine.util;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Serializable;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hdfs.DistributedFileSystem;
import org.apache.log4j.Logger;

import cn.netcommander.kpiengine.config.Config;
import scala.Tuple2;


public class HDFSUtil implements Serializable{

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	public static Logger logger=Logger.getLogger(HDFSUtil.class);
	public static String uri=Config.hdfdurl;

	public static FileSystem getFileSystem(Configuration conf, String ip, int port, String srcFilePath) {
		FileSystem fs = null;

		try {
			if (conf == null) {
				conf = new Configuration();
			}

			fs = DistributedFileSystem.get(URI.create(srcFilePath), conf);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return fs;
	}

	public static FileSystem getFileSystem(String ip, int port, String srcFilePath) {
		return getFileSystem(null, ip, port, srcFilePath);
	}

	public static FileSystem getFileSystem(String ip, String srcFilePath) {
		return getFileSystem(null, ip, 9160, srcFilePath);
	}

	/**
	 * @Title: listAll  
	 * @Description: 列出目录下所有文件  
	 * @return void    返回类型  
	 * @throws
	 */  
	public static List<String> listAll(String dir) throws IOException  
	{  
		List<String> filelist=new ArrayList<String>();
		Configuration conf = new Configuration();  
		conf.set("fs.default.name",Config.hdfdurl);

		FileSystem fs = FileSystem.get(conf);  
		FileStatus[] stats = fs.listStatus(new Path(dir));  
		for(int i = 0; i < stats.length; ++i){  
			if (!stats[i].isDir()){  

				filelist.add(stats[i].getPath().toString());
				// regular file  
				//				System.out.println(stats[i].getPath().toString());  
			}else{  
				// dir  
				System.out.println(stats[i].getPath().toString());  
			}  
			//           else if(stats[i].())  
			//           {  
			//               // is s symlink in linux  
			//               System.out.println(stats[i].getPath().toString());  
			//           }  

		}  
		fs.close();
		return filelist;
	}  

	/**
	 * 删除指定文件
	 * @param file
	 */
	public static void deleteFile(String file)  {  
		Configuration conf = new Configuration();  
		conf.set("fs.default.name",Config.hdfdurl);

		FileSystem fs;  
		try {  
			fs= FileSystem.get(conf);  

			Path path = new Path(file);  
			if (!fs.exists(path)) {  
				logger.info("File " + file + " does not exists");  
				return;  
			}  
			/*
			 * recursively delete the file(s) if it is adirectory.
			 * If you want to mark the path that will bedeleted as
			 * a result of closing the FileSystem.
			 *  deleteOnExit(Path f)
			 */  
			fs.delete(new Path(file), true);  
			fs.close();  
		}catch (IOException e) {  
			logger.error("deleteFile Exception caught! :" , e);  
			new RuntimeException(e);  
		}  

	}  


	/**
	 * writeMap<String, Object>
	 *
	 * @param fileName
	 * @param lineList
	 * @param charsetName
	 * @return
	 */
	public boolean writeList(String remotepath,String fileName, List<Tuple2<String, String>> results, String charsetName) {
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
				String line = tuple2._1+"|"+tuple2._2 + SpliterFlag.NEWLINEFLAG;
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

	/**
	 * writeMap<String, Object>
	 *
	 * @param fileName
	 * @param lineList
	 * @param charsetName
	 * @return
	 */
	public boolean writeMap(String remotepath,String fileName, Map<String, Object> map, String charsetName) {
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
			for(Entry<String,Object> entry :map.entrySet()){
				String line = entry.getKey()+"|"+entry.getValue() + SpliterFlag.NEWLINEFLAG;
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

	public boolean writeList(String remotepath,String fileName, Map<String, Object> map, String charsetName) {
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
			for(Entry<String,Object> entry :map.entrySet()){
				String line = entry.getKey()+"|"+entry.getValue() + SpliterFlag.NEWLINEFLAG;
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
	/**
	 *
	 * @param remotepath
	 * @param fileName
	 * @param results
	 * @param charsetName
	 * @return
	 */
	public boolean writeJavaList(String path, List<String> results, String charsetName) {
		boolean flag = false;
		FileSystem fs = null;
		OutputStream os = null;
		BufferedWriter bw = null;
		OutputStreamWriter osWeiter = null;
		try {
			String target = path.substring(0,path.indexOf(".")) + ".tmp";
			logger.warn("target " + target);

			Configuration config = new Configuration();
			fs = FileSystem.newInstance(URI.create(target), config);
			os = fs.create(new Path(target)); //打开创建目标文件

			osWeiter = new OutputStreamWriter(os, charsetName);
			bw = new BufferedWriter(osWeiter);
			int num = 0;

			for (String list: results) {
				String line = list + SpliterFlag.NEWLINEFLAG;
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


	public <K, V extends Comparable<? super V>> Map<K, V> writeLineMap(String remotepath,String fileName, Map<K, V> daySpeedMap, String charsetName) {
		FileSystem fs = null;
		OutputStream os = null;
		BufferedWriter bw = null;
		OutputStreamWriter osWeiter = null;
		try {
			String target = remotepath+fileName+ ".tmp";

			logger.warn("target " + target);

			Configuration config = new Configuration();
			fs = FileSystem.newInstance(URI.create(target), config);
			os = fs.create(new Path(target)); //打开创建目标文件

			osWeiter = new OutputStreamWriter(os, charsetName);
			bw = new BufferedWriter(osWeiter);
			int num = 0;
			for (K line : ((Map<K, V>) daySpeedMap).keySet()) {
				bw.write(line+"|"+((Configuration) daySpeedMap).get((String) line)+"\n");
				num++;
				if (num >= 500) {
					bw.flush();
					num = 0;
				}
			}
			bw.flush();
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
		return daySpeedMap;
	}

	public static boolean mkdir(String dir) throws IOException {  
        if (StringUtils.isBlank(dir)) {  
            return false;  
        }  
        dir = uri + dir;  
        Configuration conf = new Configuration();  
        FileSystem fs = FileSystem.get(URI.create(dir), conf);  
        if (!fs.exists(new Path(dir))) {  
            fs.mkdirs(new Path(dir));  
        }  

        fs.close();  
        return true;  
    }  

	public boolean rename(String remotepath,String fileName){
		boolean flag = false;
		FileSystem fs = null;
		try {

			String target = remotepath + fileName.substring(0, fileName.length()-4) + ".tmp";
		    String successtarget = remotepath + fileName;

		    Configuration config = new Configuration();
		    fs = FileSystem.newInstance(URI.create(target), config);

			logger.warn("rename " + target + " to " + successtarget);
			fs.rename(new Path(target), new Path(successtarget));

			flag = true;
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
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


	public static void main(String[] args) throws IOException {
//		List<String> filelist=listAll("D:/test/103/");
//		for (String path : filelist) {
//			System.out.println(path);
//		}
				String file="D:/test/103/103_201512151333_02_00_100.csv";
				deleteFile(file);
	}
}


```
