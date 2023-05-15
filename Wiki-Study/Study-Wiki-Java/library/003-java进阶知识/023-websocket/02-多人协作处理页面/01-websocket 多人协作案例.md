# websocket 多人协作处理需求


## websocket java 后台 spirngboot项目 写法 


WebSocketService.java

```java
package com.graphsafe.operation.utils.websocket.service;
import com.alibaba.fastjson.JSONObject;
import com.graphsafe.api.enums.AllDicEnum;
import com.graphsafe.api.feign.base.BaseUserFeign;
import com.graphsafe.api.model.admin.BaseUser;
import com.graphsafe.api.model.operation.securityCheckTask.SecurityCheckTask;
import com.graphsafe.api.model.operation.securityCheckTask.SecurityTaskRecordContent;
import com.graphsafe.api.model.operation.securityCheckTask.SecurityTaskRecordLog;
import com.graphsafe.base.exception.CustomException;
import com.graphsafe.operation.service.SecurityCheckTaskService;
import com.graphsafe.operation.service.SecurityTaskRecordContentService;
import com.graphsafe.operation.service.SecurityTaskRecordLogService;
import com.graphsafe.operation.utils.MyDateUtile;
import com.graphsafe.operation.utils.SpringContextUtil;
import com.graphsafe.operation.utils.websocket.constant.WebSocketConstant;
import com.graphsafe.operation.utils.websocket.dto.RecordChangeSocketDto;
import com.graphsafe.operation.utils.websocket.model.WebSocketClient;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * @ClassName:
 * @Author: shenyabo
 * @date: 2022/11/5 10:40
 * @Description: WebSocketService类
 * modulePath: 指定websocket是哪个模块的
 * teamId : 相当于创建一个队伍， 比如多人修改检查记录模块的 某一条检查记录 ，可能同时间会有多个检查记录，那么一个检查记录就是一个Team(队伍)
 * @Version: 1.0
 */
@ServerEndpoint(value = "/websocketService/{modulePath}/{teamId}")
@Component
@Slf4j

public class WebSocketService {


    // 存储用户id 用户名 map
    private static Map<String, String> userIdNameMap = null;

    /**
     * 用来记录当前teamId 队伍下有客户端连接
     * curTeamonlinePersons
     */
    private static AtomicInteger curTeamonlinePersons = new AtomicInteger(0);


    //concurrent包的线程安全Map，用来存放每个客户端对应的WebSocketServer对象。String 存session 的 id(也有可能同一个人同时登陆了pc 与 app ，所以这里选择用session id作为 key)
    private static ConcurrentHashMap<String, WebSocketClient> webSocketMap = new ConcurrentHashMap<>(10);

    public BaseUserFeign baseUserFeign;


    // 检查记录项的service
    public SecurityTaskRecordContentService securityTaskRecordContentService;

    // 检查记录修改日志service
    public SecurityTaskRecordLogService securityTaskRecordLogService;


    // 为了修改检查任务对应的状态
    public SecurityCheckTaskService securityCheckTaskService;

    public static ConcurrentHashMap<String, WebSocketClient> getWebSocketMap() {
        return webSocketMap;
    }

    public static void setWebSocketMap(ConcurrentHashMap<String, WebSocketClient> webSocketMap) {
        WebSocketService.webSocketMap = webSocketMap;
    }


    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("modulePath") String modulePath, @PathParam("teamId") String teamId) {

        log.info("↓----------------------------------------------------------------------------↓");
        log.info("socket 模块有新的链接，modulePath为:{}，teamId为：{}", modulePath, teamId);
        String sessionID = session.getId();
        if (!webSocketMap.containsKey(sessionID)) {
            // 当前队伍人数+1
            curTeamonlinePersons.incrementAndGet();
        }
        WebSocketClient client = new WebSocketClient();
        client.setSession(session);
        client.setUri(session.getRequestURI().toString());
        // curPeopleId=80800895-5d3a-4410-bcb7-5e9e528999b6&curPeopleName=张三&curPeoplePointPcApp=PC
        String paramsStr = session.getQueryString();
        Map<String, Object> paramsMap = com.graphsafe.operation.utils.StringUtils.transUrlStringToMap(paramsStr, WebSocketConstant.andSymbol, WebSocketConstant.equalSymbol);

        String curPeopleId = (String) paramsMap.get(WebSocketConstant.curPeopleId);
        // String curPeopleName = (String) paramsMap.get(WebSocketConstant.curPeopleName);
        String curPeopleName = getCurUserNameById(curPeopleId, true);
        String curPeoplePointPcApp = (String) paramsMap.get(WebSocketConstant.curPeoplePointPcApp);
        client.setCurPeopleId(curPeopleId);


        client.setCurPeopleName(curPeopleName);
        client.setCurPeoplePoint(curPeoplePointPcApp);
        client.setModulePath(modulePath);
        client.setTeamId(teamId);

        // 日志中打印当前session 的名称/sessionid
        String logPrintCurSessionName = StringUtils.isEmpty(client.getCurPeopleName()) ? sessionID : client.getCurPeopleName();

        webSocketMap.put(sessionID, client);
        log.info("新用户 sessionId【{}】,用户名：【{}】连接【{}】端:当前在线人数为: 【{}】", sessionID, logPrintCurSessionName, client.getCurPeoplePoint(), curTeamonlinePersons.get());
        try {

            RecordChangeSocketDto dto = new RecordChangeSocketDto();
            dto.setSessionId(sessionID);
            dto.setMessageCategory(WebSocketConstant.onOpenMessageCategory);
            dto.setResultMessage("恭喜您， " + logPrintCurSessionName + "链接socket服务器成功！");
            sendMessage(JSONObject.toJSONString(dto), session);
        } catch (IOException e) {
            log.error("用户:【" + logPrintCurSessionName + "】链接失败， 网络异常!!!!!!");
        } finally {
            log.info("↑----------------------------------------------------------------------------↑");
        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/7 13:58
     * @Description: 根据用户id 查询对应用户名
     * @Params: [curPeopleId, ifFlushCache: 是否刷新缓存]
     * @Return: java.lang.String
     */
    private String getCurUserNameById(String curPeopleId, boolean ifFlushCache) {

        if (ifFlushCache || userIdNameMap.size() == 0) {
            // 需重新查询用户id 用户名 对应map
            if (baseUserFeign == null) {
                this.baseUserFeign = SpringContextUtil.getApplicationContext().getBean(BaseUserFeign.class);
            }
            if (userIdNameMap == null) {
                List<BaseUser> usersByUserIds = baseUserFeign.getUsersByUserIds(new HashMap<>());
                // 将查到的users 根据
                userIdNameMap = usersByUserIds.stream().collect(Collectors.toMap(user -> Optional.ofNullable(user.getId()).orElse("null"), user -> Optional.ofNullable(user.getUserName()).orElse("null")));
            }
        }
        return userIdNameMap.get(curPeopleId);

    }


    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(@PathParam("teamId") String teamId, Session session) {
        if (webSocketMap.containsKey(session.getId())) {

            WebSocketClient removeClient = webSocketMap.remove(session.getId());
            // 将当前队伍 在线人数-1
            curTeamonlinePersons.decrementAndGet();
            log.info("用户【{}】退出,当前在线人数为:【{}】", removeClient.getCurPeopleId() + "_" + removeClient.getCurPeopleName(), curTeamonlinePersons);
        }
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/5 10:45
     * @Description: 收到客户端消息后调用的方法
     * @Params: [message, session]
     * message: 客户端发送过来的消息
     * @Return: void
     */
    @OnMessage
    public void onMessage(String message, Session session) {

        WebSocketClient curSessionClient = webSocketMap.get(session.getId());

        log.info("收到用户消息:【{}】,报文:【{}】", curSessionClient.getCurPeopleId() + "_" + curSessionClient.getCurPeopleName(), message);
        //可以群发消息
        //消息保存到数据库、redis
        switch (curSessionClient.getModulePath()) {
            case WebSocketConstant.CheckTaskRecordWebServiceModulePath: {
                // 说明是隐患检查记录模块的socket
                // 做其他操作

                RecordChangeSocketDto changeDto = JSONObject.parseObject(message, RecordChangeSocketDto.class);
                changeDto.setMessageCategory(WebSocketConstant.sendCheckRecordMessageCategory);

                // 在这里进行数据库操作，在这里进行单个项数据的修改逻辑
                this.changeRecordData(session, changeDto);

                // 将返回前段的消息添加一个字段标识，表示是后端返回给前端正常检查记录业务消息
                message = JSONObject.toJSONString(changeDto);

                // 修改完数据库以后将消息发送给前端socket
                this.sendMessageToSingleId(message, curSessionClient.getTeamId(), session);


                // 存储修改日志
                this.addRecordContentLog(changeDto, session);

                // 拿到当前有修改队伍的id(根据当前session 拿到对应的record id)
                String teamId = curSessionClient.getTeamId();

                // 找到对应 team 的 所有session 循环给分发消息

                log.info("循环通知队伍【{}】中所有用户数据发生修改",
                        teamId
                );
                break;
            }
        }

    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/5 10:46
     * @Description: 发生错误触发
     * @Params: [session, error]
     * @Return: void
     */
    @OnError
    public void onError(Session session, Throwable error) {
        WebSocketClient curSessionClient = webSocketMap.get(session.getId());
        log.error("用户【{}】错误:原因:【{}】", curSessionClient.getCurPeopleId() + "_" + curSessionClient.getCurPeopleName(), error.getStackTrace());
        error.printStackTrace();
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/5 10:46
     * @Description: 连接服务器成功后, 给指定session 发送消息
     * @Params: [message, Session  session 给指定session 发送消息]
     * @Return: void
     */
    public void sendMessage(String message, Session session) throws IOException {
        synchronized (session) {
            session.getBasicRemote().sendText(message);
        }
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/12 15:10
     * @Description: 根据队伍Id 发送信息给当前队伍的所有窗口
     * @Params: [message, teamId]
     * @Return: void
     */
    public void sendMessageToSingleId(String message, String teamId) {

        webSocketMap.entrySet().forEach(item -> {
            WebSocketClient client = item.getValue();
            String sessionId = item.getKey();
            try {
                sendMessage(message, client.getSession());
                log.info("【{}】循环通知队伍【{}】中的 , SessionID：【{}】，用户:【{}】数据发生了更改,成功 √",
                        MyDateUtile.dateToStr(new Date(), null),
                        teamId,
                        sessionId,
                        client.getCurPeopleName()
                );
            } catch (IOException e) {
                log.info("【{}】循环通知队伍【{}】中的 , SessionID：【{}】，用户:【{}】数据发生了修改,失败 ×",
                        MyDateUtile.dateToStr(new Date(), null),
                        teamId,
                        sessionId,
                        client.getCurPeopleName(), e
                );

            }
        });
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/12 17:45
     * @Description: 根据sessionId 获取对应的session对象
     * @Params: [sessionId]
     * @Return: javax.websocket.Session
     */
    public Session getSessionBySessionId(String sessionId) {

        WebSocketClient webSocketClient = webSocketMap.get(sessionId);
        if (webSocketClient != null) {
            return webSocketClient.getSession();
        }
        return null;
    }

    ;

    public void sendMessageToSingleId(String message, String teamId, Session ignoreSession) {

        for (Map.Entry<String, WebSocketClient> item : webSocketMap.entrySet()) {
            WebSocketClient client = item.getValue();
            Session session = client.getSession();
            if (session.getId().equals(ignoreSession.getId())) {
                // 说明当前session 不需要发送消息，跳过本次循环
                continue;
            }
            String sessionId = item.getKey();
            try {
                sendMessage(message, client.getSession());
                log.info("【{}】循环通知队伍【{}】中的 , SessionID：【{}】，用户:【{}】数据发生了更改,成功 √",
                        MyDateUtile.dateToStr(new Date(), null),
                        teamId,
                        sessionId,
                        client.getCurPeopleName()
                );
            } catch (IOException e) {
                log.info("【{}】循环通知队伍【{}】中的 , SessionID：【{}】，用户:【{}】数据发生了修改,失败 ×",
                        MyDateUtile.dateToStr(new Date(), null),
                        teamId,
                        sessionId,
                        client.getCurPeopleName(), e
                );

            }
        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/8 18:17
     * @Description: 修改检查记录单项的值
     * @Params: [session, changeDto]
     * @Return: void
     */
    private void changeRecordData(Session session, RecordChangeSocketDto changeDto) {

        // 根据session 找到对应的 用户信息


        WebSocketClient curSessionClient = webSocketMap.get(session.getId());

        // 根据模式 allRecordChange
        switch (changeDto.getCurChangeMode()) {
            case RecordChangeSocketDto.singleItemChange: {
                // 根据项的id 修改对应项的内容

                if (securityTaskRecordContentService == null) {
                    this.securityTaskRecordContentService = SpringContextUtil.getApplicationContext().getBean(SecurityTaskRecordContentService.class);
                }
                // 修改对应项内容
                SecurityTaskRecordContent recordContent = new SecurityTaskRecordContent();

                BeanUtils.copyProperties(changeDto, recordContent);

                // 设置修改时间，修改人
                recordContent.setUpdateTime(new Date());
                recordContent.setUpdatePeople(curSessionClient.getCurPeopleId());
                securityTaskRecordContentService.updateSelective(recordContent);

                // 修改对应检查任务状态为 执行中 )
                // (只要有一项内容修改了那就改为执行中，但是为了防止每一次都去查询检查任务状态，这里设计让前端传一下检查任务状态，
                // 如果为待执行，就查询一下对应的检查任务状态，如果数据库依旧为待执行，那么修改数据库中检查任务的状态位 执行中， 如果前段端过来的值为执行中，那么就不需要操作

                if (changeDto.getCheckProgress() != null) {
                    // 修改检查任务状态,注意这里前端如果传状态了，一定要给我穿检查任务id
                    if (securityCheckTaskService == null) {
                        this.securityCheckTaskService = SpringContextUtil.getApplicationContext().getBean(SecurityCheckTaskService.class);
                    }
                    // 判断当前项前段传过来的状态
                    if (1 == changeDto.getCheckProgress()) {
                        // 前端状态位1  待执行； 可能是一个延迟状态(因为检查任务对应的检查记录完善窗口在第一次打开的时候带的状态为1，但是其他窗口修改某一项之后检查任务
                        // 理应改为执行中，如果前端没做这个状态的更新，那么每一次到这里状态可能为延迟的 任务状态)，所以先查询一下数据库
                        if (StringUtils.isEmpty(changeDto.getCheckTaskId())) {
                            throw new CustomException("修改单项检查记录，对应检查状态缺少对应的检查任务ID");
                        }
                        SecurityCheckTask task = securityCheckTaskService.getByEquals("id", changeDto.getCheckTaskId());
                        if (AllDicEnum.CHECK_1_TASK_STATUS.getIntCode() == task.getCheckProgress()) {
                            // 如果当前检查任务为待开始，那么将其改为执行中(因为走到这里一定是对应检查记录的某一项做了修改，状态已不能为待执行了)
                            SecurityCheckTask updateTask = new SecurityCheckTask();
                            updateTask.setId(changeDto.getCheckTaskId());
                            updateTask.setCheckProgress(AllDicEnum.CHECK_2_TASK_STATUS.getIntCode());
                            this.securityCheckTaskService.updateSelective(updateTask);
                            // 将传给前端的实体对象状态也修改为 2
                            changeDto.setCheckProgress(AllDicEnum.CHECK_2_TASK_STATUS.getIntCode());
                        }

                    }
                }


                break;
            }
            case RecordChangeSocketDto.allRecordChange: {
                // 提交操作,暂时提交操作不在这里走逻辑，前端提交的时候直接调用对应接口

                break;
            }
            default: {
                throw new CustomException("socket changeRecordData 发送消息对应的  curChangeMode 模式有误");
            }

        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/14 16:01
     * @Description: 根据单项修改添加一条日志
     * @Params: [changeDto, session]
     * @Return: int
     */
    private void addRecordContentLog(RecordChangeSocketDto changeDto, Session session) {

        WebSocketClient webSocketClient = webSocketMap.get(session.getId());
        if (this.securityTaskRecordLogService == null) {
            this.securityTaskRecordLogService = SpringContextUtil.getApplicationContext().getBean(SecurityTaskRecordLogService.class);

        }
        // 添加一条修改日志到 检查记录项日志表中
        SecurityTaskRecordLog Contentlog = new SecurityTaskRecordLog();

        Contentlog.setCreatePeople(webSocketClient.getCurPeopleId());
        // 检查记录id
        Contentlog.setRecordId(webSocketClient.getTeamId());
        // 检查记录项id
        Contentlog.setRecordContentId(changeDto.getId());

        // 修改的 那一项的sort 序号
        Contentlog.setSort(changeDto.getSort());

        //  [PC] 端,[小红]在[2022-11-14 12:34:33]修改了第[2]项，是否异常改为:否;
        //  [PC] 端,[小红]在[2022-11-14 12:34:33]修改了第[2]项，备注描述改为: 一号工厂安全措施不合格;
        //  [PC] 端,[小红]在[2022-11-14 12:34:33]修改了第[2]项，备注描述改为: 修改了附件;
        // 拼接描述日志: [{}]端,[{用户名}]在[{创建时间}] 修改了 第[{}]项 , 是否异常改为: ;/  备注描述改为:  ;/  修改了附件;

        StringBuffer sb = new StringBuffer();
        sb.append("[").append(webSocketClient.getCurPeoplePoint()).append("]端,");
        sb.append("[").append(webSocketClient.getCurPeopleName()).append("]在[").append(MyDateUtile.dateToStr(new Date(), null)).append("]");
        sb.append("修改了第[").append(Contentlog.getSort()).append("]项,");
        if (changeDto.getIfNormal() != null) {
            sb.append("是否异常改为:").append(changeDto.getIfNormal().equals(1) ? "正常;" : "异常;");
        }
        if (changeDto.getDescription() !=null ) {
            String result="".equals(changeDto.getDescription()) ? "空值" : changeDto.getDescription();
            sb.append("备注描述改为:").append(result).append(";");
        }
        if (changeDto.getIfFileChange() != null) {
            sb.append("修改了附件;");
        }
        Contentlog.setLogDescription(sb.toString());
        Contentlog.setCreatePeopleName(webSocketClient.getCurPeopleName());
        String s = this.securityTaskRecordLogService.addSelective(Contentlog);
        log.info("新增加一条记录项修改项日志,id为[{}],描述为[{}]", Contentlog.getId(), Contentlog.getLogDescription());

    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2022/11/14 17:35
     * @Description: 根据sessionId 添加一条日志到检查记录项日志表
     * @Params: [sessionId]
     * @Return: void
     */
    public void addSubmitLog(String sessionId) {
        if (this.securityTaskRecordLogService == null) {
            this.securityTaskRecordLogService = SpringContextUtil.getApplicationContext().getBean(SecurityTaskRecordLogService.class);

        }

        WebSocketClient client = webSocketMap.get(sessionId);
        // 拼接最终日志
        // 添加一条修改日志到 检查记录项日志表中
        SecurityTaskRecordLog contentlog = new SecurityTaskRecordLog();

        contentlog.setCreatePeople(client.getCurPeopleId());
        // 检查记录id
        contentlog.setRecordId(client.getTeamId());

        //  [PC] 端,[小红]在[2022-11-14 12:34:33] 进行了[提交]操作;
        StringBuffer sb = new StringBuffer();
        sb.append("[").append(client.getCurPeoplePoint()).append("]端,");
        sb.append(client.getCurPeopleName()).append("在[").append(MyDateUtile.dateToStr(new Date(), null)).append("] 进行了[提交]操作");

        contentlog.setLogDescription(sb.toString());
        String s = this.securityTaskRecordLogService.addSelective(contentlog);
        log.info("新增加一条检查记录提交日志,id为[{}],描述为[{}]", contentlog.getId(), contentlog.getLogDescription());


    }
}

```


## 注意socket 对应启动项目以后 会有这个服务也启动 ，但是前端创建socket 连接的话需要注意后端需要吧接口在拦截器中进行 放行 

![](assets/003/023/02/01-1681805271302.png)



## 前端 


websocket.js 混入写法的组件

```js
/**
 * 检查记录弹窗websocket
 */
export default {
  data() {
    return {
      synthesizeWebsocket: null,
      socketNormalCloseFlag: false, //socket是否正常关闭，如果是就不进行重连
      socketTimeoutnum: null, //socket重连计时器
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      socketUrl: "wss://secenv.cebenvironment.com.cn/env/flow/websocket",
      userId: sessionStorage.getItem("userId"),
      socketAutoConnect: true, //是否初始化的时候自动链接socket,true初始化自动链接，false根据时机需要手动链接 sjj 2022/11/12 15:03:44
      sendErrorCatch: true, //发送数据异常时是否缓存当重连时发送不丢数据 sjj 2022/11/12 15:02:18
      catchSendData: [],
    };
  },
  created() {
    if (this.socketAutoConnect) {
      this.initWebSocket();
    }
  },
  destroyed() {
    this.destroySocket();
  },
  methods: {
    initWebSocket: function () {
      //原有的websocket为打开或者已经关闭，重新初始化
      if (this.synthesizeWebsocket) {
        if (this.synthesizeWebsocket.readyState === 3) {
          this.newSocket();
        }
      } else {
        this.newSocket();
      }
      //console.log(this.synthesizeWebsocket.OPEN);
      //this.synthesizeWebsocket.close();
    },
    //新建socket sjj 2022/11/12 14:22:57
    newSocket() {
      this.synthesizeWebsocket = new WebSocket(this.socketUrl);
      this.synthesizeWebsocket.onopen = this.synthesizeWebsocketonopen;
      this.synthesizeWebsocket.onerror = this.synthesizeWebsocketonerror;
      this.synthesizeWebsocket.onmessage = this.synthesizeWebsocketonmessage;
      this.synthesizeWebsocket.onclose = this.synthesizeWebsocketclose;
    },
    // 链接成功
    synthesizeWebsocketonopen: function () {
      console.log("synthesize--WebSocket连接成功");
      if (this.socketTimeoutnum) {
        clearTimeout(this.socketTimeoutnum);
        if (this.sendErrorCatch) {
          this.sendCtachData(); //处理发送时异常的缓存数据 sjj 2022/11/12 14:57:58
        }
      }
    },
    synthesizeWebsocketonerror: function (e) {
      console.log("synthesize--WebSocket连接发生错误：" + e);
    },

    synthesizeWebsocketclose: function (e) {
      //不是正常关闭，进行重连
      if (this.socketNormalCloseFlag === false) {
        console.log("synthesize--webSocket异常关闭！");
        this.socketReconnect();
      } else {
        console.log("synthesize--webSocket正常关闭！");
      }
    },
    socketReconnect() {
      if (!this.isClientCloseWebsocket) {
        //重新连接
        const that = this;
        //清除定时器
        if (that.socketTimeoutnum) {
          clearTimeout(that.socketTimeoutnum);
        }

        that.socketTimeoutnum = setTimeout(function () {
          //新连接
          console.log("开始建立新连接");
          that.initWebSocket();
        }, 5000);
      }
    },
    destroySocket() {
      //清除定时器
      if (this.socketTimeoutnum) {
        clearTimeout(this.socketTimeoutnum);
      }
      //console.log(this.synthesizeWebsocket.readyState)
      if (this.synthesizeWebsocket.readyState == 1) {
        //设置为正常关闭
        this.socketNormalCloseFlag = true;
        this.synthesizeWebsocket.close();
        //console.log(this.synthesizeWebsocket.readyState)
      }
    },
    // 发送消息给服务器
    synthesizeWebsocketSend(sendData = {}) {
      try {
        if (this.synthesizeWebsocket.readyState === 1) {
          if (typeof sendData == "object") {
            sendData = JSON.stringify(sendData);
          }
          this.synthesizeWebsocket.send(sendData);
        } else {
          if (this.sendErrorCatch) {
            this.catchSendData.push(sendData);
          }
        }
      } catch (error) {
        console.log("发送webocket消息异常", error);
      }
    },
    // 前端收到服务器的消息
    synthesizeWebsocketonmessage(e) {
      try {
        if (typeof this.getSocketMessageHandle == "function") {
          this.getSocketMessageHandle(e.data);
        }
      } catch (error) {
        console.log("webscoket收到消息处理:", error);
      }
    },
    //处理缓存的没发送的数据再次发送 sjj 2022/11/12 15:07:32
    sendCtachData() {
      for (let index = 0; index < this.catchSendData.length; index++) {
        this.synthesizeWebsocketSend(this.catchSendData[index]);
        this.catchSendData.splice(index, 1);
      }
    },
  },
};

```
