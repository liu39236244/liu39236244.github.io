# linux 启动 spring cloud 

springboot后端部署脚本

## 脚本


```shell
#!/bin/sh
export EUREKA=gp_eureka-1.0-SNAPSHOT.jar
export ZUUL=gp_zuul-1.0-SNAPSHOT.jar
export LAW=gp_law-1.0-SNAPSHOT.jar
export MONGODB=gp_mongodb-1.0-SNAPSHOT.jar
export DANGER=gp_danger-1.0-SNAPSHOT.jar
export DAILY=gp_daily-1.0-SNAPSHOT.jar
export EMERGENCY=gp_emergency-1.0-SNAPSHOT.jar
export USER=gp_user-1.0-SNAPSHOT.jar
export ACCIDENTMANGE=gp_accidentManage-1.0-SNAPSHOT.jar
export AUTH=gp_auth-1.0-SNAPSHOT.jar
export CONTRACTOR=gp_contractor-1.0-SNAPSHOT.jar
export EDUCATION=gp_education-1.0-SNAPSHOT.jar
export HEALTH=gp_occupational_health-1.0-SNAPSHOT.jar
export DEVICEMANAGE=gp_deviceManage-1.0-SNAPSHOT.jar 
export QUARTZ=gp_quartz-1.0-SNAPSHOT.jar 
export HIGHRISK=gp_high_risk-1.0-SNAPSHOT.jar 
 
export EUREKA_port=8761
export ZUUL_port=8762
export LAW_port=8093
export MONGODB_port=8091
export DANGER_port=8097
export DAILY_port=8095
export EMERGENCY_port=8096
export USER_port=8094
export ACCIDENTMANGE_port=8100
export AUTH_port=8092
export CONTRACTOR_port=8098
export EDUCATION_port=8099
export HEALTH_port=8101
export DEVICEMANAGE_port=8102
export QUARTZ_port=8104
export HIGHRISK_port=8105

#启动命令所在目录
HOME='/home/zhgj/parent'
#LOGDIR=/home/zhgj/parent/zhgj.log
EUREAKLOG=/home/zhgj/parent/eureka.log
DEVICEMANAGELOG=/home/zhgj/parent/deviceManage.log
MONGODBLOG=/home/zhgj/parent/mongodb.log
AUTHLOG=/home/zhgj/parent/auth.log
USERLOG=/home/zhgj/parent/user.log
LOWLOG=/home/zhgj/parent/low.log
DANGERLOG=/home/zhgj/parent/danger.log
DAILYLOG=/home/zhgj/parent/daily.log
EMERGENCYLOG=/home/zhgj/parent/emergency.log
ACCIDENTMANGELOG=/home/zhgj/parent/accident.log
CONTRACTORLOG=/home/zhgj/parent/contractor.log
EDUCATIONLOG=/home/zhgj/parent/education.log
HEALTHLOG=/home/zhgj/parent/health.log
ZUULLOG=/home/zhgj/parent/zuu.log
QUARTZLOG=/home/zhgj/parent/quartz.log
HIGHRISTLOG=/home/zhgj/parent/highrisk.log

 
case "$1" in
 
start)
		#进入命令所在目录
		cd $HOME
        ## 启动eureka
        echo "--------eureka 开始启动--------------"
        nohup java -jar $EUREKA --spring.config.location=/home/zhgj/parent/yml/applicationeureka.yml  >> $EUREAKLOG 2>&1 &
        EUREKA_pid=`lsof -i:$EUREKA_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$EUREKA_pid" ]
            do
              EUREKA_pid=`lsof -i:$EUREKA_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "EUREKA pid is $EUREKA_pid" 
        echo "--------eureka 启动成功--------------"
		
		## 启动deviceManage
        echo "--------deviceManage 开始启动--------------"
        nohup java -jar $DEVICEMANAGE >> $DEVICEMANAGELOG 2>&1 &
        DEVICEMANAGE_pid=`lsof -i:$EUREKA_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$EUREKA_pid" ]
            do
              DEVICEMANAGE_pid=`lsof -i:$EUREKA_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "EUREKA pid is $EUREKA_pid" 
        echo "--------eureka 启动成功--------------"
		
		 ## 启动MONGODB
        echo "--------开始启动MONGODB---------------"
        nohup java -jar $MONGODB >> $MONGODBLOG 2>&1 &
        MONGODB_pid=`lsof -i:$MONGODB_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$MONGODB_pid" ]
            do
              MONGODB_pid=`lsof -i:$MONGODB_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "MONGODB pid is $MONGODB_pid"    
        echo "---------MONGODB 启动成功-----------"
		
		## 启动AUTH
        echo "--------开始启动AUTH---------------"
        nohup java -jar $AUTH >> $AUTHLOG 2>&1 &
        AUTH_pid=`lsof -i:$AUTH_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$AUTH_pid" ]
            do
              AUTH_pid=`lsof -i:$AUTH_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "AUTH pid is $AUTH_pid"    
        echo "---------AUTH 启动成功-----------"		
				
		
	    ## 启动USER
        echo "--------开始启动USER---------------"
        nohup java -jar $USER >> $USERLOG 2>&1 &
        USER_pid=`lsof -i:$USER_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$USER_pid" ]
            do
              USER_pid=`lsof -i:$USER_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "USER pid is $USER_pid"     
        echo "---------USER 启动成功-----------"
 
        ## 启动LAW
        echo "--------开始启动LAW---------------"
        nohup java -jar $LAW >> $LOWLOG 2>&1 &
        LAW_pid=`lsof -i:$LAW_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$LAW_pid" ]
            do
              LAW_pid=`lsof -i:$LAW_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "LAW pid is $LAW_pid"     
        echo "---------LAW 启动成功-----------"
		
		## 启动DANGER
        echo "--------开始启动DANGER---------------"
        nohup java -jar $DANGER >> $DANGERLOG 2>&1 &
        DANGER_pid=`lsof -i:$DANGER_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$DANGER_pid" ]
            do
              DANGER_pid=`lsof -i:$DANGER_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "DANGER pid is $DANGER_pid"     
        echo "---------DANGER 启动成功-----------"
		
		## 启动DAILY
        echo "--------开始启动DAILY---------------"
        nohup java -jar $DAILY >> $DAILYLOG 2>&1 &
        DAILY_pid=`lsof -i:$DAILY_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$DAILY_pid" ]
            do
              DAILY_pid=`lsof -i:$DAILY_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "DAILY pid is $DAILY_pid"     
        echo "---------DAILY 启动成功-----------"
		
		
		## 启动EMERGENCY
        echo "--------开始启动EMERGENCY---------------"
        nohup java -jar $EMERGENCY >> $EMERGENCYLOG 2>&1 &
        EMERGENCY_pid=`lsof -i:$EMERGENCY_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$EMERGENCY_pid" ]
            do
              EMERGENCY_pid=`lsof -i:$EMERGENCY_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "EMERGENCY pid is $EMERGENCY_pid"     
        echo "---------EMERGENCY 启动成功-----------"
		
		## 启动ACCIDENTMANGE
        echo "--------开始启动ACCIDENTMANGE---------------"
        nohup java -jar $ACCIDENTMANGE >> $ACCIDENTMANGELOG 2>&1 &
        ACCIDENTMANGE_pid=`lsof -i:$ACCIDENTMANGE_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$ACCIDENTMANGE_pid" ]
            do
              ACCIDENTMANGE_pid=`lsof -i:$ACCIDENTMANGE_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "ACCIDENTMANGE pid is $ACCIDENTMANGE_pid"     
        echo "---------ACCIDENTMANGE 启动成功-----------"
		
			## 启动CONTRACTOR
        echo "--------开始启动CONTRACTOR---------------"
        nohup java -jar $CONTRACTOR >> $CONTRACTORLOG 2>&1 &
        CONTRACTOR_pid=`lsof -i:$CONTRACTOR_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$CONTRACTOR_pid" ]
            do
              CONTRACTOR_pid=`lsof -i:$CONTRACTOR_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "CONTRACTOR pid is $CONTRACTOR_pid"    
        echo "---------CONTRACTOR 启动成功-----------"
		
		## 启动EDUCATION
        echo "--------开始启动EDUCATION---------------"
        nohup java -jar $EDUCATION >> $EDUCATIONLOG 2>&1 &
        EDUCATION_pid=`lsof -i:$EDUCATION_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$EDUCATION_pid" ]
            do
              EDUCATION_pid=`lsof -i:$EDUCATION_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "EDUCATION pid is $EDUCATION_pid"    
        echo "---------EDUCATION 启动成功-----------"
		
		## 启动HEALTH
        echo "--------开始启动HEALTH---------------"
        nohup java -jar $HEALTH >> $HEALTHLOG 2>&1 &
        HEALTH_pid=`lsof -i:$HEALTH_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$HEALTH_pid" ]
            do
              HEALTH_pid=`lsof -i:$HEALTH_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "HEALTH pid is $HEALTH_pid"    
        echo "---------HEALTH 启动成功-----------"

       ## 启动ZUUL
        echo "--------开始启动ZUUL---------------"
        nohup java -jar $ZUUL >> $ZUULLOG 2>&1 &
        ZUUL_pid=`lsof -i:$ZUUL_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$ZUUL_pid" ]
            do
              ZUUL_pid=`lsof -i:$ZUUL_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "ZUUL pid is $ZUUL_pid"     
        echo "---------ZUUL 启动成功-----------"
        
        echo "===startAll success==="
		
		## 启动quartz
        echo "--------开始启动quartz---------------"
        nohup java -jar $QUARTZ >> $QUARTZLOG 2>&1 &
        QUARTZ_pid=`lsof -i:$QUARTZ_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$QUARTZ_pid" ]
            do
              QUARTZ_pid=`lsof -i:$QUARTZ_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "QUARTZ pid is $QUARTZ_pid"     
        echo "---------QUARTZ 启动成功-----------"
		
		## 启动hightris
        echo "--------开始启动hightrisk---------------"
        nohup java -jar $HIGHRISK >> $HIGHRISTLOG 2>&1 &
        HIGHRISK_pid=`lsof -i:$HIGHRISK_port|grep "LISTEN"|awk '{print $2}'` 
        until [ -n "$HIGHRISK_pid" ]
            do
              HIGHRISK_pid=`lsof -i:$HIGHRISK_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "HIGHRISK pid is $HIGHRISK_pid"     
        echo "---------HIGHRISK 启动成功-----------"
        
        echo "===startAll success==="
        ;;
 
 stop)
        P_ID=`ps -ef | grep -w $EUREKA | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===EUREKA process not exists or stop success"
        else
            kill -9 $P_ID
            echo "EUREKA killed success"
        fi
		P_ID=`ps -ef | grep -w $DEVICEMANAGE | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===DEVICEMANAGE process not exists or stop success"
        else
            kill -9 $P_ID
            echo "DEVICEMANAGE killed success"
        fi
		P_ID=`ps -ef | grep -w $MONGODB | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===MONGODB process not exists or stop success"
        else
            kill -9 $P_ID
            echo "MONGODB killed success"
        fi
		P_ID=`ps -ef | grep -w $AUTH | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===AUTH process not exists or stop success"
        else
            kill -9 $P_ID
            echo "AUTH killed success"
        fi
		P_ID=`ps -ef | grep -w $USER | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===USER process not exists or stop success"
        else
            kill -9 $P_ID
            echo "USER killed success"
        fi
		P_ID=`ps -ef | grep -w $LAW | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===LAW process not exists or stop success"
        else
            kill -9 $P_ID
            echo "LAW killed success"
        fi
		P_ID=`ps -ef | grep -w $DANGER | grep -v "grep" | awk '{print $2}'`
		if [ "$P_ID" == "" ]; then
            echo "===DANGER process not exists or stop success"
        else
            kill -9 $P_ID
            echo "DANGER killed success"
        fi
		P_ID=`ps -ef | grep -w $DAILY | grep -v "grep" | awk '{print $2}'`
		if [ "$P_ID" == "" ]; then
            echo "===DAILY process not exists or stop success"
        else
            kill -9 $P_ID
            echo "DAILY killed success"
        fi
			P_ID=`ps -ef | grep -w $EMERGENCY | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===EMERGENCY process not exists or stop success"
        else
            kill -9 $P_ID
            echo "EMERGENCY killed success"
        fi
		P_ID=`ps -ef | grep -w $ACCIDENTMANGE | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===ACCIDENTMANGE process not exists or stop success"
        else
            kill -9 $P_ID
            echo "ACCIDENTMANGE killed success"
        fi			
		P_ID=`ps -ef | grep -w $CONTRACTOR | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===CONTRACTOR process not exists or stop success"
        else
            kill -9 $P_ID
            echo "CONTRACTOR killed success"
        fi
		P_ID=`ps -ef | grep -w $EDUCATION | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===EDUCATION process not exists or stop success"
        else
            kill -9 $P_ID
            echo "EDUCATION killed success"
        fi
		P_ID=`ps -ef | grep -w $HEALTH | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===HEALTH process not exists or stop success"
        else
            kill -9 $P_ID
            echo "HEALTH killed success"
        fi
		P_ID=`ps -ef | grep -w $ZUUL | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===ZUUL process not exists or stop success"
        else
            kill -9 $P_ID
            echo "ZUUL killed success"
        fi

		P_ID=`ps -ef | grep -w $QUARTZ | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===QUARTZ process not exists or stop success"
        else
            kill -9 $P_ID
            echo "QUARTZ killed success"
        fi

		P_ID=`ps -ef | grep -w $HIGHRISK | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===HIGHRISK process not exists or stop success"
        else
            kill -9 $P_ID
            echo "HIGHRISK killed success"
        fi

 
        echo "===stop success==="
        ;;   
 
restart)
        $0 stop
        sleep 2
        $0 start
        echo "===restart success==="
        ;;   
esac	
exit 0

```



# linux 普通jar 不指定配置文件启动


```sh
#!/bin/sh
export EUREKA=gp_eureka-0.0.1-SNAPSHOT.jar
export ZUUL=gp_zuul-0.0.1-SNAPSHOT.jar
export DEFORM=gp_dform-0.0.1-SNAPSHOT.jar
export MONGODB=gp_mongodb-0.0.1-SNAPSHOT.jar

export EUREKA_port=8771
export ZUUL_port=8773
export DEFORM_port=8142
export MONGODB_port=8428


#启动命令所在目录
HOME='/home/graphsafe/ZZZHPX/back'
#LOGDIR=/home/graphsafe/ZZZHPX/zzzhpx.log
EUREAKLOG=/home/graphsafe/ZZZHPX/back/log/eureka.log
ZUULLOG=/home/graphsafe/ZZZHPX/back/log/zuul.log
DEFORMLOG=/home/graphsafe/ZZZHPX/back/log/deform.log
MONGODBLOG=/home/graphsafe/ZZZHPX/back/log/mongodb.log
 
case "$1" in
 
start)
		#进入命令所在目录
		cd $HOME
        ## 启动eureka
        echo "--------eureka 开始启动--------------"
        nohup java -jar  $EUREKA > $EUREAKLOG 2>&1 &
        EUREKA_pid=`lsof -i:$EUREKA_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$EUREKA_pid" ]
            do
              EUREKA_pid=`lsof -i:$EUREKA_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "EUREKA pid is $EUREKA_pid" 
        echo "--------eureka 启动成功--------------"
		
		## 启动ZUUL
        echo "--------开始启动ZUUL---------------"
        nohup java -jar $ZUUL >> $ZUULLOG 2>&1 &
        ZUUL_pid=`lsof -i:$ZUUL_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$ZUUL_pid" ]
            do
              ZUUL_pid=`lsof -i:$ZUUL_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "ZUUL pid is $ZUUL_pid"    
        echo "---------ZUUL 启动成功-----------"
		
		## 启动DEFORM
        echo "--------开始启动DEFORM---------------"
        nohup java -jar  $DEFORM >> $DEFORMLOG 2>&1 &
        DEFORM_pid=`lsof -i:$DEFORM_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$DEFORM_pid" ]
            do
              DEFORM_pid=`lsof -i:$DEFORM_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "DEFORM pid is $DEFORM_pid"    
        echo "---------DEFORM 启动成功-----------"
		 
		## 启动MONGODB
        echo "--------开始启动MONGODB---------------"
        nohup java -jar  $MONGODB >> $MONGODBLOG 2>&1 &
        MONGODB_pid=`lsof -i:$MONGODB_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$MONGODB_pid" ]
            do
              MONGODB_pid=`lsof -i:$MONGODB_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "MONGODB pid is $MONGODB_pid"    
        echo "---------MONGODB 启动成功-----------"
		
        echo "===startAll success==="
        ;;
 
 stop)
        P_ID=`ps -ef | grep -w $EUREKA | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===EUREKA process not exists or stop success"
        else
            kill -9 $P_ID
            echo "EUREKA killed success"
        fi
		P_ID=`ps -ef | grep -w $ZUUL | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===ZUUL process not exists or stop success"
        else
            kill -9 $P_ID
            echo "ZUUL killed success"
        fi
		P_ID=`ps -ef | grep -w $DEFORM | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===DEFORM process not exists or stop success"
        else
            kill -9 $P_ID
            echo "DEFORM killed success"
        fi
		P_ID=`ps -ef | grep -w $MONGODB | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===MONGODB process not exists or stop success"
        else
            kill -9 $P_ID
            echo "MONGODB killed success"
        fi
        echo "===stop success==="
        ;;   
 
restart)
        $0 stop
        sleep 2
        $0 start
        echo "===restart success==="
        ;;   
esac	
exit 0

```

# 成功案例：

zzzh

```sh
#!/bin/sh
export EUREKA=gp_eureka-0.0.1-SNAPSHOT.jar
export ZUUL=gp_zuul-0.0.1-SNAPSHOT.jar
export DEFORM=gp_dform-0.0.1-SNAPSHOT.jar
export MONGODB=gp_mongodb-0.0.1-SNAPSHOT.jar

export EUREKA_port=8771
export ZUUL_port=8773
export DEFORM_port=8142
export MONGODB_port=8438


#启动命令所在目录
HOME='/home/graphsafe/ZZZHPX/back'
#LOGDIR=/home/graphsafe/ZZZHPX/zzzhpx.log
EUREAKLOG=/home/graphsafe/ZZZHPX/back/log/eureka.log
ZUULLOG=/home/graphsafe/ZZZHPX/back/log/zuul.log
DEFORMLOG=/home/graphsafe/ZZZHPX/back/log/deform.log
MONGODBLOG=/home/graphsafe/ZZZHPX/back/log/mongodb.log
 
case "$1" in
 
start)
		#进入命令所在目录
		cd $HOME
        ## 启动eureka
        echo "--------eureka 开始启动--------------"
        nohup java -jar  $EUREKA --spring.config.location=/home/graphsafe/ZZZHPX/back/yml/gp_eureka_application.yml >> $EUREAKLOG 2>&1 &
        EUREKA_pid=`lsof -i:$EUREKA_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$EUREKA_pid" ]
            do
              EUREKA_pid=`lsof -i:$EUREKA_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "EUREKA pid is $EUREKA_pid" 
        echo "--------eureka 启动成功--------------"
		
		## 启动ZUUL
        echo "--------开始启动ZUUL---------------"
        nohup java -jar  $ZUUL --spring.config.location=/home/graphsafe/ZZZHPX/back/yml/gp_zuul_application.yml >> $ZUULLOG 2>&1 &
        ZUUL_pid=`lsof -i:$ZUUL_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$ZUUL_pid" ]
            do
              ZUUL_pid=`lsof -i:$ZUUL_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "ZUUL pid is $ZUUL_pid"    
        echo "---------ZUUL 启动成功-----------"
		
		## 启动DEFORM
        echo "--------开始启动DEFORM---------------"
        nohup java -jar $DEFORM --spring.config.location=/home/graphsafe/ZZZHPX/back/yml/gp_dform_application.yml  >> $DEFORMLOG 2>&1 &
        DEFORM_pid=`lsof -i:$DEFORM_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$DEFORM_pid" ]
            do
              DEFORM_pid=`lsof -i:$DEFORM_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "DEFORM pid is $DEFORM_pid"    
        echo "---------DEFORM 启动成功-----------"
		 
		## 启动MONGODB
        echo "--------开始启动MONGODB---------------"
        nohup java -jar $MONGODB --spring.config.location=/home/graphsafe/ZZZHPX/back/yml/gp_mongodb_application.yml  >> $MONGODBLOG 2>&1 &
        MONGODB_pid=`lsof -i:$MONGODB_port|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$MONGODB_pid" ]
            do
              MONGODB_pid=`lsof -i:$MONGODB_port|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "MONGODB pid is $MONGODB_pid"    
        echo "---------MONGODB 启动成功-----------"
		
        echo "===startAll success==="
        ;;
 
 stop)
        P_ID=`ps -ef | grep -w $EUREKA | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===EUREKA process not exists or stop success"
        else
            kill -9 $P_ID
            echo "EUREKA killed success"
        fi
		P_ID=`ps -ef | grep -w $ZUUL | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===ZUUL process not exists or stop success"
        else
            kill -9 $P_ID
            echo "ZUUL killed success"
        fi
		P_ID=`ps -ef | grep -w $DEFORM | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===DEFORM process not exists or stop success"
        else
            kill -9 $P_ID
            echo "DEFORM killed success"
        fi
		P_ID=`ps -ef | grep -w $MONGODB | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===MONGODB process not exists or stop success"
        else
            kill -9 $P_ID
            echo "MONGODB killed success"
        fi
        echo "===stop success==="
        ;;   
 
restart)
        $0 stop
        sleep 2
        $0 start
        echo "===restart success==="
        ;;   
esac	
exit 0

```

## 学生奶

```sh

```sh
#!/bin/sh
export XSN_BASE_SERVICE=gp_xsn-1.0-SNAPSHOT.jar

export XSN_PORT=27501


#启动命令所在目录
HOME='/home/graphsafe/MNXSN/jar'
#LOGDIR=/home/graphsafe/ZZZHPX/zzzhpx.log
XSN_LOG=/home/graphsafe/MNXSN/jar/log/xsn.log

 
case "$1" in
 
start)
		#进入命令所在目录
		cd $HOME

		## 启动XSN
        echo "--------开始启动XSN_BASE_SERVICE---------------"
        nohup java -jar $XSN_BASE_SERVICE --spring.config.location=/home/graphsafe/ZZZHPX/back/application.yml  >> $XSN_LOG 2>&1 &
        XSN_BASE_SERVICE_pid=`lsof -i:$XSN_PORT|grep "LISTEN"|awk '{print $2}'`
        until [ -n "$XSN_BASE_SERVICE_pid" ]
            do
              XSN_BASE_SERVICE_pid=`lsof -i:$XSN_PORT|grep "LISTEN"|awk '{print $2}'`  
            done
        echo "XSN pid is $XSN_BASE_SERVICE_pid"    
        echo "---------XSN_BASE_SERVICE 启动成功-----------"
		
        echo "===startAll success==="
        ;;
        
 stop)
        P_ID=`ps -ef | grep -w $XSN_BASE_SERVICE | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "===XSN_BASE_SERVICE process not exists or stop success"
        else
            kill -9 $P_ID
            echo "XSN_BASE_SERVICE killed success"
        fi
        echo "===stop success==="
        ;;   

restart)
        $0 stop
        sleep 2
        $0 start
        echo "===restart success==="
        ;;   
esac	
exit 0

```
```

# 配置文件不起作用；

我是吧配置文件放在了jar 同级下的一个yml中了，后来给拿出来与jar 同级，并且指定了配置文件，名字必须是application.yml 才有效



