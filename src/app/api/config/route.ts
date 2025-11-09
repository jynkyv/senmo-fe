import { NextRequest, NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/config';
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
    const config = getConfig();
    // 不返回admin密码
    const { admin, ...publicConfig } = config;
    return NextResponse.json(publicConfig);
  } catch (error) {
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
    const currentConfig = getConfig();
    const updatedConfig = {
      ...body,
      admin: body.admin || currentConfig.admin
    };
    
    saveConfig(updatedConfig);
    return NextResponse.json({ success: true, message: '配置已更新' });
  } catch (error) {
    return NextResponse.json(
      { error: '保存配置失败' },
      { status: 500 }
    );
  }
}

