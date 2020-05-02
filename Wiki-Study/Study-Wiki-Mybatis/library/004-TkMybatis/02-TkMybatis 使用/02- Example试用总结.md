# Tkmybatis 使用总结


## 使用案例

### 等于某个条件，排序


```java
    public List<UserDefinedMenu> getUserDefinMenuByUserId(String userId) {
        Example example = new Example(UserDefinedMenu.class);
        example.createCriteria().andEqualTo("userId", userId);
        example.orderBy("sort").asc();
        return userDefinedMenuMapper.selectByExample(example);
    }
```

### 封装所有条件


```java
public BasePageResult<T> getByExample(BaseExampleDto baseExampleDto) {
        Example example = new Example(clazz);
        Example.Criteria criteria = example.createCriteria();
        // 设置精确查询条件
        baseExampleDto.getQueryParamsEqual().forEach(
                (k, v) -> {
                    if(null != v && !"".equals(v)){
                        criteria.andEqualTo(k, v);
                    }
                }
        );
        // 设置模糊查询条件
        baseExampleDto.getQueryParamsLike().forEach(
                (k, v) -> {
                    if(StringUtils.isNotEmpty(v)){
                        criteria.andLike(k,"%" + v.trim() + "%");
                    }
                });

        // 设置不等于精确查询条件
        baseExampleDto.getQueryParamsNotEqual().forEach(
                (k, v) -> {
                    if(null != v && !"".equals(v)){
                        criteria.andNotEqualTo(k, v);
                    }
                });

        // 设置时间查询条件
        baseExampleDto.getQueryParamsTime().forEach(baseTimeQueryParam -> {
            if (!Objects.isNull(baseTimeQueryParam.getStartTime())) {
                criteria.andGreaterThanOrEqualTo(baseTimeQueryParam.getTimeParam(), baseTimeQueryParam.getStartTime());
            }
            if (!Objects.isNull(baseTimeQueryParam.getEndTime())) {
                criteria.andLessThanOrEqualTo(baseTimeQueryParam.getTimeParam(), baseTimeQueryParam.getEndTime());
            }
        });

        // 设置排序
        Example.OrderBy orderBy;
        for (Map.Entry<String, String> entry : baseExampleDto.getSortParams().entrySet()) {
            orderBy = example.orderBy(entry.getKey());
            if ("asc".equals(entry.getValue())) {
                orderBy.asc();
            } else {
                orderBy.desc();
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

```


## 查询


