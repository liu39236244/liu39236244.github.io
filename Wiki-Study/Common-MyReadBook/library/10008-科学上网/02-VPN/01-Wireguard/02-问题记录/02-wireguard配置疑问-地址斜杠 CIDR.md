# 疑问记录-斜杠表示


## 具体的细节问题学习

非常好问题！这些网络基础知识对于正确配置VPN至关重要。我来详细解释这些概念。

## **CIDR表示法：斜杠和数字的含义**

### **1. 基本概念**
- **`/24`、`/32` 是CIDR表示法**，用来指定IP地址的网络部分和主机部分
- **斜杠后面的数字**表示网络前缀的位数（二进制中1的个数）

### **2. 具体解释你的配置**

#### **客户端配置：`Address = 10.0.0.2/24`**
```ini
[Interface]
Address = 10.0.0.2/24
```
- **`/24`** 表示子网掩码是 `255.255.255.0`
- 前24位是网络部分，后8位是主机部分
- 可用IP范围：`10.0.0.1` - `10.0.0.254`
- 这意味着客户端属于 `10.0.0.0/24` 这个网络

#### **服务器配置：`AllowedIPs = 10.0.0.2/32`**
```ini
[Peer]
AllowedIPs = 10.0.0.2/32
```
- **`/32`** 表示子网掩码是 `255.255.255.255`
- 这是一个**精确的主机路由**，只匹配这一个具体的IP地址
- 意思是"只允许来自IP `10.0.0.2` 的流量通过这个对等连接"

### **3. 常见CIDR值对应表**
| CIDR | 子网掩码 | 可用IP数量 | 含义 |
|------|----------|------------|------|
| `/32` | 255.255.255.255 | 1 | 单个主机 |
| `/24` | 255.255.255.0 | 254 | C类子网 |
| `/16` | 255.255.0.0 | 65,534 | B类子网 |
| `/8` | 255.0.0.0 | 16,777,214 | A类子网 |

## **关于10.x.x.x网段的使用**

### **1. 10段IP地址规则**
- **10.x.x.x** 是私有IP地址段（RFC 1918）
- **每一位的取值范围**：`0-255`
  - 第一位固定为 `10`
  - 第二位：`0-255`
  - 第三位：`0-255` 
  - 第四位：`1-254`（0是网络地址，255是广播地址）

### **2. 你可以选择的方案**
完全可以改成 `10.50.0.x`，这样更不容易与现有网络冲突：

**服务器配置：**
```ini
[Interface]
Address = 10.50.0.1/24
ListenPort = 51820
PrivateKey = <服务器私钥>

[Peer]
PublicKey = <客户端公钥>
AllowedIPs = 10.50.0.2/32
```

**客户端配置：**
```ini
[Interface]
PrivateKey = <客户端私钥>
Address = 10.50.0.2/24

[Peer]
PublicKey = <服务器公钥>
Endpoint = your-server-ip:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

### **3. 为什么推荐使用10.50.0.x？**
- **避免冲突**：很多家庭/办公室网络使用 `192.168.1.x` 或 `10.0.0.x`
- **易于记忆**：`10.50.0.x` 比较独特，不容易混淆
- **扩展性好**：如果需要多个VPN网络，可以用 `10.51.0.x`、`10.52.0.x` 等

## **实际配置示例**

假设你选择 `10.50.0.x/24` 网段：

**服务器 (`/etc/wireguard/wg0.conf`)：**
```ini
[Interface]
Address = 10.50.0.1/24
ListenPort = 51820
PrivateKey = <服务器私钥>
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# 客户端1 - 办公室服务器
PublicKey = <办公室客户端公钥>
AllowedIPs = 10.50.0.2/32

[Peer]
# 客户端2 - 你的笔记本电脑（如果需要）
PublicKey = <笔记本公钥>
AllowedIPs = 10.50.0.3/32
```

**客户端 (`/etc/wireguard/wg0.conf`)：**
```ini
[Interface]
PrivateKey = <客户端私钥>
Address = 10.50.0.2/24

[Peer]
PublicKey = <服务器公钥>
Endpoint = 你的云服务器公网IP:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

## **重要提醒**

1. **修改后要重启服务**：
   ```bash
   sudo wg-quick down wg0
   sudo wg-quick up wg0
   ```

2. **确保所有配置中的IP段一致**，特别是服务器和客户端的 `[Peer]` 部分要对应

3. **检查路由**：使用 `ip route` 确认路由表正确更新

这样修改后，你的VPN网络就会使用 `10.50.0.x` 网段，更加清晰且不容易冲突！



