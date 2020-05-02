# app 端传值与获取

## 总结


## 案例

### 1 push 页面传参与获取值

* 父组件

```js
this.$router.push({
            name: "hiddenTroubleAdd",
            params: {
              formDetail: item, // item 是一个对象
              // dangerStatus: item.dangerStatus,
              ifedit:true
              // refreshDangerList:tabTabs
            },
          })
```
* 子组件获取数据


```js
if(this.$route.params.formDetail){
        this.HidenDangerDto = this.$route.params.formDetail;
        this.editable=this.$route.params.ifedit;
        // 查询出来之前的排查图片，并且显示出来
        // 获取整改之前的图片id 集合，并赋值
        this.getResultPrePhoto();

        // 查询出对应的隐患对应的流程id
        this.getDangerFlowIdPaicha()

      }else{
        console.log("不是编辑页面")
      }
```