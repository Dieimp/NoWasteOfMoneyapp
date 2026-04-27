import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const hasToken = request.cookies.has('access_token')

    // Prevent redirect loops for internal Next.js paths or API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/api/') ||
        pathname.includes('/favicon.ico')
    ) {
        return NextResponse.next()
    }

    // If user is not logged in and not trying to access login, redirect to login
    if (!hasToken && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user is already logged in but trying to access the login page, redirect to home
    if (hasToken && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
