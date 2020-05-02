# Vant 工作记录

## 弹出框 picker:

```
https://blog.csdn.net/HYeeee/article/details/82714315
```

## 请求方式


```js
this.$http({
        // url: this.$http.adornUrl(`/danger/dangerinfo/getDangerDaoByid/${this.id}`),
        url: this.$http.adornUrl('/danger/dangerinfo/getDangerDaoByid/'+this.HidenDangerDto.id),
        method: 'post',
        data: this.$http.adornData(this.HidenDangerDto)
      }).then(({
        data
      }) => {
        if (data && data.code === 1) {}
```



### 案例

* 获取部门信息
```js
getDepartList () {
      this.$http({
        url: this.$http.adornUrl('/user/dicField/getItemlistByCode'),
        method: 'get',
        params: this.$http.adornParams({
          'qyid': 'b3d4f3dd-dfe6-4c5b-afb1-be8ea7278ea0'
        })
      }).then(({ data }) => {
        if (data && data.code === 1) {
          this.objectColumns = [{ id: '', text: '' }]
          data.data.forEach((item) => {
            this.objectColumns.push({
              id: item.id,
              text: item.name
            })
          })
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
* 提交表单

```js
submitForm () {
      this.validateFormFields()
      if (!this.isPassValidateForm) {
        this.dataForm.empNo = this.getUser.empNo
        this.dataForm.observationPerson = this.getUser.userName
        this.$http({
          url: this.$http.adornUrl(this.dataForm.id ? '/daily/stopMonitorRecord/updateMobileRecord' : '/daily/stopMonitorRecord/addMobileRecord'),
          method: 'post',
          data: this.$http.adornData(this.dataForm)
        }).then(({ data }) => {
          // this.$store.commit('setUser', this.loginForm)
          if (data && data.code === 1) {
            this.$toast({
              duration: 1000,
              message: '操作成功'
            })
            this.$router.go(-1)
          } else {
            this.$toast({
              duration: 1000,
              message: data.message
            })
          }
        }).catch(() => {
          this.$toast({
            duration: 1000,
            message: '网络异常，请稍后重试...'
          })
        })
      }
    }
```

* 查询

```js


queryParam:{
             accidentName:'',
             level:'',
             type:'',
             typecla:'',
             qyId:'',
             limit: 6,
             page:1
           },

onSearch: function () {

          this.queryParam.qyId = this.getQyId;
          setTimeout(()=>{
            this.$http({
              url: this.$http.adornUrl('/accidentManage/getAccidentBRList'),
              method: 'post',
              data: this.$http.adornData(this.queryParam)
            }).then((res)=>{
              if(res && res.data.code == 1){
                this.total = res.data.data.total;
                res.data.data.rows.forEach((each)=>{
                  this.accidentList.push(each);
                });
                // 加载状态结束
                this.loading = false;
                //数据全部加载完成
                if(this.accidentList.length >= this.total){
                  this.finished = true;
                }
                this.queryParam.page = this.queryParam.page + 1
              }else {
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
          },500)
        }



```


* 获取当前用户id

```js
String userId = UserUtil.getCurrUserId();

getStopPlan () {
      // 异步更新数据
      setTimeout(() => {
        this.$http({
          url: this.$http.adornUrl('/daily/stopMonitor/getPlanListByUserId'),
          method: 'post',
          data: this.$http.adornData(this.queryParam)
        }).then(({ data }) => {
          if (data && data.code === 1) {

            this.total = data.data.total
            data.data.rows.forEach((item) => {
              this.stopPlanList.push(item)
            })
            // 加载状态结束
            this.loading = false
            // 数据全部加载完成
            if (this.stopPlanList.length >= this.total) {
              this.finished = true
            }
            this.queryParam.page = this.queryParam.page + 1
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
      }, 500)
    },
```


## toast


```
https://www.jb51.net/article/159958.htm
```

## img 图片


```js
<van-tab title="图片">
        <div v-if="imgArr.length" class="imgRow">
          <!-- <img 
            v-for="(img,index) in imgArr"
            :key="index"
            :src="baseUrl+'/mongodb/getDownloadOutputStream?fileId='+img.id"
            @click="imgPreview(img.id)"> -->
            <img 
            v-for="(img,index) in imgArr"
            :key="index"
            :src="that.$http.adornUrl('/mongodb/getDownloadOutputStream?fileId='+img.id)"
            @click="imgPreview(img.id)">
        </div> 
        <div v-else class="noData">
          暂无数据
        </div>
      </van-tab>
```

## 登录存储信息


```
{userId: "085af315-3b30-4122-9e64-b131879a9dcb", userName: "syb_admin", departName: "生产部门", loginName: "syb"}
```

## 验证


```
accidentBr-add.vue

errorMsg: {
          checkTime: '', // 排查时间
          content: '' // 隐患内容
        },
        rules: {
          checkTime: [
            {required: true, message: '请选择排查时间'}
          ],content: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback('请输入隐患内容');
                } else if (!isNumber(value)) {
                  callback('请输入正确的死亡人数');
                }
              }
            }
          ],
        }
```

## 确认删除吗 

```
this.$dialog.confirm({
        title: '删除记录',
        message: '您确认要删除吗?'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/daily/stopMonitorRecord/deleteByIds'),
          method: 'delete',
          params: this.$http.adornParams({
            ids: id
          })
        }).then(({ data }) => {
          if (data && data.code === 1) {
            this.$toast({
              duration: 1000,
              message: '删除成功'
            })
            this.recordList = []
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
```


## 多级联动
```
https://www.jianshu.com/p/3886f1eded67
```


## 监听vue 对象中的某一列属性
用compulte 坐中间层


```js
 // 用于数据回显以及上传信息存储的隐患对象
        HidenDangerDto: {
          id: '',
          checkTime: '',
          checker: "",
          checkDepart: '', // 受检部门id
          content: '',
          controlRequirements: '',
          capitalSource: '',
          deadline: '',
          hiddenDangerDepart: '', // 责任部门id
        }


computed: {
      // 监听
      HidendangerChange() {
        return this.HidenDangerDto.hiddenDangerDepart
      }
    },
    watch:{
      HidendangerChange(){
       alert(1)
      }
```


## app端签字


```

add-fire-info.vue

```


## 标签消息提示框


```html

带有提示框
<van-tabs v-model="tabSelected" swipeable @change='tabTabs'>
      <van-tab  name='hiddenTroubleDetail'>
        <div slot="title" style="position: relative">
          <span class="van-ellipsis">隐患列表</span>
          <span class="bridge van-info">1</span>
        </div>
      </van-tab>

      <van-tab  name='hiddenTroubleReform' >
          <div slot="title" style="position: relative">
            <span class="van-ellipsis">隐患整改</span>
            <span class="bridge van-info" v-if="userTitleCount.titleReform > 0" >{{userTitleCount.titleReform}}</span>
          </div>
      </van-tab>
        <van-tab  name='hiddenTroubleWriteOff'>
          <div slot="title" style="position: relative">
            <span class="van-ellipsis">隐患核销</span>
            <span class="bridge van-info" v-if="userTitleCount.titleCancle > 0" >{{userTitleCount.titleCancle}}</span>
          </div>
        </van-tab>
        <div class="notice-recheck" v-if="userTitleCount.titleRecheck > 0" >{{userTitleCount.titleRecheck}}</div>
        <van-tab title="隐患复核" v-if="ifSecurityUser" name='hiddenTroubleRecheck'>
          <div slot="title" style="position: relative">
            <span class="van-ellipsis">隐患核销</span>
            <span class="bridge van-info" v-if="userTitleCount.titleRecheck > 0" >{{userTitleCount.titleRecheck}}</span>
          </div>
        </van-tab>

    </van-tabs>

注意bridge 为自定义class 

.bridge{
    top: 8px;
    right: 8px;
  }

不带提示框



```