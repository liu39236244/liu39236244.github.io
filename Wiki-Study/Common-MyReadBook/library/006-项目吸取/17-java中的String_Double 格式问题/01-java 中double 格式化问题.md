# java 中格式化double 问题

# 1-四种格式化double 的方法
* 原文链接：https://blog.csdn.net/u012117710/article/details/54970649  
```java
import java.math.BigDecimal;  
    import java.text.DecimalFormat;  
    import java.text.NumberFormat;  
    public class format {  
        double f = 111231.5585;  
        public void m1() {  
            BigDecimal bg = new BigDecimal(f);  
            double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();  
            System.out.println(f1);  
        }  
        /**
         * DecimalFormat转换最简便
         */  
        public void m2() {  
            DecimalFormat df = new DecimalFormat("#.00");  
            System.out.println(df.format(f));  
        }  
        /**
         * String.format打印最简便
         */  
        public void m3() {  
            System.out.println(String.format("%.2f", f));  
        }  
        public void m4() {  
            NumberFormat nf = NumberFormat.getNumberInstance();  
            nf.setMaximumFractionDigits(2);  
            System.out.println(nf.format(f));  
        }  
        public static void main(String[] args) {  
            format f = new format();  
            f.m1();  
            f.m2();  
            f.m3();  
            f.m4();  
        }  
    }
```


##
