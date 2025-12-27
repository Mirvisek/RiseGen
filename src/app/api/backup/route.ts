import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    // Auth check - tylko SUPERADMIN
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes('SUPERADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const timeNum = Date.now();
        const backupDir = path.join(process.cwd(), 'backups');
        const backupFileName = `backup-${timestamp}-${timeNum}.db`;
        const backupPath = path.join(backupDir, backupFileName);

        // Create backups directory if not exists
        await fs.mkdir(backupDir, { recursive: true });

        // SQLite backup (copy file)
        const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

        try {
            await fs.copyFile(dbPath, backupPath);
        } catch (error) {
            // If dev.db doesn't exist, might be different DB setup
            return NextResponse.json({
                error: 'Database file not found. Check your database configuration.',
                details: 'Expected SQLite at prisma/dev.db'
            }, { status: 500 });
        }

        const stats = await fs.stat(backupPath);

        // Clean old backups (keep last 30 days)
        await cleanOldBackups(backupDir, 30);

        return NextResponse.json({
            success: true,
            backup: backupFileName,
            size: stats.size,
            sizeFormatted: formatBytes(stats.size),
            timestamp: new Date(),
            path: backupPath
        });
    } catch (error) {
        console.error('Backup error:', error);
        return NextResponse.json(
            {
                error: 'Backup failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// List backups
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes('SUPERADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const backupDir = path.join(process.cwd(), 'backups');

        // Create dir if not exists
        await fs.mkdir(backupDir, { recursive: true });

        const files = await fs.readdir(backupDir);

        const backups = await Promise.all(
            files
                .filter(f => f.startsWith('backup-') && f.endsWith('.db'))
                .map(async (file) => {
                    const filePath = path.join(backupDir, file);
                    const stats = await fs.stat(filePath);
                    return {
                        name: file,
                        size: stats.size,
                        sizeFormatted: formatBytes(stats.size),
                        created: stats.birthtime,
                    };
                })
        );

        backups.sort((a, b) => b.created.getTime() - a.created.getTime());

        return NextResponse.json({
            backups,
            total: backups.length,
            totalSize: backups.reduce((sum, b) => sum + b.size, 0)
        });
    } catch (error) {
        return NextResponse.json({ backups: [], total: 0, totalSize: 0 });
    }
}

async function cleanOldBackups(backupDir: string, daysToKeep: number) {
    try {
        const files = await fs.readdir(backupDir);
        const now = Date.now();
        const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

        for (const file of files) {
            if (!file.startsWith('backup-')) continue;

            const filePath = path.join(backupDir, file);
            const stats = await fs.stat(filePath);

            if (now - stats.birthtime.getTime() > maxAge) {
                await fs.unlink(filePath);
                console.log(`Deleted old backup: ${file}`);
            }
        }
    } catch (error) {
        console.error('Error cleaning old backups:', error);
    }
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
