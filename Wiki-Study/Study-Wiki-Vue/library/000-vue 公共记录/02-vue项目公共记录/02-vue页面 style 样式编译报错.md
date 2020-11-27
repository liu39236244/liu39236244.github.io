# style 样式编译报错


## vue页面样式编译报错

* 如果css 样式编译语言在项目中没有存在相应的编译工具包，则汇报响应的错


> 错误案例，我把别的项目中的 vue组件复制过来，但是报错，后来才知道修改 style 的css 编译方式，不同项目可能引入的不一样


```vue
<style lang="less">
</style>
```

后来改为：




```vue
<style lang="scss">

</style>
```

```
This dependency was not found:

* !!vue-style-loader!css-loader?{"sourceMap":true,"minimize":true}!../../../node_modules/vue-loader/lib/style-compiler/index?{"vue":true,"id":"data-v-65bb78a7","scoped":false,"hasInlineConfig":false}!less-loader?{"sourceMap":true}!../../../node_modules/vue-loader/lib/selector?type=styles&index=0!./allQyDepartTr
ee.vue in ./src/components/common/allQyDepartTree.vue

To install it, you can run: npm install --save !!vue-style-loader!css-loader?{"sourceMap":true,"minimize":true}!../../../node_modules/vue-loader/lib/style-compiler/index?{"vue":true,"id":"data-v-65bb78a7","scoped":false,"hasInlineConfig":false}!less-loader?{"sourceMap":true}!../../../node_modules/vue-loader/lib
/selector?type=styles&index=0!./allQyDepartTree.vue

```

解决思路：

npm install sass-loader --save;

npm install node-sass --save;



less


lessc -v

npm install --save less less-loader
https://www.cnblogs.com/qdwds/p/11516181.html



