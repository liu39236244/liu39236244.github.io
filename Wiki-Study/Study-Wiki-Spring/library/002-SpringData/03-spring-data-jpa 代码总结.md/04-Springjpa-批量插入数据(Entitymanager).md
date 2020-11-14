# springdata jpa批量插入数据

## EntityManager 批量操作


## 博主记录

[原文地址](https://blog.csdn.net/qq_28289405/article/details/81134666)
> 批量 插入与更新


* spring boot jpa 批量入库

在高并发的情况下需要进行批量往数据库插入对象，jpa貌似没有提供处理批量插入的接口

> 处理办法一 


利用jpa提供的save(Iterator it)方法

但是把日志打印出来还是hibernate一条一条插入的，不过效率已经提高好几个数量级了，自己分析原因可能是减少了与数据库建立链接的开销，减少了事务建立的开销。



>处理办法二 

用EntityManager做批量处理

* 1 、BatchDao.java

```java

package com.nroad.heartserver.dao;
 
import java.util.List;
 
public interface BatchDao<T>  {
    public void batchInsert(List<T> list);
    public void batchUpdate(List<T> list);
}
```

* 2、 AbstractBatchDao.java

```java
package com.nroad.heartserver.dao;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
 
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public abstract  class AbstractBatchDao<T> implements BatchDao {
 
    private Logger logger = LoggerFactory.getLogger(this.getClass());
 
    @PersistenceContext
    protected EntityManager em;
 
    @Transactional
    public void batchInsert(List list) {
        try {
            for (int i = 0; i < list.size(); i++) {
                em.persist(list.get(i));
                if (i % 100 == 0) {//一次一百条插入
                    em.flush();
                    em.clear();
                }
            }
            logger.info("save to DB success,list is {}",list.toString());
        } catch (Exception e) {
            logger.error("batch insert data failuer.");
            e.printStackTrace();
        }
    }
 
    @Transactional
    public void batchUpdate(List list) {
        try {
            for (int i = 0; i < list.size(); i++) {
                em.merge(list.get(i));
                if (i % 100 == 0) {
                    em.flush();
                    em.clear();
                }
            }
            logger.info("update data success,list is {}",list.toString());
        } catch (Exception e) {
            logger.error("batch update data failuer.");
            e.printStackTrace();
        }
    }
 
}

```



* 3、LogEntityBatchDao.java

```java
package com.nroad.heartserver.dao;
 
import com.nroad.heartserver.model.LogEntry;
import org.springframework.stereotype.Repository;
 

@Repository
public class LogEntityBatchDao extends AbstractBatchDao<LogEntry>{
}
```


> 这个方法日志打印出来也是hibernate一条一条插入的，但是效率也是比较高的。

处理办法三 
用自己拼接sql批量插入

```java
INSERT INTO table_name 
(列1, 列2,...) 
VALUES 
(值1, 值2,....),
(值1, 值2,....),
(值1, 值2,....),
(值1, 值2,....),
...
(值1, 值2,....);
```