## docker 安装 open-web-ui



docker run -d --name open-webui  -p 3000:8080 -e WEBUI_SECRET_KEY=your-secret-key -e ENABLE_RAG=true -e RAG_EMBEDDING_ENGINE=ollama -e PDF_EXTRACT_IMAGES=false  -v open-webui:/app/backend/data  --restart always  ghcr.io/open-webui/open-webui:main