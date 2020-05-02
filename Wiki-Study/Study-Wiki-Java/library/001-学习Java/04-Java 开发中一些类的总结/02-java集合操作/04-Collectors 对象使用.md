# Collectors 集合对象 总结


## 简单介绍



## 功能实现说明



## 1.8 stream 流 功能 总结


### 根据List 创建树形结构

* Collectors 使用 流链式处理 List ， 并且根据 id  父id  组件 树 


> 1案例总结：

```java
public class TreeFactory<T extends Tree> {

    /**
     * 生成树
     * @param treeNodes         需要转换的集合
     * @param idFieldName       id字段名称
     * @param parentFieldName   父id字段名称
     * @param levelFieldName    层级字段名称
     * @param clazz             当前实体类的字节码对象
     * @return
     */
    public List<T> createTree(List<T> treeNodes, String idFieldName, String parentFieldName, String levelFieldName, Class<T> clazz) {

        treeNodes = treeNodes.stream().filter(t -> {
            try {

                // 设置id
                Field idField = clazz.getDeclaredField(idFieldName);
                //设置对象的访问权限，保证对private的属性的访问
                idField.setAccessible(true);
                String id = (String) idField.get(t);
                t.setTreeId(id);

                // 设置parentId
                Field parentField = clazz.getDeclaredField(parentFieldName);
                //设置对象的访问权限，保证对private的属性的访问
                parentField.setAccessible(true);
                String parentId = (String) parentField.get(t);
                t.setTreeParentId(parentId);

                // 设置层级
                Field levelField = clazz.getDeclaredField(levelFieldName);
                //设置对象的访问权限，保证对private的属性的访问
                levelField.setAccessible(true);
                Integer level = (Integer) levelField.get(t);
                t.setTreeLevel(level);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }).collect(Collectors.toList());

        Map<Optional<String>, List<T>> collect = treeNodes.stream().collect(groupingBy(t -> Optional.ofNullable(t.getTreeParentId())));
        List<T> treeNodeList = new ArrayList<>();
        List<T> list = collect.get(Optional.empty());

        if (list != null) {
            for (T t : list) {
                treeNodeList.add(addChildNode(t, collect));
            }
        }
        return treeNodeList;
    }


    /**
     * 递归
     * @param treeNode
     * @param collect
     * @return
     */
    private T addChildNode(T treeNode, Map<Optional<String>, List<T>> collect) {
        List<T> list = collect.get(Optional.of(treeNode.getTreeId()));
        if (list != null) {
            List<T> treeNodeList = new ArrayList<>();
            for (T t : list) {
                treeNodeList.add(addChildNode(t, collect));
            }
            treeNode.setChilds(treeNodeList);
        }
        return treeNode;
    }
```


