# java 中调用python并获取输入输出值


## 调用总结

>java 执行 python脚本


## 博主总结：

* https://www.cnblogs.com/zhigu/p/10935182.html
* https://blog.csdn.net/QQ994406030/article/details/78868461


### 我的使用

> 命令行方式调用

```python


```


```java
static void runpython_2(String path, String inputParam, String outputFileName) {
        if (path == "" || path == null) {
            path = "D:\\shenyabo-work\\MyProject_workspace\\mypythonProject\\test1\\demo1.py ";
        }
        try {
            Process proc = Runtime.getRuntime().exec("python " + path + " " + inputParam + " " + outputFileName);
            proc.waitFor();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
```


```java
public static String exePythonInOneOutOneString_3(String pythonPath, String Imagepath, String outputImagePath, String resultStrFile) {

        // 这里就是判断输入参数是否为空
        if (StringUtil.isEmptyForImport(pythonPath) || StringUtil.isEmptyForImport(Imagepath) || StringUtil.isEmptyForImport(outputImagePath)) {
            return "";
        }
        Process proc = null;
        String result = null;
        try {
            proc = Runtime.getRuntime().exec("python " + pythonPath + " " + Imagepath + " " + outputImagePath);
            InputStreamReader isr = new InputStreamReader(proc.getInputStream());
            BufferedReader br = new BufferedReader(isr);
            String line = null;
            StringBuilder stringBuilder=new StringBuilder();
            while ((line = br.readLine()) != null) {
                stringBuilder.append(line).append("=");
            }
            result = stringBuilder.toString();

            proc.waitFor();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 执行完之后 ，读取对应文件，下面是 python脚本中 写入文件 中数据 ，这里可以获取python脚本写入的数据文件
       /* try {

            FileReader fr = new FileReader(new File(resultStrFile));
            BufferedReader br = new BufferedReader(fr);
            String line;
            StringBuffer sb = new StringBuffer();
            if ((line = br.readLine()) != null) {
                sb.append(line);
            }
            br.close();
            result = sb.toString();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }*/
        return result;
    }
```


### 博主总结

## java调用python 获取返回值



### 我的总结

### 博主总结

[地址1:命令行执行，获取控制台输出获取返回值](https://www.cnblogs.com/sumuncle/p/9142193.html)-》<span><font color="green">√采纳的</font></span>

> 博主：

```python


def get_path(filename):
    y_t = np.loadtxt(filename)
    peolpex = int(y_t[0][0])
    peolpey = int(y_t[0][1])
    firex = int(y_t[1][0])
    firey = int(y_t[1][1])
    answer = getQ(peolpex, peolpey, firex, firey)
    return answer


if __name__ == "__main__":
    filename = sys.argv[1]
    # print(filename)

    # root = Tk()
    # canvas = Canvas(root, bg="white")
    # canvas.pack()
    # colors = ['red', 'orange',  'green', 'black','yellow','white','pink']

    result = get_path(filename)
    # with open(filename, 'w') as f:
    #     f.write(result)
    print result

```    

```java
String result = "";

        try {
            Process process = Runtime.getRuntime().exec("python /home/jia/fireevacuation/my.py " + filename);
//            process.waitFor();
            InputStreamReader ir = new InputStreamReader(process.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);
            result = input.readLine();
            input.close();
            ir.close();
//            process.waitFor();
        } catch (IOException e) {
            logger.error("调用python脚本并读取结果时出错：" + e.getMessage());
        }
        return result;
```

