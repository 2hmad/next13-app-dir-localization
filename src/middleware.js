import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { i18n } from '@/i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';

function getLocale(request) {
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = i18n.locales;

  return matchLocale(languages, locales, i18n.defaultLocale);
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );
  const locale = getLocale(request);
  const excludePaths = [
    '/admin',
    '/api',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ];

  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    !request.cookies.has(process.env.NEXT_PUBLIC_ADMIN_ACCESSTOKEN)
  ) {
    request.nextUrl.pathname = '/admin/login';
    return NextResponse.redirect(request.nextUrl.toString(), {
      status: 302,
    });
  }

  if (
    pathname.startsWith('/admin') &&
    pathname === '/admin/login' &&
    request.cookies.has(process.env.NEXT_PUBLIC_ADMIN_ACCESSTOKEN)
  ) {
    request.nextUrl.pathname = '/admin';
    return NextResponse.redirect(request.nextUrl.toString(), {
      status: 302,
    });
  }

  if (excludePaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url),
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
