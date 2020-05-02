# pc 端页面 新增相关

## 新创建tab 

```js

vue:页面菜单组织：

Data (){
    return {
         menus: [{
            name: 'organizationManage',
            text: '组织架构'
          }]

        includePageNames: [],
        tabs: [],
    }
}
添加tab
addTab:function(obj,num){//添加新的页签
	  obj.tabView=obj.menus[num].name;
      var divnum=$("#"+obj.menus[num].name).length;
      if(divnum>0){

      }else{
       	let tabTitle = {id:obj.menus[num].name,name:obj.menus[num].text};
        obj.tabs.push(tabTitle);
        obj.includePageNames.push(obj.menus[num].name);
      }
    },

显示tab 方法

    showTab:function(obj,id){//切换页签
    	obj.active=id;
    	obj.tabView=id;
    },

```


``vue
//主页面展示 
<ul class="nav nav-tabs" style="float: left;width: 100%;padding: 0 10px;background: #f8fbff;">
      <li :class="{active:isIndex}">
        <a href="javascript:void(0);">
          <span style="padding-right: 10px;" @click="toggle('home_jituan')">首页</span>
        </a>
      </li>
      <li v-for="(tab,index) in tabs" :key="index" :id="tab.id" :class="{active:tab.id==tabView}">
        <a href="javascript:void(0);">
          <span @click="toggle(tab.id)">{{tab.name}}</span>
          <i class="fa fa-remove closeable" @click="del(tab.id,$event)" title="关闭"></i>
        </a>
      </li>
    </ul>


```