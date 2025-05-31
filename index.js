require('dotenv').config();
require('websocket-polyfill');
const express = require('express');
const { getPublicKey, getEventHash, getSignature } = require('nostr-tools');

const app = express();
app.use(express.json());

// 从环境变量获取配置
const NOSTR_PRIVATE_KEY = process.env.NOSTR_PRIVATE_KEY;
const NOSTR_RELAYS = (process.env.NOSTR_RELAYS || '').split(',');
const PORT = process.env.PORT || 3000;

// 验证配置
if (!NOSTR_PRIVATE_KEY) {
  console.error('请设置 NOSTR_PRIVATE_KEY 环境变量');
  process.exit(1);
}

if (!NOSTR_RELAYS.length) {
  console.error('请设置 NOSTR_RELAYS 环境变量');
  process.exit(1);
}

// 处理来自 Memos 的 webhook
app.post('/webhook', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: '无效的请求内容' });
    }

    // 创建 Nostr 事件
    const publicKey = getPublicKey(NOSTR_PRIVATE_KEY);
    const event = {
      kind: 1,
      pubkey: publicKey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: content
    };

    // 计算事件哈希并签名
    event.id = getEventHash(event);
    event.sig = getSignature(event, NOSTR_PRIVATE_KEY);

    // 发送到所有配置的 relay
    for (const relay of NOSTR_RELAYS) {
      try {
        const ws = new WebSocket(relay);
        
        ws.onopen = () => {
          ws.send(JSON.stringify(['EVENT', event]));
          setTimeout(() => ws.close(), 2000);
        };

        ws.onerror = (error) => {
          console.error(`Relay ${relay} 连接错误:`, error);
        };
      } catch (error) {
        console.error(`向 ${relay} 发送事件失败:`, error);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('处理 webhook 失败:', error);
    res.status(500).json({ error: '内部服务器错误' });
  }
});

app.listen(PORT, () => {
  console.log(`Webhook 服务运行在端口 ${PORT}`);
  console.log('配置的 Nostr relays:', NOSTR_RELAYS);
  console.log('Nostr 公钥:', getPublicKey(NOSTR_PRIVATE_KEY));
});