# 1 对接ldap 数据对接webservice，springcloud -springboot 整合cxf 


## 步骤

### 1 引入pom文件配置：
案例中又引入甲方jar ，这里pom就不在引入，也就是实现了接口，调用了加密与xml处理；

```xml
 <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web-services</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.cxf</groupId>
    <artifactId>cxf-spring-boot-starter-jaxws</artifactId>
    <version>3.2.7</version>
</dependency>

```



### 2 编写webservice


* ISyncUserWebService.java
    此类是甲方给出以来中的接口实现即可，如需实现自行的webservice 直接写正常接口就行。不需要加@WebService注解等

```java
public interface ISyncUserWebService {
    String synchronism(String var1, String var2, String var3);
}
```


* SyncUserWebServiceImpl.java

```java
package com.graphsafe.ehs.webService.ldapUser;

import cn.com.crc.syncuser.webservice.*;
import com.graphsafe.api.model.user.po.UserSystemOrganization;
import com.graphsafe.api.model.user.po.UserSystemUser;
import com.graphsafe.constants.ConstantCode;
import com.graphsafe.constants.UserSystemConstantCode;
import com.graphsafe.ehs.mapper.UserSystemOrganizationMapper;
import com.graphsafe.ehs.mapper.UserSystemUserMapper;


import com.graphsafe.ehs.service.UserSystemUserService;
import com.graphsafe.utils.ReflectionUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import tk.mybatis.mapper.entity.Example;


import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;


import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author ：syb
 * @date ：Created in 2019-12-03 18:13
 * @description：webservice ldap 实现
 * @modified By：syb
 * @version: 1.0
 */

@WebService(serviceName = "ISyncUserWebService")
@SOAPBinding(style = SOAPBinding.Style.RPC)
@Component
public class SyncUserWebServiceImpl extends SyncUser implements ISyncUserWebService  {

    private static Logger logger = LoggerFactory.getLogger(ReflectionUtils.class);

    @Value("${ldap.USER}")
    String WEBSERVICEUSER;

    @Value("${ldap.PWD}")
    String WEBSERVICEPWD;

    @Autowired
    private UserSystemUserMapper userSystemUserMapper;

    @Autowired
    private UserSystemOrganizationMapper userSystemOrganizationMapper;
    @Autowired
    private UserSystemUserService userSystemUserService;


    @Override
    @WebMethod
    public String synchronism(@WebParam(name = "wsuser") String wsuser,
                              @WebParam(name = "wspwd") String wspwd,
                              @WebParam(name = "requestdate") String requestdate){

        System.out.println("连接webservice");
        this.soapWsUser = wsuser;
        this.soapWsPwd = wspwd;
        if (!this.isAuth()) {
            return SyncXmlUtils.returnXml("E0003000", "认证信息失败");
        } else {
            String opType = this.getOpType(requestdate);
            SyncUserInfo user = parseXMLToUser(requestdate);
            // sha256 编码 解码
            System.out.println("认证成功");
            if ("CREATE".equals(opType)) {
                return this.createAccount(user);
            } else if ("EDIT".equals(opType)) {
                return this.editAccount(user);
            } else if ("ENABLE".equals(opType)) {
                return this.enableAccount(user);
            } else {
                return "DISABLE".equals(opType) ? this.disableAccount(user) : this.deleteAccount(user);
            }
        }
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2019/12/4 10:39
     * @Description: 同步用户对象字段属性值
     * @Params: [syncUserInfo, user]
     * @Return:
     */
    private void synchronizUser(SyncUserInfo syncUserInfo, UserSystemUser user) {
        user.setAccountNumber(syncUserInfo.getUid()); // 登录 id
        user.setPassword(syncUserInfo.getPassword());// 登录密码
        user.setCreateOrganization(syncUserInfo.getDeptId());// 部门编号
        user.setPhone(syncUserInfo.getMobile());// 手机号
        user.setInternationalize(ConstantCode.ZH_CN);//简繁体
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2019/12/4 11:31
     * @Description:  根据用户 uid 唯一标识，查询数据库中的用户对象,如果没有找到对应的 uid、对应的用户则返回null
     * @Params: [syncUserInfo, user]
     * @Return:
     */
    private UserSystemUser getUserByLdapId(SyncUserInfo syncUserInfo) {
        // 首先根据用户ldap 唯一标识查询员用户数据
        Example example = new Example(UserSystemUser.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andEqualTo("accountNumber",syncUserInfo.getUid().toUpperCase()).andEqualTo("isDelete", UserSystemConstantCode.isDeleteNo);// 根据ldap唯一标识更改数据
        List<UserSystemUser> users = userSystemUserMapper.selectByExample(example);// 根据ldap唯一标识查询用户数据
        if(CollectionUtils.isEmpty(users)){
            return null;
        }else{
            return users.get(0);
        }

    }


    @Override
    public boolean isAuth() {

        if(!super.soapWsUser.equals(WEBSERVICEUSER)||!super.soapWsPwd.equals(WEBSERVICEPWD))
        {
            return false;
        }
        return true;

    }
    /**
     * @Author: shenyabo
     * @Date: Create in 2019/12/4 10:26
     * @Description: 同步创建账户
     * @Params: [syncUserInfo]
     * @Return: 返回用户ldap唯一标识
     */

    @Override
    public String createAccount(SyncUserInfo syncUserInfo) {
        String result = "";
        try {
            UserSystemUser user=getUserByLdapId(syncUserInfo);
            if(user!=null){
                return SyncXmlUtils.returnXml(ResponseCode.USER_EXISTE, ResponseCode.USER_EXISTE_DESC);
            }else{
                // user为null
                user = new UserSystemUser();
            }
            user.setIsDelete(ConstantCode.IS_NOT_DELETE); // 默认 没有删除
            user.setEnableUser(UserSystemConstantCode.enableYes); // 默认启用用户
            user.setStatus(ConstantCode.DEFAULT_STATUS_QY); // 默认启用
            user.setSyncType(ConstantCode.USER_DEFAULT_SYNC); // 默认变更状态：未变更
            user.setInternationalize(ConstantCode.ZH_CN); // 默认国际化语言：zh_cn

            user.setId(UUID.randomUUID().toString());
            user.setCreateTime(new Date());
            synchronizUser(syncUserInfo, user);
            // 指定用户创建方式
            user.setCreateType(UserSystemConstantCode.creteTypeZDTB); // 自动同步
            user.setAccountNumber(user.getAccountNumber().toUpperCase());// 存入库中都为大写
            // 修改用户的 organizationId
            setUserOrganization(user);

            userSystemUserService.addSelective(user);
            result=SyncXmlUtils.returnXml(ResponseCode.SUCCESS, ResponseCode.SUCCESS_DESC);
        }catch (Exception ex){
            System.out.println("同步用户失败："+ex.getMessage());
            result=SyncXmlUtils.returnXml(ResponseCode.UNKNOW_ERROR, ResponseCode.UNKNOW_ERROR_DESC);
        }
        return result;

    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2019/12/10 16:13
     * @Description: 根据用户的 organizationId + createOrganization 去组织表中查询对应(organizationNumber)的唯一id 存入 organizationI中
     * @Params: [user]
     * @Return:
     */
    private void setUserOrganization(UserSystemUser user) {
        Example orgExample = new Example(UserSystemOrganization.class);
        String organizationNumber = user.getOrganizationId() + user.getCreateOrganization();
        orgExample.createCriteria().andEqualTo("organizationNumber", organizationNumber);
        List<UserSystemOrganization> userSystemOrg = userSystemOrganizationMapper.selectByExample(orgExample);// 查找对应的userSystemOrg对象
        if(userSystemOrg.size()>0){
            user.setOrganizationId(userSystemOrg.get(0).getId());
            user.setCreateOrganization(organizationNumber);
        }else{
            user.setCreateOrganization(organizationNumber);
            user.setOrganizationId(null);
        }
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2019/12/4 11:37
     * @Description:  修改用户信息
     * @Params: [syncUserInfo]
     * @Return:
     */
    @Override
    public String editAccount(SyncUserInfo syncUserInfo) {

        String result = "";
        try {
            UserSystemUser getUser = getUserByLdapId(syncUserInfo);
            if(getUser==null){// 用户不存在
                return  SyncXmlUtils.returnXml(ResponseCode.USER_NOT_EXISTE, ResponseCode.USER_NOT_EXISTE_DESC);
            }else{
                //编辑之前同步一下数据
                synchronizUser(syncUserInfo,getUser);
                // 根据ldap标识修改
//            Example exampleUpdate = new Example(user.getClass());
//            Example.Criteria criteria2 = exampleUpdate.createCriteria();
//            criteria2.andEqualTo("ldapGuid", user.getLdapGuid());// 根据ldap唯一标识更改数据
//            userSystemUserMapper.updateByExampleSelective(user, example);
//                getUser.beforeUpdate();
            getUser.setLastUpdateTime( new Date());
            getUser.setAccountNumber(getUser.getAccountNumber().toUpperCase());// 每次更新都是大写用户
            getUser.setSyncType(UserSystemConstantCode.userSyncGX); // 编辑操作设置同步状态为更新
            userSystemUserMapper.updateByPrimaryKeySelective(getUser);// 空值不更新

//          result = user.getLdapGuid();
            result=SyncXmlUtils.returnXml(ResponseCode.SUCCESS, ResponseCode.SUCCESS_DESC);
            }

        }catch (Exception ex){
            System.out.println("更新用户失败："+ex.getMessage());
            result=SyncXmlUtils.returnXml(ResponseCode.UNKNOW_ERROR, ResponseCode.UNKNOW_ERROR_DESC);
        }

        return result;
    }


    @Override
    public String disableAccount(SyncUserInfo syncUserInfo) {
        String result = "";
        try {

            UserSystemUser resultUser = getUserByLdapId(syncUserInfo);
            if(resultUser==null){// 如果没有查到对应的用户则返回用户不存在
                return  SyncXmlUtils.returnXml(ResponseCode.USER_NOT_EXISTE, ResponseCode.USER_NOT_EXISTE_DESC);
            }else{
                resultUser.setEnableUser(UserSystemConstantCode.enableNo);// 禁用用户 0
                resultUser.setStatus(UserSystemConstantCode.userStatusJY);// 禁用用户  更改status 状态
                resultUser.setAccountNumber(resultUser.getAccountNumber().toUpperCase());// 每次都转大写
                userSystemUserMapper.updateByPrimaryKeySelective(resultUser);
//                result = user.getLdapGuid();
                result=SyncXmlUtils.returnXml(ResponseCode.SUCCESS, ResponseCode.SUCCESS_DESC);
            }
        }catch (Exception ex){
            System.out.println("禁用用户失败："+ex.getMessage());
            result=SyncXmlUtils.returnXml(ResponseCode.UNKNOW_ERROR, ResponseCode.UNKNOW_ERROR_DESC);
        }
        return result;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2019/12/4 11:51
     * @Description: 启用用户
     * @Params: [syncUserInfo]
     * @Return:
     */
    @Override
    public String enableAccount(SyncUserInfo syncUserInfo) {
        String result = "";
        try {

            UserSystemUser resultUser = getUserByLdapId(syncUserInfo);
            if(resultUser==null){// 如果没有查到对应的用户则返不存在
                return  SyncXmlUtils.returnXml(ResponseCode.USER_NOT_EXISTE, ResponseCode.USER_NOT_EXISTE_DESC);
            }else{
                resultUser.setEnableUser(UserSystemConstantCode.enableYes);// 启用用户 1
                resultUser.setStatus(UserSystemConstantCode.userStatusQY);// 启用用户
                resultUser.setSyncType(UserSystemConstantCode.userSyncGX);// 同步状态改为更新

                resultUser.setAccountNumber(resultUser.getAccountNumber().toUpperCase());
                userSystemUserMapper.updateByPrimaryKeySelective(resultUser);
//                result = user.getLdapGuid();
                result=SyncXmlUtils.returnXml(ResponseCode.SUCCESS, ResponseCode.SUCCESS_DESC);
            }

        }catch (Exception ex){
            System.out.println("启用用户失败："+ex.getMessage());
            result=SyncXmlUtils.returnXml(ResponseCode.UNKNOW_ERROR, ResponseCode.UNKNOW_ERROR_DESC);
        }
        return result;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2019/12/4 11:51
     * @Description: 逻辑删除用户
     * @Params: [syncUserInfo]
     * @Return:
     */
    @Override
    public String deleteAccount(SyncUserInfo syncUserInfo) {
        String result = "";
        try {

            UserSystemUser resultUser = getUserByLdapId(syncUserInfo);
            if(resultUser==null){// 如果没有查到对应的用户则返回用户不存在
                return  SyncXmlUtils.returnXml(ResponseCode.USER_NOT_EXISTE, ResponseCode.USER_NOT_EXISTE_DESC);
            }else{
                resultUser.setIsDelete(UserSystemConstantCode.isDeleteYes);// 删除用户(逻辑删除) 1
                resultUser.setStatus(UserSystemConstantCode.userStatusJY);// 删除的用户也设置为禁用


                resultUser.setAccountNumber(resultUser.getAccountNumber().toUpperCase());
                userSystemUserMapper.updateByPrimaryKeySelective(resultUser);
//                result = user.getLdapGuid();
                result=SyncXmlUtils.returnXml(ResponseCode.SUCCESS, ResponseCode.SUCCESS_DESC);
            }
        }catch (Exception ex){
            System.out.println("删除用户失败："+ex.getMessage());
            result=SyncXmlUtils.returnXml(ResponseCode.UNKNOW_ERROR, ResponseCode.UNKNOW_ERROR_DESC);
        }
        return result;
    }
}

```

### 3 编写配置文件


* LdapCxfConfig.java

```java
package com.graphsafe.ehs.config;


import javax.xml.ws.Endpoint;

import com.graphsafe.ehs.webService.ldapUser.SyncUserWebServiceImpl;
import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.apache.cxf.transport.servlet.CXFServlet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author ：syb
 * @date ：Created in 2019-12-04 14:27
 * @description：ldap webservice 定义配置类
 * @modified By：syb
 * @version:
 */
@Configuration
public class LdapCxfConfig {

    @Autowired
    private Bus bus;

    @Autowired
    SyncUserWebServiceImpl syncUserWebService;


    /**
     * 默认servlet路径/*,如果覆写则按照自己定义的来
     *
     * @return
     */
    @SuppressWarnings("all")
    @Bean
    public ServletRegistrationBean cxfServlet() {
        return new ServletRegistrationBean(new CXFServlet(), "/一级地址/*");
    }

    @Bean
    ServletWebServerFactory servletWebServerFactory() {
        return new TomcatServletWebServerFactory();
    }

    /**
     * JAX-WS 站点服务
     **/
    @Bean
    public Endpoint endpoint() {
        EndpointImpl endpoint = new EndpointImpl(bus, syncUserWebService);
        endpoint.publish("/二级地址");
        // http://localhost:8094/gp-ehs/一级地址/二级地址?wsdl ; 8094 是yml配置文件配置的当前服务的端口，gp-ehs ,是当前服务的名字
        return endpoint;
    }

}

```
yml配置 
![](assets/003/02/02/01-1587087316525.png)