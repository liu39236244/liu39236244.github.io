# 横竖表案例




## 总结

## 参考


> 参考1：https://www.cnblogs.com/rodge-run/p/7159483.html

> csdn:https://www.csdn.net/gather_27/MtTaEg2sOTA4OS1ibG9n.html 


org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'enterpriseBasicInfoController': Unsatisfied dependency expressed through field 'baseAttachService'; nested exception is org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'com.gsafety.em.enclosure.api.feign.BaseAttachServiceClient': FactoryBean threw exception on object creation; nested exception is java.lang.IllegalStateException: No Feign Client for loadBalancing defined. Did you forget to include spring-cloud-starter-netflix-ribbon?
	at org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor$AutowiredFieldElement.inject(AutowiredAnnotationBeanPostProcessor.java:643) ~[spring-beans-5.2.3.RELEASE.jar:5.2.3.RELEASE]
	at org.springfr