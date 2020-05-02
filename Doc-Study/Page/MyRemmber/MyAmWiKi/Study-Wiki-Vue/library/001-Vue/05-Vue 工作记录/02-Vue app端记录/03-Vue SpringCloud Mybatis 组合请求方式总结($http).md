#  vue 项目 app vant ui框架 中使用的请求的四种方式的使用


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

