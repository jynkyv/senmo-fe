# 在 Vercel 中设置 KV_URL 环境变量

## 方案 1：手动设置环境变量（使用外部 Redis）

如果你已经有 Redis 数据库（如 Redis Labs），可以直接在 Vercel 中设置环境变量：

### 步骤：

1. **登录 Vercel 控制台**
   - 访问 https://vercel.com/dashboard
   - 选择你的项目

2. **进入项目设置**
   - 点击项目名称进入项目页面
   - 点击顶部的 **Settings** 标签

3. **添加环境变量**
   - 在左侧菜单选择 **Environment Variables**
   - 点击 **Add New** 按钮

4. **设置 KV_URL**
   - **Key（键名）**: `KV_URL`
   - **Value（值）**: `redis://default:E1bkkdUDkZtkM4d99FdPDcOaWRdmNAYW@redis-13657.c290.ap-northeast-1-2.ec2.cloud.redislabs.com:13657`
   - **Environment（环境）**: 选择所有环境（Production、Preview、Development）或至少选择 Production

5. **保存并重新部署**
   - 点击 **Save** 保存环境变量
   - 在 **Deployments** 页面，找到最新的部署
   - 点击右侧的 **...** 菜单，选择 **Redeploy**

### 验证

部署完成后：
1. 访问你的网站
2. 登录管理员后台
3. 点击"🔍 检查 KV 状态"按钮
4. 应该显示 KV 配置正常

## 方案 2：使用 Vercel KV（推荐用于生产环境）

如果你想使用 Vercel 原生的 KV 服务：

### 步骤：

1. **创建 Vercel KV 数据库**
   - 在 Vercel 控制台进入项目设置
   - 选择 **Storage** 标签
   - 点击 **Create Database**
   - 选择 **KV** (Redis)
   - 选择免费计划（Hobby）或付费计划
   - 为数据库命名（例如：`senmo-config`）
   - 选择区域（建议选择与项目相同的区域）
   - 点击 **Create**

2. **连接 KV 数据库到项目**
   - 创建后，在 Storage 页面找到你的 KV 数据库
   - 点击 **Connect** 或 **.env.local** 按钮
   - 选择你的项目
   - 确认连接

3. **Vercel 会自动设置环境变量**
   - 连接后，Vercel 会自动添加 `KV_URL` 环境变量
   - 无需手动设置

4. **重新部署项目**
   - 在 **Deployments** 页面重新部署项目

### 初始化配置

如果使用 Vercel KV，首次部署后需要初始化配置：

1. 访问 `/api/config/init` 端点（需要先登录管理员账户）
2. 或者直接通过管理后台更新配置，系统会自动保存到 KV

## 两种方案对比

| 特性 | 方案 1（外部 Redis） | 方案 2（Vercel KV） |
|------|---------------------|---------------------|
| 设置难度 | 简单（只需设置环境变量） | 中等（需要创建并连接 KV） |
| 成本 | 取决于 Redis 提供商 | Vercel 免费额度 |
| 管理 | 需要单独管理 Redis | Vercel 统一管理 |
| 集成度 | 较低 | 高（自动设置环境变量） |
| 推荐场景 | 已有 Redis 数据库 | 新项目或想使用 Vercel 服务 |

## 故障排除

### 环境变量未生效

如果设置了环境变量但仍然报错：

1. **确认环境变量已保存**
   - 在 Environment Variables 页面确认 `KV_URL` 已存在
   - 确认选择了正确的环境（Production/Preview/Development）

2. **重新部署项目**
   - 环境变量更改后必须重新部署才能生效
   - 在 Deployments 页面点击 **Redeploy**

3. **检查环境变量值**
   - 确认 Redis URL 格式正确
   - 确认 URL 中包含正确的密码和主机地址

4. **查看部署日志**
   - 在 Vercel 控制台的部署日志中查看是否有错误
   - 检查函数日志以获取详细错误信息

### 连接失败

如果 KV_URL 已设置但连接失败：

1. **检查 Redis URL 格式**
   - 格式应为：`redis://[password]@[host]:[port]`
   - 或：`rediss://[password]@[host]:[port]`（SSL）

2. **验证 Redis 连接**
   - 确认 Redis 数据库正在运行
   - 确认网络可以访问 Redis 服务器
   - 确认密码和权限正确

3. **使用诊断工具**
   - 访问 `/api/config/status` 查看详细诊断信息
   - 查看 Vercel 函数日志获取错误详情

