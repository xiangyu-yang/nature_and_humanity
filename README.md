# 五行中医智能体

> 天人合一，五行养生 - 融合传统中医与命理智慧的健康管理平台

## 项目简介

五行中医智能体是一款基于中国传统五行学说和中医理论开发的健康管理应用。通过八字排盘、紫微星盘、体质辨识等传统命理方法，结合现代健康管理理念，为用户提供个性化的养生建议和健康指导。

## 核心功能

### 🔮 命理分析
- **八字排盘** - 根据出生年月日时进行四柱八字分析
- **紫微星盘** - 紫微斗数命盘推演与解读
- **五行平衡** - 分析命局五行强弱与平衡

### 🏥 健康管理
- **体质测评** - 中医九种体质辨识测试
- **健康报告** - 综合健康风险评估与预测
- **养生建议** - 个性化养生方案推荐

### 🌿 养生指导
- **食疗推荐** - 根据体质推荐适宜食材
- **穴位保健** - 常用养生穴位介绍与按摩方法
- **今日运势** - 每日五行运势与宜忌

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

### 计算引擎
- 八字排盘引擎
- 紫微斗数引擎
- 中医体质辨识引擎
- 节气历法计算
- 五行交叉分析引擎

## 快速开始

### 环境要求
- Node.js >= 18.x
- pnpm >= 8.x

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

### 访问应用

打开浏览器访问 http://localhost:5173

## 项目结构

```
nature_and_humanity/
├── api/                    # 后端API服务
│   ├── src/
│   │   ├── index.ts        # 应用入口
│   │   ├── routes/         # API路由
│   │   ├── engines/        # 计算引擎
│   │   ├── ai/             # AI分析引擎
│   │   ├── db/             # 数据库操作
│   │   └── data/           # 知识库数据
│   └── package.json
├── web/                    # 前端应用
│   ├── src/
│   │   ├── main.tsx        # 应用入口
│   │   ├── App.tsx         # 根组件
│   │   ├── pages/          # 页面组件
│   │   ├── components/     # 通用组件
│   │   ├── stores/         # 状态管理
│   │   └── api/            # API客户端
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

### 综合报告
- `POST /api/report` - 生成综合报告

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
- 收藏记录

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