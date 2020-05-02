# vue pc 端 与 Spring cloud Mybatis 请求方式的总结以及使用

# 项目请求访问的路径配置

## 设置请求路径：

### pc端 vue 项目中设置项目公用的请求路径

app.vue 定义baseUrl 

```
 baseUrl: 'http://localhost:8762/api'

定义：
 localStorage.setItem('url', this.baseUrl)
 使用
 localStorage.getItem('url')

```

 决定baseurl 端口与路径的是后端服务中定义的，这里使用的是spring cloud 框架，其中 zuul服务中的application.yml 配置中配置所需要地址与端口如下：

```yml
server:
  port: 8762
  servlet:
    context-path: /api
eureka:
  client:
    registerWithEureka: true #服务注册开关
    fetchRegistry: true #服务发现开关
    serviceUrl: #Eureka客户端与Eureka服务端进行交互的地址，多个中间用逗号分隔
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address:  true  #将自己的ip地址注册到Eureka服务中
    ip-address: 127.0.0.1
    instance-id: ${spring.application.name}:${server.port} #指定实例id
```


# 四种请求方式 post get put delete 请求后台前后端写法

## get 

* 基本使用语法

```js
axios.get(){
  this.axios({
    method:"GET",
    url:'https://api.github.com',
    params:{
       user:999,//get请求中使用params传递参数
    ,
    header:{
        token:123,//使用token在header里面
      },
   }).then((response)=>{
       console.log(response.data)
   }).catch((err)=>{})
},

```

* 案例1: 在请求头的路径问好中添加参数

```js
addTypeName: function(typeId) {
    this.axios.get(this.baseUrl + '/服务名/control层路径/方法路径?id=' + typeId, {}).then((data) => {
        this.typeName = data.data.data.name;
    })
}
```

* 案例2：在params 参数中添加需要的参数

```js
      getDangerFlowIdPaicha() {
        this.axios.get(this.baseUrl + '/服务名/control层路径/方法路径', {
          params: {
            dangerId:"传值" // params 中的参数名需要与后台RewquestParam中定义的字符串相同，否则 400 报错，参数传递后台会报错
          }
        }).then((res) => {
          if (res.data.code == 1) { // res.data 是返回数据，.code是数据对象中属性
              this.*** = res.data.data.id // 赋值
          } else {
            console.log("失败")
          }
        });
      },

      // 注意、如果后台没有定义produces 那么前端需要指定数据类型；具体如下：headers中需要定义
        getlimitTypes: async function(){
                await this.axios.get(this.url+'/occuhealth/occuhealthtest/getTestType', {
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((response) => {
                        this.testTypes = response.data.data;
                    })
            },
        }

```
后台参数control接受

```java
 @GetMapping(value = "/getDangerPaichaFlowId", produces = "application/json;charset=UTF-8")
    @Override
    public RestMessage getDangerFlowId(@RequestParam("dangerId") String dangerId) {
        return new RestMessage(hdf2); //  new RestMessage(hdf2) 即与前端 res.data 等价
    } // dangerId 
```


* 案例3 ，get 方式请求，params 传参，并设置请求数据类型，返回值

```js
 // -1 
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


* 案例四
 > 多个参数get,? 路径形式

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

## post 请求案例


* 基本用法
```js
axios.post(){
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

* 案例1  无参


```js
verifyLogin() {
        this.axios.post(this.baseUrl + "/user/userAdmin/****", {}, {
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((res) => {
          if(res.data.code == 1) {
           
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

## put

* 参数请求体写法

> 前端vue 写法
```js
obj = this.axios.put(this.baseUrl + '/user/userAdmin/updateUser', this.item, {
						headers: {
							'Content-Type': 'application/json'
						}
          })
          

```
> 后台参数接受


```java

    @PutMapping(value="/updateUser",produces="application/json;charset=UTF-8")
    public RestMessage updateUser(@RequestBody SeUser seUser) {
        int i = userService.updateByPrimaryKeySelective(seUser);
        if(i>0){
            return new RestMessage();
        }
        return new RestMessage(RespCodeAndMsg.FAIL);
    }

```

* 参数 ？ 路径拼接写法

> vue 前端编写

```js
this.axios.put(this.baseUrl + '/danger/dangeraccount/changeIsvisible/' + id, {}).then((data) => {
          if (data.data.code == 1) {
            this.$layer.msg('操作成功！');
          } else {
            this.$layer.msg('操作失败！');
          }
        })
```


```java
@PutMapping(value="/changeIsvisible/{id}")
    @Override
    public RestMessage changeIsvisible(@PathVariable("id") String id) {
        try{
            Integer i =dangerinfoservice.changeIsvisible(id);
            if(i>0){
                return new RestMessage();
            }else{
                return  new RestMessage(RespCodeAndMsg.FAIL);
            }
        }catch (Exception ex){
            ex.printStackTrace();
            return  new RestMessage(RespCodeAndMsg.FAIL);
        }
    }
```



## delete


###  delete 批量删除案例

```js

// 批量获取bootstraptable 选中的id
obtainids: function (element, that) {
    var selectedItem = $(element).bootstrapTable('getSelections');
    var selectedIdStr = "";
    $(selectedItem).each(function () {
      selectedIdStr += this.id + ',';
    });
    if (selectedIdStr != "") {
      return selectedIdStr.substring(0, selectedIdStr.length - 1);
    } else {
      that.$layer.msg('请选择操作项！');
      return null;
    }
  },

* 删除

ids:以逗号分割的字符串
deleteRole: function() {
				var ids = this.obtainids(roleTable);
				if(ids) {
					this.$layer.alert('确定要删除所选项吗？', (id) => {
						this.axios.delete(this.baseUrl + '/auth/role/deleteRoleByIds/' + ids, {}).then((res) => {
							if(res.data.code == 1) {
								this.initGrid(1);
								this.$layer.msg('操作成功！');
								this.$layer.close(id);
							}else {
								this.$layer.msg('操作失败！');
							}
						});
					});
				}
			},

```

* 后台


```java
 @DeleteMapping(value = "/deleteRoleByIds/{ids}")
    @Override
    public RestMessage<Integer> deleteRoleByIds(@PathVariable("ids")String ids) {
        Integer i =roleService.deleteRoleIds(ids);
        if(i > 0) {
            return new RestMessage();
        }else {
            return new RestMessage(RespCodeAndMsg.FAIL);
        }
    }
```


### 批量删除案例2 requestParams 形式


```js
 //批量删除入厂记录
      delInfo: function () {
        if(this.obtainids(addmissionTable)){
          if (this.selectIds) {
            this.$layer.alert('确定要删除吗?', (id) => {
              this.axios.delete(this.baseUrl + '/contractor/admission?selectIds=' + this.selectIds + "&selectPicIds=" + this.selectPicIds + '', {}
              ).then((res) => {
                if (res.data.code) {
                  this.initGrid(1);
                  this.$layer.msg('操作成功！');
                  this.$layer.close(id);
                }
              })
            });
          }
        }
      },
```



```java
@Override
    @DeleteMapping(value = "/admission", produces = "application/json;charset=UTF-8")
    public RestMessage delAdmission(@RequestParam("selectIds") String ids, @RequestParam("selectPicIds") String picIds) {
        try {
            contractorAdmissionService.delAdmission(ids, picIds);
        } catch (Exception e) {
            e.printStackTrace();
            return new RestMessage(RespCodeAndMsg.FAIL);
        }
        return new RestMessage(RespCodeAndMsg.SUCCESS);
    }


```

* mybatis 底层 批量删除

```xml

    <delete id="delAdmission" parameterType="String">
        delete
        from contractor_admission
        where id in
        <foreach collection="array" separator="," close=")" open="(" item="id">
            '${id}'
        </foreach>
    </delete>
```


# axio option 使用

> 案例1 

```js
axios.defaults.baseURL = 'https://api.example.com';		//不用重复去写url
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;	//不用重复去传token
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

```

# axio 中拦截器使用


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



