# vue 中提示框，确认框

# vue 中的提示框

## 确认框

```js
this.$layer.alert('确认提交么？', (id) => {
      this.$layer.close(id) // 代表关闭当前提示框
})
```


### 案例 :

## 确认删除吗

```js
批量删除


deletedangersByids

 @DeleteMapping(value = "/deletedangersByids/{ids}")
    @Override
    public RestMessage deletedangersByids(@PathVariable("ids") String ids) {
        try{
            Integer i = dangerinfoservice.deletedangersByids(ids);
            if(i>0){
                return new RestMessage();
            }else{
                return new RestMessage(RespCodeAndMsg.FAIL);
            }
        }catch (Exception ex){
            ex.printStackTrace();
            return  new RestMessage(RespCodeAndMsg.FAIL);
        }
    }

 this.$layer.alert('确定要删除所选项吗？', (id) => {
            this.axios.delete(this.baseUrl + '/danger/dangeraccount/deletedangersByids/' + ids, {}).then((res) => {
              if (res.data.code == 1) {
                this.initGrid(1);
                this.$layer.msg('操作成功！');
                this.$layer.close(id);
              }
            });
          });
```

## 提示框

```js
 this.$layer.msg('该部门编号已存在！');
```



## iframe 弹出框

```js

  import hidangerReform from './hidangerReform';

reform: function () {
        var el = event.currentTarget;
        var id = $(el).parents("tr").attr('data-uniqueid');// 隐患id
        this.$layer.iframe({
          title: '隐患整改',
          content: {
            content: hidangerReform, //传递的组件对象
            parent: this, //当前的vue对象
            // data: {
            //   data: JSON.stringify(data.data.data),
            //   pageNo: this.pageNo
            // }
          },
          area: ['800px', '75%'],
          shade: true, //是否显示遮罩,
          shadeClose: true //不关闭
        });
```



