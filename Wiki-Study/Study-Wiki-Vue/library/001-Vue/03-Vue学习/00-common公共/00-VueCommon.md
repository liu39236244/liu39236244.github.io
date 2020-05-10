

# vue Common 


## vue 介绍 


### 为什么要是用vue 为前端框架呢

#### 废话篇1

刚开始转到java web 开发的时候，我是没有进行过公司web 开发的，只是在学校学的一些iframe 、css、html 顶多来个jquery ajax easyui ；往后接触的就是jsp ，后台没学框架之前就是简单的servlet，各种配置，请求我记得还需要去手动每个请求都要编码处理，而且拦截器、过滤器都没有，这是学校课本上简单的，再往后就是设计框架比如 ssh (struts|struts2、spring、 hibrinate)[百度百科](https://baike.baidu.com/item/ssh%E6%A1%86%E6%9E%B6/8882453?fr=aladdin) ,  、 ssm（Spring+SpringMVC+MyBatis） [百度百科](https://baike.baidu.com/item/SSM/18801167?fr=aladdin )，再到后来接触web 项目都是前后端分离的那种，比如springboot、spring cloud 微服务+vue （前端三大框架之一），以前都是 常用的是JQuery、Bootstrap框架，现在三大主流框架分别是 React、Vue、Angular ；

* React、Vue、Angular 三者简单区别

> 博主总结记录


* 留白

```
01、React

React框架是起源于Facebook的项目，当时在公司内部盛行JavaScript框架，但是感觉不是很满意，就写了React框架。React可以轻易的解决跨浏览器兼容的问题，主要是通过对DOM的模拟减少与DOM的交互做到的。

React的模块化把组件进行了隔离，出现问题的时候更方便程序员对其进行修改，而且由于JavaScript，因此更有利于搜索引擎的优化。

02、Vue

Vue是相对比较轻量级的框架，是通过进行双向数据绑定来达到驱动页面的效果，大多程序员在学习新框架的时候都会先从Vue开始。

Vue比较简单，官方文档介绍的很清楚，可以非常快速的通过异步批处理的方式对DOM进行更新，也能把可复用的、解耦的组件组合在一起使用，更能允许多种模块的安装，场景使用也更加灵活。

03、Angular

Angular拥有很好的应用程序，是一个以JavaSpript编写的库，模板功能也异常强大，本身就带有丰富的Angular指令。一方面可以通过指令扩宽HTML，一方面可以通过表达式绑定数据到HTML。因为引入了Java的相关内容，因此更容易些出复用的代码，不仅方便了以后的工作，也可以提高团队项目开发的速度。
```


* 但是我所了解到的9 大前端框架

[原文知乎](https://zhuanlan.zhihu.com/p/76463271)

```
1.Vue

https://cn.vuejs.org

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。
2.React
https://react.docschina.org/

React 是一个用于构建用户界面的 JAVASCRIPT 库。React主要用于构建UI，很多人认为 React 是 MVC 中的 V（视图）。React 起源于 Facebook 的内部项目，用来架设 Instagram 的网站，并于 2013 年 5 月开源。React 拥有较高的性能，代码逻辑非常简单，越来越多的人已开始关注和使用它。
3.Angular
https://angular.io

AngularJS诞生于2009年，由Misko Hevery 等人创建，后为Google所收购。是一款优秀的前端JS框架，已经被用于Google的多款产品当中。AngularJS有着诸多特性，最为核心的是：MVVM、模块化、自动化双向数据绑定、语义化标签、依赖注入等等。
4.QucikUI
http://www.uileader.com/product_quickui

QucikUI 4.0是一套完整的企业级web前端开发解决方案，由基础框架、UI组件库、皮肤包、示例工程和文档等组成。底层基于jquery构建。使用QucikUI 开发者可以极大地减少工作量，提高开发效率，快速构建功能强大、美观、兼容的web应用系统。
5.Layui
https://www.layui.com/

layui（谐音：类UI) 是一款采用自身模块规范编写的前端 UI 框架，遵循原生 HTML/CSS/JS 的书写与组织形式，门槛极低，拿来即用。其外在极简，却又不失饱满的内在，体积轻盈，组件丰盈，从核心代码到 API 的每一处细节都经过精心雕琢，非常适合界面的快速开发。layui 首个版本发布于2016年金秋，她区别于那些基于 MVVM 底层的 UI 框架，却并非逆道而行，而是信奉返璞归真之道。准确地说，她更多是为服务端程序员量身定做，你无需涉足各种前端工具的复杂配置，只需面对浏览器本身，让一切你所需要的元素与交互，从这里信手拈来。
6.Avalon
http://avalonjs.coding.me/

avalon2是一款基于虚拟DOM与属性劫持的 迷你、 易用、 高性能 的 前端MVVM框架， 拥有超优秀的兼容性, 支持移动开发, 后端渲染, WEB Component式组件开发, 无需编译, 开箱即用。
7.Dojo
https://dojo.io/

Dojo致力于实现最大的互操作性。Web组件提供了一种机制，可以在Dojo应用程序中利用非Dojo组件，并在非Dojo应用程序中轻松使用基于Dojo的小部件。Dojo为Web组件提供一流的支持。您今天做出的决定不应该将您锁定在未来的决策中。
8.Ember
https://emberjs.com/

Ember.js可能是最固执己见的主流框架，这也是其最大的优势。它有创建Ember.js应用程序的正确方法，通常只有一种方法来创建应用程序。Ember.js更类似于一个产品或平台，在那里你会到一个供应商的长期支持和维护。Ember.js提供了对其平台的全面版本管理，升级工具以及对API升级的强大指导和工具。成熟，是对Ember.js的一个很好的总结。
9.Aurelia
https://aurelia.io/

Aurelia是一个令人惊叹的框架，它在不牺牲功能的情况下采用简单而干净的代码。在本教程中，我们将通过构建“Todo”应用程序向您介绍Aurelia的简单性。您将看到应用程序代码的简洁程度，您将学习Aurelia的几个基本概念和功能。
```



####  回归正题2

那么为什么公司用的是vue 呢，于是为了更清楚介绍一些vue 的优势所在

嗯 我还是比较懒的，下面是摘抄 博主的总结原文地址如下：

[hyt2018](https://blog.csdn.net/hyt2018/article/details/86371063)

---

vue 为何占据如此高的比率呢


Vue最初可能是其创始人Evan You的一个新项目的开发需要，经过多年的发展，它已经成为一个成熟的框架，拥有成熟的生态系统和开发工具包。在它的发展过程中，Vue吸引了大量的代码贡献者、赞助者和传播者。

```
1.为什么Vue.js会持续增长？

 

Vue是建立于 Angular和React的基础之上，它保留了Angular和React的优点并添加了自己的独特成分，这保证了Vue足够的美好来吸引JS开发人员的胃口。

下面来谈谈Vue的过人之处：

 

2.平缓的学习曲线

 

Vue平缓的学习曲线赢得了初学者和高级开发人员的欢心。我们在State of Vue.js报告中调查过的开发人员都说，学习曲线是Vue引起众多开发人员兴趣的主要原因。在浏览完官方指南中包含的材料后，您就可以着手开发您的第一个Vue应用，而无需事先了解ES2015、typescript、JSX或其它前端框架。

你只需要对Javascript、HTML和CSS有一个基本的理解就可以开始使用Vue来构建您的应用。当然如果您在使用框架方面有一些经验会更好，特别是您正在构建的是复杂的Web应用（稍后将详细介绍）。

Vue的高可访问性有助于快节奏的开发团队在不需要花费大量时间熟悉多余的语法扩展的情况下快速出成果。为一个项目组建一个团队或将Vue集成到一个项目中变得更容易、更快。尽管目前市场上的Vue开发人员还不多，但只要有使用React的经验，开发人员就可以轻松地切换到Vue，且只需一周左右的时间就可以出成果。

Vue还减少了理解复杂代码所需的时间（这在使用Angular时很常见）。这一点对编写简单的Web应用特别方便。

 

3.模块化、灵活的开发环境

 

Vue的Web应用是使用组件构建的。因为Vue已经根据项目需要为开发人员提供了许多灵活性和适应性，而且Vue的单文件组件是松散耦合的，这可以提高代码重用性，进而缩短了开发时间。

基于组件的架构是构建将来有扩展需求的应用的理想选择。Vue要求构建大型应用时一开始就使用模块化来构建系统。但是Vue在这里也给了开发人员一些灵活性，因为Vue、Webpack或Browserify推荐的bundler具有稍后用您选择的预处理器转换源代码的能力。

 

4.开发的乐趣

 

在Monterrail团队，我们的开发人员经常强调他们使用Vue构建应用程序的纯粹乐趣。自由地按照开发人员喜欢的方式构造代码，以及无倾向的编码方式，是Vue深受开发人员热捧的主要原因。

梳理代码库变得轻而易举，实际上您所需要的一切都在.vue文件中。从数据模型和模板到CSS、属性、计算值和方法，所有组件如何工作都可以从中找到，这让您省去额外的麻烦。

 

5.丰富的生态系统和开发工具的多样性

 

Vue以丰富的代码库和成套方便开发的工具，满足了开发人员的所有需求。这些有名的旨在提高编码体验的工具包括：用于状态管理的Vuex和用于路由管理的Vue-routing, 后者可以将单页应用程序的和对应的URL一一映射，让构建单页面应用变得易如反掌。

Vue还有自己的官方调试工具 devtools ，它作为浏览器扩展的形式出现。devtools简化了应用程序调试和组件的状态和层次结构的检查。它允许实时编辑应用程序、跟踪自定义事件和跨时间点调试应用程序，以查看以前的版本和所做的更改。

 

6.支持移动开发

 

Vue为开发人员提供了一些跨平台移动用户界面开发的解决方案。包括阿里巴巴（Alibaba）创建的Weex，和以拥有海量工具、组件和插件库著称的NativeScript。最近，Ionic也加入进来了。

与React Native的“Learn once, write anything”不同，Weex和Nativescript都宣称“Write once, run it anywhere”。这种设计使您能够在多个平台之间以透明和可重复的方式管理UI。这点很太棒。

 

7.特有的响应机制

 

各种HTML元素中的数据在现代的Web应用中动态地渲染。Vue的特有的响应机制可以自动刷新用户界面。这种方法节省了大量的时间和额外的代码行，以便开发人员可以集中精力来开发其他功能，从而提高效率。

 

8.高性能

 

Vue.js速度很快。尽管它不是最快的框架，但Vue.js目前所具有的特性足以为SPA和UI提供完美的用户体验。

对于移动应用，Vue相比Angular和React而言，它能更快地启动应用。鉴于53%的用户会放弃加载时间超过3秒的网站，而移动应用又是现在网站提升用户体验的第一选择，因此Vue的高性能就变成了选择JavaScript前端框架的一个重要考量。

 

9.支持HTML模板

 

这点有些争议，但引入基于HTML的模板提高了工作效率，特别是对于我们这些有HTML基础的人来说有很大的吸引力。Vue的模板也有助于将它的快速响应机制引入到已有的Web应用。模板由Vue编译以具有虚拟DOM渲染功能。这样做的好处是，在App状态改变时，Vue向DOM中引入的操作最少。

 

10.社区交流活跃

 

Vue社区的蓬勃发展积极地促进了框架的发展。全世界每年都有几次专门为Vue举办的大型会议。

下面是一些即将召开的值得关注的会议：

Vuejs Amsterdam 2019：https://www.vuejs.amsterdam/

Vue Fes Japan：https://vuefes.jp/

VueConf US：http://us.vuejs.org/

Vue社区不仅仅组织正式的会议，Vue非正式的交流在六大洲的很多国家一直在进行，通过一杯啤酒或咖啡，Vue开发人员就可以分享他们使用框架的知识和经验。

 

11.容易上手

 

Vue.js有非常好的官方文档，让开发人员可以很容易地找到所需的关于Vue的方方面面。官方指南有示例和详细描述。API文档还收录了开发人员在编码时可能遇到的大多数问题和解决方案。

教程

除了通过官方指南学习Vue，您还可以通过一些可获得的教程（包括视频和示例）来掌握Vue中的编程技巧。一些免费教程会以有趣的方式引导您全面掌握Vue（例如Scrimba –它是 Vue的推荐教程）。

以下列出其它可能让你迷上Vue的教程：

Intro to Vue.js by Vue Mastery：https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/

Vue on Laracasts：https://laracasts.com/series/learn-vue-2-step-by-step

Vue.js on Tutorialspoint：https://www.tutorialspoint.com/vuejs/

StackOverflow和官方聊天频道

对于教程中没有涵盖的各种代码疑难问题，您可以用Ask a question on StackOverflow得到你所要的答案。新的问题和回复会一直弹出，所以不管你的问题有多复杂，你都很有可能得到你要的答案。

当你遇到一个紧迫的编程问题时，你不会孤军作战，你可以在Vue官方聊天频道中向其他编码人员寻求帮助，很快你就会收到回复。

 

12.Vue持续发展

 

Vue自2014年发布，一开始许多开发人员都不愿采用它，因为每个人都担心它会被放弃而导致需要承担合并代码到另一个框架中的艰巨而昂贵的任务。当然这一切都没有发生。Evan You在2018年9月宣布将要发布Vue.JS 3.0版，尽管到目前为止还没有明确的发布日期，但是这次更新的重要性在于它是基于开发人员的贡献和并解决了大家反馈的问题。在没有知名品牌企业支持的情况下，Vue能快速发展到现在是一项了不起的壮举。

Vue的生态系统正在越来越大，越来越好，也越来越受到开发人员和企业的赞赏。

 

13.谁在使用Vue？

 

Vue.js可能还不是最流行的Javascript前端框架，但它已经被阿里巴巴、Grammarly、小米、Laracasts和Reuters等大牌公司所接受。要想更好地了解Vue的过人之处，你可以浏览大量的UI组件、网站、模板、插件、应用等等，或者通过使用Vue来构建您的应用。

至于后端框架对Vue的支持，PHP框架Laravel就建议使用vue.js进行前端开发，尽管这不是必须的。

 

14.我应该将Vue.js添加到我的技术堆栈中吗？

 

答案是Yes。然而，Vue并不是唯一值得关注和有前景的JS前端框架。你最好先测试一下并使用一些框架后，再看看哪些框架适合你的项目需求。

所以即使我们喜欢Vue，它也不是一个完美的框架。但我们必须承认，Vue已经尽可能地接近完美。而且如果我们根据它的学习曲线、维护的连续性和提高开发人员生产力的能力来评判的话，那么Vue就是那颗最耀眼的星星。
```


## vue 学习路径记录

### 中文api [文档地址](https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E6%95%B0%E6%8D%AE)


Intro to Vue.js by Vue Mastery：https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/

Vue on Laracasts：https://laracasts.com/series/learn-vue-2-step-by-step

Vue.js on Tutorialspoint：https://www.tutorialspoint.com/vuejs/


## vue 执行顺序



* 博主地址：https://www.cnblogs.com/stella1024/p/10563091.html


* 错误总结：

![](assets/001/03/00-1565859775452.png)

* 提示vee-报错 就执行 ；

![](assets/001/03/00-1565859800561.png)

