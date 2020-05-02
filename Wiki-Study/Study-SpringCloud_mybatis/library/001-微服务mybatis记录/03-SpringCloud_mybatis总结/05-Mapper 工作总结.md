# Mybatis 中 mapper 中的总结 


## 关于逆向工程 中如果生成 mysql 中如果有 datetime 类型问题；

> 问题来源，存入数据库数据可能没有年月日或者没有时分秒 

* bean 对象中 接受 vue 前端 datetimepicker 控件的时间，如果在bean date 属性中如果不定义 JsonFormat 注解 的话或转换报错

```java
public class HiddenDanger implements Serializable {
    private String id;
//    @JsonFormat(locale="zh", timezone="GMT+8", pattern="yyyy-MM-dd HH:mm")
    @JsonFormat( timezone="GMT+8", pattern="yyyy-MM-dd HH:mm")
    private Date checkTime;
}
```

* 此外 mybatis 事件格式 ,resultmap 中 jdbcType ： 有三种 

```xml
<result column="create_time" jdbcType="DATE" property="createTime" />
 <result column="CREATE_TIME" jdbcType="TIMESTAMP" property="createTime" />
 <result column="CREATE_TIME" jdbcType="DATETIME" property="createTime" />
 <result column="CREATE_TIME" jdbcType="TIME" property="createTime" /> 只有时间
```

## 查询条件案例

### 判断有哪些条件然后根据条件判断

```xml
<select id="hostingAllList" parameterType="com.graphsafe.api.model.highrisk.dto.HighRiskHostingQueryCommond" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List" />
    from high_risk_hosting
    where 1 = 1
    <if test="hostingPermitNo !=null and hostingPermitNo != ''">
      and hosting_permit_no like '%' +  #{hostingPermitNo,jdbcType=VARCHAR} + '%'
    </if>
    <if test="hostingLevel !=null and hostingLevel != ''">
      and hosting_level = #{hostingLevel,jdbcType=INTEGER}
    </if>


    错误写法：mybatis 中 的时间判断不能与空字符串比较
    <if test="enterpriseId != null and enterpriseId != ''">  
      and enterprise_id = #{enterpriseId,jdbcType=CHAR}
    </if>
    <if test="endDateEnd != null and endDateEnd!=''">
        and smp.end_date  <![CDATA[ <= ]]> #{endDateEnd}
      </if>
      <if test="startDateBegin != null and startDateBegin!=''">
        and smp.start_date <![CDATA[ >= ]]> #{startDateBegin}
      </if>
    ORDER BY hosting_permit_no DESC
  </select>

```

### sql 语句分页
### 前端分页 


```html
      <page :total="this.queryObj.count" :pageSize="this.queryObj.limit"
              @navpage="initGrid"></page>
```

bootstrap操作


```js
this.queryObj // 绑定的是 控件上得值

queryobject:是 要传入后台接受的参数对象，里面的属性需要与后台bean属性名字一样

 //查询条件对象
        var queryObj = {
          checkDepart_Name: this.queryObj.checkDepart_Name,
          state: this.queryObj.state,
          checkTime: this.queryObj.checkTime,
          deadline: this.queryObj.deadline,
          limit: this.queryObj.limit,
          page: this.queryObj.page,
        }
this.axios.post(this.baseUrl + '/danger/dangerinfo/selectDangerinfoPagenation', queryObj,
          {headers: {'Content-Type': 'application/json'}, showLoading: true}).then((res) => {
          if (res.data.code == 1) {
            this.queryObj.count = res.data.data.total;// 赋值 总条数 let h=$(window).height() - 500;
            $('#hbTable').bootstrapTable("destroy").bootstrapTable({
              pagination: false,
              toolbar: '#bmtoolbar',//工具按钮用哪个容器
              data: res.data.data.rows,// 直接传值给Data
              totalRows: res.data.data.total,
              uniqueId: "id",
              cache: false,
              height: $(".content").height() - 188,
              columns: this.columns,
              sortable: true,
              striped: true,
            });
            //查看
            /*$("#hbTable tbody tr").on("click", "td:eq(2)", this.detail);*/
            $(".optioncolum").on("click", "#detail", this.detail); // 隐患整改该
            $(".optioncolum").on("click", "#edit", this.edit); // 隐患整改该
            $(".optioncolum").on("click", "#reform", this.reform); // 隐患整改该
            $(".optioncolum").on("click", "#cancle", this.cancle);  // 隐患核销
            $(".optioncolum").on("click", "#recheck", this.recheck);  // 隐患复核
            $(".optioncolum").on("click", "#flow", this.flow);  // 隐患流程

            // $(".optioncolum").on("click", ".forward", this.forward);
            // $(".optioncolum").on("click", ".reform", this.reform);
            // $(".optioncolum").on("click", ".visible", this.isvisible);
            // $(".optioncolum").on("click", ".ischeck", this.ischeck);
            // $(".optioncolum").on("click", ".trash", this.deleteDire);
            var that = this;
            $('#hbTable').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table', function (e, rows) {
              var datas = $.isArray(rows) ? rows : [rows];        // 点击时获取选中的行或取消选中的行
              that.examine(e.type, datas);                         // 保存到全局 Array() 里
            });
          }
        })
```


```xml
<!--分页-->
  <select id="getPointPagination" parameterType="com.graphsafe.api.model.danger.dto.RiskPointQueryCommond" resultMap="RiskPointQueryCommond">
    select * from tb_riskpoint tr
    where 1=1
    <if test="unitname != null and unitname!=''">
      and tr.unitname like '%' +  #{unitname,jdbcType=VARCHAR} + '%'
    </if>
    <if test="areaLocation != null and areaLocation!=''">
      and tr.area_location like '%' +  #{areaLocation,jdbcType=VARCHAR} + '%'
    </if>
    <if test="qyId != null and qyId!=''">
      and tr.qy_id = #{qyId,jdbcType=CHAR}
    </if>
    <if test="ids != null">
      AND tr.id in
      <foreach close=")" collection="ids" index="index" item="id" open="(" separator=",">
        #{id}
      </foreach>
    </if>
     <!-- 这里注意mysql只中尽量 不要用 + 拼接， 会有问题 -->
    <if test="checkDepart_Name != null and checkDepart_Name !='' ">
      and dp1.depart_name like '%' + #{checkDepart_Name,jdbcType=VARCHAR} + '%'
    </if>

    <if test="checkDepart_Name != null and checkDepart_Name !='' ">
      and dp1.depart_name like  CONCAT('%',#{checkDepart_Name,jdbcType=VARCHAR},'%')
    </if>
    <if test="state != null and state !='' ">
      and  hd.state= #{state,jdbcType=INTEGER}
    </if>
    <!-- 这里注意时间格式不要 判断空字符串 -->
    <if test="checkTime != null  and deadline !=null">
      and  hd.check_time between #{checkTime} and #{deadline}
    </if>
  </select>
```


## if test

### 字符串比较以及 in 语句

```xml

<update id="updateGoodsShelf" parameterType="java.lang.String">
        update
        integral_goods
        set
        <if test='shelfFlag == "1"'>
            shelf_flag = ${@com.pisen.cloud.luna.ms.jifen.base.domain.IntegralGoods@SHELF_ON}
        </if>
        <if test='shelfFlag == "0"'>
            shelf_flag = ${@com.pisen.cloud.luna.ms.jifen.base.domain.IntegralGoods@SHELF_OFF}
        </if>
        where
        uid
        IN
        <foreach collection="list" item="item" index="index" open="(" separator="," close=")">
            #{item}
        </foreach>

    </update>
```

* in 语句
```xml


       uid
        IN
        <foreach collection="list" item="item" index="index" open="(" separator="," close=")">
            #{item}
        </foreach>
        
      <if test="ids != null">
        and id in
        <foreach close=")" collection="ids" item="oid" open="(" separator=",">
          '${oid}'
        </foreach>
      </if>

```


### 判断大小写xml 中的形式


```xml
 <select id="getDepartAccountNum" resultType="int" parameterType="String">
    select count(*)
    from tb_accident_bulletin
    where occur_depart= #{occurDepart} and accident_category = #{accidentCategory}
    <if test="startDate != null">
      and accident_create_time &gt;= #{startDate}
    </if>
    <if test="endDate != null">
      and accident_create_time &lt;= #{endDate}
    </if>
    <if test="qyId != null and qyId!=''">
      and qyId = #{qyId}
    </if>
  </select>
  <select id="getAccNumByinjurySite" resultType="int" parameterType="String">
    select count(*)
    from tb_accident_bulletin
    where  injury_site LIKE '%'+#{injurySite}+'%' and accident_category = #{accidentCategory}
    <if test="startDate != null">
      and accident_create_time &gt;= #{startDate}
    </if>
    <if test="endDate != null">
      and accident_create_time &lt;= #{endDate}
    </if>
    <if test="qyId != null">
      and qyId = #{qyId}
    </if>
  </select>
```