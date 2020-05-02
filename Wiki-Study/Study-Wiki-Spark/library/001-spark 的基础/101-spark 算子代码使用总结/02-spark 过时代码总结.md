# spark 过时代码

# 1- spark 过时代码
## 1-1 spark 累加器 1.5 与2.1
### spark1.5 累加器


> 1- 普通类假期

```
public final static Accumulator<Integer> noRoad_name = SparkInitMgr.jsc.intAccumulator(0);
使用：
GuiYangService.noRoad_name.add(1);
```

> 2-自定义雷佳琪

```java
package cn.netcommander.kpiengine.sysdata.GshYdSysData.GuiYangAccumulator;

import java.util.ArrayList;
import java.util.List;

import cn.netcommander.kpiengine.util.UseUtils.SpliterFlag;
import org.apache.spark.AccumulatorParam;

/**
 * @Author: shenyabo
 * @Ime: 2018/8/11 12:27
 * @Version: 1.0
 */
public class LngLatNoFoundAccu implements AccumulatorParam<String> {

    @Override
    public String addAccumulator(String t1, String t2) {
        return t1+=SpliterFlag.VERTICAL_BAR_APPEND+t2;
    }

    @Override
    public String addInPlace(String r1, String r2) {

        return r1+=SpliterFlag.VERTICAL_BAR_APPEND+r2;
    }

    @Override
    public String zero(String initialValue) {
        System.out.println("----------------"+this.getClass()+"累加器初始值："+initialValue);
        return  initialValue;
    }
}



```

### spark2.1 累加器

```
public final static LongAccumulator noRoad_name_new = SparkInitMgr.jsc.sc().longAccumulator("noRoad_name_new");
 GuiYangService.noRoad_name_new.add(1);
```
