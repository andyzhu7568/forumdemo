import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { messagesRouter } from './endpoints/messages';
const PORT = process.env.PORT ?? 3000;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/forumdemo';

const app = express();

app.use(cors());
app.use(express.json());

const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.use('/api/messages', messagesRouter);

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB 已连接');
  } catch (err) {
    console.error('MongoDB 连接失败:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`留言板服务运行在 http://localhost:${PORT}`);
  });
}

start();
