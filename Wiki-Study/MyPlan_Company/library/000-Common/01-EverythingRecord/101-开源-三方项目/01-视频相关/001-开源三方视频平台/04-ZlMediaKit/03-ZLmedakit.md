**ZLMediaKit** 是一个完全开源免费、性能优异的流媒体服务器，采用 **C++** 实现，并且支持多种流媒体协议，包括 **RTSP、RTMP、HTTP-FLV、HLS、WebRTC、GB/T28181** 等，适合用于摄像头管理、实时视频流推送、录像回放等场景。提供 RESTful API，方便与第三方系统对接，非常适合您的需求。

以下是关于 ZLMediaKit 的详细信息，包括技术栈、如何部署（含 Docker Compose 配置）、使用注意事项等内容。

---

### 一、ZLMediaKit 的技术栈

#### **语言与架构：**
1. **主语言：** C++（保证了高性能）。
2. **协议支持：**
   - **RTSP**
   - **RTMP**
   - **HTTP-FLV**
   - **HLS**
   - **WebRTC**
   - **GB28181**（国标协议支持）
3. **API 支持：**
   - 提供了一组 **RESTful API** 用于流管理、设备状态查询，可以被第三方系统调用。
   - 支持通过浏览器查看实时流和录像。

#### **兼容性：**
- 支持 Linux、Windows、macOS 等操作系统。
- 原生支持 Docker 部署，非常适合开发测试与生产使用。

---

### 二、功能支持（实现您提到的场景）

1. **支持摄像头接入：**
   - **通过 RTSP、RTMP：** 连接摄像头、推流到平台。
   - **通过 GB/T28181：** 支持国标协议摄像头的注册、推流、云台控制。
   
2. **实时画面查看：**
   - 支持通过浏览器直接访问视频流（HTTP-FLV、WebRTC）。
   - 提供 RESTful API，生成推流地址（RTMP/FLV）。

3. **录像回放：**
   - 支持流录制到本地磁盘并根据时间段查询与访问。
   - 提供录像文件的分段存储与外部访问（HLS 支持以点播形式回放）。

4. **云台控制：**
   - GB/T28181 摄像头可以直接实现 PTZ（云台控制：上下、左右、变倍等）。
   - 非国标摄像头需要借助摄像头厂商提供的 SDK。

5. **视频画面预警监测：**
   - ZLMediaKit 支持实时视频流转发，可以与 AI 框架集成（如 YOLOv5、OpenCV、PyTorch），对画面进行智能分析。
   - 分析结果通过 Webhook 或 API 触发报警。

---

### 三、部署 ZLMediaKit（Docker Compose）

以下是基于 `Docker Compose` 的 ZLMediaKit 部署方案，支持快速搭建、便于维护。

#### **步骤 1：安装 Docker 与 Docker Compose**  
首先确保您的服务器安装了 Docker 和 Docker Compose：
```bash
# 安装 Docker
sudo apt update
sudo apt install -y docker.io

# 安装 Docker Compose
sudo apt install -y docker-compose
```

#### **步骤 2：写入 Docker Compose 文件**

新建一个目录，例如 `zlmediakit`，然后创建 `docker-compose.yml` 文件：
```yaml
version: "3.7"
services:
  zlmediakit:
    image: panjjo/zlmediakit:latest
    container_name: zlmediakit
    ports:
      - "80:80"          # HTTP-FLV 浏览器访问（用于实时流）
      - "1935:1935"      # RTMP 推流访问
      - "554:554"        # RTSP 推流访问
      - "10000-10100:10000-10100/udp" # GB28181国标协议端口（建议与摄像头端口对应）
    volumes:
      - ./config:/zlmediakit/config       # 配置文件挂载
      - ./logs:/zlmediakit/logs           # 日志文件持久化
      - ./media:/zlmediakit/www          # 本地磁盘存储录像文件
    environment:
      - TZ=Asia/Shanghai                 # 设置时区
    restart: unless-stopped
```

#### 配置说明：
1. **镜像：** 使用官方镜像 `panjjo/zlmediakit:latest`。
2. **端口：** 
   - `80`：HTTP-FLV 推流直播。
   - `1935`：RTMP 推流。
   - `554`：RTSP 推流。
   - `10000-10100`：GB28181 国标设备注册与流推送端口（建议与设备设置保持一致）。
3. **挂载：**
   - `config`：挂载 ZLMediaKit 的配置文件，可自定义流重定向、日志存储路径等。
   - `logs`：持久化日志，便于监控错误或问题。
   - `media`：录像文件存储路径。

---

#### **步骤 3：启动 ZLMediaKit**

进入目录并启动服务：
```bash
docker-compose up -d
```

检查容器状态：
```bash
docker ps
```

服务启动成功后，可以通过以下端口访问功能：
- **实时画面：**
  - RTSP 流示例地址：`rtsp://<服务器地址>/live/stream`
  - HTTP-FLV 示例地址：`http://<服务器地址>/live/stream.flv`
- **录像文件：**
  - HLS 视频：`http://<服务器地址>/record/<stream>.m3u8`

---

#### **步骤 4：GB/T28181 配置示例**

ZLMediaKit 的 GB28181 配置示例：
修改 `config.ini` 文件（挂载到容器中），找到 `[GB28181]` 部分：
```ini
[GB28181]
enable=1
id=34020000002000000001      # 设备 ID
domain=3402000000            # 设备域
registerPort=5060            # 注册端口（默认）
streamPort=10000             # GB28181 视频流端口
secret=123456                # 注册密码（与摄像头配置保持一致）
```
重启容器：
```bash
docker-compose restart
```

添加支持 GB28181 的设备（如海康、大华）到 ZLMediaKit，设备视频流即可注册并推送到平台。

---

### 四、部署注意事项

#### **1. 防火墙配置**
确保服务器允许以下端口通行：
- TCP：`80, 554, 1935, 5060`
- UDP：`10000-10100`

例如，基于 `ufw` 配置：
```bash
sudo ufw allow 80/tcp
sudo ufw allow 554/tcp
sudo ufw allow 1935/tcp
sudo ufw allow 5060/tcp
sudo ufw allow 10000:10100/udp
```

#### **2. 数据存储配置**
- 确保录像文件的挂载磁盘有足够的存储空间。
- 建议设置定期清理旧录像文件的脚本，避免磁盘占满。

#### **3. RESTful API调用**
如果需要第三方 API 调用流，可以通过以下方式：
- API 文档参考：[ZLMediaKit RESTful API](https://blog.zlmediakit.com/restful_api_intro.html)
- 示例：
  ```bash
  curl -X GET "http://<服务器>:80/index/api/getMediaList"
  ```

---

### 五、总结

**选用 ZLMediaKit 的理由：**
1. **完全开源免费，具备高性能流处理能力。**
2. **支持 GB28181、RTSP、RTMP 等协议，满足设备注册、推流、云台控制等需求。**
3. **提供 RESTful API，可轻松和第三方系统集成。**
4. **通过 Docker Compose 可快速部署，方便维护。**

如果您对部署过程中的某些功能有具体需求（例如定制化报警逻辑或与 AI 模型的集成），可以告诉我，我会进一步引导！ 😊