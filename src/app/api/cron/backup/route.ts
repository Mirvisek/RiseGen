import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * Backup API - Triggered by Cron (e.g. Vercel Cron or local crontab)
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Security check
    if (token !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const dbPath = path.join(process.cwd(), "prisma", "dev.db");
        const backupDir = path.join(process.cwd(), "backups");

        // Ensure backup directory exists
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupPath = path.join(backupDir, `backup-${timestamp}.db`);

        // Copy database
        fs.copyFileSync(dbPath, backupPath);

        // Keep only last 10 backups (retention policy)
        const files = fs.readdirSync(backupDir)
            .filter(f => f.startsWith("backup-"))
            .map(f => ({
                name: f,
                time: fs.statSync(path.join(backupDir, f)).mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time);

        if (files.length > 10) {
            const filesToDelete = files.slice(10);
            filesToDelete.forEach(f => {
                fs.unlinkSync(path.join(backupDir, f.name));
            });
        }

        return NextResponse.json({
            success: true,
            backup: `backup-${timestamp}.db`,
            count: Math.min(files.length, 10),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Backup error:", error);
        const message = error instanceof Error ? error.message : "Backup failed";
        return NextResponse.json({
            success: false,
            error: message
        }, { status: 500 });
    }
}
