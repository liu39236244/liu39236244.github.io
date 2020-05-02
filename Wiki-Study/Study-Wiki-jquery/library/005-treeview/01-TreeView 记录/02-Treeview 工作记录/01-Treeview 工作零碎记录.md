# TreeView 工作记录


## 地址总结


### 官网



## 学习记录




## 经验总结

### 初始化

```js
	$('#idenuserTree').treeview({
						data: res.data.data
                        backColor: '#FFFFFF'
					});


// 直接循环

<div class="treeview" id="classifiTree">
				<ul class="list-group">
		    		<li v-for="(dept, index) in topDept" class="list-group-item" v-bind:class="{active:index==pid}">
		    			<span>
		    				{{ dept.name }}
		    			</span>
		    		</li>
		    	</ul>
			</div>

```




### 获取 选中的 节点数据


```js
	var nodes = $('#idenuserTree').treeview('getSelected', "");//获取选中项
    

    
```

### 选中第一个节点但是不出发事件


```js
$('#departTree').treeview('selectNode', [1, { silent: true } ]);
```


### 目录树点击事件


```js
		$('#departTree').on('nodeSelected', function(event, data) {
						_this.getUsersByDepartId(data.id);
					});


```


### 文本框点击出现下拉框


```js
<td class="formValue">
    <input type="hidden" v-model="item.checkDepart">
    <div  id="addhidangerTree" style="height: 50px;" >
    <div >
        <input data-vv-name="受检单位" v-model="item.checkDepart_Name" name="content"
            type="text" class="form-control" readonly="readonly" @click.stop="departTreeToogle" >
        <i>*</i>
    </div>
    <div class="treeview" id="departTree" style="display:none;position:absolute;overflow: auto; width:200px;z-index:1;top:35px;">
    </div>
    <!--<div id="departTree" style="position:absolute;left:200px;top:90px; display:block;width:250px;height:300px;border:dashed 1px #000000; background-color:#F7F7F7; overflow:auto"></div>-->
    </div>

</td>
departTreeToogle: function () {
        $("#addhidangerTree #departTree").toggle();
      },
```