# SpringDataJpa -自带方法使用


## jpa 自带查询方法使用

### 根据id 操作


```Java

 @Override
    public Tbatmosafe selectTbatmosafeByTaskid(String taskid) {
        return tbatmosafeDao.findById(taskid).get();
    }

    // 使用语句则需要加上Modifying
    @Modifying
    @Query("delete from Tblockborder where taskid=?1")
    void deleteByTaskId(String taskId);

    @Override
    public void deleteTbatmosafeByTaskid(String taskid) {
        tbatmosafeDao.deleteById(taskid);
    }

    // 多个查询条件
     Tbuser findByLoginnameAndPasswordAndStatus(String loginname, String password, Integer status);
```

### notNull系列

```Java

 List<Tbrole> findByDescriptionNotNull();
```


## jpa 创建名字查询

```java
List<Tbtaskwater> findByRunstateOrTaskdescLike(String runstate, String taskdesc);
```


## in 语句


```Java

    // 查询
    List<Tbtaskwater> findByTaskidIn(List<String> taskids);

    // 删除
     void deleteAllByIdIn(List<String> taskids);
    // 中间加了一个Is 也是可行的 不加也行 ，都可以查询出结果
    List<Tbnuclidewater> findAllByIdIsIn(long[] nucliids);
    List<Tbnuclidewater> findAllByIdIn(long[] nucliids);

```


