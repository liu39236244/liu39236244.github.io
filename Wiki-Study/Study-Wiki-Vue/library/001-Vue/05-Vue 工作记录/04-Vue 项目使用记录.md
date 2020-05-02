# vue 项目使用记录

## vue 项目零碎记录


## Vue.config.productionTip = false 是什麽意思

https://blog.csdn.net/losedguest/article/details/86569293

> 总结来说：是否设置为生产环境，提示是否显示
开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。而在生产环境下，这些警告语句却没有用，反而会增加应用的体积。此外，有些警告检查还有一些小的运行时开销，这在生产环境模式下是可以避免的。(摘于官网说明) 大概意思应该就是，消息提示的环境配置，设置为开发环境或者生产环境


## 挂在 ref 使用 ？


```js
	<!--:is实现多个组件实现同一个挂载点-->
		<div class="col-md-9 col-lg-9">
			<component :is="currentView" ref="mychild"></component>
		</div>

         $('#departTree').on('nodeSelected', function (event, data) {
          _this.changePid(data);
        })

        点击获取的是每一个treeview 每一行的数据

         changePid: function(dept) {
        this.$refs.mychild.theDeptName = null;
        this.$refs.mychild.qyId = dept.qyId;
        this.$refs.mychild.pageNo = 1;
        this.$refs.mychild.getDepartsByParentId(1, dept.id);
        this.$refs.mychild.changeParentName(dept.departName);
      },
```

> vue 内置组件 compoent 用法

* 参考博主地址[链接](https://blog.csdn.net/weixin_42333548/article/details/80532919)


## axios的使用方法--即GET、POST、 OPTION 、请求拦截的使用


> 博主记录：https://blog.csdn.net/weixin_42315962/article/details/80461536


### 我的记录：

> axios  在全局中使用

```
0 . 安装axios    npm/cnpm install axios --save
1 .在main.js将axios放在原型上   
	> 1.0 import axios from 'axios'
	> 1.1 Vue.prototype.axios = axios
2. 在你想用的vue文件中直接使用this.axios({method:'',url:''}).then().catch()直接使用

```
#### get 请求的使用

* 案例1 
```js
axios. get(){
  this.axios({
    method:"GET",
    url:'https://api.github.com',
    params:{
       user:999,//get请求中使用params传递参数
      },
    header:{
        token:123,//使用token在header里面
      },
   }).then((response)=>{
       console.log(response.data)
   }).catch((err)=>{})
},

```

* 案例2 


```js
addTypeName: function(typeId) {
				this.axios.get(this.baseUrl + '/user/dicField/getItemById?id=' + typeId, {}).then((data) => {
					this.typeName = data.data.data.name;
				})
			}
```

* 案例三

```js
 // -1 代表根部门
        this.axios.get(this.baseUrl + '/user/depart/getDepartsByQyId', {
          params: {
            "qyId": -1
          }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          if (response.data.code == 1) {
            this.departList = response.data.data;
          }
          return 1
        }).then((v) => {
          if (v) {
            this.axios.get(this.baseUrl + '/user/userAdmin/getUserBydepartId', {
              params: {
                "departId": this.item.departId
              }
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            }).then((response) => {
              this.userList = response.data.data;
            })
          }
        })
```

#### post 请求案例


```js
axios. post(){
            this.axios({
              method:'POST',
              url:'https://api.github.com',
              data:{
                userId:12,
              },
              header:{
                token:123,
              },
            }).then((res)=>{
              console.log(res)
            }).catch((err)=>{})
          },



```

> 案例2

```js
this.axios.get(this.baseUrl + '/user/depart/getDepartByDeptNoQyId?deptNo=' + this.depart.departNo + '&qyId=' + this.depart.qyId, {}).then((response) => {
						if(response.data.code == 1) {
							if(response.data.data != null) {
								this.$layer.msg('该部门编号已存在！');
								this.isUniqueDeptNo = true;
							} else {
								this.isUniqueDeptNo = false;
							}
						} else {
							this.$layer.msg('操作失败！');
						}
					})

```


#### axio 中post 请求案例



> 案例1 


```js
verifyLogin() {
        this.axios.post(this.baseUrl + "/user/userAdmin/verifyLogin", {}, {
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((res) => {
          if(res.data.code == 1) {
          	this.jumpModule(0);
          }
        })
      },
```

> 案例2 

```js
getDepartsByParentId: function(pageNo, parentId) {
				this.no = (pageNo-1)*this.pageSize;
				this.parentid = parentId;
				this.axios.post(this.baseUrl + '/user/depart/getDepartListByParentIdPagination', {
					qyId: this.qyId,
					departName: this.theDeptName,
					parentId: this.parentid,
					limit: this.pageSize,
					page: pageNo
				}, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then((res) => {
					if(res.data.code == 1) {
						this.total = res.data.data.total; // 赋值 总条数
						this.list = res.data.data.rows; // 后台返回list
						$('#bmTable').bootstrapTable("destroy").bootstrapTable({
							pagination: false,
							toolbar: '#bmtoolbar', //工具按钮用哪个容器
							data: res.data.data.rows, // 直接传值给Data
							uniqueId: "id",
							height: $(".content").height() - 320,
							columns: this.columns,
							sortable: true,
							striped: true
						});
						$(".optioncolum").on("click", ".edit", this.edit);
						$(".optioncolum").on("click", ".detail", this.detail);
					}
				})
			},

     
```
后台post  controlal 书写

```java

    // DepartQueryDto 中有分页(当前页0、每页限制limit、总条数count等) 对应的信息以及 父类 部门对应的属性 （部门编号、名字等）
     @PostMapping(value="/getDepartListByParentIdPagination",produces="application/json;charset=UTF-8")
    @Override
    public RestMessage<Map> getDepartListByParentIdPagination(@RequestBody DepartQueryDto departQueryDto) {
        Map map = new HashMap();
        try {
            List<SeDepart> seDepartList = departService.listDepartByParentId(departQueryDto);
            map.put("rows", seDepartList);
            map.put("total", departQueryDto.getCount());
            return new RestMessage(map);
        }catch (Exception e) {
            e.printStackTrace();
            return new RestMessage(RespCodeAndMsg.FAIL);
        }
    }
```

#### axio 中 option使用


> 案例1 

```js
axios.defaults.baseURL = 'https://api.example.com';		//不用重复去写url
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;	//不用重复去传token
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

```

#### axio 中拦截器使用


> 案例1 


```js
this.axios.interceptors.request.use((config)=>{
           console.log('请求前的拦截');			
           console.log('loading.....');
           return config
         }),
         this.axios.interceptors.response.use((response)=>{
            console.log('响应拦截');//响应拦截
             return response;
	})

```


## vue中零碎方法记录


### 判断数组中是否包含一个值


```js
$.inArray(row.id, overAllIds) != -1)
```


## vue 中分页 插件 


### 博主记录

[地址](http://www.jq22.com/jquery-info15311)



## 弹出新页面方法

```js
this.$layer.iframe({
          title: '隐患上报',
          content: {
            content: addhidanger, //传递的组件对象
            parent: this, //当前的vue对象
            data: {
              userid: this.userid,
              responsibleDepartid: this.departid
            } //props
          },
          area: ['800px', '555px'],
          shadeClose: false //不关闭
        });
```

## 生成隐患id 


```js
 guid: function () {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        var uuid = (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
        this.item.id = uuid;
        return uuid;
      },

```

## 时间控件


```js
defineDateControl() {
        var that = this;
        var config = {
          language: 'zh-CN',
          format: 'yyyy-mm-dd hh:ii:ss',
          weekStart: 1,
          todayBtn: 1,
          autoclose: 2, // 选中之后是否 自动 关闭
          todayHighlight: 1, // 当日高亮选中
          startView: 2, // 刚开始从日开始
          minView: 2, //
          forceParse: 0,
          showMeridian: 1
        };
        $('#hidangerList input[name=checkstarttime]').datetimepicker(config).on('hide', function (ev) {
          var value = $('#hidangerList input[name=checkstarttime]').val();
          that.check = value;
          var starttime = $('#hidangerList input[name=checkstarttime]').val().trim();
          var endtime = $('#hidangerList input[name=checkendtime]').val().trim();
          var minustime = that.getDate(endtime) - that.getDate(starttime);
          if (minustime < 0 && endtime != "") {
            that.$layer.msg("结束日期不能小于起始日期");
            that.check_time = '';
            that.deadline = '';
          } else {
          }
        });
        $('#hidangerList input[name=checkendtime]').datetimepicker(config).on('hide', function (ev) {
          var value = $('#hidangerList input[name=checkendtime]').val();
          that.checkendtime = value;
          var starttime = $('#hidangerList input[name=checkstarttime]').val().trim();
          var endtime = $('#hidangerList input[name=checkendtime]').val().trim();
          var minustime = that.getDate(endtime) - that.getDate(starttime);
          if (minustime < 0) {
            that.$layer.msg("结束日期不能小于起始日期");
            that.check_time = '';
            that.deadline = '';
          } else {
          }
        });
      },


        $('#findtime').datetimepicker('setEndDate', new Date()); // 设置开始时间
         $('#deadline').datetimepicker('setStartDate', new Date()).on('hide',function(ev){ // 设置结束时间

        });
```

## 字符串判空


```js

function isBlank(str) {
return (!str || /^\s*$/.test(str));
}

  if (this.item.hiddenDangerDepart.length<=0) { // 责任部门为kong  则 返回
          return;
        }
```

## vue -ref 使用

> 目的就是 为了减少直接对dom的操作 ，直接给父组件注册一个 引用，直接使用

```js
<div id="app">
  <h1>{{ message }}</h1>
  <button ref="myButton" @click="clickedButton">点击偶</button>
</div>
let app = new Vue({
    el: '#app',
    data () {
        return {
            message: 'Hi!大漠'
        }
    },
    methods: {
        clickedButton: function () {
            console.log(this.$refs)
            this.$refs.myButton.innerText = this.message
        }
    }
})
```


## input上传控件


```html
 <div class="inpImg clearfix">
                    <input ref="fileInput1" @change="selectFile" type="file" placeholder="请选择文件"
                           accept="image/jpg,image/jpeg,image/gif,image/bmp,image/png"/>
                  </div>


```

```js
selectFile:function(obj,e) {
        let files = e.target.files || e.dataTransfer.files;
        let self = this;
        if(files.length){
        	let flag=false;
            let allImgExt = '.jpg|.jpeg|.gif|.bmp|.png|';
            let filePath = e.target.value;
            let extName = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
            if(allImgExt.indexOf(extName+'|') == -1){
               obj.$layer.alert('请选择正确的图片类型！', (id) => {
			       obj.$layer.close(id);
		       });
                return;
            }
            let arr=filePath.split('\\');
            let file = files[0];
            if (file.size / 1024 > 1000) {//大于1兆的情况下进行压缩
		       flag=true;
		    }
            let reader = new FileReader();
            reader.readAsDataURL(file);
            if(flag){
            	reader.onloadend = function() {
			        obj.picArr.push(reader.result);
			        let result = this.result;
	          		let img = new Image();
	         		img.src = result;
		          	img.onload = function() {
			            let data = self.compress(img);
			            self.imgUrl = result;
			            let blob = self.dataURItoBlob(data);
						obj.fileArr.push(blob);
		          	};
		        };
            }else{
            	reader.onloadend = () => {
	                obj.picArr.push(reader.result);
	                obj.fileArr.push(file);
	            }
            }

        }
        //e.target.value = '';
        //obj.$previewRefresh();手机预览
    },
```




## 文件上传


```js
		
			uploadImg(e) {
				let _this = this
				let files = e.target.files[0]
				this.file = files
				let reader = new FileReader()
				reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
				reader.onloadend = function() {
					_this.src = this.result
				}
			}
		},

obj.then((response) => {
							if(response.data.code == 1) {
								if(this.file != undefined) {
									//创建 formData 对象
									
									var formData = new FormData();
									// 向 formData 对象中添加文件
									formData.append('file', this.file);
									this.axios.post(this.baseUrl + "/mongodb/uploadFile", formData).then((response) => {
										var filesid = response.data.data
										console.log("filesid: "+ filesid);
										if(filesid != null) {
											var formData1 = new FormData();
											formData1.append("parentId", this.id);
											formData1.append("id", filesid);
											formData1.append("fjSource", 'photo');
											this.axios.post(
												this.baseUrl + "/mongodb/fileInfo/uploadFiles",
												formData1,
											).then((response) => {
												this.$parent.initGrid(1);
												this.$layer.close(this.$options.propsData.layerid);
												this.$layer.msg('操作成功！');
											})
										}
									})
								}
								this.$layer.closeAll();

								this.$layer.msg('操作成功！');
								this.$parent.getUsersByDepartId(1, this.$parent.departId);
							} else {
								this.$layer.msg('操作失败！')
							}
						})




```

## 扩展vue 验证


```js

this.$validator.extend('phone', {
				messages: {
					zh_CN: field => field + '必须是11位手机号码'
				},
				validate: value => {
					return value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
				}
			})
			this.$validator.extend('idCard', {
				messages: {
					zh_CN: field => field + '请输入正确的身份证号'
				},
				validate: value => {
					return value.length === 18 && /^\d{17}[0-9Xx]$/.test(value)
				}
			})
```


## 读取图片

```js
getDangerImages: function () {

        this.axios.post(this.baseUrl + '/mongodb/DangerMongodb/getDangerFileInfoList', {
          parentId: this.dangerid,
          type: 2,
          fjSource: "dangerInfo_check"
        }).then((res) => {

          if(res.data.code==1){
            console.log("查询成功")
            var files = res.data.data
            console.log(files)
            if (files != null) {
              console.log(this.formDateInner.imgs, this.baseUrl, files)
              this.$set(this.formDateInner,'imgs',[])
              // this.formDateInner.imgs = []
              for (var fileinfo of files.rows) {
                let url = this.baseUrl + '/mongodb/getDownloadOutputStream?fileId=' + fileinfo.id
                this.formDateInner.imgs.push(url)
              }
            }
          }
        });
      },
```


## vue 中 van-list  

```js
<van-list v-model="configVanList.loading" :finished="configVanList.finished" finished-text="没有更多了" :error-text="'请求失败，点击重新加载' + configVanList.errCode"
      @load="getRiskList" :error.sync="configVanList.err">
      <van-cell-group v-for="(item,index) in hidangerList" :key="index" @click="hidangerInfoClick(item)" style="border-bottom: 1px solid #e1e1e1;">

        <van-row>
          <van-col :span="i.span || 12" v-for="i in listPanelItem">
            <van-cell v-bind:key="item.id" :title="i.title + ':'" :value="item[i.field]" />
          </van-col>
        </van-row>
      </van-cell-group>
</van-list>
```

### 总结

```


```

### 博主

* [van-list](https://blog.csdn.net/ddengjiayao/article/details/94027270)


## vue 中 子父传值


### $emit 的使用


* 博主记录：
代码案例：

子组件点击并触发方法，并且修改父组件的值

```js
// 子组件

<template>  
  <div class="train-city">  
    <h3>父组件传给子组件的toCity:{{sendData}}</h3>   
    <br/><button @click='select(`大连`)'>点击此处将‘大连’发射给父组件</button>  
  </div>  
</template>  
<script>  
  export default {  
    name:'trainCity',  
    props:['sendData'], // 用来接收父组件传给子组件的数据  
    methods:{  
      select(val) {  
        let data = {  
          cityname: val  
        };  
        this.$emit('showCityName',data);//select事件触发后，自动触发showCityName事件  
      }  
    }  
  }  
</script>

// 父组件

<template>  
    <div>父组件的toCity{{toCity}}</div>  
    <train-city @showCityName="updateCity" :sendData="toCity"></train-city>  
<template>  
<script>  
  import TrainCity from "./train-city";  
  export default {  
    name:'index',  
    components: {TrainCity},  
    data () {  
      return {  
        toCity:"北京"  
      }  
    },  
    methods:{  
      updateCity(data){//触发子组件城市选择-选择城市的事件  
        this.toCity = data.cityname;//改变了父组件的值  
        console.log('toCity:'+this.toCity)  
      }  
    }  
  }  
</script>

```

* 字符传值2

```js
//  子组件 
 app 通过属性，把方法传入到子，再用 this.$emit 进行方法调用与参数传递

  props: {
      form: [Object],
      refreshDangerList:{
        type: Function,
        default:null
      }
    },

 this.$emit('refreshDangerList','hiddenTroubleReform') // 刷新主页面数据

//  父组件
 hidangerInfoClick(item) {
     
        let routerName = this.tabSelected
        console.log(item, routerName)
        this.$router.push({
          name: routerName,
          params: {
            form: item,
            editable: false,
            refreshDangerList:tabTabs
          },
        })
      },
```

## 确定吗 pc 端 

```js
 this.$dialog.confirm({
                message: '确定删除吗？'
              }).then(() => {
                alert("删除隐患："+instance.$attrs.troubleId);
                instance.close();
              });
```

## watch 

### watch 使用介绍


### watch博主记录

* [详解 deep、immediate](https://www.jianshu.com/p/b70f1668d08f)

```
deep:对象中的属性改变就执行某方法
immediate: 值在最初就进行 watch
 data:{
     a:1,
     b:{
         c:1
     }
 },
 watch:{
     a(val, oldVal){//普通的watch监听
         console.log("a: "+val, oldVal);
     },
     b:{//深度监听，可监听到对象、数组的变化
         handler(val, oldVal){
             console.log("b.c: "+val.c, oldVal.c);//但是这两个值打印出来却都是一样的
         },
         deep:true
     }
 }

监听对象中的某一个值：
方法1 ：

 watch:{
     a(val, oldVal){//普通的watch监听
         console.log("a: "+val, oldVal);
     },
     'b.value':{//深度监听，可监听到对象、数组的变化
           handler(val, oldVal){
              console.log("b.value: "+val.value, oldVal.value);//但是这两个值打印出来却都是一样的
          },
          deep:true
     }
}

方法2 ：借助computed

computed: {
    newNum: function () {
      return this.b.value
    }
  }
watch:{
    newNum:{
      handler(val, oldVal){
         console.log(oldVal);
      },
      deep:true
    }
}


```



## 暂时记录：


保存关联

```
 // 保存图片与当前模块的关联
        var formData1 = new FormData();
        formData1.append("parentId", that.parentId);
        formData1.append("id", that.id);
        formData1.append("fjSource", that.fjSource);
        formData1.append("type", that.type);

        await this.axios.post(this.baseUrl + "/mongodb/fileInfo/uploadFilesAndType", formData1, {
          'Content-type' : 'application/json'
        }).then((res) => {
          if (res.data.code === 1) {

            this.setParentID(this.id)
            this.$layer.close(this.$options.propsData.layerid);
            this.$layer.msg('操作成功！');
          }
        });;
      },
```


