"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const messages_1 = require("./endpoints/messages");
const PORT = process.env.PORT ?? 3000;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/forumdemo';
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const publicDir = path_1.default.join(__dirname, '..', 'public');
app.use(express_1.default.static(publicDir));
app.use('/api/messages', messages_1.messagesRouter);
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(publicDir, 'index.html'));
});
async function start() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('MongoDB 已连接');
    }
    catch (err) {
        console.error('MongoDB 连接失败:', err);
        process.exit(1);
    }
    app.listen(PORT, () => {
        console.log(`留言板服务运行在 http://localhost:${PORT}`);
    });
}
start();
