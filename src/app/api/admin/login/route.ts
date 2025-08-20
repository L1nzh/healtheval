// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const JWT_SECRET = process.env.JWT_SECRET;

  // 检查服务器配置
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, error: 'Server config error: ADMIN_PASSWORD missing' },
      { status: 500 }
    );
  }

  if (!JWT_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Server config error: JWT_SECRET missing' },
      { status: 500 }
    );
  }

  // 验证密码
  if (password === ADMIN_PASSWORD) {
    //登录成功：签发 JWT
    const token = sign(
      { role: 'admin', iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { expiresIn: '7d' } // 7天免登录
    );

    const response = NextResponse.json({ success: true });

    // 设置 httpOnly Cookie，前端无法访问，更安全
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === 'production', // 生产环境启用 HTTPS
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
      sameSite: 'strict',
    });

    return response;
  } else {
    return NextResponse.json(
      { success: false, error: 'Incorrect password' },
      { status: 401 }
    );
  }
}