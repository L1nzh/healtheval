// app/middleware.ts
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('🟢 Middleware is WORKING! Path:', request.nextUrl.pathname);
  return;
}

export const config = {
  matcher: '/admin/:path*',
};