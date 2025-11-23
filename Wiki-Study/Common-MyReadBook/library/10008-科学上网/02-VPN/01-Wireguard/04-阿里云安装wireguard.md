# 1 服务端

找一台有外网的ip 的云服务器

## 1 直接安装，阿里云服务器上已经安装有epel

yum install wireguard-tools -y

## 2 查看版本

wg --version

## 3 服务器生成密钥 私钥

1 cd /etc/wireguard/

2 umask 077

3 wg genkey | tee server_private.key | wg pubkey > server_public.key

## 4 生成配置文件

vim /etc/wireguard/wg0.conf

```
[Interface]
Address = 10.0.0.1/24
PrivateKey = <第一步生成的服务器私钥>
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

## 5 保存启动服务

[root@iZ2ze24hli1di27jp14f9xZ wireguard]# vim /etc/wireguard/wg0.conf
[root@iZ2ze24hli1di27jp14f9xZ wireguard]# wg-quick up wg0
[#] ip link add wg0 type wireguard
[#] wg setconf wg0 /dev/fd/63
[#] ip -4 address add 10.10.66.1/24 dev wg0
[#] ip link set mtu 1420 up dev wg0
[#] iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# 2 客户端1

win 添加隧道

```
[Interface]
PrivateKey = <客户端私钥1>
Address = 10.10.66.2/24

[Peer]
PublicKey = <服务端公钥1>
AllowedIPs = 10.10.66.0/24
Endpoint = 远程服务端:51820
PersistentKeepalive = 25

```

# 3 配置客户端1 以后，需要将客户端1 添加到服务端

```
[Interface]
Address = 10.10.66.1/24
PrivateKey = <服务端1私钥>
ListenPort = 51820
# 仅仅与服务器相连
# PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
# PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# 可以做到客户端互通
PostUp = iptables -I FORWARD -i wg0 -j ACCEPT; iptables -I FORWARD -o wg0 -j ACCEPT; iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = <客户端公钥>
AllowedIPs = 10.10.66.2/32
```

# 4 重启服务端服务

sudo wg-quick down wg0
sudo wg-quick up wg0

# 5 注意阿里云端口一定要开 UDP的

# 6 排查命令整理

## 6.1 查看端口是否启用

sudo netstat -ulnp | grep 51820

## 6.2 查看服务端是否开启了网络转发

cat /proc/sys/net/ipv4/ip_forward

# 最终命令配置

## 主控服务器

创建公钥、密钥 。 可以设置 只有root 有权限读

umask 077


```conf
[Interface]
Address = 10.10.66.1/24
PrivateKey = 服务器私钥
ListenPort = 51820
# 仅仅与服务器相连- 仅仅客户端可以上网,客户端也能访问
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# 可以做到客户端互通- win关闭防火墙的情况-全部情况全能通；  客户端可以访问通；  客户端可以上网

# PostUp = iptables -I FORWARD -i wg0 -j ACCEPT; iptables -I FORWARD -o wg0 -j ACCEPT; iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE
# PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# 以下是关键 仅仅客户端可以通
# PostUp = iptables -I FORWARD -i wg0 -o wg0 -j ACCEPT
# PostDown = iptables -D FORWARD -i wg0 -o wg0 -j ACCEPT


[Peer]
# 家里主机
PublicKey = 客户端1公钥
AllowedIPs = 10.10.66.2/32


[Peer]
# 公司服务器
PublicKey = 客户端2公钥
AllowedIPs = 10.10.66.3/32
```


## 客户端1 「win- linux客户端ping win 注意开启 可ping 」

netsh advfirewall firewall add rule name="允许 Ping" dir=in action=allow protocol=icmpv4:8,any


```conf
[Interface]
PrivateKey = 客户端1私钥
Address = 10.10.66.2/24

[Peer]
PublicKey = 服务端公钥
AllowedIPs = 10.10.66.0/24
Endpoint = 服务端IP:51820
PersistentKeepalive = 25

```


## 客户端2  linux 

已经安装过wireguard ，所以自己创建一个属于自己的配置文件， 不影响之前的wg0 

### 创建自己的配置文件 wg-shenyabo.conf

root@szsyb-R5240H0:/etc/wireguard# cat wg-shenyabo.conf 

```conf

[Interface]
PrivateKey = 客户端1私钥
Address = 10.10.66.3/24

[Peer]
PublicKey = 服务端公钥
AllowedIPs = 10.10.66.0/24
Endpoint = 服务端ip:51820
PersistentKeepalive = 25
```


## 客户端3 桥梁平台所需

```

```