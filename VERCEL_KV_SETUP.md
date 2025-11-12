# Vercel KV 配置说明

## 问题说明

在 Vercel 环境中，文件系统是只读的，无法直接写入配置文件。为了解决这个问题，我们使用 Vercel KV (Redis) 来存储配置。

## 设置步骤

### 1. 在 Vercel 中创建 KV 数据库

1. 登录 [Vercel 控制台](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击项目设置（Settings）
4. 在左侧菜单选择 **Storage**
5. 点击 **Create Database**
6. 选择 **KV** (Redis)
7. 选择免费计划（Hobby）或付费计划
8. 为数据库命名（例如：`senmo-config`）
9. 选择项目所在区域
10. 点击 **Create**

### 2. 连接 KV 数据库到项目

1. 创建 KV 数据库后，在 Storage 页面找到你的 KV 数据库
2. 点击 **Connect** 或 **.env.local** 按钮
3. 选择你的项目
4. Vercel 会自动添加 `KV_URL` 环境变量到项目中

### 3. 在本地开发环境中设置（可选）

如果你想在本地测试 KV 功能：

```bash
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 登录 Vercel
vercel login

# 链接到项目
vercel link

# 拉取环境变量
vercel env pull .env.development.local
```

这会在本地创建 `.env.development.local` 文件，包含 `KV_URL` 环境变量。

### 4. 初始化配置（可选）

如果你已经有配置文件 `config/site-config.json`，可以通过以下方式初始化 KV：

#### 方法 1：使用初始化 API（推荐）

部署项目后，访问以下 URL（需要先登录管理员账户）：
```
POST /api/config/init
```

或者创建一个临时脚本：

```typescript
// scripts/init-kv.ts
import { createClient } from 'redis';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'site-config.json');

async function initKV() {
  try {
    // 从环境变量获取 KV_URL
    const url = process.env.KV_URL || process.env.KV_REST_API_URL;
    if (!url) {
      throw new Error('KV_URL 环境变量未设置');
    }
    
    const redis = createClient({ url });
    await redis.connect();
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    await redis.set('site_config', JSON.stringify(config));
    
    await redis.quit();
    console.log('配置已成功导入到 KV！');
  } catch (error) {
    console.error('导入失败:', error);
  }
}

initKV();
```

#### 方法 2：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 拉取环境变量
vercel env pull .env.development.local
```

### 5. 重新部署项目

完成上述步骤后，重新部署项目：

1. 在 Vercel 控制台点击 **Deployments**
2. 点击最新的部署右侧的 **...** 菜单
3. 选择 **Redeploy**

或者推送代码到 Git 仓库，Vercel 会自动重新部署。

## 验证配置

部署完成后：

1. 访问你的网站
2. 登录管理员后台 (`/admin/login`)
3. 尝试更新配置
4. 如果成功，说明 KV 已正确配置

## 技术说明

项目使用 `redis` 包和 `createClient()` 来连接 Vercel KV：

- 环境变量：`KV_URL` 或 `KV_REST_API_URL`（由 Vercel 自动设置）
- 存储键名：`site_config`
- 数据格式：JSON 字符串

## 故障排除

### 错误：Vercel KV 未配置

如果看到此错误，说明 KV 数据库未正确连接：

1. 检查 Vercel 项目设置中的 Storage 部分
2. 确认 KV 数据库已创建并连接到项目
3. 检查环境变量是否包含 `KV_URL` 或 `KV_REST_API_URL`
4. 在 Vercel 控制台的 Environment Variables 中确认 `KV_URL` 已设置
5. 重新部署项目

### 配置读取失败

如果配置读取失败，系统会按以下顺序尝试：

1. 从 Vercel KV 读取（使用 `redis` 客户端）
2. 从环境变量 `SITE_CONFIG` 读取（JSON 字符串格式）
3. 从文件 `config/site-config.json` 读取（仅开发环境）
4. 使用默认配置

### Redis 连接问题

如果遇到连接错误：

1. 确认 `KV_URL` 环境变量格式正确（应该是 `redis://` 或 `rediss://` 开头的 URL）
2. 检查网络连接和防火墙设置
3. 确认 KV 数据库在正确的区域（region）
4. 查看 Vercel 函数日志以获取详细错误信息

### 备用方案：使用环境变量

如果不想使用 KV，可以通过环境变量 `SITE_CONFIG` 设置配置：

1. 在 Vercel 项目设置中进入 **Environment Variables**
2. 添加变量：
   - 名称：`SITE_CONFIG`
   - 值：将 `config/site-config.json` 的内容压缩为一行 JSON 字符串
3. 注意：使用环境变量时，无法通过管理后台动态更新配置

## 注意事项

- KV 数据库有免费额度限制，请查看 Vercel 定价页面
- 配置数据存储在 KV 中，不会因为重新部署而丢失
- 在开发环境中，配置仍然存储在本地文件中
- 生产环境（Vercel）使用 KV 存储，支持动态更新
- 项目使用 `redis` npm 包，通过 `createClient()` 连接
- 每次操作后会自动关闭 Redis 连接，避免连接泄漏
- 确保已安装 `redis` 包：`npm install redis`

