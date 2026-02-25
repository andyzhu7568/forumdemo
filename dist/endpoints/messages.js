"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = require("express");
const Message_1 = require("../models/Message");
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
exports.messagesRouter = (0, express_1.Router)();
exports.messagesRouter.get('/', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
        const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(String(req.query.limit), 10) || DEFAULT_PAGE_SIZE));
        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            Message_1.Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Message_1.Message.countDocuments(),
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
    }
    catch (error) {
        res.status(500).json({
            error: '获取留言列表失败',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.messagesRouter.post('/', async (req, res) => {
    try {
        const body = req.body;
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
        const message = await Message_1.Message.create({ author, content });
        res.status(201).json({ data: message.toObject() });
    }
    catch (error) {
        res.status(500).json({
            error: '发布留言失败',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
