# vue 中store 的使用


## store 

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

### 介绍


* 博主
[介绍](https://blog.csdn.net/weixin_43771797/article/details/84933631)

[vuex 状态管理](https://baijiahao.baidu.com/s?id=1618794879569468435&wfr=spider&for=pc)


## 使用store中的数据，


* 1 在页面中引入vuex 

  ```
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
  ```

![](assets/001/03/06/01-1598257541840.png)


* 2 计算属性中 使用

```js
// 主意引入：   import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
 computed: {
      ...mapState({
        tabSelect: state => state.tabSelect,
        tabSelect: state => state.tabSelect
      })
    },

    watch: {
      "$store.state.tabSelect": function() {
        console.log("tabSelect修改、tabName", this.tabName);
        // console.log("tabSelect修改、tabName", this.$store.state.tabName); // 这样写也可以访问到
      },

    // 当然 也可以监听 computed 中引入的
    tabSelect: {
        handler(newVal, oldVal) {
            if (newVal && newVal =="KCDY" && oldVal== "addCourseUnit") {
            // 如果新选中的是 KCDY 上一个选中的是 addCourseUnit 则执行查询方法
            this.search()
            }
        },
    deep: true
    }
    }

```

* 


## Store 数据在vue 页面中进行监听

### 1 监听数据修改

![](assets/001/03/06/01-1598257341713.png)

* vue页面中使用

![](assets/001/03/06/01-1598257492981.png)


```

```
