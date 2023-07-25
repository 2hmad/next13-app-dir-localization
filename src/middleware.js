import { NextResponse } from "next/server";
import Negotiator from "negotiator";
import { i18n } from "@/i18n-config";
import { match } from "@formatjs/intl-localematcher";

function getLocale(request) {
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = i18n.locales;

  return match(languages, locales, i18n.defaultLocale);
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
