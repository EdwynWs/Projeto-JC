import { NextResponse } from "next/server"

export function proxy(request) {
    if(!request.cookies.get("token")) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/participante/:path*',
        '/cotas/:path*',
        '/assembleias/:path*',
        '/pagamentos/:path*'
    ]
}