# Tk Mybatis example 的使用


## example


### 基本查询

* 总结博主：[地址](https://www.liangzl.com/get-article-detail-27354.html)

### adcondition 


```java
1.方式一

Example example = new Example(Cart.class);
example.createCriteria()
        .andEqualTo("userId",userId)
        .andEqualTo("selectd",1);
return cartMapper.selectByExample(example);
注意：（addEqualTo）这里的userId是映射的实体类。和传统的条件查询类似。
2.方式二

Example example = new Example(Cart.class);
example.createCriteria()
        .andCondition("user_id=",5)
        .andCondition("select=",1);
return cartMapper.selectByExample(example);
```


### 案例 1
```java
  @Override
	public PageList<RiskasesmtComment> findAuditResult(Integer pageIndex, Integer pageSize, String projectName,String companyName,String serialNumber,String urgent,
			String markingTime1,String markingTime2,Integer sortOrder,String[] state) {
		 		
		//将long类型的毫秒数转换成date类型的
		Date markingTimeDate1 = null;
		Date markingTimeDate2 = null;
		if (markingTime1 != null && markingTime2 != null) {
			markingTimeDate1 = new Date(Long.parseLong(markingTime1));
			markingTimeDate2 = new Date(Long.parseLong(markingTime2));
		}
				
		Example exe = new Example(RiskasesmtComment.class); //表示实例化同时传递了一个对象给构造方法, 这个对象是一个Class对象
		Criteria criteria = exe.createCriteria();
		
		List<String> stateList = new ArrayList<String>();
                if (state != null && state.length !=0) {
			for(int i = 0; i < state.length; i++){
		        stateList.add(state[i]);
		    }
			//按照 状态查询
			criteria.andIn("state", stateList);
		}
		
		
		if (projectName != null && projectName != "") {
			//按照 项目名称查询
			//c.andEqualTo("projectName", projectName); 
			criteria.andCondition("  project_name like  "+"'"+'%'+projectName+'%'+"'");
		}
		
		if (companyName != null && companyName != "") {
			//按照  申请单位查询    
			//c.andEqualTo("companyName", companyName);
			criteria.andCondition("  company_name like  "+"'"+'%'+companyName+'%'+"'");
		}
		
		if(serialNumber != null && serialNumber != "") {
			//根据 申请单号 查询
			//c.andEqualTo("serialNumber", serialNumber);
			criteria.andCondition("  serial_number like  "+"'"+'%'+serialNumber+'%'+"'");
		}
		if(urgent != null && urgent != "") {
			//根据 加急文件 查询
			criteria.andIsNotNull("urgent");
		}
		
		
		if (markingTimeDate1 != null && markingTimeDate2 !=null) {
			//查询在一个时间段之内提交的 数据
			criteria.andBetween("markingTime", markingTimeDate1, markingTimeDate2);
		}else if(markingTime1 != null){
			// 按照 时间查询
			criteria.andEqualTo("markingTime", markingTimeDate1);
		}else if (markingTime2 != null) {
			// 按照 时间查询
			criteria.andEqualTo("markingTime",markingTimeDate2);
		}
		
		//按照提交时间倒序排列
		if (sortOrder != null && sortOrder.equals(1)) {
			exe.setOrderByClause("marking_time asc");
		}else if(sortOrder != null && sortOrder.equals(0)) {
			exe.setOrderByClause("marking_time desc");
		}else {
			exe.setOrderByClause("marking_time desc");
		}
				
		return page(exe, pageIndex, pageSize); 
	}
```
