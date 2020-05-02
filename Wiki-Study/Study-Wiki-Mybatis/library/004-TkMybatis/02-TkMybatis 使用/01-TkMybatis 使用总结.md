# Tk Mybatis 使用

## 基础

## 引包

```xml
<plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <fork>true</fork>
                    <mainClass>com.graphsafe.user.UserApplication</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.5</version>
                <configuration>
                    <!--配置文件的位置-->
                    <configurationFile>src/main/resources/generatorConfig.xml</configurationFile>
                    <verbose>true</verbose>
                    <overwrite>true</overwrite>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>org.mybatis.generator</groupId>
                        <artifactId>mybatis-generator-core</artifactId>
                        <version>1.3.5</version>
                    </dependency>
                    <dependency>
                        <groupId>tk.mybatis</groupId>
                        <artifactId>mapper</artifactId>
                        <version>4.1.5</version>
                    </dependency>
                </dependencies>
                <executions>
                    <execution>
                        <id>Generate MyBatis Artifacts</id>
                        <phase>package</phase>
                        <goals>
                            <goal>generate</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
```


## Mapper 实现接口就可以使用tk mybatis 中的 封装的基础操作数据库的方法


> 基础mapper

```java
public interface MyBaseMapper<T> extends Mapper<T> {
}
```

> 实现mapper中的方法

```java
public interface UserSystemDictionaryMapper extends MyBaseMapper<UserSystemDictionary> {

    List<UserSystemDictionaryDto> getUserSysDictionDtoList (UserSystemDictionaryDto userSystemDictionaryDto);

}

```

> service 中使用


```java
@Scope("prototype")
@Component
public class BaseServiceImpl<T> implements BaseService<T> {

    private final static String sortCategory = "createTime";

    @Autowired
    protected MyBaseMapper<T> baseMapper;

    private final Class<T> clazz;

    public BaseServiceImpl() {
        Class<? extends BaseServiceImpl> childClazz = this.getClass();
        ParameterizedType genericSuperclass = (ParameterizedType) childClazz.getGenericSuperclass();
        clazz = (Class) genericSuperclass.getActualTypeArguments()[0];
    }


    /**
     * 新增一条记录（可存空值）
     * @param t
     * @return 新增成功返回主键id
     */
    @Override
    public String add(T t) {
        String id = this.beforeInsert(t);
        baseMapper.insert(t);
        return id;
    }


    /**
     * 新增一条记录（不可存空值）
     * @param t
     * @return 新增成功返回主键id
     */
    @Override
    public String addSelective(T t) {
        String id = this.beforeInsert(t);
        baseMapper.insertSelective(t);
        return id;
    }


    /**
     * 修改一条记录（不可修改为空值）
     * @param t
     */
    @Override
    public void update(T t) {
        this.beforeUpdate(t);
        baseMapper.updateByPrimaryKey(t);
    }


    /**
     * 修改一条记录（不可修改为空值）
     * @param t
     */
    @Override
    public void updateSelective(T t) {
        this.beforeUpdate(t);
        baseMapper.updateByPrimaryKeySelective(t);
    }


    /**
     * 根据主键删除一条记录
     * @param id
     */
    @Override
    public void deleteById(String id) {
        baseMapper.deleteByPrimaryKey(id);
    }


    /**
     * 根据主键集合批量删除记录
     * @param ids
     */
    @Override
    public void deleteByIds(List<String> ids) {
        if (!CollectionUtils.isEmpty(ids)) {
            ids.forEach(id -> baseMapper.deleteByPrimaryKey(id));
        }
    }


    /**
     * 根据主键查找一条记录
     * @param id
     * @return
     */
    @Override
    public T getById(String id) {
        return baseMapper.selectByPrimaryKey(id);
    }


    /**
     * 根据部门id查找
     * @param id
     * @return
     */
    @Override
    public List<T> getByOrganizationId(String id, String sortCategory, String sortType) {
        Example example = new Example(clazz);
        example.createCriteria().andEqualTo("createOrganization", id);
        Example.OrderBy createTime = example.orderBy(sortCategory);
        if ("asc".equals(sortType)) {
            createTime.asc();
        } else {
            createTime.desc();
        }
        return baseMapper.selectByExample(example);
    }


    /**
     * 条件查询（可分页）
     * @param baseExampleDto
     * @return
     */
    @Override
    public BasePageResult<T> getByExample(BaseExampleDto baseExampleDto) {
        Example example = new Example(clazz);
        Example.Criteria criteria = example.createCriteria();
        // 设置精确查询条件
        baseExampleDto.getQueryParamsEqual().forEach(criteria::andEqualTo);
        // 设置精确模糊条件
        baseExampleDto.getQueryParamsLike().forEach((k,v) -> criteria.andLike(k,"%"+v.trim()+"%"));
        // 设置排序
        Example.OrderBy orderBy;
        Map<String, String> sortParams = baseExampleDto.getSortParams();
        if (sortParams.isEmpty()) {
            orderBy = example.orderBy(sortCategory);
            orderBy.desc();
        } else {
            for (Map.Entry<String, String> entry : baseExampleDto.getSortParams().entrySet()) {
                orderBy = example.orderBy(entry.getKey());
                if ("asc".equals(entry.getValue())) {
                    orderBy.asc();
                } else {
                    orderBy.desc();
                }
            }
        }

        // 封装返回的结果
        BasePageResult<T> basePageResult = new BasePageResult<>();
        List<T> tList;
        if (null != baseExampleDto.getPage() && null != baseExampleDto.getLimit()) {
            PageHelper.startPage(baseExampleDto.getPage(), baseExampleDto.getLimit());
            tList = baseMapper.selectByExample(example);
            PageInfo<T> pageInfo = new PageInfo<>(tList);
            basePageResult.setTotal(pageInfo.getTotal());
            basePageResult.setRows(tList);

        } else {
            tList = baseMapper.selectByExample(example);
            basePageResult.setRows(tList);
        }
        return basePageResult;
    }


    //=============  private  =============


    private String beforeInsert(T t) {
        try {
            Method beforeInsert = clazz.getMethod("beforeInsert");
            beforeInsert.invoke(t);
            PropertyDescriptor pd = new PropertyDescriptor("id", clazz);
            Method rm = pd.getReadMethod();
            return (String) rm.invoke(t);
        } catch (Exception e) {
            throw new HandlerException("实体类中缺少beforeInsert方法");
        }
    }


    private void beforeUpdate(T t) {
        try {
            Method beforeInsert = clazz.getMethod("beforeUpdate");
            beforeInsert.invoke(t);
        } catch (Exception e) {
            throw new HandlerException("实体类中缺少beforeUpdate方法");
        }
    }


    private ClazzNameAndModuleSuccess getClazzNameAndModuleSuccess() {
        try {
            Method getClazzNameAndModuleSuccess = clazz.getMethod("clazzNameAndModuleSuccess");
            return (ClazzNameAndModuleSuccess) getClazzNameAndModuleSuccess.invoke(clazz.newInstance());
        } catch (Exception e) {
            throw new HandlerException("实体类中缺少clazzNameAndModuleSuccess方法");
        }
    }


    private ClazzNameAndModuleFail getClazzNameAndModuleFail() {
        try {
            Method getClazzNameAndModuleFail = clazz.getMethod("clazzNameAndModuleFail");
            return (ClazzNameAndModuleFail) getClazzNameAndModuleFail.invoke(clazz.newInstance());
        } catch (Exception e) {
            throw new HandlerException("实体类中缺少clazzNameAndModuleFail方法");
        }
    }

```



