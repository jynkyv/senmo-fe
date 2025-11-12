import { NextRequest, NextResponse } from 'next/server';
import { getConfig, getConfigAsync, saveConfigAsync } from '@/lib/config';
import { cookies } from 'next/headers';

// 检查认证
async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');
    return auth?.value === 'authenticated';
  } catch {
    return false;
  }
}

// GET - 获取配置
export async function GET() {
  try {
    const config = await getConfigAsync();
    // 不返回admin密码
    const { admin, ...publicConfig } = config;
    return NextResponse.json(publicConfig);
  } catch (error) {
    console.error('获取配置失败:', error);
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    );
  }
}

// POST - 更新配置
export async function POST(request: NextRequest) {
  try {
    // 检查认证
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    // 确保不覆盖admin密码（如果body中没有admin字段）
    const currentConfig = await getConfigAsync();
    const updatedConfig = {
      ...body,
      admin: body.admin || currentConfig.admin
    };
    
    try {
      await saveConfigAsync(updatedConfig);
      return NextResponse.json({ success: true, message: '配置已更新' });
    } catch (error: any) {
      // 如果是 Vercel 环境的错误，返回更详细的提示
      const errorMessage = error?.message || '保存配置失败';
      const isVercel = process.env.VERCEL === '1';
      
      // 检查 KV 状态以提供更准确的错误信息
      let kvStatus = null;
      if (isVercel && errorMessage.includes('KV')) {
        try {
          const { checkKVStatus } = await import('@/lib/config');
          kvStatus = await checkKVStatus();
        } catch (e) {
          // 忽略检查错误
        }
      }
      
      let hint = '';
      if (isVercel && errorMessage.includes('KV')) {
        if (kvStatus && !kvStatus.hasUrl) {
          hint = 'KV_URL 环境变量未设置。\n\n请按以下步骤操作：\n1. 在 Vercel 控制台进入项目设置\n2. 选择 "Storage" → 找到你的 KV 数据库\n3. 点击 "Connect" 或 ".env.local" 按钮\n4. 选择你的项目并确认连接\n5. 重新部署项目\n\n如果还没有创建 KV 数据库：\n1. 选择 "Storage" → "Create Database"\n2. 选择 "KV" (Redis)\n3. 创建后连接到项目';
        } else if (kvStatus && kvStatus.hasUrl && !kvStatus.available) {
          hint = `KV 连接失败：${kvStatus.error}\n\n请检查：\n1. KV 数据库是否正常运行\n2. 网络连接是否正常\n3. 查看 Vercel 函数日志获取详细错误信息`;
        } else {
          hint = '请在 Vercel 项目中启用 KV 存储：\n1. 在 Vercel 控制台进入项目设置\n2. 选择 "Storage" → "Create Database"\n3. 选择 "KV" (Redis)\n4. 连接 KV 数据库到项目\n5. 重新部署项目\n\n提示：可以访问 /api/config/status 查看详细的 KV 配置状态';
        }
      } else if (isVercel) {
        hint = '如果 KV 未配置，可以通过 Vercel 环境变量 SITE_CONFIG 来设置配置（JSON 字符串格式）。';
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          isVercel,
          kvStatus: kvStatus || undefined,
          hint: hint || undefined,
          diagnosticUrl: isVercel ? '/api/config/status' : undefined
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('更新配置失败:', error);
    return NextResponse.json(
      { error: error?.message || '保存配置失败' },
      { status: 500 }
    );
  }
}

