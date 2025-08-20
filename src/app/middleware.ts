// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  // 非 admin 路径直接放行
  if (!isAdminPath) {
    return NextResponse.next();
  }

  try {
    // 验证 JWT 有效性（7天有效期由登录时的 expiresIn 控制）
    if (token) {
      verify(token, process.env.JWT_SECRET!);
      // 已认证：允许访问 admin 页面
      return NextResponse.next();
    }
  } catch (error) {
    // token 无效或过期：强制跳转到 admin 页面（显示登录表单）
    console.log('Token invalid or expired');
    console.log(error);
  }

  // 未认证：强制留在 admin 页面（显示登录表单）
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // 匹配所有 admin 相关路径
};