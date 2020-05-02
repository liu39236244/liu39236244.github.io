# RSA 公钥私钥配置

# RSA 工具类

```Java
package cn.netcommander.rasengine.utils;

import org.apache.hadoop.io.IOUtils;

import javax.crypto.Cipher;
import java.io.ObjectInputStream;
import java.security.Key;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;

public class RSAUtils {
    public static Key privateKey = null;
    public static Key publicKey = null;

    public static void main(String[] args) throws Exception {
        String str = "51446B8744656FB23E933BCE4EB1032C4E46160CEF3ABD446E9EDEC89061448B6019939ACFF68AC7ACAE806B5344C0AF39C32B6980CFE64AE2993F92ED70CB1776D24BA031DE74543A53FFD18242DF9AAC903694B851597A26275D928538B541B5097496E04E4BBADBE5DCCE85420CA09CFB071E94A4F0D9B42FACDD13DD2518";
        initKey();
        String decStr = decrypt(str, publicKey);
        System.out.println("公钥解密后：" + decStr);
        String encrypt = encrypt(decStr, privateKey);
        System.out.println(encrypt);
    }

    /**
     * 初始化公钥、私钥
     */
    public static void initKey() {
        if (privateKey == null)
            privateKey = readKeyFromResource("private.key");
        if (publicKey == null)
            publicKey = readKeyFromResource("public.key");
    }

    /**
     * * 加密,key可以是公钥，也可以是私钥 * *
     *
     * @param message *
     * @return *
     * @throws Exception
     */
    public static String encrypt(String message, Key key) throws Exception {
        String miwen = "";
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        int blocksize = 64;
        int mlength = message.length();
        int leavedSize = mlength % blocksize;
        int blocksNum = (leavedSize == 0) ? (mlength / blocksize) : (mlength / blocksize + 1);
        try {
            for (int i = 0; i < blocksNum; i++) {
                String istr;
                if (i < blocksNum - 1) {
                    istr = message.substring(i * blocksize, (i + 1) * blocksize);
                } else {
                    istr = message.substring(i * blocksize);
                }
                byte[] b = istr.getBytes();
                byte[] b1 = cipher.doFinal(b);
                String mstr = valueOfHex(b1);
                miwen = miwen + mstr;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return miwen;
    }

    /**
     * * 解密，key可以是公钥，也可以是私钥，如果是公钥加密就用私钥解密，反之亦然 * *
     *
     * @param message *
     * @return *
     * @throws Exception
     */
    public static String decrypt(String message, Key key) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] msg = toBytes(message);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < msg.length; i += 128) {
            byte[] temp = new byte[128];
            System.arraycopy(msg, i, temp, 0, 128);
            byte[] doFinal = cipher.doFinal(temp);
            sb.append(new String(doFinal, "UTF-8"));
        }
        return sb.toString();
    }

    /**
     * * 用私钥签名 * *
     *
     * @param message *
     * @param key     *
     * @return *
     * @throws Exception
     */
    public static byte[] sign(String message, PrivateKey key) throws Exception {
        Signature signetcheck = Signature.getInstance("MD5withRSA");
        signetcheck.initSign(key);
        signetcheck.update(message.getBytes("ISO-8859-1"));
        return signetcheck.sign();
    }

    /**
     * * 用公钥验证签名的正确性 * *
     *
     * @param message *
     * @param signStr *
     * @return *
     * @throws Exception
     */
    public static boolean verifySign(String message, String signStr, PublicKey key)
            throws Exception {
        if (message == null || signStr == null || key == null) {
            return false;
        }
        Signature signetcheck = Signature.getInstance("MD5withRSA");
        signetcheck.initVerify(key);
        signetcheck.update(message.getBytes("ISO-8859-1"));
        return signetcheck.verify(toBytes(signStr));
    }

    /**
     * * 从文件读取密钥 * *
     *
     * @param fileName *
     * @return *
     */
    private static Key readKeyFromResource(String fileName) {
        ObjectInputStream input = null;
        Key obj = null;
        try {
            input = new ObjectInputStream(RSAUtils.class.getClassLoader().getResourceAsStream(fileName));
            obj = (Key) input.readObject();
            input.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            IOUtils.closeStream(input);
        }
        return obj;
    }

    public static byte[] toBytes(String s) {
        byte[] bytes;
        bytes = new byte[s.length() / 2];
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = (byte) Integer.parseInt(s.substring(2 * i, 2 * i + 2),
                    16);
        }
        return bytes;
    }

    /**
     * get hex string,not separate by space
     *
     * @param bs
     * @return
     */
    public static String valueOfHex(byte[] bs) {
        return valueOfHex(bs, false);
    }

    /**
     * get hex string
     *
     * @param bs
     * @param spaceSeparate true--separate by space
     *                      false--not separate by space
     * @return
     */
    public static String valueOfHex(byte[] bs, boolean spaceSeparate) {
        if (bs == null) {
            return "";
        }

        StringBuilder contents = new StringBuilder();
        for (int i = 0; i < bs.length; i++) {
            String hex = valueOfHex(bs[i]);
            if (i > 0 && spaceSeparate) {
                contents.append(" ");
            }
            contents.append(hex.toUpperCase());
        }
        return contents.toString();
    }

    /**
     * get the byte's hex String
     *
     * @param b 字节
     * @return
     */
    public static String valueOfHex(byte b) {
        String hex = Integer.toHexString(b & 0xFF);
        if (hex.length() == 1) {
            hex = '0' + hex;
        }
        return hex;
    }
}


```
