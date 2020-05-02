# Spring boot 多模块创建、且创建springboot web



## my记录

new project -》 spring Interact ，不选中任何依赖，总项目中

*  1 创建project


![](assets/005/20190603-73e55000.png)  



* 随后选中项目名称，new module  ，选中web web，创建 web 模块

![](assets/005/20190603-200e55de.png)  


* 3 删除不需要的地方

![](assets/005/20190603-c0b0d116.png)  


* 4 最终结构

![](assets/005/20190603-433efc48.png)  



---


## 博主记录


### 记录-1）

源文：https://blog.csdn.net/lhw_csd/article/details/82183008
创建web ：

https://www.cnblogs.com/tufujie/p/8950169.html

https://blog.csdn.net/u013297491/article/details/83543550


* 创建完成之后需要添加webapp 目录 ，idea 创建的是没有的，具体参考：

https://blog.csdn.net/fakerswe/article/details/80922536

* spring boot 的三种启动方式

https://blog.csdn.net/azhong148/article/details/78494804




<div class="htmledit_views" id="content_views">
            <p>最近在负责的是一个比较复杂项目，模块很多，代码中的二级模块就有9个，部分二级模块下面还分了多个模块。代码中的多模块是用maven管理的，每个模块都使用spring boot框架。之前有零零散散学过一些maven多模块配置的知识，但没自己从头到尾创建和配置过，也快忘得差不多了。这次正好对照着这个项目，动手实践一下，下面我们就开始吧。</p>

<p>maven多模块项目通常由一个父模块和若干个子模块构成，每个模块都对应着一个pom.xml。它们之间通过继承和聚合（也称作多模块）相互关联。多模块适用于一些比较大的项目，通过合理的模块拆分，实现代码的复用，便于维护和管理。</p>

<h2><a name="t0"></a>1 多模块项目创建</h2>

<p>因为本系列的下一篇是《Spring Boot集成Dubbo》，所以本章就以创建多模块的dubbo项目作为示例。示例中的开发环境是Win 7，编辑器是Intellij IDEA，Java版本是1.8。</p>

<h3><a name="t1"></a>1.1 父模块创建</h3>

<p>首先我们在IDEA中创建一个spring boot工程作为父项目。</p>

<p>一、在界面左上角选择File-&gt;New-&gt;Project后，选择Spring Initializr，默认使用的Java版本是1.8。</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143355412-669989753.png"></p>

<p>二、点击Next，进入下一步，可以设置项目的一些基本信息。</p>

<p>这里我们先来温习下groupId、artifactId、package这三个参数的一般填写规范。</p>

<p>groupId和artifactId统称为“坐标”，是为了保证项目唯一性而提出的。groupId是项目组织唯一的标识符，实际对应JAVA的包的结构，ArtifactID是项目的唯一的标识符，实际对应项目的名称，就是项目根目录的名称。groupId一般分为多个段，一般第一段为域，第二段为公司名称。举个apache公司的tomcat项目例子：这个项目的groupId是org.apache，它的域是org，公司名称是apache，artifactId是tomcat。包结构package最好是以groupId.artifactId打头的。</p>

<p>因为后续打算将“代码学习和实践”写成一个系列的文章，文中演示的工程都作为该工程的子模块，所以这里项目名Name就填写CodeLearnAndPractice。</p>

<p>这里是个人练习的项目，不涉及公司名，但groupId、artifactId、package参数的填写，还是尽量按照上面的规范来填写，这里package就直接用groupId.artifactId。如下所示：</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143435537-1533664407.png"></p>

<p>三、点击Next，进入下一个选择dependency的界面，作用是在pom中自动添加一些依赖，在项目开始时就下载。这里我们暂时不勾选任何依赖。</p>

<p>四、点击Next，进入下一个界面，填写工程名，并选择工程所在目录。填写完成后，点击Finish，即可创建一个spring boot项目。</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143449115-728756027.png"></p>

<h3><a name="t2"></a>1.2 创建子模块</h3>

<p>在上面创建好的CodeLearnAndPractice工程名上，点击右键，选择New–&gt;Module，进入New Module页面。</p>

<p>该模块为dubbo服务的提供方，Name为springboot-dubbo-server，后面其他的参数都可参照父模块的参数设置。</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143718896-545482084.png"></p>

<p>下面创建另一个Module，dubbo服务的调用方，Name为springboot-dubbo-client，其他参数设置参照上步。</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143729818-1570168486.png"></p>

<p>以上3个模块创建完成之后，整个项目的目录结构如下图所示。</p>

<p>我们把下图选中的无用的文件及文件夹删掉，包括三个模块的mvnw、mvnw.cmd文件及.mvn文件夹，还有父模块的src目录，因为此处的父模块只做依赖管理，不需要编写代码。</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143739303-295778058.png"></p>

<p>到这里，一个父模块和两个子模块都创建完成啦~~</p>

<h2><a name="t3"></a>2 多模块项目配置</h2>

<h3><a name="t4"></a>2.1 父模块pom配置</h3>

<p>父pom是为了抽取统一的配置信息和依赖版本控制，方便子pom直接引用，简化子pom的配置。</p>

<p>下面介绍下父pom的配置中需要注意的一些地方。我贴出的pom看起来会有点冗余，因为其中一些不需要的地方，我没有直接删掉而是注释掉，并加了说明，是为了后续查看的时候还能清楚删掉的原因。</p>

<p>1、父模块的打包类型</p>

<p>多模块项目中，父模块打包类型必须是pom，同时以给出所有的子模块，其中每个module，都是另外一个maven项目。</p>

<p>我们的项目中目前一共有两个子模块，springboot-dubbo-server和springboot-dubbo-client。后续新增的子模块也必须加到父pom的modules中。</p>

<p>2、继承设置</p>

<p>继承是maven中很强大的一种功能，继承可以使子pom获得parent中的各项配置，对子pom进行统一的配置和依赖管理。父pom中的大多数元素都能被子pom继承，想深入了解的同学可自行搜索学习~~</p>

<p>maven项目之间的继承关系通过表示。这里使用的开发框架是spring boot，默认继承spring-boot-starter-parent。</p>

<p>3、使用dependencyManagement管理依赖版本号</p>

<p>一般在项目最顶层的父pom中使用该元素，让所有子模块引用一个依赖而不用显式的列出版本号。maven会沿着父子层次向上走，直到找到一个拥有dependencyManagement元素的项目，然后它就会使用在这个dependencyManagement元素中指定的版本号。</p>

<p>4、使用properties控制依赖包的版本号，便于版本维护</p>

<p>在properties标签中，添加各依赖包的版本号，然后在dependency中直接引用该依赖版本号的值即可。</p>

<p><strong>CodeLearnAndPractice/pom.xml</strong></p>

<div class="table-box"><table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td>
			<p>1</p>

			<p>2</p>

			<p>3</p>

			<p>4</p>

			<p>5</p>

			<p>6</p>

			<p>7</p>

			<p>8</p>

			<p>9</p>

			<p>10</p>

			<p>11</p>

			<p>12</p>

			<p>13</p>

			<p>14</p>

			<p>15</p>

			<p>16</p>

			<p>17</p>

			<p>18</p>

			<p>19</p>

			<p>20</p>

			<p>21</p>

			<p>22</p>

			<p>23</p>

			<p>24</p>

			<p>25</p>

			<p>26</p>

			<p>27</p>

			<p>28</p>

			<p>29</p>

			<p>30</p>

			<p>31</p>

			<p>32</p>

			<p>33</p>

			<p>34</p>

			<p>35</p>

			<p>36</p>

			<p>37</p>

			<p>38</p>

			<p>39</p>

			<p>40</p>

			<p>41</p>

			<p>42</p>

			<p>43</p>

			<p>44</p>

			<p>45</p>

			<p>46</p>

			<p>47</p>

			<p>48</p>

			<p>49</p>

			<p>50</p>

			<p>51</p>

			<p>52</p>

			<p>53</p>

			<p>54</p>

			<p>55</p>

			<p>56</p>

			<p>57</p>

			<p>58</p>

			<p>59</p>

			<p>60</p>

			<p>61</p>

			<p>62</p>

			<p>63</p>

			<p>64</p>

			<p>65</p>

			<p>66</p>

			<p>67</p>

			<p>68</p>

			<p>69</p>

			<p>70</p>

			<p>71</p>

			<p>72</p>

			<p>73</p>

			<p>74</p>

			<p>75</p>

			<p>76</p>

			<p>77</p>

			<p>78</p>

			<p>79</p>

			<p>80</p>

			<p>81</p>

			<p>82</p>

			<p>83</p>

			<p>84</p>

			<p>85</p>

			<p>86</p>

			<p>87</p>

			<p>88</p>
			</td>
			<td>
			<p><code>&lt;?</code><code>xml</code>&nbsp;<code>version="1.0" encoding="UTF-8"?&gt;</code></p>

			<p><code>&lt;</code><code>project</code>&nbsp;<code>xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>modelVersion</code><code>&gt;4.0.0&lt;/</code><code>modelVersion</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.practice&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;CodeLearnAndPractice&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;0.0.1-SNAPSHOT&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;packaging&gt;jar&lt;/packaging&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>packaging</code><code>&gt;pom&lt;/</code><code>packaging</code><code>&gt;&nbsp;&nbsp;</code><code>&lt;!--父模块打包类型必须为pom--&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>modules</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>module</code><code>&gt;springboot-dubbo-server&lt;/</code><code>module</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>module</code><code>&gt;springboot-dubbo-client&lt;/</code><code>module</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>modules</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>name</code><code>&gt;CodeLearnAndPractice&lt;/</code><code>name</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>description</code><code>&gt;Practice the learned code&lt;/</code><code>description</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- parent指明继承关系，给出被继承的父项目的具体信息--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>parent</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework.boot&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring-boot-starter-parent&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;1.5.8.RELEASE&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>relativePath</code><code>/&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- lookup parent from repository --&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>parent</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>properties</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>project.build.sourceEncoding</code><code>&gt;UTF-8&lt;/</code><code>project.build.sourceEncoding</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>project.reporting.outputEncoding</code><code>&gt;UTF-8&lt;/</code><code>project.reporting.outputEncoding</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>java.version</code><code>&gt;1.8&lt;/</code><code>java.version</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- 在properties中统一控制依赖包的版本，更清晰--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dubbo.version</code><code>&gt;2.5.3&lt;/</code><code>dubbo.version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>zkclient.version</code><code>&gt;0.10&lt;/</code><code>zkclient.version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>properties</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependencyManagement</code><code>&gt;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--dependencyManagement用于管理依赖版本号--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependencies</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- 删除spring-boot-starter和spring-boot-starter-test，</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>因为parent中继承的祖先中已经有了，并且一般dependencyManagement管理的依赖都要写版本号 --&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;dependency&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;artifactId&gt;spring-boot-starter&lt;/artifactId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/dependency&gt;--&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;dependency&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;scope&gt;test&lt;/scope&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/dependency&gt;--&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--新增后续dubbo项目中所需依赖，dubbo、zk--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.alibaba&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;dubbo&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;version&gt;2.5.3&lt;/version&gt;--&gt;</code>&nbsp;&nbsp;&nbsp;&nbsp;<code>&lt;!--使用properties中配置的版本号--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;${dubbo.version}&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>exclusions</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>exclusion</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>exclusion</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>exclusions</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.101tec&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;zkclient&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;version&gt;0.10&lt;/version&gt;--&gt;</code>&nbsp;&nbsp;&nbsp;&nbsp;<code>&lt;!--使用properties中配置的版本号--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;${zkclient.version}&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependencies</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependencyManagement</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--该插件作用是打一个可运行的包，必须要写在需要打包的项目里。这里的父模块不需要打包运行，所以删掉该插件。--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;build&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;plugins&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;plugin&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/plugin&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/plugins&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/build&gt;--&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&lt;/</code><code>project</code><code>&gt;</code></p>
			</td>
		</tr></tbody></table></div><p>&nbsp;</p>

<h3><a name="t5"></a>2.2 子模块pom配置</h3>

<p>1、继承设置</p>

<p>子模块的parent要使用顶层的父模块.</p>

<p>2、依赖设置</p>

<p>父模块pom中使用dependencyManagement来管理的依赖，在子模块pom中就不需要再写版本号了，exclusion元素也不需要再写。</p>

<p><strong>springboot-dubbo-server\pom.xml</strong></p>

<div class="table-box"><table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td>
			<p>1</p>

			<p>2</p>

			<p>3</p>

			<p>4</p>

			<p>5</p>

			<p>6</p>

			<p>7</p>

			<p>8</p>

			<p>9</p>

			<p>10</p>

			<p>11</p>

			<p>12</p>

			<p>13</p>

			<p>14</p>

			<p>15</p>

			<p>16</p>

			<p>17</p>

			<p>18</p>

			<p>19</p>

			<p>20</p>

			<p>21</p>

			<p>22</p>

			<p>23</p>

			<p>24</p>

			<p>25</p>

			<p>26</p>

			<p>27</p>

			<p>28</p>

			<p>29</p>

			<p>30</p>

			<p>31</p>

			<p>32</p>

			<p>33</p>

			<p>34</p>

			<p>35</p>

			<p>36</p>

			<p>37</p>

			<p>38</p>

			<p>39</p>

			<p>40</p>

			<p>41</p>

			<p>42</p>

			<p>43</p>

			<p>44</p>

			<p>45</p>

			<p>46</p>

			<p>47</p>

			<p>48</p>

			<p>49</p>

			<p>50</p>

			<p>51</p>

			<p>52</p>

			<p>53</p>

			<p>54</p>

			<p>55</p>

			<p>56</p>

			<p>57</p>

			<p>58</p>

			<p>59</p>

			<p>60</p>

			<p>61</p>

			<p>62</p>

			<p>63</p>

			<p>64</p>

			<p>65</p>

			<p>66</p>

			<p>67</p>

			<p>68</p>

			<p>69</p>

			<p>70</p>

			<p>71</p>

			<p>72</p>

			<p>73</p>

			<p>74</p>
			</td>
			<td>
			<p><code>&lt;?</code><code>xml</code>&nbsp;<code>version="1.0" encoding="UTF-8"?&gt;</code></p>

			<p><code>&lt;</code><code>project</code>&nbsp;<code>xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>modelVersion</code><code>&gt;4.0.0&lt;/</code><code>modelVersion</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.practice&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;springboot-dubbo-server&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;0.0.1-SNAPSHOT&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>packaging</code><code>&gt;jar&lt;/</code><code>packaging</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>name</code><code>&gt;springboot-dubbo-server&lt;/</code><code>name</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>description</code><code>&gt;Demo project for Spring Boot&lt;/</code><code>description</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- 子模块的parent要使用顶层的父模块--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>parent</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;version&gt;1.5.8.RELEASE&lt;/version&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;relativePath/&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.practice&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;CodeLearnAndPractice&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;0.0.1-SNAPSHOT&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>parent</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- properties可删掉，会继承父模块的--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;properties&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;project.reporting.outputEncoding&gt;UTF-8&lt;/project.reporting.outputEncoding&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;java.version&gt;1.8&lt;/java.version&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/properties&gt;--&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependencies</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework.boot&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring-boot-starter&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework.boot&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring-boot-starter-test&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>scope</code><code>&gt;test&lt;/</code><code>scope</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--新增后续dubbo项目中所需依赖，dubbo、zk。</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>父模块pom中使用dependencyManagement来管理依赖版本号，子模块pom中不需要再写版本号，exclusion也不需要--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.alibaba&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;dubbo&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;version&gt;2.5.3&lt;/version&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;exclusions&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;exclusion&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;groupId&gt;org.springframework&lt;/groupId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;artifactId&gt;spring&lt;/artifactId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/exclusion&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/exclusions&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.101tec&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;zkclient&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;version&gt;0.10&lt;/version&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependencies</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>build</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>plugins</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>plugin</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework.boot&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring-boot-maven-plugin&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>plugin</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>plugins</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>build</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&lt;/</code><code>project</code><code>&gt;</code></p>
			</td>
		</tr></tbody></table></div><p>&nbsp;</p>

<p><strong>springvoot-dubbo-client/pom.xml</strong></p>

<div class="table-box"><table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td>
			<p>1</p>

			<p>2</p>

			<p>3</p>

			<p>4</p>

			<p>5</p>

			<p>6</p>

			<p>7</p>

			<p>8</p>

			<p>9</p>

			<p>10</p>

			<p>11</p>

			<p>12</p>

			<p>13</p>

			<p>14</p>

			<p>15</p>

			<p>16</p>

			<p>17</p>

			<p>18</p>

			<p>19</p>

			<p>20</p>

			<p>21</p>

			<p>22</p>

			<p>23</p>

			<p>24</p>

			<p>25</p>

			<p>26</p>

			<p>27</p>

			<p>28</p>

			<p>29</p>

			<p>30</p>

			<p>31</p>

			<p>32</p>

			<p>33</p>

			<p>34</p>

			<p>35</p>

			<p>36</p>

			<p>37</p>

			<p>38</p>

			<p>39</p>

			<p>40</p>

			<p>41</p>

			<p>42</p>

			<p>43</p>

			<p>44</p>

			<p>45</p>

			<p>46</p>

			<p>47</p>

			<p>48</p>

			<p>49</p>

			<p>50</p>

			<p>51</p>

			<p>52</p>

			<p>53</p>

			<p>54</p>

			<p>55</p>

			<p>56</p>

			<p>57</p>

			<p>58</p>

			<p>59</p>

			<p>60</p>

			<p>61</p>

			<p>62</p>

			<p>63</p>

			<p>64</p>

			<p>65</p>

			<p>66</p>

			<p>67</p>

			<p>68</p>

			<p>69</p>

			<p>70</p>

			<p>71</p>

			<p>72</p>

			<p>73</p>

			<p>74</p>

			<p>75</p>

			<p>76</p>

			<p>77</p>

			<p>78</p>

			<p>79</p>

			<p>80</p>

			<p>81</p>

			<p>82</p>

			<p>83</p>

			<p>84</p>

			<p>85</p>

			<p>86</p>

			<p>87</p>

			<p>88</p>
			</td>
			<td>
			<p><code>&lt;?</code><code>xml</code>&nbsp;<code>version="1.0" encoding="UTF-8"?&gt;</code></p>

			<p><code>&lt;</code><code>project</code>&nbsp;<code>xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>modelVersion</code><code>&gt;4.0.0&lt;/</code><code>modelVersion</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.practice&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;springboot-dubbo-client&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;0.0.1-SNAPSHOT&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>packaging</code><code>&gt;jar&lt;/</code><code>packaging</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>name</code><code>&gt;springboot-dubbo-client&lt;/</code><code>name</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>description</code><code>&gt;Demo project for Spring Boot&lt;/</code><code>description</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- 子模块的parent要使用顶层的父模块--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>parent</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;version&gt;1.5.8.RELEASE&lt;/version&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;relativePath/&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.practice&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;CodeLearnAndPractice&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;0.0.1-SNAPSHOT&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>parent</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- properties可删掉，会继承父模块的--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;properties&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;project.reporting.outputEncoding&gt;UTF-8&lt;/project.reporting.outputEncoding&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;java.version&gt;1.8&lt;/java.version&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/properties&gt;--&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependencies</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework.boot&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring-boot-starter&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework.boot&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring-boot-starter-test&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>scope</code><code>&gt;test&lt;/</code><code>scope</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!-- 该模块需要启动web服务，需要该依赖--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework.boot&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring-boot-starter-web&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--新增后续dubbo项目中所需依赖，dubbo、zk</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>父模块pom中使用dependencyManagement来管理依赖版本号，子模块pom中不需要再写版本号</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>父模块pom中里有exclusion，子模块pom中不要写exclusion--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.alibaba&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;dubbo&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;version&gt;2.5.3&lt;/version&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;exclusions&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;exclusion&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;groupId&gt;org.springframework&lt;/groupId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;artifactId&gt;spring&lt;/artifactId&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/exclusion&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;/exclusions&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.101tec&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;zkclient&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--&lt;version&gt;0.10&lt;/version&gt;--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;!--client模块需要依赖server模块--&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;com.practice&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;springboot-dubbo-server&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>version</code><code>&gt;0.0.1-SNAPSHOT&lt;/</code><code>version</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependency</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>dependencies</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>build</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>plugins</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>plugin</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>groupId</code><code>&gt;org.springframework.boot&lt;/</code><code>groupId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>artifactId</code><code>&gt;spring-boot-maven-plugin&lt;/</code><code>artifactId</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>plugin</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>plugins</code><code>&gt;</code></p>

			<p><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;/</code><code>build</code><code>&gt;</code></p>

			<p>&nbsp;</p>

			<p><code>&lt;/</code><code>project</code><code>&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code></p>
			</td>
		</tr></tbody></table></div><p>&nbsp;</p>

<p>3、关于exclusions标签</p>

<p>当dependency A自身的依赖B，与其他dependency存在冲突的时候（最常见的就是版本冲突），我们就需要把B排除掉，这时就需要使用exclusions元素。</p>

<p>那么我们怎么知道一个dependency自身包含哪些依赖呢？<br>
1、通过mvn dependency:tree命令查看依赖树<br>
2、使用IDEA或其他IDA查看依赖树</p>

<p>点击IDEA右侧的Maven Projects，在每个模块的Dependencies中即可查看每个dependency内部的依赖及版本号，从来识别哪些依赖需要被排除掉。</p>

<p>以dubbo为例，我们先删除配置，点开Maven Projects，可以看到2.5.3版本的dubbo中使用的spring版本是2.5.6，这是一个很老的版本，有一些方法是没有的，现在在用的spring版本一般都是4.*的，所以我们需要把它排除掉，避免后续报错。</p>

<p>要查看当前项目中使用的spring版本，可以按住左键，然后点击父pom中的值，进入更上一层pom，再重复上步操作，可以看到spring的版本是4.3.12。</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143751209-819179520.png"></p>

<p>按住左键，然后点击父pom中的值，进入更上一层pom：</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143805256-1282026024.png"></p>

<p>可以看到spring的版本是4.3.12：</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223143814850-1233290682.png"></p>

<h2><a name="t6"></a>3 测试</h2>

<p>这里就先不写代码了，到下一章再写。直接编译一下，如果编译成功，说明pom文件的配置没有什么大问题。</p>

<p>点开右侧Maven Projects，双击父模块Lifecycle中的compile，进行代码编译，或者直接在Terminal中执行命令：mvn compile。</p>

<p>编译通过啦~~</p>

<p><img alt="avatar" class="has" src="https://images2017.cnblogs.com/blog/1052758/201712/1052758-20171223170302709-744806258.png"></p>

<p>到这里，Spring Boot多模块项目创建与配置就介绍完啦</p>          </div>
