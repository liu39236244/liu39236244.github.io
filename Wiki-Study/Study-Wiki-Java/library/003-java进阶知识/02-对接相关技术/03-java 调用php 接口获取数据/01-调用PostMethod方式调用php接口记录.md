# java PostMethod方式调用php 接口

## PostMethod链接php接口案例


```java
private PostMethodHttpResult getPhpAreaPostMethods(XxpbaseinfoDto xxpBaseinfoDto) {


        PostMethodHttpResult ret = new PostMethodHttpResult();
        HttpClient client = null;
        String charset = "UTF-8";

        String getSpreadDataUrl = SpreadConstantcode.HTTP_STR + SpreadConstantcode.SPREAD_CENTER_IP + SpreadConstantcode.GET_AREA_PATH;
        client = new org.apache.commons.httpclient.HttpClient();

        //1.创建 HttpClient
        HttpClient httpClient = new HttpClient();
        // 2.构造PostMethod的实例
        PostMethod postMethod = new PostMethod(getSpreadDataUrl);

        postMethod.getParams().setContentCharset("UTF-8");

        postMethod.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

        postMethod.setParameter("jsondata[pageIndex]", xxpBaseinfoDto.getPage().toString());
        postMethod.setParameter("jsondata[pageCount]", xxpBaseinfoDto.getLimit().toString());
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

```
