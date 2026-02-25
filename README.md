# 留言板 / 论坛（基础版）

基于 Node.js + Express + MongoDB 的简单留言板，支持发布和查看文本留言，带分页与基础数据库存储。

## 技术栈

- **后端**: Node.js、Express、TypeScript
- **数据库**: MongoDB（Mongoose）
- **前端**: HTML、CSS、JavaScript（源码为 TypeScript：`public/app.ts`）
- **API**: REST（GET/POST `/api/messages`）

## 环境要求

- Node.js 18+
- MongoDB 6+（本地或远程实例）

## 快速开始

1. **安装依赖**

   ```bash
   npm install
   ```

2. **配置环境变量（可选）**

   ```bash
   cp .env.example .env
   ```

   编辑 `.env` 可修改端口和 MongoDB 地址；不配置则使用默认 `PORT=3000`、`MONGODB_URI=mongodb://127.0.0.1:27017/forumdemo`。

3. **启动 MongoDB**

   确保本地已启动 MongoDB，或修改 `MONGODB_URI` 指向你的实例。

4. **开发模式运行**

   ```bash
   npm run dev
   ```

   浏览器访问：<http://localhost:3000>

5. **生产构建与运行**

   ```bash
   npm run build
   npm start
   ```

## 脚本说明

| 命令           | 说明                     |
|----------------|--------------------------|
| `npm run dev`  | 编译前端并启动开发服务   |
| `npm run build`| 编译后端与前端           |
| `npm start`    | 运行已编译的后端（需先 build） |
| `npm run build:client` | 仅编译前端 TypeScript 为 `public/app.js` |

## API 说明

- **GET `/api/messages`**  
  分页获取留言列表。  
  查询参数：`page`（页码，默认 1）、`limit`（每页条数，默认 20，最大 100）。  
  返回：`{ data: Message[], pagination: { page, limit, total, totalPages } }`。

- **POST `/api/messages`**  
  发布一条留言。  
  请求体：`{ author: string, content: string }`。  
  返回：`{ data: Message }`。

## 项目结构

```
forumdemo/
├── public/           # 前端静态资源
│   ├── index.html
│   ├── styles.css
│   ├── app.ts        # 前端 TS 源码
│   └── app.js        # 编译后的前端脚本（可由 build:client 生成）
├── src/
│   ├── index.ts      # Express 入口
│   ├── types/        # 类型定义
│   ├── models/       # Mongoose 模型
│   └── endpoints/    # REST 路由
├── .env.example
├── package.json
├── tsconfig.json
└── tsconfig.client.json
```

## 数据模型（Message）

- `author`: 昵称，必填，最长 100 字符
- `content`: 留言内容，必填，最长 2000 字符
- `createdAt`: 创建时间（由 Mongoose 自动维护）

索引：`createdAt` 降序，用于分页排序。
