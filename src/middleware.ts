import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextFetchEvent } from "next/server";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function getRateLimit(ip: string, limit: number, windowMs: number) {
    const now = Date.now();
    const uniqueKey = ip;
    const record = rateLimitMap.get(uniqueKey);

    if (!record || (now - record.lastReset) > windowMs) {
        rateLimitMap.set(uniqueKey, { count: 1, lastReset: now });
        return { success: true, count: 1 };
    }

    if (record.count >= limit) {
        return { success: false, count: record.count };
    }

    record.count += 1;
    return { success: true, count: record.count };
}

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((val, key) => {
        if (now - val.lastReset > 60000) { // Clear if older than 1 minute (simplification)
            rateLimitMap.delete(key);
        }
    });
}, 300000);

const authMiddleware = withAuth(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const pathname = req.nextUrl.pathname;

    // --- Rate Limiting for API Routes ---
    if (pathname.startsWith("/api")) {
        // Stricter limit for auth and newsletter
        const isSensitiveApi = pathname.startsWith("/api/auth") || pathname.startsWith("/api/newsletter");
        const limit = isSensitiveApi ? 10 : 100; // 10 req/min for sensitive, 100 for general
        const windowMs = 60 * 1000; // 1 minute

        const rateCheck = getRateLimit(ip, limit, windowMs);

        if (!rateCheck.success) {
            // Return 429 Too Many Requests
            return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
                status: 429,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    if (process.env.NODE_ENV === "production") {
        const forwardedProto = req.headers.get("x-forwarded-proto");

        if (forwardedProto === "http") {
            const requestHeaders = new Headers(req.headers);
            let host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");

            // Remove port if present first
            if (host) {
                host = host.split(':')[0];
            }

            // Enforce www.risegen.pl for production
            // This handles:
            // 1. localhost/IP redirects from proxy (fixing the main issue)
            // 2. Bare domain risegen.pl -> www.risegen.pl (requested by user)
            if (!host || host.includes("localhost") || host === "risegen.pl" || host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
                host = "www.risegen.pl";
            }

            return NextResponse.redirect(`https://${host}${req.nextUrl.pathname}${req.nextUrl.search}`, 301);
        }
    }

    // Define CSP
    // Note: 'unsafe-inline' is currently enabled to support existing functionality.
    // 'unsafe-eval' is enabled only in development.
    const isDev = process.env.NODE_ENV !== "production";

    // Allow unsafe-eval in dev for hot reloading, but block in production if possible.
    // However, some libraries might need it. If errors occur, re-enable.
    // For now, let's keep it restricted in production.
    const scriptSrc = `'self' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.googletagmanager.com https://www.google-analytics.com`;

    const cspHeader = `
        default-src 'self';
        script-src ${scriptSrc};
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: https:;
        font-src 'self' https://fonts.gstatic.com data:;
        connect-src 'self' https://www.google.com/recaptcha/ https://recaptchaenterprise.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com;
        frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'self';
        ${!isDev ? 'upgrade-insecure-requests;' : ''}
    `.replace(/\s{2,}/g, ' ').trim();

    // Permissions Policy
    const permissionsPolicy = "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()";

    // 1. Prepare headers with x-pathname, CSP, and Permissions-Policy
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);
    requestHeaders.set("Content-Security-Policy", cspHeader);

    // 2. Handle Admin & Auth pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (authMiddleware as any)(req, event);
        if (response) {
            response.headers.set("Content-Security-Policy", cspHeader);
            response.headers.set("Permissions-Policy", permissionsPolicy);
            response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
            response.headers.set("X-Frame-Options", "SAMEORIGIN");
            response.headers.set("X-Content-Type-Options", "nosniff");
            response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
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
    response.headers.set("Permissions-Policy", permissionsPolicy);
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
}

export const config = {
    matcher: ["/((?!api/admin|api/upload|_next/static|_next/image|favicon.ico).*)"],
};
