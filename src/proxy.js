import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/checkout', '/profile'];
const AUTH_ROUTES = ['/login', '/register', '/verify-otp', '/forgot-password'];

export function proxy(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('jwt')?.value || null;
    const role = request.cookies.get('role')?.value || null;

    // Bina login ke protected pages nahi kholne denge
    if (PROTECTED_ROUTES.includes(pathname) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    // Admin panel - sirf admin/super_admin access kar sakte hai
    if (pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (role !== "admin" && role !== "super_admin") {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (AUTH_ROUTES.includes(pathname) && token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
}

export const config = {
    matcher: [
        '/checkout',
        '/profile',
        '/login',
        '/register',
        '/verify-otp',
        '/forgot-password',
        "/admin/:path*",
    ],
};
