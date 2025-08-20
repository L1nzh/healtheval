// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('🟢 Middleware is WORKING! Path:', request.nextUrl.pathname);

  // 强制重定向，一看就知道生效了
  if (request.nextUrl.pathname === '/admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login'; // 强制跳转到登录页
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};