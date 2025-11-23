您提出了一个很好的问题！这里需要澄清一个重要的概念：

## **端口 51820 的作用**

**51820 端口是 WireGuard 的服务端监听端口**，它的作用是：
- WireGuard **客户端**通过这个端口连接到 **WireGuard 服务器**
- 这个端口**只在服务器端**需要开放
- 客户端之间的通信**不使用** 51820 端口

## **客户端间通信的真实情况**

当 Linux 客户端 Ping Windows 客户端时：
1. 数据包通过 WireGuard 隧道发送到服务器
2. 服务器将数据包转发给 Windows 客户端
3. Windows 客户端收到数据包后，需要**回应**
4. 这个"回应"被 Windows 防火墙阻挡了

## **正确的解决方案**

### **方案1：允许 ICMP 协议（推荐）**
这是最正确的方法，因为 Ping 使用的是 ICMP 协议，不是 TCP/UDP 端口：
```cmd
# 在 Windows 上以管理员身份运行
netsh advfirewall firewall add rule name="允许 VPN 网络 Ping" dir=in action=allow protocol=icmpv4:8,any remoteip=10.10.66.0/24
```

### **方案2：为 WireGuard 隧道接口创建特殊规则**
```cmd
# 允许来自 VPN 网络的所有入站流量
netsh advfirewall firewall add rule name="允许 VPN 网络访问" dir=in action=allow remoteip=10.10.66.0/24
```

### **方案3：临时测试 - 完全关闭防火墙**
```cmd
# 临时关闭防火墙测试（不推荐长期使用）
netsh advfirewall set allprofiles state off
```

## **验证步骤**

1. 在 Windows 上执行上述任一命令
2. 从 Linux 客户端 Ping Windows 客户端：
   ```bash
   ping 10.10.66.2
   ```
3. 如果通了，说明确实是 Windows 防火墙问题

## **为什么不是 51820 端口**

- **51820** = WireGuard **服务端**监听端口（在您的云服务器上）
- **客户端间通信** = 使用 WireGuard 隧道接口，不涉及 51820 端口
- **Ping 命令** = 使用 ICMP 协议，不是基于端口的 TCP/UDP

## **总结**

**请使用方案1**，它：
- ✅ 只允许 VPN 网络内的 Ping 请求
- ✅ 不会影响其他安全设置
- ✅ 针对性强，安全性好

开放 51820 端口在 Windows 客户端上是**不需要的**，因为这个端口只在您的云服务器（主控服务器）上使用。

请先尝试方案1，然后测试 Ping 是否正常！