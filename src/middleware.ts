import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig, isAdminRole } from '@/shared/config/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = authConfig.publicPages.some((p) => pathname.startsWith(p));
  const isProtected =
    !isPublic &&
    authConfig.protectedPages.some((p) => pathname.startsWith(p));

  const role = request.cookies.get('role')?.value;
  const hasAccessToken = request.cookies.has('accessToken');
  const hasRefreshToken = request.cookies.has('refreshToken');

  if (isProtected) {
    if (!isAdminRole(role)) {
      return NextResponse.redirect(new URL(authConfig.signInPage, request.url));
    }
    if (!hasAccessToken && !hasRefreshToken) {
      return NextResponse.redirect(new URL(authConfig.signInPage, request.url));
    }
  }

  if (isPublic && hasAccessToken && isAdminRole(role)) {
    return NextResponse.redirect(new URL(authConfig.homePage, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
};
