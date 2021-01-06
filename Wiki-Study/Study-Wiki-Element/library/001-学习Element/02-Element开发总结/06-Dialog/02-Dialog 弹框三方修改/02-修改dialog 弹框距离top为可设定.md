# 修改dialog 距离top 可以设定

* 应为dialog 弹框顶部距离是固定的，也没找到对应的修改方式，参考网上的修改

##  使用

>1  vue中利用自定义指令修改elementUI对话框到顶部的距离

```

Vue.directive('alterELDialogMarginTop'/*修改elementUI中el-dialog顶部的距离,传入值eg:{marginTop:'5vh'} */, {
          inserted(el, binding, vnode) {
                    el.firstElementChild.style.marginTop = binding.value.marginTop
          }
})
```

> 2 使用

```
<el-dialog v-alterELDialogMarginTop="{marginTop:'5vh'}">
```

## 参考博客

[vue中利用自定义指令修改elementUI对话框到顶部的距离](https://blog.csdn.net/codser/article/details/98885190)