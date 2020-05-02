# NPM 的使用


## 菜鸟教程地址

NPM:https://www.runoob.com/nodejs/nodejs-npm.html

### 菜鸟页面

<div class="article-intro" id="content">

			<h1>NPM 使用介绍</h1>
<p>NPM是随同NodeJS一起安装的包管理工具，能解决NodeJS代码部署上的很多问题，常见的使用场景有以下几种：</p>
<ul><li>允许用户从NPM服务器下载别人编写的第三方包到本地使用。
</li><li>
允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用。
</li><li>
允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。</li></ul>
<p>
由于新版的nodejs已经集成了npm，所以之前npm也一并安装好了。同样可以通过输入 <b>"npm -v" </b>来测试是否成功安装。命令如下，出现版本提示表示安装成功:
</p>

<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm </span><span class="pun">-</span><span class="pln">v
</span><span class="lit">2.3</span><span class="pun">.</span><span class="lit">0</span></pre>
<p>如果你安装的是旧版本的 npm，可以很容易得通过 npm 命令来升级，命令如下：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ sudo npm install npm </span><span class="pun">-</span><span class="pln">g
</span><span class="pun">/</span><span class="pln">usr</span><span class="pun">/</span><span class="kwd">local</span><span class="pun">/</span><span class="pln">bin</span><span class="pun">/</span><span class="pln">npm </span><span class="pun">-&gt;</span><span class="pln"> </span><span class="str">/usr/</span><span class="kwd">local</span><span class="pun">/</span><span class="pln">lib</span><span class="pun">/</span><span class="pln">node_modules</span><span class="pun">/</span><span class="pln">npm</span><span class="pun">/</span><span class="pln">bin</span><span class="pun">/</span><span class="pln">npm</span><span class="pun">-</span><span class="pln">cli</span><span class="pun">.</span><span class="pln">js
npm@2</span><span class="pun">.</span><span class="lit">14.2</span><span class="pln"> </span><span class="pun">/</span><span class="pln">usr</span><span class="pun">/</span><span class="kwd">local</span><span class="pun">/</span><span class="pln">lib</span><span class="pun">/</span><span class="pln">node_modules</span><span class="pun">/</span><span class="pln">npm</span></pre>
<p>如果是 Window 系统使用以下命令即可：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">npm install npm </span><span class="pun">-</span><span class="pln">g</span></pre>

<blockquote>
<p>使用淘宝镜像的命令：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">cnpm install npm </span><span class="pun">-</span><span class="pln">g</span></pre></blockquote>


<hr>
<h2>使用 npm 命令安装模块</h2>
<p>npm 安装 Node.js 模块语法格式如下：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm install </span><span class="pun">&lt;</span><span class="typ">Module</span><span class="pln"> </span><span class="typ">Name</span><span class="pun">&gt;</span></pre>
<p>以下实例，我们使用 npm 命令安装常用的 Node.js web框架模块 <b>express</b>:</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm install express</span></pre>
<p>
安装好之后，express 包就放在了工程目录下的 node_modules 目录中，因此在代码中只需要通过 <b>require('express')</b> 的方式就好，无需指定第三方包路径。
</p>
<pre class="prettyprint prettyprinted" style=""><span class="kwd">var</span><span class="pln"> express </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">require</span><span class="pun">(</span><span class="str">'express'</span><span class="pun">);</span></pre>
<hr>
<h2>全局安装与本地安装</h2>
<p>
npm 的包安装分为本地安装（local）、全局安装（global）两种，从敲的命令行来看，差别只是有没有-g而已，比如
</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">npm install express          </span><span class="com"># 本地安装</span><span class="pln">
npm install express </span><span class="pun">-</span><span class="pln">g   </span><span class="com"># 全局安装</span></pre>
<p>如果出现以下错误：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">npm err</span><span class="pun">!</span><span class="pln"> </span><span class="typ">Error</span><span class="pun">:</span><span class="pln"> connect ECONNREFUSED </span><span class="lit">127.0</span><span class="pun">.</span><span class="lit">0.1</span><span class="pun">:</span><span class="lit">8087</span><span class="pln"> </span></pre><p>解决办法为：</p><pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm config </span><span class="kwd">set</span><span class="pln"> proxy </span><span class="kwd">null</span></pre>
<h3>本地安装</h3>
<ul><li>
1. 将安装包放在 ./node_modules 下（运行 npm 命令时所在的目录），如果没有 node_modules 目录，会在当前执行 npm 命令的目录下生成 node_modules 目录。
</li><li>
2. 可以通过 require() 来引入本地安装的包。
</li></ul>
<h3>
全局安装</h3>
<ul><li>
1. 将安装包放在 /usr/local 下或者你 node 的安装目录。</li><li>
2. 可以直接在命令行里使用。</li>

</ul>
<p>如果你希望具备两者功能，则需要在两个地方安装它或使用 <strong>npm link</strong>。</p>
<p>接下来我们使用全局方式安装 express</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm install express </span><span class="pun">-</span><span class="pln">g</span></pre>
<p>安装过程输出如下内容，第一行输出了模块的版本号及安装位置。</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">express@4</span><span class="pun">.</span><span class="lit">13.3</span><span class="pln"> node_modules</span><span class="pun">/</span><span class="pln">express
</span><span class="pun">├──</span><span class="pln"> escape</span><span class="pun">-</span><span class="pln">html@1</span><span class="pun">.</span><span class="lit">0.2</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> range</span><span class="pun">-</span><span class="pln">parser@1</span><span class="pun">.</span><span class="lit">0.2</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> merge</span><span class="pun">-</span><span class="pln">descriptors@1</span><span class="pun">.</span><span class="lit">0.0</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> array</span><span class="pun">-</span><span class="pln">flatten@1</span><span class="pun">.</span><span class="lit">1.1</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> cookie@0</span><span class="pun">.</span><span class="lit">1.3</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> utils</span><span class="pun">-</span><span class="pln">merge@1</span><span class="pun">.</span><span class="lit">0.0</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> parseurl@1</span><span class="pun">.</span><span class="lit">3.0</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> cookie</span><span class="pun">-</span><span class="pln">signature@1</span><span class="pun">.</span><span class="lit">0.6</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> methods@1</span><span class="pun">.</span><span class="lit">1.1</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> fresh@0</span><span class="pun">.</span><span class="lit">3.0</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> vary@1</span><span class="pun">.</span><span class="lit">0.1</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> path</span><span class="pun">-</span><span class="pln">to</span><span class="pun">-</span><span class="pln">regexp@0</span><span class="pun">.</span><span class="lit">1.7</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> content</span><span class="pun">-</span><span class="pln">type@1</span><span class="pun">.</span><span class="lit">0.1</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> etag@1</span><span class="pun">.</span><span class="lit">7.0</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> serve</span><span class="pun">-</span><span class="kwd">static</span><span class="pun">@</span><span class="lit">1.10</span><span class="pun">.</span><span class="lit">0</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> content</span><span class="pun">-</span><span class="pln">disposition@0</span><span class="pun">.</span><span class="lit">5.0</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> depd@1</span><span class="pun">.</span><span class="lit">0.1</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> qs@4</span><span class="pun">.</span><span class="lit">0.0</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> finalhandler@0</span><span class="pun">.</span><span class="lit">4.0</span><span class="pln"> </span><span class="pun">(</span><span class="pln">unpipe@1</span><span class="pun">.</span><span class="lit">0.0</span><span class="pun">)</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> on</span><span class="pun">-</span><span class="pln">finished@2</span><span class="pun">.</span><span class="lit">3.0</span><span class="pln"> </span><span class="pun">(</span><span class="pln">ee</span><span class="pun">-</span><span class="pln">first@1</span><span class="pun">.</span><span class="lit">1.1</span><span class="pun">)</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> proxy</span><span class="pun">-</span><span class="pln">addr@1</span><span class="pun">.</span><span class="lit">0.8</span><span class="pln"> </span><span class="pun">(</span><span class="pln">forwarded@0</span><span class="pun">.</span><span class="lit">1.0</span><span class="pun">,</span><span class="pln"> ipaddr</span><span class="pun">.</span><span class="pln">js@1</span><span class="pun">.</span><span class="lit">0.1</span><span class="pun">)</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> debug@2</span><span class="pun">.</span><span class="lit">2.0</span><span class="pln"> </span><span class="pun">(</span><span class="pln">ms@0</span><span class="pun">.</span><span class="lit">7.1</span><span class="pun">)</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> type</span><span class="pun">-</span><span class="kwd">is</span><span class="pun">@</span><span class="lit">1.6</span><span class="pun">.</span><span class="lit">8</span><span class="pln"> </span><span class="pun">(</span><span class="pln">media</span><span class="pun">-</span><span class="pln">typer@0</span><span class="pun">.</span><span class="lit">3.0</span><span class="pun">,</span><span class="pln"> mime</span><span class="pun">-</span><span class="pln">types@2</span><span class="pun">.</span><span class="lit">1.6</span><span class="pun">)</span><span class="pln">
</span><span class="pun">├──</span><span class="pln"> accepts@1</span><span class="pun">.</span><span class="lit">2.12</span><span class="pln"> </span><span class="pun">(</span><span class="pln">negotiator@0</span><span class="pun">.</span><span class="lit">5.3</span><span class="pun">,</span><span class="pln"> mime</span><span class="pun">-</span><span class="pln">types@2</span><span class="pun">.</span><span class="lit">1.6</span><span class="pun">)</span><span class="pln">
</span><span class="pun">└──</span><span class="pln"> send@0</span><span class="pun">.</span><span class="lit">13.0</span><span class="pln"> </span><span class="pun">(</span><span class="pln">destroy@1</span><span class="pun">.</span><span class="lit">0.3</span><span class="pun">,</span><span class="pln"> statuses@1</span><span class="pun">.</span><span class="lit">2.1</span><span class="pun">,</span><span class="pln"> ms@0</span><span class="pun">.</span><span class="lit">7.1</span><span class="pun">,</span><span class="pln"> mime@1</span><span class="pun">.</span><span class="lit">3.4</span><span class="pun">,</span><span class="pln"> http</span><span class="pun">-</span><span class="pln">errors@1</span><span class="pun">.</span><span class="lit">3.1</span><span class="pun">)</span></pre>
<h3>查看安装信息</h3>
<p>你可以使用以下命令来查看所有全局安装的模块：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm list </span><span class="pun">-</span><span class="pln">g

</span><span class="pun">├─┬</span><span class="pln"> cnpm@4</span><span class="pun">.</span><span class="lit">3.2</span><span class="pln">
</span><span class="pun">│</span><span class="pln"> </span><span class="pun">├──</span><span class="pln"> </span><span class="kwd">auto</span><span class="pun">-</span><span class="pln">correct@1</span><span class="pun">.</span><span class="lit">0.0</span><span class="pln">
</span><span class="pun">│</span><span class="pln"> </span><span class="pun">├──</span><span class="pln"> bagpipe@0</span><span class="pun">.</span><span class="lit">3.5</span><span class="pln">
</span><span class="pun">│</span><span class="pln"> </span><span class="pun">├──</span><span class="pln"> colors@1</span><span class="pun">.</span><span class="lit">1.2</span><span class="pln">
</span><span class="pun">│</span><span class="pln"> </span><span class="pun">├─┬</span><span class="pln"> commander@2</span><span class="pun">.</span><span class="lit">9.0</span><span class="pln">
</span><span class="pun">│</span><span class="pln"> </span><span class="pun">│</span><span class="pln"> </span><span class="pun">└──</span><span class="pln"> graceful</span><span class="pun">-</span><span class="pln">readlink@1</span><span class="pun">.</span><span class="lit">0.1</span><span class="pln">
</span><span class="pun">│</span><span class="pln"> </span><span class="pun">├─┬</span><span class="pln"> cross</span><span class="pun">-</span><span class="pln">spawn@0</span><span class="pun">.</span><span class="lit">2.9</span><span class="pln">
</span><span class="pun">│</span><span class="pln"> </span><span class="pun">│</span><span class="pln"> </span><span class="pun">└──</span><span class="pln"> lru</span><span class="pun">-</span><span class="pln">cache@2</span><span class="pun">.</span><span class="lit">7.3</span><span class="pln">
</span><span class="pun">……</span></pre>
<p>如果要查看某个模块的版本号，可以使用命令如下：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm list grunt

projectName@projectVersion </span><span class="pun">/</span><span class="pln">path</span><span class="pun">/</span><span class="pln">to</span><span class="pun">/</span><span class="pln">project</span><span class="pun">/</span><span class="pln">folder
</span><span class="pun">└──</span><span class="pln"> grunt@0</span><span class="pun">.</span><span class="lit">4.1</span></pre>

<hr><h2>使用 package.json</h2>

<p>package.json 位于模块的目录下，用于定义包的属性。接下来让我们来看下 express 包的 package.json 文件，位于 node_modules/express/package.json 内容：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pun">{</span><span class="pln">
  </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"express"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"description"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Fast, unopinionated, minimalist web framework"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"version"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"4.13.3"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"author"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"TJ Holowaychuk"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"tj@vision-media.ca"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"contributors"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">[</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Aaron Heckmann"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"aaron.heckmann+github@gmail.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Ciaran Jessup"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"ciaranj@gmail.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Douglas Christopher Wilson"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"doug@somethingdoug.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Guillermo Rauch"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"rauchg@gmail.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Jonathan Ong"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"me@jongleberry.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Roman Shtylman"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"shtylman+expressjs@gmail.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Young Jae Sim"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"hanul@hanul.me"</span><span class="pln">
    </span><span class="pun">}</span><span class="pln">
  </span><span class="pun">],</span><span class="pln">
  </span><span class="str">"license"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"MIT"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"repository"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"type"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"git"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"url"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"git+https://github.com/strongloop/express.git"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"homepage"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"http://expressjs.com/"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"keywords"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">[</span><span class="pln">
    </span><span class="str">"express"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"framework"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"sinatra"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"web"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"rest"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"restful"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"router"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"app"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"api"</span><span class="pln">
  </span><span class="pun">],</span><span class="pln">
  </span><span class="str">"dependencies"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"accepts"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.2.12"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"array-flatten"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"1.1.1"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"content-disposition"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.5.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"content-type"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.0.1"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"cookie"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.1.3"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"cookie-signature"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"1.0.6"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"debug"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~2.2.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"depd"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.0.1"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"escape-html"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"1.0.2"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"etag"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.7.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"finalhandler"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.4.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"fresh"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.3.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"merge-descriptors"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"1.0.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"methods"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.1.1"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"on-finished"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~2.3.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"parseurl"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.3.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"path-to-regexp"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.1.7"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"proxy-addr"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.0.8"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"qs"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"4.0.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"range-parser"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.0.2"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"send"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.13.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"serve-static"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.10.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"type-is"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.6.6"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"utils-merge"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"1.0.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"vary"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.0.1"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"devDependencies"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"after"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.8.1"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"ejs"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"2.3.3"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"istanbul"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.3.17"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"marked"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"0.3.5"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"mocha"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"2.2.5"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"should"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"7.0.2"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"supertest"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"1.0.1"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"body-parser"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.13.3"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"connect-redis"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~2.4.1"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"cookie-parser"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.3.5"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"cookie-session"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.2.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"express-session"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.11.3"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"jade"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.11.0"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"method-override"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~2.3.5"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"morgan"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~1.6.1"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"multiparty"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~4.1.2"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"vhost"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"~3.0.1"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"engines"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"node"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"&gt;= 0.10.0"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"files"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">[</span><span class="pln">
    </span><span class="str">"LICENSE"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"History.md"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"Readme.md"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"index.js"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"lib/"</span><span class="pln">
  </span><span class="pun">],</span><span class="pln">
  </span><span class="str">"scripts"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"test"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"mocha --require test/support/env --reporter spec --bail --check-leaks test/ test/acceptance/"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"test-ci"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"istanbul cover node_modules/mocha/bin/_mocha --report lcovonly -- --require test/support/env --reporter spec --check-leaks test/ test/acceptance/"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"test-cov"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"istanbul cover node_modules/mocha/bin/_mocha -- --require test/support/env --reporter dot --check-leaks test/ test/acceptance/"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"test-tap"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"mocha --require test/support/env --reporter tap --check-leaks test/ test/acceptance/"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"gitHead"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"ef7ad681b245fba023843ce94f6bcb8e275bbb8e"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"bugs"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"url"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"https://github.com/strongloop/express/issues"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"_id"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"express@4.13.3"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"_shasum"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"ddb2f1fb4502bf33598d2b032b037960ca6c80a3"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"_from"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"express@*"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"_npmVersion"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"1.4.28"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"_npmUser"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"dougwilson"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"doug@somethingdoug.com"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"maintainers"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">[</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"tjholowaychuk"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"tj@vision-media.ca"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"jongleberry"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"jonathanrichardong@gmail.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"dougwilson"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"doug@somethingdoug.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"rfeng"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"enjoyjava@gmail.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"aredridel"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"aredridel@dinhe.net"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"strongloop"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"callback@strongloop.com"</span><span class="pln">
    </span><span class="pun">},</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">
      </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"defunctzombie"</span><span class="pun">,</span><span class="pln">
      </span><span class="str">"email"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"shtylman@gmail.com"</span><span class="pln">
    </span><span class="pun">}</span><span class="pln">
  </span><span class="pun">],</span><span class="pln">
  </span><span class="str">"dist"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="str">"shasum"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"ddb2f1fb4502bf33598d2b032b037960ca6c80a3"</span><span class="pun">,</span><span class="pln">
    </span><span class="str">"tarball"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"http://registry.npmjs.org/express/-/express-4.13.3.tgz"</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
  </span><span class="str">"directories"</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{},</span><span class="pln">
  </span><span class="str">"_resolved"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"https://registry.npmjs.org/express/-/express-4.13.3.tgz"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"readme"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"ERROR: No README data found!"</span><span class="pln">
</span><span class="pun">}</span></pre>
<h3>Package.json 属性说明</h3>
<ul>
<li><p><b>name</b> - 包名。</p></li>
<li><p><b>version</b> - 包的版本号。</p></li>
<li><p><b>description</b> - 包的描述。</p></li>
<li><p><b>homepage</b> - 包的官网 url 。</p></li>
<li><p><b>author</b> - 包的作者姓名。</p></li>
<li><p><b>contributors</b> - 包的其他贡献者姓名。</p></li>
<li><p><b>dependencies</b> - 依赖包列表。如果依赖包没有安装，npm 会自动将依赖包安装在 node_module 目录下。</p></li>
<li><p><b>repository</b> - 包代码存放的地方的类型，可以是 git 或 svn，git 可在 Github 上。</p></li>
<li><p><b>main</b> - main 字段指定了程序的主入口文件，require('moduleName') 就会加载这个文件。这个字段的默认值是模块根目录下面的 index.js。</p></li>
<li><p><b>keywords</b> - 关键字</p></li>
</ul>

<hr>
<h2>卸载模块</h2>
<p>
我们可以使用以下命令来卸载 Node.js 模块。</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm uninstall express</span></pre>
<p>
</p><p>卸载后，你可以到 /node_modules/ 目录下查看包是否还存在，或者使用以下命令查看：</p><pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm ls</span></pre>
<hr><h2>更新模块</h2>
<p>我们可以使用以下命令更新模块：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm update express</span></pre>
<hr>
<h2>搜索模块</h2>
<p>
使用以下来搜索模块：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm search express</span></pre>
<hr>
<h2>创建模块</h2>
<p>创建模块，package.json 文件是必不可少的。我们可以使用 NPM 生成 package.json 文件，生成的文件包含了基本的结果。</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm init
</span><span class="typ">This</span><span class="pln"> utility will walk you through creating a </span><span class="kwd">package</span><span class="pun">.</span><span class="pln">json file</span><span class="pun">.</span><span class="pln">
</span><span class="typ">It</span><span class="pln"> only covers the most common items</span><span class="pun">,</span><span class="pln"> </span><span class="kwd">and</span><span class="pln"> tries to guess sensible defaults</span><span class="pun">.</span><span class="pln">

</span><span class="typ">See</span><span class="pln"> </span><span class="str">`npm help json`</span><span class="pln"> </span><span class="kwd">for</span><span class="pln"> definitive documentation on these fields
</span><span class="kwd">and</span><span class="pln"> exactly what they </span><span class="kwd">do</span><span class="pun">.</span><span class="pln">

</span><span class="typ">Use</span><span class="pln"> </span><span class="str">`npm install &lt;pkg&gt; --save`</span><span class="pln"> afterwards to install a </span><span class="kwd">package</span><span class="pln"> </span><span class="kwd">and</span><span class="pln">
save it </span><span class="kwd">as</span><span class="pln"> a dependency </span><span class="kwd">in</span><span class="pln"> the </span><span class="kwd">package</span><span class="pun">.</span><span class="pln">json file</span><span class="pun">.</span><span class="pln">

</span><span class="typ">Press</span><span class="pln"> </span><span class="pun">^</span><span class="pln">C at any time to quit</span><span class="pun">.</span><span class="pln">
name</span><span class="pun">:</span><span class="pln"> </span><span class="pun">(</span><span class="pln">node_modules</span><span class="pun">)</span><span class="pln"> runoob                   </span><span class="com"># 模块名</span><span class="pln">
version</span><span class="pun">:</span><span class="pln"> </span><span class="pun">(</span><span class="lit">1.0</span><span class="pun">.</span><span class="lit">0</span><span class="pun">)</span><span class="pln">
description</span><span class="pun">:</span><span class="pln"> </span><span class="typ">Node</span><span class="pun">.</span><span class="pln">js </span><span class="pun">测试模块(</span><span class="pln">www</span><span class="pun">.</span><span class="pln">runoob</span><span class="pun">.</span><span class="pln">com</span><span class="pun">)</span><span class="pln">  </span><span class="com"># 描述</span><span class="pln">
entry point</span><span class="pun">:</span><span class="pln"> </span><span class="pun">(</span><span class="pln">index</span><span class="pun">.</span><span class="pln">js</span><span class="pun">)</span><span class="pln">
test command</span><span class="pun">:</span><span class="pln"> make test
git repository</span><span class="pun">:</span><span class="pln"> https</span><span class="pun">:</span><span class="com">//github.com/runoob/runoob.git  # Github 地址</span><span class="pln">
keywords</span><span class="pun">:</span><span class="pln">
author</span><span class="pun">:</span><span class="pln">
license</span><span class="pun">:</span><span class="pln"> </span><span class="pun">(</span><span class="pln">ISC</span><span class="pun">)</span><span class="pln">
</span><span class="typ">About</span><span class="pln"> to write to </span><span class="pun">……/</span><span class="pln">node_modules</span><span class="pun">/</span><span class="kwd">package</span><span class="pun">.</span><span class="pln">json</span><span class="pun">:</span><span class="pln">      </span><span class="com"># 生成地址</span><span class="pln">

</span><span class="pun">{</span><span class="pln">
  </span><span class="str">"name"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"runoob"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"version"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"1.0.0"</span><span class="pun">,</span><span class="pln">
  </span><span class="str">"description"</span><span class="pun">:</span><span class="pln"> </span><span class="str">"Node.js 测试模块(www.runoob.com)"</span><span class="pun">,</span><span class="pln">
  </span><span class="pun">……</span><span class="pln">
</span><span class="pun">}</span><span class="pln">


</span><span class="typ">Is</span><span class="pln"> </span><span class="kwd">this</span><span class="pln"> ok</span><span class="pun">?</span><span class="pln"> </span><span class="pun">(</span><span class="pln">yes</span><span class="pun">)</span><span class="pln"> yes</span></pre>

<p>以上的信息，你需要根据你自己的情况输入。在最后输入 "yes" 后会生成 package.json 文件。</p>
<p>
接下来我们可以使用以下命令在 npm 资源库中注册用户（使用邮箱注册）：</p>

<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm adduser
</span><span class="typ">Username</span><span class="pun">:</span><span class="pln"> mcmohd
</span><span class="typ">Password</span><span class="pun">:</span><span class="pln">
</span><span class="typ">Email</span><span class="pun">:</span><span class="pln"> </span><span class="pun">(</span><span class="kwd">this</span><span class="pln"> IS </span><span class="kwd">public</span><span class="pun">)</span><span class="pln"> mcmohd@gmail</span><span class="pun">.</span><span class="pln">com</span></pre>
<p>接下来我们就用以下命令来发布模块：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm publish</span></pre>
<p>如果你以上的步骤都操作正确，你就可以跟其他模块一样使用 npm 来安装。</p>

<hr>
<h2>
版本号
</h2>
<p>
使用NPM下载和发布代码时都会接触到版本号。NPM使用语义版本号来管理代码，这里简单介绍一下。
</p>
<p>
语义版本号分为X.Y.Z三位，分别代表主版本号、次版本号和补丁版本号。当代码变更时，版本号按以下原则更新。
</p>
<ul>
<li>
如果只是修复bug，需要更新Z位。</li><li>

如果是新增了功能，但是向下兼容，需要更新Y位。</li><li>

如果有大变动，向下不兼容，需要更新X位。</li></ul>
<p>
版本号有了这个保证后，在申明第三方包依赖时，除了可依赖于一个固定版本号外，还可依赖于某个范围的版本号。例如"argv": "0.0.x"表示依赖于0.0.x系列的最新版argv。</p>
<p>NPM支持的所有版本号范围指定方式可以查看<a href="https://npmjs.org/doc/files/package.json.html#dependencies">官方文档</a>。
</p>
<hr>
<h2>NPM 常用命令</h2>
<p>
除了本章介绍的部分外，NPM还提供了很多功能，package.json里也有很多其它有用的字段。</p>
<p>除了可以在<a href="https://npmjs.org/doc/">npmjs.org/doc/</a>查看官方文档外，这里再介绍一些NPM常用命令。
</p>
<p>
NPM提供了很多命令，例如install和publish，使用npm help可查看所有命令。
</p>
<ul>
<li><p>NPM提供了很多命令，例如<code>install</code>和<code>publish</code>，使用<code>npm help</code>可查看所有命令。</p>
</li>
<li><p>使用<code>npm help &lt;command&gt;</code>可查看某条命令的详细帮助，例如<code>npm help install</code>。</p>
</li>
<li><p>在<code>package.json</code>所在目录下使用<code>npm install . -g</code>可先在本地安装当前命令行程序，可用于发布前的本地测试。</p>
</li>
<li><p>使用<code>npm update &lt;package&gt;</code>可以把当前目录下<code>node_modules</code>子目录里边的对应模块更新至最新版本。</p>
</li>
<li><p>使用<code>npm update &lt;package&gt; -g</code>可以把全局安装的对应命令行程序更新至最新版。</p>
</li>
<li><p>使用<code>npm cache clear</code>可以清空NPM本地缓存，用于对付使用相同版本号发布新版本代码的人。</p>
</li>
<li><p>使用<code>npm unpublish &lt;package&gt;@&lt;version&gt;</code>可以撤销发布自己发布过的某个版本代码。</p>
</li>
</ul>
<hr>
<h2 id="taobaonpm">使用淘宝 NPM 镜像</h2>
<p>大家都知道国内直接使用 npm 的官方镜像是非常慢的，这里推荐使用淘宝 NPM 镜像。</p>
<p>淘宝 NPM 镜像是一个完整 npmjs.org 镜像，你可以用此代替官方版本(只读)，同步频率目前为 10分钟 一次以保证尽量与官方服务同步。</p>
<p>你可以使用淘宝定制的 cnpm (gzip 压缩支持) 命令行工具代替默认的 npm:</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ npm install </span><span class="pun">-</span><span class="pln">g cnpm </span><span class="pun">--</span><span class="pln">registry</span><span class="pun">=</span><span class="pln">https</span><span class="pun">:</span><span class="com">//registry.npm.taobao.org</span></pre>
<p>这样就可以使用 cnpm 命令来安装模块了：</p>
<pre class="prettyprint prettyprinted" style=""><span class="pln">$ cnpm install </span><span class="pun">[</span><span class="pln">name</span><span class="pun">]</span></pre>
<p>更多信息可以查阅：<a href="http://npm.taobao.org/" target="_blank">http://npm.taobao.org/</a>。</p>			<!-- 其他扩展 -->

			</div>

##
