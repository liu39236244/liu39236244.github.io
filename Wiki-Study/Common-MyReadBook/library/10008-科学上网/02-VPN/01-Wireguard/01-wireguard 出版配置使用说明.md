没问题！下面是一份从零开始的 WireGuard **保姆级教程**，包含了在 Linux 服务器和 Windows 客户端上的详细配置步骤、命令和注意事项。这份指南旨在让你一次成功，轻松连接你的云服务器和办公室内网。

### **搭建前的准备工作**

在开始之前，请确保你已满足以下两个基本条件，这能避免很多常见问题：

1. **拥有权限**：对你用于搭建服务的云服务器和办公室内网的机器拥有 **管理员权限（sudo/root）**。
2. **开放端口**：云服务器的防火墙（如 `ufw`/`iptables`）以及云服务商的安全组策略中，已放行 **UDP 51820** 端口的入站流量。这是 WireGuard 的默认通信端口。

### **第一步：安装 WireGuard**

首先，我们需要在作为服务器和客户端的机器上都安装 WireGuard 软件。

- **在 Linux 上安装（适用于云服务器和办公室Linux机器）**
  通过系统自带的包管理器安装非常简单：

  对于 **Ubuntu/Debian** 系统，请使用：

  ```bash
  sudo apt update
  sudo apt install wireguard resolvconf -y
  ```

  对于 **CentOS/RHEL** 系统，请使用：

  ```bash
  sudo yum install epel-release -y
  sudo yum install wireguard-tools -y
  ```
- **在 Windows 上安装（适用于办公室Windows机器）**

  1. 访问 WireGuard 官方网站：`https://www.wireguard.com/install/`。
     1. 地址：https://itlanyan.com/wireguard-clients/
  2. 下载 Windows 安装程序并运行。
  3. 安装完成后，打开 WireGuard 应用程序。你会看到一个简洁的图形界面。

### **第二步：配置服务器（通常是你的云服务器）**

现在，我们在云服务器上进行操作，它将作为 VPN 的中心枢纽。

1. **生成服务器密钥对**
   执行以下命令来生成服务器自己的私钥和公钥：

   ```bash
   cd /etc/wireguard
   sudo umask 077
   sudo wg genkey | tee server_private.key | wg pubkey > server_public.key
   ```

   **安全提示**：`umask 077` 确保了生成的密钥文件只有 root 用户可读，这是关键的安全步骤。
2. **创建服务器配置文件**
   使用 `sudo nano /etc/wireguard/wg0.conf` 命令创建并编辑配置文件，然后填入以下内容：

   ```ini
   [Interface]
   Address = 10.0.0.1/24
   PrivateKey = <第一步生成的服务器私钥>
   ListenPort = 51820
   PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
   PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
   ```

   **配置说明与注意事项**：

   - **`Address`**：定义了 VPN 网络的地址空间。这里服务器自己使用 `10.0.0.1`，后续客户端的 IP 会从这个网段分配。
   - **`PrivateKey`**：填入刚才 `server_private.key` 文件中的内容。
   - **`PostUp/PostDown`**：这些命令在 VPN 启动后和关闭前自动执行，作用是设置防火墙规则，**允许流量转发并开启 NAT**，这样客户端才能通过服务器访问互联网或其它网络。请确保 `eth0` 是你的服务器连接公网的真实网卡名称，如果不确定，请使用 `ip addr` 命令查看。
3. **启动服务器并设置开机自启**
   使用 `wg-quick` 脚本启动 VPN 接口：

   ```bash
   sudo wg-quick up wg0
   ```

   执行以下命令，让 WireGuard 在服务器重启后能自动启动：

   ```bash
   sudo systemctl enable wg-quick@wg0
   ```

### **第三步：配置客户端（连接至办公室内网或你的电脑）**

客户端可以是办公室内网的 Linux 服务器，也可以是你的 Windows 个人电脑。配置逻辑是相似的：生成密钥对，创建配置文件。

1. **生成客户端密钥对**
   在客户端机器上，同样需要生成自己的一对密钥。

   - **Linux 客户端**：重复 **第二步-1** 的步骤，在客户端的 `/etc/wireguard/` 目录下生成 `client_private.key` 和 `client_public.key`。
   - **Windows 客户端**：打开 WireGuard 软件，点击 **"添加空隧道"**，它会自动为你生成密钥对并填充在配置编辑框里。
2. **创建客户端配置文件**
   客户端的配置需要指明"我要连接谁（服务器）"。

   - **Linux 客户端**：创建文件 `/etc/wireguard/wg0.conf`。
   - **Windows 客户端**：在软件界面中编辑你新建的隧道。

   将以下配置模板填入：

   ```ini
   [Interface]
   PrivateKey = <客户端私钥>
   Address = 10.0.0.2/24

   [Peer]
   PublicKey = <服务器公钥>
   Endpoint = <你的云服务器公网IP>:51820
   AllowedIPs = 0.0.0.0/0
   #   Address = 10.0.0.0/24  不代表所有流量都走vpn
   PersistentKeepalive = 25
   ```

   **配置说明与注意事项**：

   - **`[Interface]` 部分**：
     - `PrivateKey`：填入客户端自己的私钥。
     - `Address`：为该客户端在 VPN 网络中分配一个唯一的 IP，例如 `10.0.0.2`。
   - **`[Peer]` 部分**：
     - `PublicKey`：填入 **服务器的公钥**（`server_public.key` 的内容）。
     - `Endpoint`：这里填你的云服务器的 **公网 IP 地址** 和 WireGuard 端口。
     - `AllowedIPs`：`0.0.0.0/0` 表示将所有流量都通过 VPN 服务器转发。如果你只想访问服务器所在的内网，可以设置为该内网的网段，例如 `192.168.1.0/24`。
     - `PersistentKeepalive`：对于位于 NAT 之后（如家庭或办公室网络）的客户端至关重要，它定期发送心跳包以维持连接，防止被路由器断开。

### **第四步：将客户端告知服务器**

现在我们需要在服务器的配置里"注册"这个客户端，告诉服务器："这个公钥对应的客户端是被允许连接的"。

1. 获取客户端的公钥。
2. 在 **云服务器** 上，执行以下命令将客户端添加为对等节点：

   ```bash
   sudo wg set wg0 peer <客户端公钥> allowed-ips 10.0.0.2
   ```

   **注意**：这里的 `10.0.0.2` 必须与客户端配置中 `Address` 的 IP 一致。

   为了使配置永久生效，建议也将这个 `[Peer]` 段加入服务器的配置文件 `/etc/wireguard/wg0.conf` 中：

   ```ini
   [Peer]
   PublicKey = <客户端公钥>
   AllowedIPs = 10.0.0.2/32
   ```
3. 重新加载服务器配置：

   ```bash
   sudo wg-quick down wg0
   sudo wg-quick up wg0
   ```

### **第五步：测试连接**

一切就绪，现在来测试吧！

- **在 Windows 上**：在 WireGuard 界面选中配置好的隧道，点击 **"启动"**。
- **在 Linux 上**：执行 `sudo wg-quick up wg0`。

**验证连接是否成功**：

1. 在客户端上 `ping` 服务器的 VPN IP：
   ```bash
   ping 10.0.0.1
   ```
2. 在服务器上查看 WireGuard 状态：
   ```bash
   sudo wg show
   ```

   如果输出中能看到客户端的公钥，并且 `latest handshake` 后有最近握手时间，则恭喜你，隧道已经成功建立！

### **故障排查与小贴士**

如果连接失败，别担心，按以下顺序检查：

- **✅ 检查防火墙**：确保云服务器的 `UDP 51820` 端口确实已开放。
- **✅ 核对密钥**：确保服务器的 `[Peer]` 里是客户端的公钥，客户端的 `[Peer]` 里是服务器的公钥。**公钥和私钥绝对不能混淆**。
- **✅ 检查端点信息**：确保客户端的 `Endpoint` IP 和端口号正确无误。
- **✅ 确认转发设置**：如果客户端能 `ping` 通 `10.0.0.1` 但无法上网，请检查服务器上的 `iptables` 规则和 IP 转发（`sysctl net.ipv4.ip_forward` 应为 1）是否配置正确。

这份教程应该能带领你顺利完成跨内网的 WireGuard 搭建。如果在任何一个步骤卡住了，或者想了解更高级的配置（如多个客户端），随时可以再来问我。
