import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 定义需要保护的路由
const protectedRoutes: string[] = [];

// 定义无需保护的路由（登录页面和首页可以访问）
const publicRoutes = ['/login', '/'];

export function middleware(request: NextRequest) {
  // 获取cookie中的token
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // 检查是否在公共路由中
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 检查是否在受保护的路由中且没有token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    // 重定向到登录页面并添加当前页面作为callbackUrl参数
    const search = request.nextUrl.search;
    const callbackUrl = encodeURIComponent(pathname + (search || ''));
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  // 允许访问
  return NextResponse.next();
}

// 定义中间件应用的路由
// 这里我们让中间件应用于所有路由，内部会根据上述逻辑决定是否拦截
// 但我们不拦截API路由，因为那些可能有自己的认证逻辑
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};