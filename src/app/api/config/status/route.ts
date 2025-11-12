import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkKVStatus } from '@/lib/config';

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

// GET - 检查 KV 配置状态
export async function GET() {
  try {
    // 检查认证
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const status = await checkKVStatus();
    
    return NextResponse.json({
      ...status,
      envVars: {
        VERCEL: process.env.VERCEL,
        KV_URL: process.env.KV_URL ? '已设置' : '未设置',
        KV_REST_API_URL: process.env.KV_REST_API_URL ? '已设置' : '未设置',
      },
      instructions: !status.available ? {
        step1: '在 Vercel 控制台进入项目设置',
        step2: '选择 "Storage" → "Create Database"',
        step3: '选择 "KV" (Redis)',
        step4: '点击 "Connect" 将 KV 数据库连接到项目',
        step5: '重新部署项目',
        note: '连接 KV 后，Vercel 会自动设置 KV_URL 环境变量'
      } : undefined
    });
  } catch (error: any) {
    console.error('检查 KV 状态失败:', error);
    return NextResponse.json(
      { 
        error: error?.message || '检查失败',
        available: false,
        hasUrl: false
      },
      { status: 500 }
    );
  }
}

