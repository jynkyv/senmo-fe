# 本地 KV 测试说明

## 测试结果

✅ **Redis 连接测试已通过！**

测试脚本已成功验证：
- ✅ Redis 连接正常
- ✅ 配置写入成功
- ✅ 配置读取成功
- ✅ 配置更新成功
- ✅ 配置验证通过

## 在本地开发环境中使用 KV

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件（此文件已被 gitignore，不会提交到仓库）：

```bash
# .env.local
KV_URL=redis://default:E1bkkdUDkZtkM4d99FdPDcOaWRdmNAYW@redis-13657.c290.ap-northeast-1-2.ec2.cloud.redislabs.com:13657
```

### 2. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

### 3. 测试配置更新

1. 访问 `http://localhost:3001/admin/login`
2. 登录管理员账户
3. 修改配置并点击"保存配置"
4. 配置会保存到 Redis KV 中

### 4. 检查 KV 状态

在管理后台点击"🔍 检查 KV 状态"按钮，可以查看：
- KV 连接状态
- 环境变量配置
- 详细的诊断信息

## 运行测试脚本

可以使用测试脚本验证 Redis 连接：

```bash
npm run test:kv
```

测试脚本会：
1. 连接 Redis
2. 读取本地配置文件
3. 写入配置到 Redis
4. 从 Redis 读取配置并验证
5. 测试配置更新功能
6. 恢复原始配置

## 注意事项

- `.env.local` 文件不会被提交到 Git（已在 .gitignore 中）
- 本地开发时，如果设置了 `KV_URL`，系统会自动使用 KV 存储
- 如果没有设置 `KV_URL`，系统会使用本地文件存储（`config/site-config.json`）
- 在 Vercel 生产环境中，KV_URL 会自动由 Vercel 设置

## 配置优先级

系统按以下优先级读取配置：

1. **Redis KV**（如果设置了 `KV_URL` 或 `KV_REST_API_URL`）
2. **环境变量 `SITE_CONFIG`**（JSON 字符串格式）
3. **本地文件 `config/site-config.json`**（仅开发环境）
4. **默认配置**

## 在 Vercel 中使用

在 Vercel 生产环境中：

1. 在 Vercel 控制台创建 KV 数据库
2. 将 KV 数据库连接到项目
3. Vercel 会自动设置 `KV_URL` 环境变量
4. 重新部署项目

配置会自动从 KV 读取和写入。

