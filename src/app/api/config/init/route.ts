import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getConfig, saveConfigAsync } from '@/lib/config';
import fs from 'fs';
import path from 'path';

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

// POST - 初始化 KV 配置（从文件或环境变量导入）
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

    // 检查是否在 Vercel 环境
    if (process.env.VERCEL !== '1') {
      return NextResponse.json(
        { error: '此功能仅在 Vercel 生产环境中可用' },
        { status: 400 }
      );
    }

    // 尝试从文件读取配置
    let configToImport;
    try {
      const configPath = path.join(process.cwd(), 'config', 'site-config.json');
      if (fs.existsSync(configPath)) {
        const fileContents = fs.readFileSync(configPath, 'utf8');
        configToImport = JSON.parse(fileContents);
      }
    } catch (error) {
      console.error('从文件读取配置失败:', error);
    }

    // 如果文件不存在，尝试从当前配置读取
    if (!configToImport) {
      configToImport = getConfig();
    }

    // 导入到 KV
    try {
      await saveConfigAsync(configToImport);
      return NextResponse.json({ 
        success: true, 
        message: '配置已成功导入到 Vercel KV！',
        config: {
          ...configToImport,
          admin: configToImport.admin ? { password: '***' } : undefined
        }
      });
    } catch (error: any) {
      return NextResponse.json(
        { 
          error: '导入到 KV 失败',
          details: error?.message,
          hint: '请确保已在 Vercel 项目中创建并连接 KV 数据库。'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('初始化配置失败:', error);
    return NextResponse.json(
      { error: error?.message || '初始化配置失败' },
      { status: 500 }
    );
  }
}

