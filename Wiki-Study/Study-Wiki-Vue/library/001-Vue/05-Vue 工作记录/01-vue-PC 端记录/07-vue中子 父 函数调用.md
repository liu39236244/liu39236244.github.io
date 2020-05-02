# pc 端子父组件函数相互调用总结

## 子调用父，不通过组件注入调用形式-parent形式

```js
this.$parent.initGrid(1)
```


### 方法调用案例 parent

```js
  this.$parent.initGrid(1);
  单独这样写 可能会有问题，如果父传入的this  并不是 父组件本身就掉用不到，那么怎么办呢。在子组件中的method 定义一个方法，里面写 ： this.$parent.initGrid(1);

  例如：
  //方法

  this.$layer.iframe({
          title: '隐患修改',
          content: {
            content: addhidanger, //传递的组件对象
            parent: this, //当前的vue对象：这里不一定是当前vue 
            data: {
              formData: JSON.stringify(curData),
              operation: "edit"
              // userid: this.userid,
              // responsibleDepartid: this.departid
            } //props
          },
          area: ['1000px', '650px'],
          shadeClose: false //不关闭
        });


   methods: { // 子组件

      refreshParentGrid() {
        this.$parent.initGrid(1
        )

      }
   }


```


## 子调用父($emit())与父调用子($refs)共用，通过组件注入形式调用 

> 父组件：

* 父组件中引入 <mi-tree> 自定义子组件，想要子组件调用父组件的updateParentMenu 函数从而达到传递子组件数据更新父组件数据，
子组件中 ： @update-parentMenu 随便定义; 
父调用子：

而通过组件注入形式，ref ="menuTree" , 之后 在父组件中可以通过 this.$refs.menuTree.showParentMenu 调用子组建中的  showParentMenu 函数
```html
 <el-form-item :label="$t('table.systemMenu.parentName')">
    <mi-tree ref="menuTree" :menudata="menudata" @update-parentMenu="updateParentMenu"   :default-expanded-keys="[form.parentId||'']"></mi-tree>
</el-form-item>
```

* 父组件js
```js
  import miTree from "./common/menuInputTree";
export default {
name: 'menuAddAndEdit',
components: {
        miTree
    },
}
methods: {
        // mi-tree 使用 ↓
        // 编辑页面回显父菜单名自所用 mi-tree
        selectChildMenuTree() {
            // 父调用子的函数
                this.$refs.menuTree.showParentMenu(this.form,this.$refs.menuTree.$refs.DeviceGroupTree)
        },
        // 菜单下拉树 更新数据的时候，同步父组件中的form数据 mi-tree
        updateParentMenu(value) {
            // 子调用父的函数
            this.form.parentId = value.parentId;
            this.form.parentName = value.parentName;
        },
}
```

> 子组件

```html
<template>

    <el-select v-model="form.parentName" :placeholder="$t('table.common.pleaseChoose')" clearable
               @change="parentNameChange" @update-parentMenu="updateParentMenu">
        <el-option v-model="form.parentName" style="height: auto">
            <el-tree
                    :data="menudata"
                    show-checkbox
                    ref="DeviceGroupTree"
                    node-key="id"
                    :default-expanded-keys="[form.parentId||'']"
                    :check-strictly="true"
                    :props="defaultProps"
                    @check="checkGroupNode"
                    accordion
                    clearable
            >
            </el-tree>
        </el-option>
    </el-select>

</template>

```

* 子中的js

子组件中 添加了一个watch，当子组件的值改变的时候，出发子组件中的update-parentMenu 方法(相当于间接调用父组件中 updateParentMenu 函数，value为传递给父组件函数中的参数))


```js
 watch: {
            'form': {
                immediate: true,
                handler(value) {
                    this.$emit('update-parentMenu', value);// 更新父组件中的父节点数据
                },
                deep: true,
            }
        },
methods: {
            updateParentMenu(value) {
              
                // 用于传递给父组件值
            },
        }
```






# 父调用子组件函数


```
https://www.cnblogs.com/mophy/p/8590291.html
```

