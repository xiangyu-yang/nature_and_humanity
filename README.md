# 五行中医智能体

> 天人合一，五行养生 - 融合传统中医与命理智慧的健康管理平台

## 项目简介

五行中医智能体是一款基于中国传统五行学说和中医理论开发的健康管理应用。通过八字排盘、紫微星盘、体质辨识等传统命理方法，结合现代AI大模型技术，为用户提供个性化的养生建议和健康指导。

## 核心功能

### 🔮 命理分析
- **八字排盘** - 根据出生年月日时进行四柱八字分析
- **紫微星盘** - 紫微斗数命盘推演与解读
- **五行平衡** - 分析命局五行强弱与平衡
- **十神分析** - 命理十神关系解读

### 🏥 健康管理
- **体质测评** - 中医九种体质辨识测试
- **健康报告** - 综合健康风险评估与预测
- **养生建议** - 个性化养生方案推荐

### 🌿 养生指导
- **食疗推荐** - 根据体质推荐适宜食材
- **穴位保健** - 常用养生穴位介绍与按摩方法
- **今日运势** - 每日五行运势与宜忌
- **养生资讯** - 多主题实时养生资讯（体质知识、节气养生、穴位保健、食疗养生等），支持详情页阅读，每日定时更新

### 🤖 AI大模型对话
- **智能问答** - 基于大模型的中医命理智能问答
- **深度思考** - 可开关的深度思考模式，支持展示思考过程
- **个性化回答** - 结合用户八字、体质、节气、天气等数据
- **每日分析** - 根据当日干支、节气、天气提供针对性建议
- **多轮对话** - 支持会话历史与多轮对话
- **模型配置** - 支持配置自定义大模型服务（如Ollama）

### 📚 RAG知识库
- **文档上传** - 支持PDF、Word（.doc/.docx）、TXT、Markdown格式
- **智能解析** - 自动解析文档内容，处理文本、图片、表格
- **分片策略** - 支持固定长度、按句子、按段落三种分片方式
- **向量检索** - 基于Embedding的语义检索，支持余弦相似度计算
- **文档预览** - 集成kkFileView在线预览，支持PDF、Word等格式
- **自动服务** - 自动检测并启动kkFileView预览服务

### 👨‍👩‍👧‍👦 家庭健康
- **家庭成员管理** - 添加家庭成员健康档案
- **家族健康分析** - 家族健康趋势分析

## 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: Tailwind CSS 3
- **状态管理**: Zustand
- **路由**: React Router 6
- **图标**: Lucide React
- **图表**: ECharts

### 后端技术栈
- **框架**: Express 4 + TypeScript
- **数据库**: SQLite (JSON文件存储)
- **验证**: Zod
- **运行时**: tsx
- **AI集成**: Ollama本地大模型支持

### 计算引擎
- 八字排盘引擎
- 紫微斗数引擎
- 中医体质辨识引擎
- 节气历法计算
- 五行交叉分析引擎
- 每日干支与宜忌计算

## 快速开始

### 环境要求
- Node.js >= 18.x
- pnpm >= 8.x
- Ollama (可选，用于本地大模型)

### 安装依赖

```bash
# 安装后端依赖
cd api
pnpm install

# 安装前端依赖
cd ../web
pnpm install
```

### 启动开发服务器

```bash
# 启动后端服务 (端口: 4000)
cd api
pnpm dev

# 启动前端服务 (端口: 5173)
cd web
pnpm dev
```

### 配置大模型（可选）

如果使用本地Ollama大模型：

1. 安装并启动Ollama服务
2. 拉取模型：`ollama pull qwen3.6:35b-a3b-q8_0`
3. 在应用"我的"-"设置中心"配置：
   - API地址: http://localhost:11434/v1
   - 模型名称: qwen3.6:35b-a3b-q8_0
   - API密钥: ollama

### 访问应用

打开浏览器访问 http://localhost:5173

## 项目结构

```
nature_and_humanity/
├── api/                    # 后端API服务
│   ├── src/
│   │   ├── index.ts        # 应用入口
│   │   ├── routes/         # API路由
│   │   │   ├── llm.ts      # 大模型对话路由
│   │   │   ├── bazi.ts     # 八字排盘路由
│   │   │   ├── ziwei.ts    # 紫微星盘路由
│   │   │   ├── rag.ts      # RAG知识库路由（上传、检索、预览）
│   │   │   ├── news.ts     # 养生资讯路由（联网搜索、详情页、定时更新）
│   │   │   └── ...
│   │   ├── engines/        # 计算引擎
│   │   │   ├── bazi.ts     # 八字排盘引擎
│   │   │   ├── ziwei.ts    # 紫微斗数引擎
│   │   │   ├── solar.ts    # 节气历法引擎
│   │   │   └── ...
│   │   ├── ai/             # AI分析引擎
│   │   │   ├── rag.ts      # RAG核心引擎（文档解析、分片、向量化）
│   │   │   ├── kkfileview.ts # kkFileView服务管理
│   │   │   └── ...
│   │   ├── db/             # 数据库操作
│   │   ├── utils/          # 工具函数
│   │   │   └── dailyAnalysis.ts  # 每日分析工具
│   │   └── data/           # 知识库数据
│   ├── uploads/            # 上传文件存储
│   └── package.json
├── web/                    # 前端应用
│   ├── src/
│   │   ├── main.tsx        # 应用入口
│   │   ├── App.tsx         # 根组件
│   │   ├── pages/
│   │   │   ├── ChatPage.tsx     # 大模型对话页面
│   │   │   ├── KnowledgeBasePage.tsx # 知识库管理页面
│   │   │   ├── NewsDetailPage.tsx # 养生资讯详情页
│   │   │   └── ...
│   │   ├── components/     # 通用组件
│   │   ├── stores/         # 状态管理
│   │   └── api/            # API客户端
│   ├── public/img/         # 静态图片资源
│   └── package.json
├── .trae/                  # 项目文档
└── README.md
```

## API接口

### 用户相关
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/:id` - 更新用户信息

### 命理相关
- `POST /api/bazi` - 八字排盘计算
- `POST /api/ziwei` - 紫微星盘计算

### 健康相关
- `GET /api/constitution/questions` - 获取体质测评题目
- `POST /api/constitution/calc` - 体质辨识计算

### 养生相关
- `GET /api/food/recommend` - 食疗推荐
- `GET /api/acupoints` - 获取穴位列表
- `GET /api/fortune/today` - 获取今日运势
- `GET /api/news` - 获取养生资讯列表（支持多主题）
- `GET /api/news/:id` - 获取资讯详情
- `POST /api/news/refresh` - 手动刷新资讯

### 综合报告
- `POST /api/report` - 生成综合报告

### 大模型对话
- `POST /api/llm/chat` - 大模型对话（支持流式响应）
- `POST /api/llm/config` - 保存大模型配置
- `GET /api/llm/config/:userId` - 获取大模型配置
- `POST /api/llm/test` - 测试大模型连接
- `GET /api/llm/sessions/:userId` - 获取会话历史列表
- `POST /api/llm/sessions` - 创建新会话
- `DELETE /api/llm/sessions/:sessionId` - 删除会话

### RAG知识库
- `POST /api/rag/upload` - 上传文档（支持PDF/Word/TXT/MD）
- `GET /api/rag/documents/:userId` - 获取用户文档列表
- `GET /api/rag/documents/:userId/:documentId` - 获取文档详情
- `DELETE /api/rag/documents/:documentId` - 删除文档
- `POST /api/rag/search` - 搜索知识库内容
- `POST /api/rag/preview` - 获取文档预览链接
- `GET /api/rag/chunk-strategies` - 获取分片策略配置
- `GET /api/rag/preview/health` - 检查预览服务状态

## 设计理念

### 东方禅意设计
- 主色调: 深青色 (#1A4D5C)
- 点缀色: 琥珀黄 (#D4A84B)、朱砂红 (#C8553D)
- 背景色: 米白色 (#F5F1E8)

### 响应式设计
- 桌面优先设计
- 移动端适配支持

## 数据持久化

用户数据存储在 SQLite 数据库中（JSON文件模拟），包括：
- 用户信息
- 家庭成员信息
- 八字排盘记录
- 体质测评结果
- 大模型配置
- 会话历史
- 知识库文档（向量数据）

## 每日分析功能

系统会自动计算每日天时信息，为用户提供个性化分析：

- **节气时令** - 当前节气、季节、当令五行
- **干支历法** - 年柱、月柱、日柱及其五行属性
- **每日宜忌** - 根据日干/支生成宜做与忌做事项
- **实时天气** - 联网获取用户所在地天气信息
- **养生提示** - 结合节气的饮食、穴位、生活建议

## 开发说明

### 新增功能流程
1. 在 `api/src/routes/` 中添加新路由
2. 在 `api/src/engines/` 中添加计算逻辑
3. 在 `web/src/pages/` 中添加页面组件
4. 在 `web/src/api/` 中添加API调用

### 代码规范
- TypeScript 严格模式
- ESLint 代码检查
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**五行中医智能体** - 让传统智慧赋能现代健康 🌿