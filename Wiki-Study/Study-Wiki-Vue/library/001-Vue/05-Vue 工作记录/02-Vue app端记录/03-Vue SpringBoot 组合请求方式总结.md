#  Vue SpringBoot 组合请求方式总结 四种方式的使用


## 配置路径


## get


### get方式 获取访问前端 案例1 


```js

getResultPrePhoto: function () {
        this.$http({
          url: this.$http.adornUrl(`/danger/dangerinfoMobile/getDangerphotoById`),
          method: 'get',
          params: this.$http.adornParams({
            id: this.HidenDangerDto.id,
            flowId:""
            // id: "7f298027-0dd1-4ea8-a6ca-d883aafab753"
          })
        }).then(({data}) => {
          if (data && data.code === 1) {
            if (data.code == 1) {
              this.EditPicArr = data.data.fileprelist;
              console.log("EditPicArr",this.EditPicArr)
              this.EditPicArr.forEach((item) => {
                console.log(item,"item")
                // let curentHidenDangerDto = {url:this.$http.adornUrl('/mongodb/getDownloadOutputStream?fileId='+item),isImage:true};
                // this.HidenDangerDto.fileprelist.push({url:this.$http.adornUrl(this.baserURL+'/mongodb/getDownloadOutputStream?fileId=5d71c6536a246f4358d428a5'),isImage:true})
                // this.HidenDangerDto.fileprelist.push({url:this.$http.adornUrl('/mongodb/getDownloadOutputStream?fileId='+item),isImage:true})
                this.picArr.push({url:this.$http.adornUrl('/mongodb/getDownloadOutputStream?fileId='+item),isImage:true})
              })
            } else {
              this.$toast({
                duration: 1000,
                message: '获取排查图片异常！！'
              })
            }
          } else {
            this.$toast({
              duration: 1000,
              message: data.data
            })
          }
        }).catch(() => {
          this.$toast({
            duration: 1000,
            message: '网络异常，请稍后重试...'
          })
        })
      },

```


### get方式 获取访问后台


```java


 @GetMapping(value = "/getDangerphotoById", produces = "application/json;charset=UTF-8")
    @Override
    public RestMessage<HiddenDangerDto> getDangerphotoById(@RequestParam("id") String id,@RequestParam("flowId") String flowId ) {
        try {
            HiddenDangerDto dao = dangerinfoservice.getDangerphotoById(id,flowId);
            return new RestMessage<>(dao);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new RestMessage(RespCodeAndMsg.FAIL);
        }
    }
```

### get 方式前端  案例2 


```js

changeDutteyNameList() {
        this.$http({
          url: this.$http.adornUrl(`/user/userAdmin/getUserBydepartId`),
          method: 'get',
          params: this.$http.adornParams({
            "departId": this.HidenDangerDto.hiddenDangerDepart
          })
        }).then(({
          data
        }) => {
          console.log(data.data);
          if (data && data.code === 1) {
            this.responseUserList = []
            data.data.forEach((item) => {
              this.responseUserList.push({
                id: item.id,
                text: item.realName
              })
            })
            console.log(this.responseUserList)
          } else {
            this.$toast({
              duration: 1000,
              message: data.data
            })
          }
        }).catch(() => {
          this.$toast({
            duration: 1000,
            message: '网络异常，请稍后重试...'
          })
        });

      },
```



### get 请求   window.location.href 方式传入实体对象到后端


#### 简单对象

前端直接使用实体接受就可以

```js
  window.location.href =
            log.exportExcelUrl + "/exportBaseLog?" +
            "logDescription=日志描述" 
            + '&startTime=2021-02-11 00:00:00'
            + '&endTime=2021-02-12 12:22:22'
```

* 实体

```java

@Data
@Accessors(chain = true)
public class BaseLogDto {

    private String logDescription;

    private String startTime;

    private String endTime;

}

```


* 接口写法

```java
    @GetMapping(value = "/exportBaseLog")
    public void exportBaseLogGet(BaseLogDto logDto, HttpServletResponse response) {

        BaseExampleDto exampleDto = new BaseExampleDto();
        exampleDto.getQueryParamsLike().put("logDescription", logDto.getLogDescription());
        exampleDto.getQueryParamsTime().put("createTime", new String[]{logDto.getStartTime(), logDto.getEndTime()});
        List<BaseLog> rows = super.getByExample(exampleDto).getData().getRows();

        baseLogService.exportBaseLog(rows, response);
    }
```

#### 复杂对象，使用json字符串传输，后端再转为对象


> 1 前端代码

主要是将json中的特殊符号进行转换

转换之前的字符串（不进行转换走不到后端）

```js
http://10.0.12.66:27502/gp-xsn/baseLog/exportBaseLog?baseLogMultiTableDto={"page":1,"limit":10,"baseLog":{"queryParamsEqual":{},"queryParamsLike":{"logDescription":""},"queryParamsTime":{"createTime":["",""]},"sortParams":{"createTime":"DESC"}},"baseUser":{"queryParamsLike":{"userName":""},"sortParams":{"userName":"DESC"}},"baseOrganization":{"queryParamsLike":{"organizationName":""},"sortParams":{"organizationName":"DESC"}}}
```

转化之后的字符串

```js
http://10.0.12.66:27502/gp-xsn/baseLog/exportBaseLog?baseLogMultiTableDto=%7B"page"%3A1%2C"limit"%3A10%2C"baseLog"%3A%7B"queryParamsEqual"%3A%7B%7D%2C"queryParamsLike"%3A%7B"logDescription"%3A""%7D%2C"queryParamsTime"%3A%7B"createTime"%3A%5B""%2C""%5D%7D%2C"sortParams"%3A%7B"createTime"%3A"DESC"%7D%7D%2C"baseUser"%3A%7B"queryParamsLike"%3A%7B"userName"%3A""%7D%2C"sortParams"%3A%7B"userName"%3A"DESC"%7D%7D%2C"baseOrganization"%3A%7B"queryParamsLike"%3A%7B"organizationName"%3A""%7D%2C"sortParams"%3A%7B"organizationName"%3A"DESC"%7D%7D%7D
```

```js
   window.location.href =
            log.exportExcelUrl + "/exportBaseLog?baseLogMultiTableDto="+ encodeURIComponent(JSON.stringify(this.listQuery), 'utf-8')
```


> 2 后端


实体：

```java
@ApiModel("基础查询实体")
public class BaseExampleDto extends BasePage {
    @ApiModelProperty("查询属性和值对应的map集合（k-传入实体类的属性,v-查询需要相等的值）,精确查询")
    private Map<String, Object> queryParamsEqual = new HashMap();
    @ApiModelProperty("查询属性和值对应的map集合（k-传入实体类的属性,v-查询需要相等的值），模糊查询")
    private Map<String, String> queryParamsLike = new HashMap();
    @ApiModelProperty("查询属性和值对应的map集合（k-传入实体类的属性,v-查询需要不相等的值），精确查询")
    private Map<String, Object> queryParamsNotEqual = new HashMap();
    @ApiModelProperty("查询属性和值对应的map集合（k-排序的字段,v-排序方式【asc,desc】），排序，默认按创建时间降序createTime desc")
    private Map<String, String> sortParams = new HashMap();
    @ApiModelProperty("查询属性和值对应的list集合根据顺序多条件排序")
    private List<MyOrder> sortParamsList = new LinkedList();
    @ApiModelProperty("时间查询参数集合")
    private Map<String, String[]> queryParamsTime = new HashMap();
    @ApiModelProperty("年份查询参数集合")
    private List<MyYear> yearParamsList = new LinkedList();
    @ApiModelProperty("集合参数查询")
    private Map<String, List<Object>> queryParamsIn = new HashMap();
    @ApiModelProperty("集合参数查询")
    private Map<String, List<Object>> queryParamsNotIn = new HashMap();
    @ApiModelProperty("查询参数是否为NULL,true为IS NULL, false为IS NOT NULL")
    private Map<String, Boolean> queryParamsNull = new HashMap();
    @ApiModelProperty("查询组织的map集合（k-传入实体类的属性,v-选中的组织id）,向下查找权限内所有组织")
    private Map<String, String> queryParamsOrg = new HashMap();
    @ApiModelProperty("查询属性和值对应的map集合（k-传入实体类的属性,v-查询需要相等的值）,or查询")
}
```
```java
@Data
@ApiModel(value = "多表查询日志dto")
@SearchExample
public class BaseLogMultiTableDto  extends BasePage {

    @ApiModelProperty(value = "日志主表")
    @MainTable(entity = BaseLog.class,aliasName = "LOG")
    private BaseExampleDto baseLog;

    @ApiModelProperty(value = "关联用户表")
    @LeftJoinTable(entity = BaseUser.class, aliasName = "USER_1", on = "LOG.CREATE_PEOPLE = USER_1.ID")
    private BaseExampleDto baseUser;

    @ApiModelProperty(value = "关联组织表")
    @LeftJoinTable(entity = BaseOrganization.class, aliasName = "ORG", on = "USER_1.ORGANIZATION_ID = ORG.ID")
    private BaseExampleDto BaseOrganization;

//    top 100 percent
    @SelectField(sql = " LOG.* ,\n" +
            "        USER_1.USER_NAME USER_NOW_NAME,\n" +
            "        USER_1.USER_ORG_TYPE,\n" +
            "        USER_1.USER_ORG_DEALER_TYPE,\n" +
            "        ORG.ORGANIZATION_NAME USER_ORG_NAME" )
    private String selectField;


```

```java
    @GetMapping(value = "/exportBaseLog")
    public void exportBaseLogGet(@RequestParam("baseLogMultiTableDto")  String baseLogMultiTableDto, HttpServletResponse response) {

        // 进行转换
        BaseLogMultiTableDto baseLogMultiTableDto1 = JSONObject.parseObject(baseLogMultiTableDto, BaseLogMultiTableDto.class);

        List<BaseLogMultiTableVo> rows = this.getBaseLogMultiByDto(baseLogMultiTableDto1).getData().getRows();

        baseLogService.exportBaseLog(rows, response);
        return;
    }
```


## post 案例

文本数据
```js


图片：
uploadDangerImg(flowId) {
        console.log("文件上传..")
        let formData = new FormData();
        if (this.fileArr.length) {
          this.fileArr.forEach((item) => {
            formData.append('files1', item);
          });
        }
        if (this.fileIds.length) {
          this.fileIds.forEach((item) => {
            formData.append('fileIds', item);
          });
        }
        formData.append("parentId", this.HidenDangerDto.id);
        // formData.append("parentId", "7f298027-0dd1-4ea8-a6ca-d883aafab753"); // 当前的一条隐患信息
        if(this.editable){
          // 是编辑页面
          formData.append("fjSource", 'dangerInfo_check'+"|"+this.dangerFlowIdpaicha);
        }else{
          // 不是编辑页面
        formData.append("fjSource", 'dangerInfo_check'+"|"+this.HidenDangerDto.flowId);
        }
        formData.append("type", 1); // 隐患图片：1
        this.$http({
          url: this.$http.adornUrl(`/mongodb/DangerMongodb/saveDangerinfoImage`),
          method: 'post',
          headers: {'Content-Type': 'multipart/form-data'},
          data: formData ----------------------------- 注意，这里直接formdata 不能写this.$http.adornData(formData)
        }).then(({
          data
        }) => {
          this.$toast({
            duration: 1000,
            message: '提交隐患成功！'
          })
          this.$router.go(-1);
          // this.$toast({
          //   duration: 1000,
          //   message: '图片上传成功！！'
          // })
        });
      },



this.$dialog.confirm({
    message: "确认提交？"
    }).then(() => {
    this.$http({
        url: this.$http.adornUrl(`/danger/dangerinfoMobile/saveDangerinfo`),
        method: 'post',
        data: this.$http.adornData(this.HidenDangerDto)
    }).then(({data}) => {
        if (data && data.code === 1) {
        this.HidenDangerDto.id=data.data.id // 获取返回的 隐患id
        this.HidenDangerDto.flowId = data.data.flowId;
        this.uploadDangerImg()
        }
    })
 });// 确认
```

```java
@PostMapping(value = "/saveDangerinfo", produces = "application/json;charset=UTF-8")
    @Override
    public RestMessage<HiddenDangerDto> saveDangerinfo(@RequestBody HiddenDangerDto hiddenDangerDto) {
        try {
            HiddenDangerDto hdt = new HiddenDangerDto();
            if (hiddenDangerDto.getId().equals("")) {
                // 没有id 则说明是新增
                if (dangerinfoservice.saveDangerinfo(hiddenDangerDto) == 1) {
                    hdt.setId(hiddenDangerDto.getId());
                    hdt.setFlowId(hiddenDangerDto.getFlowId());
                };
            } else {
                // 修改
//                dangerinfoservice.UpdataHiddendanger();
                HiddenDanger hiddenDanger = new HiddenDanger();
                BeanUtils.copyProperties(hiddenDangerDto, hiddenDanger);
                dangerinfoservice.updateDangerinfo(hiddenDanger);
                hdt=hiddenDangerDto;
            }
            RestMessage restMessage = new RestMessage(hdt);
            return restMessage;
        } catch (Exception ex) {
            ex.printStackTrace();
            return new RestMessage(RespCodeAndMsg.FAIL);
        }
    }
```


## put


## delete 


### delete 请求


### delete 删除案例 


```js
delRecord (id) {
          this.$dialog.confirm({
            title: '删除记录',
            message: '您确认要删除吗?'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/accidentManage/deleAccidentBR/'+id),
              method: 'delete',
            }).then(({ data }) => {
              if (data && data.code === 1) {
                this.$toast({
                  duration: 1000,
                  message: '删除成功'
                });
                this.accidentList = [];
                this.finished = false
              } else {
                this.$toast({
                  duration: 1000,
                  message: data.data
                })
              }
            }).catch(() => {
              this.$toast({
                duration: 1000,
                message: '网络异常，请稍后重试...'
              })
            })
          }).catch(() => {
            //  cancle
          })
        },
```

