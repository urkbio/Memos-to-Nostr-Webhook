# Memos to Nostr Webhook

这是一个简单的 webhook 服务，用于将 Memos 的发帖自动转发到 Nostr 网络。

## 功能特点

- 接收来自 Memos 的 webhook 请求
- 将帖子内容转发到配置的 Nostr relay
- 支持配置多个 Nostr relay
- 使用环境变量进行配置

## 安装

1. 克隆仓库：
```bash
git clone [repository-url]
cd webhooks
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
cp .env.example .env
```

编辑 `.env` 文件，设置以下变量：
- `NOSTR_PRIVATE_KEY`：你的 Nostr 私钥（hex 格式）
- `NOSTR_RELAYS`：要使用的 Nostr relay 地址，多个地址用逗号分隔
- `PORT`：服务运行的端口号（可选，默认 3000）

## 运行

开发环境运行（支持热重载）：
```bash
npm run dev
```

生产环境运行：
```bash
npm start
```

## Memos 配置

1. 在 Memos 中添加 webhook：
   - 进入 Memos 设置
   - 找到 Webhook 设置部分
   - 添加新的 webhook，URL 设置为：`http://你的服务器地址:端口/webhook`

2. 测试：
   - 在 Memos 中发布新的帖子
   - 检查控制台输出确认转发状态
   - 在 Nostr 客户端中查看是否收到新帖子

## 注意事项

- 请妥善保管你的 Nostr 私钥
- 建议使用反向代理（如 Nginx）来保护你的 webhook 端点
- 可以根据需要添加或移除 relay