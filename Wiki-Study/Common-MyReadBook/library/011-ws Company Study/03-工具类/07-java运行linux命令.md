# linux 命令运行

## java 运行linux 命令工具类


```Java
package cn.netcommander.rasengine.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class XmlUtils {

    public static void main(String[] args) {

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
