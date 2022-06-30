# springboot提交事务相关


## 参考博客

[springboot 提交事务](https://blog.csdn.net/xishi66/article/details/114257444)

### 流程

### 依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
    <scope>compile</scope>
</dependency>
```

### service层注入

2 在service层注入DataSourceTransactionManager和TransactionDefinition

```java
@Autowired
private DataSourceTransactionManager dataSourceTransactionManager;
@Autowired
private TransactionDefinition transactionDefinition;
```

### 代码中手动提交

```java
//手动开启事务
 TransactionStatus transactionStatusCleanData = dataSourceTransactionManager.getTransaction(transactionDefinition);
        try {
            genToBaseDao.cleanData();
            //手动提交事务
            dataSourceTransactionManager.commit(transactionStatusCleanData);
        } catch (TransactionException e) {
            e.printStackTrace();
            //手动回滚事务
            dataSourceTransactionManager.rollback(transactionStatusCleanData);
        }

```
### 多个事务提交

一般需要手工提交多个事务在service层的方法中可以依次增加多个事务提交

```java
//手动开启第一个事务
        TransactionStatus transactionStatusCleanData = dataSourceTransactionManager.getTransaction(transactionDefinition);
        try {
            genToBaseDao.cleanData();
            //手动提交事务
            dataSourceTransactionManager.commit(transactionStatusCleanData);
        } catch (TransactionException e) {
            e.printStackTrace();
            //手动回滚事务
            dataSourceTransactionManager.rollback(transactionStatusCleanData);
        }
        //手动开启第二个事务
        TransactionStatus transactionStatusExcuteBatch = dataSourceTransactionManager.getTransaction(transactionDefinition);
        try {
            genToBaseDao.excuteBatch();
            //手动提交事务
            dataSourceTransactionManager.commit(transactionStatusExcuteBatch);
        } catch (TransactionException e) {
            e.printStackTrace();
            //手动回滚事务
            dataSourceTransactionManager.rollback(transactionStatusExcuteBatch);
        }

```


## springboot 如何提前提交一个事务



### 代码

```java
import org.apache.ibatis.transaction.TransactionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

@Slf4j
@Service("devEmergencyInformationService")
@Transactional(rollbackFor = Exception.class)
public class DevEmergencyInformationServiceImpl extends BaseServiceImpl<DevEmergencyInformation> implements DevEmergencyInformationService {


    @Autowired
    private DataSourceTransactionManager dataSourceTransactionManager;

 @Override
    public String addSelective(DevEmergencyInformation devEmergencyInformation) {

        String id = "";
        //手动开启第一个事务
        // 发起一个新事务
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);//新发起一个事务
        TransactionStatus transactionStatusCleanData = dataSourceTransactionManager.getTransaction(def);// 获得事务状态
        // 下面addSelective 就是要执行的操作，在发送websocket 到前端之前，先提交事务
        try {
            id=super.addSelective(devEmergencyInformation);
            //手动提交事务，防止发送websocket 前端无法根据id查到对应数据，导致空弹窗
            dataSourceTransactionManager.commit(transactionStatusCleanData);
        } catch (TransactionException e) {
            e.printStackTrace();
            //手动回滚事务
            dataSourceTransactionManager.rollback(transactionStatusCleanData);
        }
        // 添加设备预警数据的同时，将大屏的websocket 中发送弹窗数据一条,
        try {
            WebSocketService.sendMessage("deviceWarnSocketName", id);
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error("addSelective-", ex);
        }
        return id;

    }


}

// 或者以下方式也可以

@Controller
public class TransactionDemo {

    @Autowired
    private DataSourceTransactionManager transactionManager;

    @RequestMapping("test")
    public void test(){
        //可做单例
        DefaultTransactionDefinition definition = new DefaultTransactionDefinition();
        definition.setPropagationBehaviorName("PROPAGATION_REQUIRED");
        TransactionStatus transaction = transactionManager.getTransaction(definition);

//        TransactionStatus transaction = transactionManager.getTransaction(TransactionDefinition.withDefaults());
        try {
            //do something
            transactionManager.commit(transaction);
        }catch (Exception e){
            //do error
            transactionManager.rollback(transaction);
        }
    }
}

```


## spring 事务相关解析

[spring事务深入剖析 - JDBC DataSourceTransactionManager 分析](https://www.pudn.com/news/628f82b0bf399b7f351e3eaa.html)