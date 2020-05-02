# $options.propsData 弹出框获取传入参数 pc

# $options 介绍



# 弹出框传值获取

## 案例1 

* 父组件点击按钮弹出vue ，并且获取传值
```js

this.$layer.iframe({
          title: '隐患上报',
          content: {
            content: addhidanger, //传递的组件对象
            parent: this, //当前的vue对象
            data: {
              operation: "add"
            }
          },
          area: ['1000px', '650px'],
          shadeClose: false //不关闭
        });
      },

```


* 子组件调用父组件函数


```js
 // 刷新当前数据
      refreshParentGrid() {
        this.$parent.initGrid(1)

      },
```

* 子组件获取传入的值


```js
   // 当前页面是add 还是edit
      initParentData() {
        this.operation = this.$options.propsData.operation
      },
```