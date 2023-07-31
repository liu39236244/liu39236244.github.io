# java 发送http请求工具类总结

## 正常工具类


```java
@Data
public class PostMethodHttpResult {

    private int code;
    private String responseBodyString;
    private byte[] responseBody;
}

```

```java
package com.szdp.utils;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.json.UTF8DataInputJsonParser;
import com.sun.org.apache.xerces.internal.xni.grammars.XMLGrammarDescription;
import com.szdp.constants.SpreadConstantcode;
import com.szdp.http.PostMethodHttpResult;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.springframework.util.StringUtils;


public class HttpUtil {

    //private static Logger logger = Logger.getLogger(HttpUtil.class);

    /**
     * get请求
     * @return
     */
    public static String doGet(String url) {
        try {
            HttpClient client = new DefaultHttpClient();
            //发送get请求
            HttpGet request = new HttpGet(url);
            HttpResponse response = client.execute(request);

            /**请求发送成功，并得到响应**/
            if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                /**读取服务器返回过来的json字符串数据**/
                String strResult = EntityUtils.toString(response.getEntity());

                return strResult;
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    /**
     * post请求(用于key-value格式的参数)
     * @param url
     * @param params
     * @return
     */
    public static String doPost(String url, Map params){

        BufferedReader in = null;
        try {
            // 定义HttpClient
            HttpClient client = new DefaultHttpClient();
            // 实例化HTTP方法
            HttpPost request = new HttpPost();
            request.setURI(new URI(url));

            //设置参数
            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            for (Iterator iter = params.keySet().iterator(); iter.hasNext();) {
                String name = (String) iter.next();
                String value = String.valueOf(params.get(name));
                nvps.add(new BasicNameValuePair(name, value));

                //System.out.println(name +"-"+value);
            }
            request.setEntity(new UrlEncodedFormEntity(nvps,HTTP.UTF_8));

            HttpResponse response = client.execute(request);
            int code = response.getStatusLine().getStatusCode();
            if(code == 200){    //请求成功
                in = new BufferedReader(new InputStreamReader(response.getEntity()
                        .getContent(),"utf-8"));
                StringBuffer sb = new StringBuffer("");
                String line = "";
                String NL = System.getProperty("line.separator");
                while ((line = in.readLine()) != null) {
                    sb.append(line + NL);
                }

                in.close();

                return sb.toString();
            }
            else{    //
                System.out.println("状态码：" + code);
                return null;
            }
        }
        catch(Exception e){
            e.printStackTrace();

            return null;
        }
    }

    /**
     * post请求（用于请求json格式的参数）
     * @param url
     * @param params
     * @return
     */
    public static String doPost(String url, String params) throws Exception {

        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);// 创建httpPost
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-Type", "application/json");
        String charSet = "UTF-8";
        StringEntity entity = new StringEntity(params, charSet);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = null;

        try {

            response = httpclient.execute(httpPost);
            StatusLine status = response.getStatusLine();
            int state = status.getStatusCode();
            if (state == HttpStatus.SC_OK) {
                HttpEntity responseEntity = response.getEntity();
                String jsonString = EntityUtils.toString(responseEntity);
                return jsonString;
            }
            else{
                //logger.error("请求返回:"+state+"("+url+")");
            }
        }
        finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
    /**
     * post请求（用于请求json格式的参数）
     * @param url
     * @param params
     * @return
     */
    public static String doPost(String url, String params, String token) throws Exception {

        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);// 创建httpPost
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("token", token);
        String charSet = "UTF-8";
        StringEntity entity = new StringEntity(params, charSet);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = null;

        try {

            response = httpclient.execute(httpPost);
            StatusLine status = response.getStatusLine();
            int state = status.getStatusCode();
            if (state == HttpStatus.SC_OK) {
                HttpEntity responseEntity = response.getEntity();
                String jsonString = EntityUtils.toString(responseEntity);
                return jsonString;
            }
            else{
                //logger.error("请求返回:"+state+"("+url+")");
            }
        }
        finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * post请求（用于请求x-www-form-urlencoded格式的参数）
     * @param url
     * @param params
     * @return
     */
    public static String doPost(String url, List<NameValuePair> params) throws Exception {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);// 创建httpPost
        String charSet = "UTF-8";
        httpPost.setEntity(new UrlEncodedFormEntity(params,"UTF-8"));
        httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
        CloseableHttpResponse response = null;
        try {

            response = httpclient.execute(httpPost);
            StatusLine status = response.getStatusLine();
            int state = status.getStatusCode();
            if (state == HttpStatus.SC_OK) {
                HttpEntity responseEntity = response.getEntity();
                String jsonString = EntityUtils.toString(responseEntity);
                return jsonString;
            }
            else{
                //logger.error("请求返回:"+state+"("+url+")");
            }
        }
        finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }


    /**
     * @Author: shenyabo
     * @Description: php 接口调用工具函数
     * @Date:  2020/8/4 15:53
     * @Params: [xxpBaseinfoDto]
     * @Return: com.szdp.http.PostMethodHttpResult
     */

    public static  PostMethodHttpResult getPhpInterfaceMethods(Map<String,String> paramMap ,String url) {

        PostMethodHttpResult ret = new PostMethodHttpResult();
        org.apache.commons.httpclient.HttpClient client = null;
        String charset = "UTF-8";

        client = new org.apache.commons.httpclient.HttpClient();

        //1.创建 HttpClient
        org.apache.commons.httpclient.HttpClient httpClient = new org.apache.commons.httpclient.HttpClient();
        // 2.构造PostMethod的实例
        PostMethod postMethod = new PostMethod(url);
        postMethod.getParams().setContentCharset(charset);
        postMethod.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        paramMap.forEach((k,v)->{
            postMethod.setParameter("jsondata["+k+"]", String.valueOf(v));
        });
        int code = 0;
        try {
            ret.setCode( client.executeMethod(postMethod));
            ret.setResponseBodyString( postMethod.getResponseBodyAsString());
            ret.setResponseBody( postMethod.getResponseBody());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ret;

    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2020/11/2 19:57
     * @Description:
     * @Params: [URL, jsonStr]
     * @Return: java.lang.String
     */
    public static String doPostWithJsonParams (String URL,String jsonStr){

        OutputStreamWriter out = null;
        BufferedReader in = null;
        StringBuilder result = new StringBuilder();
        HttpURLConnection conn = null;
        try{
            java.net.URL url = new URL(URL);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            //发送POST请求必须设置为true
            conn.setDoOutput(true);
            conn.setDoInput(true);
            //设置连接超时时间和读取超时时间
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            //获取输出流
            out = new OutputStreamWriter(conn.getOutputStream());

            out.write(jsonStr);
            out.flush();
            out.close();
            //取得输入流，并使用Reader读取
            if (200 == conn.getResponseCode()){
                in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
                String line;
                while ((line = in.readLine()) != null){
                    result.append(line);
                    System.out.println(line);
                }
            }else{
                System.out.println("ResponseCode is an error code:" + conn.getResponseCode());
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return result.toString();
    }

}
```


## 工具类2

```java
package com.szdp.utils.httputil;

import com.alibaba.fastjson.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class UrlReqUtil {



    /**
     * @Author: shenyabo
     * @Date: Create in 2020/11/2 19:35
     * @Description: get无参
     * @Params: [url]
     * @Return: com.alibaba.fastjson.JSONObject
     */
    public static JSONObject get(String url) {

        HttpURLConnection http = null;
        InputStream is = null;
        try {
            URL urlGet = new URL(url);
            http = (HttpURLConnection) urlGet.openConnection();

            http.setRequestMethod("GET");
//            http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            http.setRequestProperty("Content-Type", "application/json");
            http.setDoOutput(true);
            http.setDoInput(true);
            System.setProperty("sun.net.client.defaultConnectTimeout", "30000");
            System.setProperty("sun.net.client.defaultReadTimeout", "30000");

            http.connect();

            is = http.getInputStream();
            int size = is.available();
            byte[] jsonBytes = new byte[size];
            is.read(jsonBytes);
            String message = new String(jsonBytes, "UTF-8");
            return JSONObject.parseObject(message);
        } catch (Exception e) {
            return null;
        } finally {
            if (null != http) {
                http.disconnect();
            };
            try {
                if (null != is) {
                    is.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2020/11/2 19:35
     * @Description: post  请求， data json 字符串
     * @Params: [url, data]
     * @Return: java.lang.String
     */
    public static String post(String url, String data) {

        HttpURLConnection http = null;
        PrintWriter out = null;
        BufferedReader reader = null;
        try {
            //创建连接
            URL urlPost = new URL(url);
            http = (HttpURLConnection) urlPost
                    .openConnection();
            http.setDoOutput(true);
            http.setDoInput(true);
            http.setRequestMethod("POST");
            http.setUseCaches(false);
            http.setInstanceFollowRedirects(true);
//            http.setRequestProperty("Content-Type",
//                    "application/x-www-form-urlencoded");
            http.setRequestProperty("Content-Type",
                    "application/json");

            http.connect();

            //POST请求
            OutputStreamWriter outWriter = new OutputStreamWriter(http.getOutputStream(), "utf-8");
            out = new PrintWriter(outWriter);
            out.print(data);
            out.flush();
            out.close();
            out = null;

            //读取响应
            reader = new BufferedReader(new InputStreamReader(
                    http.getInputStream()));
            String lines;
            StringBuffer sb = new StringBuffer("");
            while ((lines = reader.readLine()) != null) {
                lines = new String(lines.getBytes(), "utf-8");
                sb.append(lines);
            }
            reader.close();
            reader = null;
            System.out.println(sb.toString());
            return sb.toString();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        } finally {
            if (null != http){
                http.disconnect();
            }
            if (null != out) {
                out.close();
            }
            try {
                if (null != reader){
                    reader.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }
}
```


## httpUrlConnect get 请求


```java
package com.szdp.utils.httputil;

import com.alibaba.fastjson.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class UrlReqUtil {



    /**
     * @Author: shenyabo
     * @Date: Create in 2020/11/2 19:35
     * @Description: get无参
     * @Params: [url]
     * @Return: com.alibaba.fastjson.JSONObject
     */
    public static JSONObject get(String url) {

        HttpURLConnection http = null;
        InputStream is = null;
        try {
            URL urlGet = new URL(url);
            http = (HttpURLConnection) urlGet.openConnection();

            http.setRequestMethod("GET");
//            http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            http.setRequestProperty("Content-Type", "application/json");
            http.setDoOutput(true);
            http.setDoInput(true);
            System.setProperty("sun.net.client.defaultConnectTimeout", "30000");
            System.setProperty("sun.net.client.defaultReadTimeout", "30000");

            http.connect();

            is = http.getInputStream();
            int size = is.available();
            byte[] jsonBytes = new byte[size];
            is.read(jsonBytes);
            String message = new String(jsonBytes, "UTF-8");
            return JSONObject.parseObject(message);
        } catch (Exception e) {
            return null;
        } finally {
            if (null != http) {
                http.disconnect();
            };
            try {
                if (null != is) {
                    is.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2020/11/2 19:35
     * @Description: post  请求， data json 字符串
     * @Params: [url, data]
     * @Return: java.lang.String
     */
    public static String post(String url, String data) {

        HttpURLConnection http = null;
        PrintWriter out = null;
        BufferedReader reader = null;
        try {
            //创建连接
            URL urlPost = new URL(url);
            http = (HttpURLConnection) urlPost
                    .openConnection();
            http.setDoOutput(true);
            http.setDoInput(true);
            http.setRequestMethod("POST");
            http.setUseCaches(false);
            http.setInstanceFollowRedirects(true);
//            http.setRequestProperty("Content-Type",
//                    "application/x-www-form-urlencoded");
            http.setRequestProperty("Content-Type",
                    "application/json");

            http.connect();

            //POST请求
            OutputStreamWriter outWriter = new OutputStreamWriter(http.getOutputStream(), "utf-8");
            out = new PrintWriter(outWriter);
            out.print(data);
            out.flush();
            out.close();
            out = null;

            //读取响应
            reader = new BufferedReader(new InputStreamReader(
                    http.getInputStream()));
            String lines;
            StringBuffer sb = new StringBuffer("");
            while ((lines = reader.readLine()) != null) {
                lines = new String(lines.getBytes(), "utf-8");
                sb.append(lines);
            }
            reader.close();
            reader = null;
            System.out.println(sb.toString());
            return sb.toString();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        } finally {
            if (null != http){
                http.disconnect();
            }
            if (null != out) {
                out.close();
            }
            try {
                if (null != reader){
                    reader.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }
}
```



## netUrl

```java

package com.szdp.utils.httputil;


import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author : shenyabo
 * @date : Created in 2020-11-02 19:28
 * @description :
 * @modified By :
 * @version: : v1.0
 */
public class NetUtil {
    public static CloseableHttpClient httpClient = HttpClientBuilder.create().build();

    /**
     * get请求获取String类型数据
     * @param url 请求链接
     * @return
     */
    public static String get(String url){
        StringBuffer sb = new StringBuffer();
        HttpGet httpGet = new HttpGet(url);
        try {
            HttpResponse response = httpClient.execute(httpGet);           //1

            HttpEntity entity = response.getEntity();
            InputStreamReader reader = new InputStreamReader(entity.getContent(),"utf-8");
            char [] charbufer;
            while (0<reader.read(charbufer=new char[10])){
                sb.append(charbufer);
            }
        }catch (IOException e){//1
            e.printStackTrace();
        }finally {
            httpGet.releaseConnection();
        }
        return sb.toString();
    }

    /**
     * post方式请求数据
     * @param url 请求链接
     * @param data post数据体
     * @return
     */
    public static String post(String url, Map<String,String> data){
        StringBuffer sb = new StringBuffer();
        HttpPost httpPost = new HttpPost(url);
        List<NameValuePair> valuePairs = new ArrayList<NameValuePair>();
        if(null != data) {
            for (String key : data.keySet()) {
                valuePairs.add(new BasicNameValuePair(key, data.get(key)));
            }
        }
        try {
            httpPost.setEntity(new UrlEncodedFormEntity(valuePairs));
            HttpResponse response = httpClient.execute(httpPost);
            HttpEntity httpEntity = response.getEntity();
            BufferedInputStream bis = new BufferedInputStream(httpEntity.getContent());
            byte [] buffer;
            while (0<bis.read(buffer=new byte[128])){
                sb.append(new String(buffer,"utf-8"));
            }
        }catch (UnsupportedEncodingException e){//数据格式有误
            e.printStackTrace();
        }catch (IOException e){//请求出错
            e.printStackTrace();
        }finally {
            httpPost.releaseConnection();
        }
        return sb.toString();
    }


}

```