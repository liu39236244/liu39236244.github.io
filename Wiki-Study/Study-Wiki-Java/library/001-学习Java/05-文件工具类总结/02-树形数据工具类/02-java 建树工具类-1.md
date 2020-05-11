# 树形工具类总结


## 

Bean

```java

import java.util.ArrayList;
import java.util.List;

public class TreeNode {
    protected int id;
    protected int parentId;
    List<TreeNode> children = new ArrayList<TreeNode>();
 
    public List<TreeNode> getChildren() {
        return children;
    }
 
    public void setChildren(List<TreeNode> children) {
        this.children = children;
    }
    public int getId() {
        return id;
    }
 
    public void setId(int id) {
        this.id = id;
    }
 
    public int getParentId() {
        return parentId;
    }
 
    public void setParentId(int parentId) {
        this.parentId = parentId;
    }
 
    public void add(TreeNode node){
        children.add(node);
    }
}
```



TreeUtil 

```java
import java.util.ArrayList;
import java.util.List;

public class TreeUtil{
  /**
   * 两层循环实现建树
   * 
   * @param treeNodes 传入的树节点列表
   * @return
   */
  public static <T extends TreeNode> List<T> bulid(List<T> treeNodes,Object root) {
 
    List<T> trees = new ArrayList<T>();
 
    for (T treeNode : treeNodes) {
 
      if (root.equals(treeNode.getParentId())) {
        trees.add(treeNode);
      }
 
      for (T it : treeNodes) {
        if (it.getParentId() == treeNode.getId()) {
          if (treeNode.getChildren() == null) {
            treeNode.setChildren(new ArrayList<TreeNode>());
          }
          treeNode.add(it);
        }
      }
    }
    return trees;
  }
 
  /**
   * 使用递归方法建树
   * 
   * @param treeNodes
   * @return
   */
  public static <T extends TreeNode> List<T> buildByRecursive(List<T> treeNodes,Object root) {
    List<T> trees = new ArrayList<T>();
    for (T treeNode : treeNodes) {
      if (root.equals(treeNode.getParentId())) {
        trees.add(findChildren(treeNode, treeNodes));
      }
    }
    return trees;
  }
 
  /**
   * 递归查找子节点
   * 
   * @param treeNodes
   * @return
   */
  public static <T extends TreeNode> T findChildren(T treeNode, List<T> treeNodes) {
    for (T it : treeNodes) {
      if (treeNode.getId() == it.getParentId()) {
        if (treeNode.getChildren() == null) {
          treeNode.setChildren(new ArrayList<TreeNode>());
        }
        treeNode.add(findChildren(it, treeNodes));
      }
    }
    return treeNode;
  }
 
}
```