# v2ray 的介绍以及安装

## 我的记录：

### 自动安装 

* 原文地址
v2ray 安装教程[地址](https://yuan.ga/v2ray-complete-tutorial/) 

```sh
bash <(curl -L -s https://install.direct/go.sh)
# 上列命令会自动安装 V2Ray，然后执行下面命令运行
systemctl start v2ray
```
* 打印出端口号与uuid

![](assets/006/01/01-1564021507810.png)


安装完成后会新增下列文件：

```
/usr/bin/v2ray/v2ctl：V2Ray 工具，用于给程序自身调用
/usr/bin/v2ray/v2ray：V2Ray 核心程序
/etc/v2ray/config.json：配置文件
/usr/bin/v2ray/geoip.dat：IP 数据文件，V2Ray 路由功能时有用，下同
/usr/bin/v2ray/geosite.dat：域名数据文件

```

### 手动安装

```shell
#下载创建文件夹：

# 创建一个目录并进入
mkdir v2ray;cd v2ray
# 下载压缩包
wget https://github.com/v2ray/v2ray-core/releases/download/v4.16.0/v2ray-linux-64.zip
# 解压压缩包
unzip v2ray*.zip
# 复制安装包中的配置文件到 /etc/v2ray 目录中
cp vpoint_vmess_freedom.json /etc/v2ray/config.json
# 创建一个目录用来储存日志文件
mkdir /var/log/v2ray/
# 运行，默认在 /etc/v2ray/config.json 寻找配置文件
./v2ray

```

为了方便接下来的使用，我们还是按照文件的存放约定把配置文件放到 etc 路径下（这里忽略官方的示例配置文件，使用文章下方的配置,这里仅仅创建一个文件），可执行文件文件放到 /usr/bin 路径下：



```shell
sudo mkdir /etc/v2ray /usr/bin/v2ray /var/log/v2ray # 创建目录
sudo chmod +x v2ray v2ctl # 赋予可执行权限
sudo mv v2ray v2ctl geoip.dat geosite.dat -t /usr/bin/v2ray # 移动文件
touch /etc/v2ray/config.json # 仅创建配置文件的空文件
sudo mv systemd/v2ray.service /etc/systemd/system/
sudo systemctl enable v2ray # 用于程序开机启动并且崩溃时自动重启程序
```




OK，经过上列的操作，我们的 V2Ray 和用脚本自动安装的达到的效果已经基本一致了，注意此时的最后一条命令是让 V2Ray 永久运行并且开机启动，但是执行此命令时并未让它启动（还没有配置 config.json 当然不会启动）。

我们需要接着下面的步骤来修改我们的配置文件，每次配置改动都需要重启程序使其生效，执行命令：

sudo systemctl restart v2ray


### 配置v2ray


```shell
vim /etc/v2ray/config.json

```


* 服务端配置：


```json
{
  "inbounds": [
    {
      "port": 443, // Vmess 协议服务器监听端口
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "b831381d-6324-4d53-ad4f-8cda48b30811" // id(UUID) 需要修改
          }
        ]
      }
    },
    {
      "port": 444, // SS 协议服务端监听端口
      "protocol": "shadowsocks",
      "settings": {
        "method": "aes-128-gcm", // 加密方式
        "password": "yuan.ga" //密码
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

以上配置了两种协议，Vmess 在 443 端口，Shadowsocks 在 444 端口，也就是说你可以一个客户端使用 Vmess 协议，另一个客户端使用 Shadowsocks，当然你闲置一个不用也无所谓。

对于上述配置而言，最少只需要修改 Vmess 的 UUID 和 Shadowsocks 的密码就可以直接使用了。


* Vmess

换掉 ID 可以使用 [Online UUID Generator](https://www.uuidgenerator.net/) 这个网站生成，注意服务端的 ID 需要和客户端保持一致。
在线生成uuid

![](assets/006/01/01-1564022627879.png)

* 端口号也是可以修改的默认是10086


![](assets/006/01/01-1564022674444.png)



* Shadowsocks 的端口配置支持1000-1010这种形式的连续多端口配置。

```json

  "inbounds": [
    {
      "protocol": "shadowsocks",
      "port": 444, // 监听 444 端口
      "settings": {
        "method": "aes-256-cfb",  // 加密方式
        "password": "yearliny"    // 密码，必须和客户端相同
      }
    }
  ],
```


V2Ray的json配置文件支持 //、/* */形式的注释，所以不需要删除注解也可以运行，当你的文本编辑器支持 json 的语法检查时可能会对注释报错，不用理会，V2Ray会正确的处理它。

目前 V2Ray 支持的加密方式很多，以下仅推荐两种：

```
aes-256-gcm：PC端推荐，安全
chacha20-ietf：移动端推荐，更省电，更快速，良好的加密性

```

* 永久运行

如果一致跟着教程走，我们已经配置了 Systemd，成功配置完成后我们需要使用它来管理 V2Ray 的运行，需要掌握的命令就以下几条：

* 启用和禁用


注意启用和禁用并不会直接影响当下 V2Ray 的运行，启用状态时 V2Ray 崩溃会自动重新运行，开机会自动运行 V2Ray。

```sh
sudo systemctl enable v2ray
sudo systemctl disable v2ray
启动、停止、重启V2Ray
sudo systemctl start v2ray
sudo systemctl stop v2ray
sudo systemctl restart v2ray
查看状态
sudo systemctl status v2ray
```

## 客户端的使用

###  下载

我们在 Github 下载 V2Ray，打开链接 https://github.com/v2ray/v2ray-core/releases ，往下翻找到 v2ray-windows-64.zip，意思为这个是 Windows 64 位系统的客户端，如果你的系统是 64 位当然可以选择 v2ray-windows-64.zip。

.zip，意思为这个是 Windows 32 位系统的客户端，如果你的系统是 64 位当然可以选择 v2ray-windows-64.zip。

![](assets/006/01/01-1564022919193.png)


### 配置


下载完成后，我们找一个地方进行解压，这里我是在 C 盘创建一个文件夹 tools，然后把 V2Ray 解压到其中。进入我们解压好的文件夹修改 config.json 文件，删除原先的内容并完整的复制下方内容粘贴进去。

```json
{
  "log": {
    "loglevel": "info"
  },
  "inbounds": [
    {
      "port": 1080,
      "protocol": "socks",
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      },
      "settings": {
        "udp": true // 开启 UDP 协议支持
      }
    },
    {
      "port": 8080,
      "protocol": "http",
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      }
    }
  ],
  "outbounds": [
    {
      "tag": "proxy-vmess",
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "8.8.8.8", // 服务器的 IP
            "port": 443, // 服务器的端口
            "users": [
              {
                // id 就是 UUID，相当于用户密码
                "id": "7d4c4078-e129-416b-a483-cf5713a96a66",
                "alterId": 4
              }
            ]
          }
        ]
      }
    },
    {
      "tag": "direct",
      "settings": {},
      "protocol": "freedom"
    }
  ],
  "dns": {
    "server": [
      "8.8.8.8",
      "1.1.1.1"
    ],
    // 你的 IP 地址，用于 DNS 解析离你最快的 CDN
    "clientIp": "203.208.40.63"
  },
  // 配置路由功能，绕过局域网和中国大陆地址
  "routing": {
    "domainStrategy": "IPOnDemand",
    "rules": [
      {
        "type": "field",
        "domain": [
          // 默认跳过国内网站，如果想要代理某个国内网站可以添加到下列列表中
          "cnblogs.com"
        ],
        "outboundTag": "proxy-vmess"
      },
      {
        "type": "field",
        "domain": [
          "geosite:cn"
        ],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "outboundTag": "direct",
        "ip": [
          "geoip:cn",
          "geoip:private"
        ]
      }
    ]
  }
}
```

<font style="color:red">alterId 这个值不能超过服务器端所指定的值，否则无法正常使用。如果没有填写则默认值为 0。一般情况下使用自动脚本安装服务端 V2Ray 生成的配置文件中 alterId 值为 64，客户端的填写推荐值为 4。</font>



```
上述配置中仅需要把 IP、 port 和 id（UUID） 修改成之前安装时的内容，保存后直接运行 v2ray.exe。把你的系统代理设置成 socks5 127.0.0.1:1080 或者 http 127.0.0.1:8080 ，就可以正常使用了。

此时此刻 V2Ray 客户端已经正常运行，我们配置一下系统，让它使用我们的代理即可。一张图讲解 Win10 设置系统代理的方法：
```

![](assets/006/01/01-1564023208488.png)



> 打开设置——网络和 Internet——代理，进行如上设置即可。可以看的出来，这里我是使用的 http 127.0.0.1:8080，而不是 socks 协议，因为系统对 http 代理的支持更好。

>设置完成后，你对一切都非常满意，但是觉得 V2Ray 的那个黑糊糊的命令行窗口十分碍眼，OK，关闭这个窗口，双击 wv2ray.exe 运行即可。二者完全一样，只是 wv2ray.exe 没有窗口。

# v2ray 介绍：



# v2ray安装：


## 安装教程地址

### YEARLINY 的安装 [他的主页](https://yuan.ga/)

#### v2ray 安装教程[地址](https://yuan.ga/v2ray-complete-tutorial/) 目前使用


