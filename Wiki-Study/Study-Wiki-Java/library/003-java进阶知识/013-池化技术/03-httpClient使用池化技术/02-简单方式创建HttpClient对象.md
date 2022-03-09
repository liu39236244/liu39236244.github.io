# HttpClient对象控制

## new HttpClient(参数) 

这是简单的一种方式，通过 new HttpClient(参数) 控制每一次的对象


## httpUtils工具类

```java
package com.graphsafe.xsn.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.graphsafe.base.exception.CustomException;
import com.graphsafe.xsn.exception.base.SystemExceptionCodeAndMsg;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.Header;
import org.apache.http.HeaderElement;
import org.apache.http.*;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.*;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.util.ObjectUtils;
import sun.misc.BASE64Encoder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;


/**
 * HTTP请求工具类
 */
@Slf4j
public class HttpClientUtils {

    private static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";

    // 读取超时
    private final static int SOCKET_TIMEOUT = 10000;
    // 连接超时
    private final static int CONNECTION_TIMEOUT = 10000;
    // 每个HOST的最大连接数量
    private final static int MAX_CONN_PRE_HOST =2;
    // 连接池的最大连接数
    private final static int MAX_CONN = 6;
    // 连接池
    private final static HttpConnectionManager httpConnectionManager;

    static {
        httpConnectionManager = new MultiThreadedHttpConnectionManager();
        HttpConnectionManagerParams params = httpConnectionManager.getParams();
        params.setConnectionTimeout(CONNECTION_TIMEOUT);
        params.setSoTimeout(SOCKET_TIMEOUT);
        params.setDefaultMaxConnectionsPerHost(MAX_CONN_PRE_HOST);
        params.setMaxTotalConnections(MAX_CONN);
    }

    /**
     * HTTP请求: get请求
     *
     */
    public static JSONObject doGet(String url) {

        // httpClient对象
       HttpClient httpClient = httpClientCreate();

        //生成get方法
        GetMethod getMethod = getMethodCreate(url);

        //相应数据数据
        String response = "";
        //结果数据
        JSONObject result = new JSONObject();
        try {

            //验证状态码
            int code = httpClient.executeMethod(getMethod);
            if (HttpStatus.SC_OK != code) {
                return null;
            }
            //不必处理响应头
            //请求先转成流
            InputStream is = getMethod.getResponseBodyAsStream();

            response = covertStr(is);

            result = JSON.parseObject(response);

        } catch (HttpException hte) {
            log.error("【时间】"+ DateUtils.getCurTimeStrByFormat(null) +"获取设备温湿度 HttpException ，url:为"+url);
            throw new CustomException(SystemExceptionCodeAndMsg.HTTP_EXCEPTION);
        } catch (IOException ioe) {
            log.error("【时间】"+ DateUtils.getCurTimeStrByFormat(null) +"IO异常", ioe);
            throw new CustomException(SystemExceptionCodeAndMsg.IO_EXCEPTION);
        } finally {
            getMethod.releaseConnection();
        }
        return result;
    }


    /**
     * post请求
     *
     */
    public static JSONObject doPost(String url, Object reqObj) {
        return getHttpResult(url, reqObj, "application/json;charset=utf-8", "POST");
    }


    public static JSONObject doPostForChenYi(String url, Object reqObj) {
        return getHttpResult(url, reqObj, "application/x-www-form-urlencoded;charset=UTF-8", "POST");
    }

    public static JSONObject doPutForChenYi(String url, Object reqObj) {
        return getHttpResult(url, reqObj, "application/x-www-form-urlencoded;charset=UTF-8", "PUT");
    }

    public static JSONObject doDeleteForChenYi(String url, Object reqObj) {
        return getHttpResult(url, reqObj, "application/x-www-form-urlencoded;charset=UTF-8", "DELETE");
    }

    /**
     * 特殊调用
     */
    public static JSONObject getForMaAnShan(Integer page) {
        //生成get方法
        GetMethod getMethod = new GetMethod("http://tem***********");
        // get方法超时时间: 10s
        getMethod.getParams().setParameter(HttpMethodParams.SO_TIMEOUT, 5 * 1000);
        //默认重试次数: 3次
        getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler());

        String cookie = ""; // 从Redis里获取，如果获取为空则调用登录方法
        if (StringUtils.isEmpty(cookie)) {
            cookie = maAnShanLogin();
        }
        getMethod.setRequestHeader("Cookie", "JSESSIONID=" + cookie);

        // 短连接//由服务端关闭 这一行是关键 // todo 另加
        getMethod.setRequestHeader(HttpHeaders.CONNECTION, "close");

        // httpClient对象
        HttpClient httpClient = httpClientCreate();
        try {
            //验证状态码
            int code = httpClient.executeMethod(getMethod);
            if (HttpStatus.SC_OK != code) {
                return null;
            }
            //不必处理响应头
            //请求先转成流
            InputStream is = getMethod.getResponseBodyAsStream();
            String response = covertStr(is);
            if (!StringUtils.isEmpty(response) && response.contains("/login.jsp")) {
                // 未登录或者登录失效
                // 重新登录
            } else {
                return JSON.parseObject(response);

            }
        } catch (HttpException hte) {
            log.error("HTTP请求异常", hte);
            throw new CustomException(SystemExceptionCodeAndMsg.HTTP_EXCEPTION);
        } catch (IOException ioe) {
            log.error("IO异常", ioe);
            throw new CustomException(SystemExceptionCodeAndMsg.IO_EXCEPTION);
        } finally {
            getMethod.releaseConnection();
        }
        return null;
    }


    /*
     特殊接口调用authorization 案例
    */
    public static String getJinHuaData() throws Exception {

        String url = "http://**********";

        //用户名以及秘钥申请请联系管理员
        String secret = "****";
        String username = "***";

        //获取GMT时间 详情请见获取GMT时间实例
        String date = getGMTTime();

        //获取签名 详情请见签名获取方式
        String signature = getSignature(secret, username, date);

        //身份验证信息拼接
        String authorization = "{\"UserName\":\"" + username + "\",\"Date\":\"" + date + "\",\"Signature\":\"" + signature + "\"}";

        //发送GET请求 详情请见GET请求实例
        String result = createGetHttpResponse(url, authorization);
        return result;
    }


    /*
     GET请求实例，需要添加请求头的
     */
    public static String createGetHttpResponse(String url, String authorization) {

        // 获取连接客户端工具
        CloseableHttpClient httpClient = HttpClients.createDefault();

        String entityStr = null;
        CloseableHttpResponse response = null;

        try {
            /*
             * 由于GET请求的参数都是拼装在URL地址后方，所以我们要构建一个URL，带参数
             */
            URIBuilder uriBuilder = new URIBuilder(url);
            // 根据带参数的URI对象构建GET请求对象
            HttpGet httpGet = new HttpGet(uriBuilder.build());

            /*
             * 添加请求头信息
             */
            // 浏览器表示
            httpGet.addHeader("Authorization", authorization);
            // 传输的类型
            httpGet.addHeader("Content-Type", "application/x-www-form-urlencoded");

            // 短连接//由服务端关闭
            httpGet.setHeader(HttpHeaders.CONNECTION, "close");

            // 执行请求
            response = httpClient.execute(httpGet);
            // 获得响应的实体对象
            HttpEntity entity = response.getEntity();
            // 使用Apache提供的工具类进行转换成字符串
            entityStr = EntityUtils.toString(entity, "UTF-8");
        } catch (ClientProtocolException e) {
            System.err.println("Http协议出现问题");
            e.printStackTrace();
        } catch (ParseException e) {
            System.err.println("解析错误");
            e.printStackTrace();
        } catch (URISyntaxException e) {
            System.err.println("URI解析异常");
            e.printStackTrace();
        } catch (IOException e) {
            System.err.println("IO异常");
            e.printStackTrace();
        } finally {
            // 释放连接
            if (null != response) {
                try {
                    response.close();
                    httpClient.close();
                } catch (IOException e) {
                    System.err.println("释放连接出错");
                    e.printStackTrace();
                }
            }
        }

        return entityStr;

    }


    public static String getGMTTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss 'GMT'", Locale.US);
        Calendar calendar = Calendar.getInstance();
        sdf.setTimeZone(TimeZone.getTimeZone("GMT")); // 设置时区为GMT
        calendar.add(Calendar.HOUR, 8);
        String dateStr = sdf.format(calendar.getTime());
        return dateStr;
    }


    /*
     * 获取签名实例
     */
    private static String getSignature(String secret, String username, String date) throws Exception {
        String txt = "\"UserName\":\"" + username + "\",\"Date\":\"" + date + "\"";

        //详情请见HMACSHA加密实例
        return HMACSHA1Text(txt, secret);
    }

    /*
    HMACSHA加密实例
     */

    /**
     * 使用 HMAC-SHA1 签名方法对data进行签名
     *
     * @param data 被签名的字符串
     * @param key  密钥
     * @return 加密后的字符串
     */
    public static String HMACSHA1Text(String data, String key) throws Exception {
        byte[] result = null;

        Mac mac = Mac.getInstance("HmacSHA1");

        mac.init(new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA1"));

        byte[] signData = mac.doFinal(data.getBytes("UTF-8"));

        return new BASE64Encoder().encode(signData);
    }


    //=============  private  =============


    private static JSONObject getHttpResult(String url, Object reqObj, String contentType, String method) {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        JSONObject result = null;
        String resStr = "";
        try {
            //转为json
            JSONObject reqVal = new JSONObject();
            if (!ObjectUtils.isEmpty(reqObj)) {
                reqVal = (JSONObject) JSON.toJSON(reqObj);
            }
            CloseableHttpResponse res;
            switch (method) {
                case "POST": {
                    HttpPost httpPost = httpPostCreate(url, reqVal, contentType);
                    res = httpClient.execute(httpPost);
                    break;
                }
                case "PUT": {
                    HttpPut httpPut = httpPutCreate(url, reqVal, contentType);
                    res = httpClient.execute(httpPut);
                    break;
                }
                case "DELETE": {
                    HttpDelete httpDelete = httpDeleteCreate(url, contentType);
                    res = httpClient.execute(httpDelete);
                    break;
                }
                default:
                    throw new CustomException(SystemExceptionCodeAndMsg.NO_HTTP_METHOD);
            }

            try {
                assert res != null;
                HttpEntity httpEntity = res.getEntity();
                resStr = EntityUtils.toString(httpEntity, "UTF-8");
                result = (JSONObject) JSON.parse(resStr);
            } catch (ClientProtocolException ie) {
                log.error("客户端代理异常", ie);
                throw new CustomException(SystemExceptionCodeAndMsg.HTTP_EXCEPTION);
            } finally {
                res.close();
            }
        } catch (IOException ce) {
            log.error("IO异常", ce);
            throw new CustomException(SystemExceptionCodeAndMsg.IO_EXCEPTION);
        } finally {
            try {
                httpClient.close();
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        return result;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2022/2/24 9:46
     * @Description: new 新的HttpClient
     * @Params: []
     * @Return: org.apache.commons.httpclient.HttpClient
     */
    private static HttpClient httpClientCreate() {
        // 这里就是http请求池中的对象
        return new HttpClient(httpConnectionManager);
    }


    /**
     * get方法实例化
     */
    private static GetMethod getMethodCreate(String url) {

        //生成get方法
        GetMethod getMethod = new GetMethod(url);
        // get方法超时时间: 5s
        getMethod.getParams().setParameter(HttpMethodParams.SO_TIMEOUT, 5 * 1000);
        //默认重试次数: 3次
        getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler());

        return getMethod;
    }

    /**
     * Post方法体
     */
    private static HttpPost httpPostCreate(String url, JSONObject reqVal, String contentType) {
        HttpPost httpPost = new HttpPost(url);
        httpPost.addHeader("Content-Type", contentType);
        httpPost.setEntity(new StringEntity(reqVal.toJSONString(), "utf-8"));
        return httpPost;
    }

    /**
     * Put方法体
     */
    private static HttpPut httpPutCreate(String url, JSONObject reqVal, String contentType) {
        HttpPut httpPut = new HttpPut(url);
        httpPut.addHeader("Content-Type", contentType);
        httpPut.setEntity(new StringEntity(reqVal.toJSONString(), "utf-8"));
        return httpPut;
    }

    /**
     * Delete方法体
     *
     * @param url
     * @return
     */
    private static HttpDelete httpDeleteCreate(String url, String contentType) {
        HttpDelete httpDelete = new HttpDelete(url);
        httpDelete.addHeader("Content-Type", contentType);
        return httpDelete;
    }


    /**
     * 输入流转换为字符串
     */
    private static String covertStr(InputStream is) {

        if (ObjectUtils.isEmpty(is)) {
            return null;
        }
        String result = "";
        try {
            BufferedReader br = new BufferedReader( new InputStreamReader(is, "UTF-8"));
            result = IOUtils.toString(br);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2022/2/24 15:15
     * @Description: 获取某接口以后拿到请求中的cookie
     * @Params: []
     * @Return: java.lang.String
     */
    private static String sendUrlGetReturnCookie() {
        String cookie = "";
        CloseableHttpClient httpClient = HttpClients.createDefault();

        HttpPost httpPost = httpPostCreate("http:*****",
                new JSONObject(),
                "application/json;charset=utf-8");
        try {
            CloseableHttpResponse res = httpClient.execute(httpPost);
            Header[] cookies = res.getHeaders("Set-Cookie");
            HeaderElement[] elements = cookies[0].getElements();
            cookie = elements[0].getValue();

        } catch (IOException ce) {
            log.error("IO异常", ce);
            throw new CustomException(SystemExceptionCodeAndMsg.IO_EXCEPTION);
        } catch (Exception e) {
            log.error("系统错误", e);
        } finally {
            try {
                httpClient.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return cookie;
    }


}

```