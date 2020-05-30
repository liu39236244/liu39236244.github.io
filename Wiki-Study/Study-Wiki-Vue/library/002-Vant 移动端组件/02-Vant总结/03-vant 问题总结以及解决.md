# vant 的问题以及总结


## vant 编写基本页面并且控制颜色以及换行

* vant控制换行

### 1 案例如下 ，能控制value 宽度控制是否换行，使用 van-tabs 


```html
<template>
  <div id="riskList">
    <van-tabs v-model="tabIndex">
      <van-tab title="登录次数">
        <van-cell-group class="van-group-css" style="border-bottom: 1px solid #e1e1e1;">
          <div v-for="(item,index) in rankingdepartciList" :key="index" @click="getRaskingUserList(item.id)">
            <!--<van-cell :title="index+1+'.' +item.name" :value="'人均'+item.num+'次'" />-->
            <van-cell :title="index+1+'.' +item.name"  :value="'共:'+ item.totalNum + '次  人均:'+item.num+'次'"/>

          </div>
        </van-cell-group>
      </van-tab>
      <van-tab title="登录时长">
        <van-cell-group class="van-group-css" style="border-bottom: 1px solid #e1e1e1;">
          <div v-for="(item,index) in rankingdeparttimeList" :key="index" @click="getRaskingUserList(item.id)" >
            <!--<van-cell :title="index+1+'.' + item.name" :value="'人均:'+item.num" />-->
            <van-cell  :title="index+1+'.' + item.name" :value="'共:'+ item.totalNum +'  人均:'+item.num+''"/>

          </div>
        </van-cell-group>
      </van-tab>
    </van-tabs>
  </div>
</template>

```

```js

```

```css

<style lang="less">

    /* 最重要的是van-cell__value 的设置 */
 .van-cell__value {
    min-width: 70%;
    span {
      color: #969799;
      font-size: 3.5vw;
      display: inline-block;
      text-align: left;
      word-break: break-all;
    }
  }



  .van-tabs__content {
    height: 100%;
  }

  .showList {
    padding: 2vw 0;
    border-bottom: 1px solid #e1e1e1;
  }


 
  #riskList {
    .van-group-css {
      .vanRow {
        .title-row {
          padding: 4px 0;

          label {
            padding: 1px 12px;
            font-size: 3.5vw;
            color: #969799;
          }
        }

        .van-cell__title {
          span {
            color: #969799;
            font-size: 3.5vw;
          }
        }
      }
    }
  }
</style>
```


* vant控制颜色

### 控制value 换行


```html
<template>
  <div id="safetyDetailInfo">
    <NavHeader title="锅炉系统"/>
    <van-row>
      <van-col :span="24">


        <van-cell-group>

          <!--<van-cell>-->
            <!--<van-row class="vanRow" :class="true?'red':'green'">-->
              <!--<van-col span="10" style="text-align: center">-->
                <!--报警次数:-->
              <!--</van-col>-->
              <!--<van-col span="10">-->
                <!--{{"12"}}-->
              <!--</van-col>-->
            <!--</van-row>-->
          <!--</van-cell>-->

          <van-cell>
            <van-row class="vanRow" >
              <van-col span="10" style="text-align: center">
                检测时间:
              </van-col>
              <van-col span="10">
                {{safeBoilerRealTime.createtime}}
              </van-col>
            </van-row>
          </van-cell>
        </van-cell-group>

        <van-cell-group title="1号锅炉">

          <van-cell>
            <van-row class="vanRow">

              <van-col span="14" style="text-align: center">
                炉出口压力(1) &nbsp;(Pa)
              </van-col>
              <!--<van-col span="10" class="van-right" :class="(parseInt(safeBoilerRealTime.a1Lower) >= parseInt(safeBoilerRealTime.a1 ) || parseInt(safeBoilerRealTime.a1 ) >= parseInt(safeBoilerRealTime.a1Upper))?'red':'green'" >-->
              <van-col span="10" class="van-right"
                       :class="compileLimit(safeBoilerRealTime.a1,safeBoilerRealTime.a1Lower,safeBoilerRealTime.a1Upper)">
                {{safeBoilerRealTime.a1}}

               <!-- 注释{{safeBoilerRealTime.a1Lower }} - {{safeBoilerRealTime.a1Upper}}-->

              </van-col>
            </van-row>
          </van-cell>


        </van-cell-group>


        <van-cell-group title="2号锅炉">
          <van-cell>
            <van-row class="vanRow">
              <van-col span="14" style="text-align: center">
                炉出口烟气含氧量(1) &nbsp;(%)
              </van-col>
              <van-col span="10" class="van-right"
                       :class="compileLimit(safeBoilerRealTime.a13,safeBoilerRealTime.a13Lower,safeBoilerRealTime.a13Upper)">
                {{safeBoilerRealTime.a13}}

                <!--注释{{safeBoilerRealTime.a13Lower}} - {{safeBoilerRealTime.a13Upper}}-->
              </van-col>
            </van-row>
          </van-cell>
        </van-cell-group>
      </van-col>
    </van-row>

  </div>
</template>
```

```js
<script>
  import NavHeader from '../../components/nav-header.vue';

  export default {
    name: "boilerInfoReal",
    data() {
      return {


        safeBoilerRealTime: { // 实时展示数据左侧
        }, // 只有一条数据展示实时锅炉数据
        safeRealTimer: {},// 定时器获取数据

      };
    },
    beforeDestroy() {
      clearInterval(this.safeRealTimer);
    },
    created() {

      let this_ = this
      this.getNewestTankList()
      this.$nextTick(() => {
        // 每三秒进行一次查询实时数据，先暂时关闭
        this_.safeRealTimer = setInterval(this.getNewestTankList, 3000)
      })
    },
    methods: {
      // 查询最新锅炉数据

      getNewestTankList() {
        let this_ = this;
        this.$http({
          url: this.$http.adornUrl(`/safe/boilerCheck/getNewestTankList`),
          method: 'post',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 1) {
            let curArray = data.data.rows;
            if (curArray.length > 0) {
              this.safeBoilerRealTime = curArray[0];

              this.safeBoilerRealTime.createtime=this.dateFormat("YYYY/mm/dd HH:MM:SS",new Date(this.safeBoilerRealTime.createtime))

              this.$nextTick(() => {

                // this.safeBoilerRealTime.createTime = this_.exchangeDateMinAll(new Date(this.safeBoilerRealTime.createTime).getTime())
                // console.log(this.safeBoilerRealTime.createTime )
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


      //时间格式化
      dateFormat(fmt, date) {
        let ret;
        const opt = {
          "Y+": date.getFullYear().toString(),        // 年
          "m+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          "H+": date.getHours().toString(),           // 时
          "M+": date.getMinutes().toString(),         // 分
          "S+": date.getSeconds().toString()          // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          }
          ;
        }
        ;
        return fmt;
      },


      // 对比范围是否是正确的
      compileLimit(value, lower, upper) {
        // return (parseInt(lower) >= parseInt(value ) || parseInt(value ) >= parseInt(upper))?'red':'green'
        return (parseFloat(lower) >= parseFloat(value) || parseFloat(value) >= parseFloat(upper)) ? 'red' : 'green'

      }
      ,



    },
    components: {
      NavHeader
    }
  }
</script>

```

```css


<style scoped>

  .red {
    color: red;
  }

  .green {
    color: green;

  }

  .van-right {
    text-align: right;

  }

</style>

```

