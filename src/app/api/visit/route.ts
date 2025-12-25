import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { path } = await req.json();

        // Simple validation
        if (!path || typeof path !== 'string') {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 });
        }

        // Exclude /admin, /api, /_next paths to focus on public site visits
        // Or keep /admin if you want to track internal usage, but usually stats are for public site.
        // User asked for "Last visits" in admin panel. Usually implies public visits.
        if (
            path.startsWith('/api') ||
            path.startsWith('/_next') ||
            path.startsWith('/static') ||
            path.includes('.') // Exclude files like .ico, .png
        ) {
            return NextResponse.json({ success: true, ignored: true });
        }

        await prisma.visitLog.create({
            data: {
                path: path,
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Visit log error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
