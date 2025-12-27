import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth middleware function
const authMiddleware = withAuth(
    function middleware(req: any) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const pathname = req.nextUrl.pathname;
        const isAuthPage = pathname.startsWith("/auth");
        const isAdminPage = pathname.startsWith("/admin");
        const isChangePasswordPage = pathname === "/admin/change-password";

        if (isAuthPage && isAuth) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        if (isAdminPage && !isAuth) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }

        // Force password change
        if (isAuth && token?.mustChangePassword && !isChangePasswordPage) {
            return NextResponse.redirect(new URL("/admin/change-password", req.url));
        }

        // Access control
        if (isAdminPage && !isChangePasswordPage) {
            const roles = (token?.roles as string[]) || [];
            const hasAccess = roles.includes("ADMIN") || roles.includes("EDITOR") || roles.includes("SUPERADMIN");
            if (!hasAccess) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        // IMPORTANT: For /admin and /auth pages, we STILL want the x-pathname header
        // so that RootLayout can exclude them from Maintenance Mode.
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-pathname", pathname);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    },
    {
        callbacks: {
            authorized: ({ token }) => true, // We handle redirection logic inside the middleware function
        },
    }
);

export default async function middleware(req: NextRequest, event: any) {
    if (process.env.NODE_ENV === "production") {
        const forwardedProto = req.headers.get("x-forwarded-proto");

        if (forwardedProto === "http") {
            const requestHeaders = new Headers(req.headers);
            let host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");

            // If we are in production and the host is still localhost (e.g. proxy didn't forward host),
            // fallback to the known domain to prevent redirecting to localhost:3000.
            if (!host || host.includes("localhost")) {
                host = "risegen.pl";
            }

            // Remove port if present (e.g. risegen.pl:3000 -> risegen.pl)
            const domain = host.split(':')[0];

            return NextResponse.redirect(`https://${domain}${req.nextUrl.pathname}${req.nextUrl.search}`, 301);
        }
    }

    const pathname = req.nextUrl.pathname;

    // Define CSP
    // Note: 'unsafe-inline' and 'unsafe-eval' are currently enabled to support existing functionality 
    // (Next.js client-side hydration, admin code injection, etc.).
    // Ideally, we should move to nonces in the future for stricter security.
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.googletagmanager.com https://www.google-analytics.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: https:;
        font-src 'self' https://fonts.gstatic.com data:;
        connect-src 'self' https://www.google.com/recaptcha/ https://recaptchaenterprise.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com;
        frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'self';
        require-trusted-types-for 'script';
        ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
    `.replace(/\s{2,}/g, ' ').trim();

    // 1. Prepare headers with x-pathname and CSP
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);
    requestHeaders.set("Content-Security-Policy", cspHeader);

    // 2. Handle Admin & Auth pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
        const response = await (authMiddleware as any)(req, event);
        if (response) {
            response.headers.set("Content-Security-Policy", cspHeader);
            response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
            response.headers.set("X-Frame-Options", "SAMEORIGIN");
        }
        return response;
    }

    // 3. For all other pages, return next with modified headers
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");

    return response;
}

export const config = {
    matcher: ["/((?!api/admin|api/upload|_next/static|_next/image|favicon.ico).*)"],
};
