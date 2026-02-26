import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { messagesRouter } from './endpoints/messages';
// 服务监听端口：优先使用环境变量 PORT，否则默认 3000
const PORT = process.env.PORT ?? 3000;
// MongoDB 连接地址：优先使用环境变量，否则连接本机 27017 端口的 forumdemo 库
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/forumdemo';

// 创建 Express 应用实例
const app = express();

// 启用 CORS，允许前端从其他域名访问本 API
app.use(cors());
// 解析请求体为 JSON，便于在路由中读取 req.body
app.use(express.json());

// 静态资源目录：指向编译后的 dist 上一级的 public 文件夹
const publicDir = path.join(__dirname, '..', 'public');
// 将 public 下的文件（HTML/CSS/JS）以静态资源形式提供，如 /styles.css、/app.js
app.use(express.static(publicDir));

// 将所有以 /api/messages 开头的请求交给 messagesRouter 处理
app.use('/api/messages', messagesRouter);

// 访问根路径 / 时，直接返回前端页面 index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// 启动流程：先连数据库，再监听端口
async function start() {
  try {
    // 连接 MongoDB，连接失败会抛出异常
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB 已连接');
  } catch (err) {
    // 连接失败时打印错误并退出进程，避免无数据库状态下对外服务
    console.error('MongoDB 连接失败:', err);
    process.exit(1);
  }

  // 在指定端口启动 HTTP 服务，收到请求后由上面的路由与静态中间件处理
  app.listen(PORT, () => {
    console.log(`留言板服务运行在 http://localhost:${PORT}`);
  });
}

// 执行启动逻辑
start();
