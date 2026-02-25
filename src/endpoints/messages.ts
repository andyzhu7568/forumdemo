import { Router, Request, Response } from 'express';
import { Message } from '../models/Message';
import type { CreateMessageBody } from '../types/message';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export const messagesRouter = Router();

messagesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(String(req.query.limit), 10) || DEFAULT_PAGE_SIZE)
    );
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Message.countDocuments(),
    ]);

    res.json({
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: '获取留言列表失败',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

messagesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateMessageBody;
    const author = typeof body.author === 'string' ? body.author.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!author) {
      res.status(400).json({ error: '请填写昵称' });
      return;
    }
    if (!content) {
      res.status(400).json({ error: '请填写留言内容' });
      return;
    }

    const message = await Message.create({ author, content });
    res.status(201).json({ data: message.toObject() });
  } catch (error) {
    res.status(500).json({
      error: '发布留言失败',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
