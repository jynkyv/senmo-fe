import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '@/lib/config';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const config = getConfig();
    const adminPassword = config.admin?.password || 'admin123';

    if (password === adminPassword) {
      // 设置cookie，7天过期
      const cookieStore = await cookies();
      cookieStore.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7天
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '登录失败' },
      { status: 500 }
    );
  }
}

