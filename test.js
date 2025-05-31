const http = require('http');

// 测试数据
const testData = {
  activityType: 'memos.memo.created',
  creatorId: 1,
  createTime: new Date().toISOString(),
  memo: {
    id: 1,
    content: '这是一条测试消息 ' + new Date().toLocaleString()
  }
};

// 发送请求
const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  
  res.on('data', (d) => {
    console.log('响应数据:', d.toString());
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

// 发送数据
req.write(JSON.stringify(testData));
req.end();