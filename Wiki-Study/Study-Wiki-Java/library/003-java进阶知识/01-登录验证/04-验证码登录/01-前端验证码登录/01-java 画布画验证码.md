# 

## 业务需求

前端登录页面刷新的时候获取后端接口获取 base64 图片 以及 存在后台redis 中的key ，登陆的时候 带上输入的验证码 以及 redis 中的key 反问道后台进行验证

## 验证码工具核心类


```java
package com.graphsafe.admin.utils.validate;

/**
 * @author : shenyabo
 * @date : Created in 2024-08-06 11:23
 * @description :
 * @modified By :
 * @version: : v1.0
 */

import com.graphsafe.api.constant.bridge.CommonConstant;
import com.graphsafe.api.model.admin.ValidateCodePo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Component
public class RandomValidateCodeUtil {


    // @Autowired
    // private  redis;

    //放到session中的key
    public final String RANDOMCODEKEY = "RANDOMVALIDATECODEKEY";


    // private String randString = "0123456789";//随机产生只有数字的字符串 private String
    //private String randString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";//随机产生只有字母的字符串
    //随机产生数字与字母组合的字符串
    private String randString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private int width = 95;// 图片宽
    private int height = 25;// 图片高
    private int lineSize = 40;// 干扰线数量
    private int stringNum = 4;// 随机产生字符数量
    private Random random = new Random();

    /**
     * 获得字体
     */
    private Font getFont() {
        return new Font("Fixedsys", Font.CENTER_BASELINE, 18);
    }

    /**
     * 获得颜色
     */
    private Color getRandColor(int fc, int bc) {
        if (fc > 255) {
            fc = 255;
        }
        if (bc > 255) {
            bc = 255;
        }
        int r = fc + random.nextInt(bc - fc - 16);
        int g = fc + random.nextInt(bc - fc - 14);
        int b = fc + random.nextInt(bc - fc - 18);
        return new Color(r, g, b);
    }

    /**
     * 生成随机图片
     */
    public void getRandomCode(HttpServletRequest request, HttpServletResponse response) {

        HttpSession session = request.getSession();

        // BufferedImage类是具有缓冲区的Image类,Image类是用于描述图像信息的类
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_BGR);

        // 产生Image对象的Graphics对象,改对象可以在图像上进行各种绘制操作
        Graphics g = image.getGraphics();

        g.fillRect(0, 0, width, height);//图片大小

        g.setFont(new Font("Times New Roman", Font.ROMAN_BASELINE, 18));//字体大小

        g.setColor(getRandColor(110, 133));//字体颜色

        // 绘制干扰线
        for (int i = 0; i <= lineSize; i++) {
            drawLine(g);
        }

        // 绘制随机字符
        String randomString = "";

        for (int i = 1; i <= stringNum; i++) {
            randomString = drawString(g, randomString, i);
        }

        // logger.info(randomString);

        //将生成的随机字符串保存到session中
        session.removeAttribute(RANDOMCODEKEY);
        session.setAttribute(RANDOMCODEKEY, randomString);
        g.dispose();

        /**
         * 将 验证码存到redis中
         */


        try {
            // 将内存中的图片通过流动形式输出到客户端
            ImageIO.write(image, "JPEG", response.getOutputStream());
        } catch (Exception e) {
            log.error("将内存中的图片通过流动形式输出到客户端失败>>>>   ", e);
        }

    }
    /**
     * @Author: shenyabo
     * @Date: Create in 2024/8/6 15:06
     * @Description: 获取base64 图片  外加 对应uuid
     * @Params: [request, response]
     * @Return: void
     */
    public ValidateCodePo getRandomCodeBase64Pic() {

        ValidateCodePo result = new ValidateCodePo();

        // BufferedImage类是具有缓冲区的Image类,Image类是用于描述图像信息的类
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_BGR);

        // 产生Image对象的Graphics对象,改对象可以在图像上进行各种绘制操作
        Graphics g = image.getGraphics();

        g.fillRect(0, 0, width, height);//图片大小

        g.setFont(new Font("Times New Roman", Font.ROMAN_BASELINE, 18));//字体大小

        g.setColor(getRandColor(110, 133));//字体颜色

        // 绘制干扰线
        for (int i = 0; i <= lineSize; i++) {
            drawLine(g);
        }

        // 绘制随机字符
        String randomString = "";

        for (int i = 1; i <= stringNum; i++) {
            randomString = drawString(g, randomString, i);
        }

        // logger.info(randomString);

        //将生成的随机字符串保存到session中

        result.setRedisKey(CommonConstant.validate + UUID.randomUUID().toString());
        result.setRedisValidateValue(randomString);

        g.dispose();

        /**
         * 将 验证码存到redis中
         */
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        String imgBase64Encoder = null;
        try {
            // 将内存中的图片通过流动形式输出到客户端
            ImageIO.write(image, "png", outputStream);
            imgBase64Encoder = "data:image/png;base64," + Base64.getEncoder().encodeToString(outputStream.toByteArray());
            result.setPicBase64(imgBase64Encoder);
        } catch (Exception e) {
            log.error("将内存中的图片通过流动形式输出到客户端失败>>>>   ", e);
        }

        return result;

    }

    /**
     * 绘制字符串
     */
    private String drawString(Graphics g, String randomString, int i) {
        g.setFont(getFont());
        g.setColor(new Color(random.nextInt(101), random.nextInt(111), random
                .nextInt(121)));
        String rand = String.valueOf(getRandomString(random.nextInt(randString
                .length())));
        randomString += rand;
        g.translate(random.nextInt(3), random.nextInt(3));
        g.drawString(rand, 13 * i, 16);
        return randomString;
    }

    /**
     * 绘制干扰线
     */
    private void drawLine(Graphics g) {

        int x = random.nextInt(width);
        int y = random.nextInt(height);

        int xl = random.nextInt(13);
        int yl = random.nextInt(15);

        g.drawLine(x, y, x + xl, y + yl);

    }

    /**
     * 获取随机的字符
     */
    public String getRandomString(int num) {
        return String.valueOf(randString.charAt(num));
    }
}

```





## control 层代码

```java
@GetMapping(value = "/getVerifyCode", produces = "application/json;charset=UTF-8")
    @Override
    public RestMessage<ValidateCodePo> getVerify(HttpServletRequest request, HttpServletResponse response) {
        ValidateCodePo result = null;


        try {
            //设置相应类型,告诉浏览器输出的内容为图片
            response.setContentType("image/jpeg");

            //设置响应头信息，告诉浏览器不要缓存此内容
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expire", 0);

            // randomValidateCodeUtil.getRandomCode(request, response);//输出验证码图片方法
            result = randomValidateCodeUtil.getRandomCodeBase64Pic();//输出验证码图片方法
            // 将验证码缓存到redis 中
            redisUtils.set(result.getRedisKey(), result.getRedisValidateValue(), CommonConstant.validateCodeRedisDbNumber, false, 120L);

            // 返回前端将验证码制空
            result.setRedisValidateValue("");

        } catch (Exception e) {
            log.error("登录页面获取验证码失败 ", e);
        }
        return new RestMessage(result);
    }
```




## 前端 img 组件直接渲染 base64 的图片

```html
    <div class="verify">
        <el-input placeholder="请输入验证码" v-model="verCode"></el-input>
        <img :src="verSrc" alt="点击更换验证码" @click="getVerifyCode">
      </div>
verSrc: 就是 base64 图片
```