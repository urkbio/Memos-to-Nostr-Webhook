#!/bin/bash

# 检查 PID 文件是否存在
if [ ! -f "webhook.pid" ]; then
    echo "找不到 webhook.pid 文件，服务可能没有运行"
    exit 1
fi

# 读取 PID 并停止进程
pid=$(cat webhook.pid)
if ps -p $pid > /dev/null; then
    echo "正在停止服务 (PID: $pid)..."
    kill $pid
    rm webhook.pid
    echo "服务已停止"
else
    echo "服务未在运行"
    rm webhook.pid
fi