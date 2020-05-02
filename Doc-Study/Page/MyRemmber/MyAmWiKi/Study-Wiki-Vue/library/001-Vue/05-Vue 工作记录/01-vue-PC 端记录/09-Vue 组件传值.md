# vue 组件传值以及案例


## 弹出 iframe 传值


```js

this.$layer.iframe({
          title: '隐患修改',
          content: {
            content: addhidanger, //传递的组件对象
            parent: this, //当前的vue对象：这里不一定是当前vue 
            data: {
              formData: JSON.stringify(curData),
              operation: "edit"
              parentId:parentId: this.parentId,
              // responsibleDepartid: this.departid
            } //props
          },
          area: ['1000px', '650px'],
          shadeClose: false //不关闭
        });


// 直接调用父传入的数据，但是这里不需要再子中重新定义；
 this.parentId = this.$options.propsData.parentId;
```