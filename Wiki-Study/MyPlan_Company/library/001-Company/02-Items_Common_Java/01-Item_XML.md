# 记录XML 解析

# 解析xml 的方式

##  xml 集中方式 1

```Java
import org.apache.commons.configuration.XMLConfiguration;
public static void parseXML(String filename) {
  XMLConfiguration parser = new XMLConfiguration();
  			if (filename == null) {
  				filename = XML_PATH;
  			}
  			parser.setFile(new File(filename));
  			parser.load();
  			String value = parser.getString("节点.节点.节点");
      }
```


# xmlUtils 的总结

## xmlUtils_1

```Java
package cn.netcommander.ptt.util;

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
import java.util.List;

public class XmlUtils {

    public static void main(String[] args) {

    }


    public static void updateElementValue(String path,List<String> list) {

        File xmlFile = new File(path);
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder;
        try {
			dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(xmlFile);
            doc.getDocumentElement().normalize();
            for (String str : list) {
				String[] s = str.split("\\|",-1);
				String key=s[0],value=s[1];
				NodeList nodes  = doc.getElementsByTagName(key);
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

    public String executeLinuxCmd(String cmd) {
        System.out.println("got cmd job : " + cmd);
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

}

```
