#!/bin/bash

# 检查是否已经在运行
if [ -f "webhook.pid" ]; then
    pid=$(cat webhook.pid)
    if ps -p $pid > /dev/null; then
        echo "服务已经在运行中，PID: $pid"
        exit 1
    else
        rm webhook.pid
    fi
fi

# 启动服务并将进程 ID 保存到文件
node index.js > webhook.log 2>&1 & 
echo $! > webhook.pid

echo "服务已在后台启动，PID: $(cat webhook.pid)"
echo "日志文件: webhook.log"