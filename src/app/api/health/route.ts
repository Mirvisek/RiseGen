import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // 1. Check Database connection
        const dbStart = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        const dbLatency = Date.now() - dbStart;

        // 2. Check environment variables
        const requiredEnvVars = [
            "DATABASE_URL",
            "NEXTAUTH_SECRET",
            "UP-DRAFT_API_KEY", // Example of some API key
        ];

        const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

        // 3. System info
        const systemInfo = {
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
            memory: process.memoryUsage(),
        };

        const status = missingEnvVars.length === 0 ? "healthy" : "degraded";

        return NextResponse.json({
            status,
            checks: {
                database: {
                    status: "healthy",
                    latency: `${dbLatency}ms`,
                },
                env: {
                    status: missingEnvVars.length === 0 ? "healthy" : "missing_vars",
                    missing: missingEnvVars,
                },
                system: systemInfo,
            }
        }, {
            status: status === "healthy" ? 200 : 503
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({
            status: "unhealthy",
            error: message,
            timestamp: new Date().toISOString(),
        }, {
            status: 500
        });
    }
}
