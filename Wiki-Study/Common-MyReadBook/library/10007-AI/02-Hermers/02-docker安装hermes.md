
## compose配置文件:


services:
  # Hermes 核心网关服务
  hermes-agent:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-agent
    restart: unless-stopped
    volumes:
      # 将宿主机的 hermes_data 目录映射到容器，确保持久化保存配置和记忆
      - ./hermes_data:/opt/data
    environment:
      - HERMES_UID=1000
      - HERMES_GID=1000
    command: ["gateway", "run"]
    networks:
      - hermes-net

  # Hermes Web UI 管理面板
  hermes-webui:
    image: ekkoye8888/hermes-web-ui:latest
    container_name: hermes-webui
    restart: unless-stopped
    depends_on:
      - hermes-agent
    ports:
      - "6060:6060"  # 浏览器访问 Web 面板的端口
      - "8651:8651"
      - "56121:56121"
    volumes:
      - ./hermes_data:/home/agent/.hermes
      - ./hermes_data/hermes-web-ui:/home/agent/.hermes-web-ui
    environment:
      PORT: "6060"
      HERMES_HOME: /home/agent/.hermes
      HERMES_BIN: /opt/hermes/.venv/bin/hermes
      HERMES_WEB_UI_MANAGED_GATEWAY: "0"
      HERMES_WEB_UI_XAI_CALLBACK_BIND_HOST: 0.0.0.0
      HERMES_ALLOW_ROOT_GATEWAY: "1"
    networks:
      - hermes-net

networks:
  hermes-net:
    driver: bridge



1. Hermes 的背景与厂家
Hermes Agent 是由 Nous Research 开发的一个开源 AI 智能体框架。Nous Research 是一家专注于前沿人工智能研究的科技公司，Hermes 目前是全球开发者社区中星标极高、非常火爆的开源项目。
2. 桌面工具与 CLI 的关系
不需要在安装桌面工具之前手动去装 CLI。
Hermes Desktop（桌面版）是官方推出的图形化伴侣应用。当你首次启动桌面版并选择“本地模式”时，它会自动检测你的系统环境。如果未安装，它会自动在后台运行官方脚本，帮你一键解析并安装好 CLI、Python 环境等所有依赖。因此，你只需要下载桌面版安装包即可，全程无需手动敲命令。
3. Docker Compose 一键部署配置
为了让你在本机一键部署 Hermes 的核心服务（Agent 网关）以及可视化的 Web 管理面板，这里为你准备了一份标准的 docker-compose.yml 配置。
请在你的电脑上创建一个文件夹（例如 hermes-deploy），并在其中新建一个名为 docker-compose.yml 的文件，将以下代码复制进去：
yaml

编辑




启动方式：
在包含该文件的文件夹中打开终端，运行以下命令即可一键启动：
docker compose up -d
启动成功后，你可以在浏览器中访问 http://localhost:6060 来使用 Web 面板进行 Agent 的开发和代码任务管理。
4. 桌面版安装指引
如果你更倾向于使用原生的桌面客户端进行开发，可以直接访问 Hermes 的官方桌面版下载页面（hermes-agent.nousresearch.com/desktop）。