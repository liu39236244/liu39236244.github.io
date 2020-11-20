# Element -ui 的Compoent 使用


## Compoent 与 content-tab 的使用总结 -01 版本



```vue
<template>
	<div class="content">
		<p class="content-tab">
			<a href="javascript:void(0);" v-for="(todo, index) in todos" v-on:click="addClass(index)" v-bind:class="{ content_tabon:index==current}">
				{{ todo.text }}
			</a>
		</p>
		<component v-bind:is="tabViewQy"></component>
	</div>
</template>

```




```js

// 这里写自己的路径
import qyInfor from "@/components/******/qyInfor";
import qyDepart from "@/components/******/depart.vue";
import qyUser from "@/components/******/user.vue";
import qyCarManage from "@/components//******/qyCar.vue";

export default {

name: 'train',
  data () {
    return {
      current: 0,
      tabViewQy: 'qyInfor',
      todos: [{
        name: 'qyInfor',
        text: '企业管理'
      },{
        name: 'qyDepart',
        text: '企业部门管理'
      },{
        name: 'qyUser',
        text: '企业人员管理'
      },{
        name: 'qyCarManage',
        text: '企业车辆管理'
      }
      ]
    }
  },
  created () {
    // this.$router.push({name:this.todos[0].name})
  },
  components: {
    qyInfor, 
    qyDepart,
    qyUser, 
    qyCarManage
  },
methods: {
    /* 路由跳转 */
    addClass: function (childrenUrl) {
      this.current = childrenUrl
      this.tabViewQy = this.todos[childrenUrl].name
    }
  }

}
```


```css

<style scoped>
	.content-tab {
		float: left;
		width: 100%;
		padding: 0 10px;
		line-height: 35px;
		border-bottom: 1px solid #eeeeee;
	}
</style>

```

