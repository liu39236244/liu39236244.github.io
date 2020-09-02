# EventBus 

## 文档：

https://zhuanlan.zhihu.com/p/72777951

## 试用总结


* 1 定义页面

```js
mounted() {
      // $emit("aMsg", '来自A页面的消息');
      this.$eventBus.$on('addCourseUnit',(param) => {
        this.search();
        if(param=== "1"){
          console.log("1",param)
        }
        this.$eventBus.$off('addCourseUnit', {})
      })
      this.search(1);
    },
    // beforeDestroy(){
    //   // 清除事件监听
    //   this.$eventBus.$off('addCourseUnit', {})
    // },
```

* 2 调用页面

```js
this.$eventBus.$emit("addCourseUnit", '参数');

```