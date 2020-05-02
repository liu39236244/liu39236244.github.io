# app vant 提示确认

## 确认？

```js
this.$dialog.confirm({
            message: "确认提交？"
          }).then(() => {})
```

```js
this.$dialog.confirm({
            title: '删除记录',
            message: '您确认要删除吗?'
          }).then(() => {})
```



## 提示
```js
// 提示

 this.$toast({
            duration: 1000,
            message: '提交隐患成功！'
          })
        
```


## 后退

```js
  this.$router.go(-1);
```