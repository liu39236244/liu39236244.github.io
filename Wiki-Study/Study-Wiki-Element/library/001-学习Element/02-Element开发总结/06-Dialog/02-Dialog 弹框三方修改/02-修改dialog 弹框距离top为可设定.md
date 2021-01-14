# 修改dialog 距离top 可以设定

* 应为dialog 弹框顶部距离是固定的，也没找到对应的修改方式，参考网上的修改

##  使用


### 添加一个属性即可(原生dialog属性)

> 1 dialog 组建中 style 计算属性

```js
 style() {
        let style = {};
        if (!this.fullscreen) {
          style.marginTop = this.top;
          if (this.width) {
            style.width = this.width;
          }
        }
        return style;
      }
```

> 2 使用，添加top属性 

```
<el-dialog
            top="2vh"
            v-el-drag-dialog
            :close-on-click-modal="false"
            v-if="guideDialogFlag"
            :visible.sync="guideDialogFlag"
            width="95%"
            height="800px"
            class="popHei bigBox" ref="popHei"
            :append-to-body="true"
            title="使用手册"
    >
      <guide></guide>
    </el-dialog>
```

> 3 效果图

![](assets/001/02/06/02/02-1609897580578.png)

### 复杂方式(刚开始找到这种方式以为dialog没有自带的设置顶部距离的，)
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