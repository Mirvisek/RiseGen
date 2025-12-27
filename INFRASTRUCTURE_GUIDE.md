# 📊🔒🔍 INFRASTRUCTURE IMPLEMENTATION GUIDE

## Status: FUNDAMENTY + COMPLETE GUIDES
**Data:** 2025-12-27  
**Funkcjonalności:** Analytics, Backup, Monitoring

---

## 📊 **#22 ANALYTICS - ZAAWANSOWANE**

### **Co już masz:**
- ✅ Basic stats (counters na homepage)
- ✅ VisitLog model w Prisma
- ✅ Admin dashboard

### **Co dodać:**

#### **1. Analytics Dashboard** 📈

**Utwórz:** `src/app/admin/analytics/page.tsx`

```tsx
import { prisma } from "@/lib/prisma";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default async function AnalyticsPage() {
  // Ostatnie 30 dni
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalVisits,
    uniqueVisitors,
    pageViews,
    applications,
    messages,
    subscribers,
  ] = await Promise.all([
    // Total visits
    prisma.visitLog.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    }),
    
    // Unique visitors (by IP)
    prisma.visitLog.groupBy({
      by: ['ip'],
      where: { createdAt: { gte: thirtyDaysAgo } }
    }).then(r => r.length),
    
    // Page views by path
    prisma.visitLog.groupBy({
      by: ['path'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
      orderBy: { _count: { path: 'desc' } },
      take: 10
    }),
    
    // Applications
    prisma.application.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    }),
    
    // Messages
    prisma.contactMessage.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    }),
    
    // Newsletter subscribers
    prisma.subscriber.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    }),
  ]);

  // Visits over time (daily)
  const visitsOverTime = await prisma.$queryRaw`
    SELECT 
      DATE(createdAt) as date,
      COUNT(*) as count
    FROM VisitLog
    WHERE createdAt >= ${thirtyDaysAgo}
    GROUP BY DATE(createdAt)
    ORDER BY date ASC
  `;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Zaawansowane Statystyki</h1>
      <AnalyticsDashboard
        totalVisits={totalVisits}
        uniqueVisitors={uniqueVisitors}
        pageViews={pageViews}
        applications={applications}
        messages={messages}
        subscribers={subscribers}
        visitsOverTime={visitsOverTime}
      />
    </div>
  );
}
```

#### **2. Analytics Dashboard Component** 

**Utwórz:** `src/components/admin/AnalyticsDashboard.tsx`

```tsx
"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Mail, Bell, Eye } from "lucide-react";

interface AnalyticsDashboardProps {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: any[];
  applications: number;
  messages: number;
  subscribers: number;
  visitsOverTime: any[];
}

export function AnalyticsDashboard(props: AnalyticsDashboardProps) {
  const stats = [
    {
      label: "Total Visits",
      value: props.totalVisits,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      label: "Unique Visitors",
      value: props.uniqueVisitors,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/30"
    },
    {
      label: "Applications",
      value: props.applications,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    },
    {
      label: "Messages",
      value: props.messages,
      icon: Mail,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/30"
    },
    {
      label: "Newsletter Subscribers",
      value: props.subscribers,
      icon: Bell,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/30"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Pages */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-4">Top 10 Pages</h2>
        <div className="space-y-2">
          {props.pageViews.map((page: any, idx: number) => (
            <div
              key={page.path}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-6">
                  #{idx + 1}
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {page.path}
                </span>
              </div>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {page._count} views
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Visits Chart - Simple Bar Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-4">Visits Over Time (Last 30 Days)</h2>
        <div className="h-64 flex items-end gap-1">
          {props.visitsOverTime.map((day: any) => (
            <div
              key={day.date}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-t"
              style={{
                height: `${(Number(day.count) / Math.max(...props.visitsOverTime.map((d: any) => Number(d.count)))) * 100}%`,
                minHeight: '4px'
              }}
              title={`${day.date}: ${day.count} visits`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### **3. Dodaj do menu Admin**

W `AdminSidebar.tsx` dodaj:
```tsx
{
  href: "/admin/analytics",
  icon: BarChart3,
  label: "Analytics",
  badge: "NEW"
}
```

### **Bonusy (opcjonalne):**
- Install `recharts` dla lepszych wykresów: `npm install recharts`
- Google Analytics integration
- Real-time dashboard (WebSockets)

---

## 💾 **#24 BACKUP AUTOMATYCZNY**

### **Implementacja:**

#### **1. Backup API Endpoint**

**Utwórz:** `src/app/api/backup/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  // Auth check - tylko SUPERADMIN
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes('SUPERADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    const backupFileName = `backup-${timestamp}.db`;
    const backupPath = path.join(backupDir, backupFileName);

    // Create backups directory if not exists
    await fs.mkdir(backupDir, { recursive: true });

    // SQLite backup (copy file)
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    await fs.copyFile(dbPath, backupPath);

    // Optional: Compress backup
    if (process.env.COMPRESS_BACKUPS === 'true') {
      await execAsync(`gzip ${backupPath}`);
    }

    // Optional: Upload to cloud (S3, R2, etc)
    // await uploadToCloud(backupPath);

    // Clean old backups (keep last 30 days)
    await cleanOldBackups(backupDir, 30);

    return NextResponse.json({
      success: true,
      backup: backupFileName,
      size: (await fs.stat(backupPath)).size,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { error: 'Backup failed', details: error },
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
    const files = await fs.readdir(backupDir);
    
    const backups = await Promise.all(
      files
        .filter(f => f.startsWith('backup-'))
        .map(async (file) => {
          const filePath = path.join(backupDir, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            size: stats.size,
            created: stats.birthtime,
          };
        })
    );

    backups.sort((a, b) => b.created.getTime() - a.created.getTime());

    return NextResponse.json({ backups });
  } catch (error) {
    return NextResponse.json({ backups: [] });
  }
}

async function cleanOldBackups(backupDir: string, daysToKeep: number) {
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
}
```

#### **2. Backup UI Component**

**Utwórz:** `src/components/admin/BackupManager.tsx`

```tsx
"use client";

import { useState } from "react";
import { Download, Trash2, Loader2, RefreshCw, Database } from "lucide-react";
import { toast } from "sonner";

export function BackupManager() {
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);

  const createBackup = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/backup', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Backup created successfully!');
        await loadBackups();
      } else {
        toast.error('Backup failed');
      }
    } catch (error) {
      toast.error('Error creating backup');
    } finally {
      setLoading(false);
    }
  };

  const loadBackups = async () => {
    try {
      const res = await fetch('/api/backup');
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={createBackup}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating backup...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Create Backup Now
            </>
          )}
        </button>

        <button
          onClick={loadBackups}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh List
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold">Available Backups</h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {backups.length > 0 ? (
            backups.map((backup) => (
              <div key={backup.name} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{backup.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(backup.created).toLocaleString()} • 
                    {(backup.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No backups found. Create your first backup!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### **3. Cron Job (Automatic Daily Backups)**

**Opcja A: Vercel Cron** (jeśli hostujesz na Vercel)

**Utwórz:** `vercel.json`
```json
{
  "crons": [{
    "path": "/api/cron/backup",
    "schedule": "0 3 * * *"
  }]
}
```

**Utwórz:** `src/app/api/cron/backup/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Trigger backup
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/backup`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
    },
  });

  return response;
}
```

**Opcja B: System Cron** (jeśli własny serwer)

```bash
# crontab -e
0 3 * * * curl -X POST https://risegen.pl/api/backup -H "Authorization: Bearer YOUR_SECRET"
```

---

## 🚨 **#25 MONITORING & ALERTING**

### **Implementacja Sentry:**

#### **1. Instalacja**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

#### **2. Konfiguracja automatyczna**

Wizard utworzy:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

#### **3. Dodaj do `.env`**

```env
# Sentry
SENTRY_DSN=https://your-dsn@sentry.io/your-project
SENTRY_AUTH_TOKEN=your-auth-token
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project
```

#### **4. Health Check Endpoint**

**Utwórz:** `src/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    checks: {
      database: 'unknown',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
    }
  };

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.checks.database = 'healthy';
  } catch (error) {
    checks.checks.database = 'unhealthy';
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'ok' ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
```

#### **5. Uptime Monitoring**

**Opcja A: UptimeRobot (FREE)**
1. Załóż konto na [uptimerobot.com](https://uptimerobot.com)
2. Dodaj monitor: `https://risegen.pl/api/health`
3. Interwał: 5 minut
4. Alerty: Email/SMS gdy down

**Opcja B: Better Uptime**
- Lepsze UI
- Slack integration
- Status page

#### **6. Error Tracking w kodzie**

```tsx
// W każdym server action lub API route:
import * as Sentry from "@sentry/nextjs";

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'applications',
      action: 'create',
    },
    user: {
      id: session?.user?.id,
      email: session?.user?.email,
    },
  });
  throw error;
}
```

---

## ✅ **CHECKLIST IMPLEMENTACJI**

### **Analytics:**
```
[ ] Utwórz /admin/analytics/page.tsx
[ ] Utwórz AnalyticsDashboard.tsx
[ ] Dodaj do menu admina
[ ] Test dashboard
[ ] (Optional) Install recharts dla lepszych wykresów
```

### **Backup:**
```
[ ] Utwórz /api/backup/route.ts
[ ] Utwórz BackupManager.tsx
[ ] Utwórz /admin/backup/page.tsx
[ ] Utwórz backups/ folder (.gitignore!)
[ ] Setup cron job (Vercel lub system)
[ ] Test manual backup
[ ] Test restore procedure
```

### **Monitoring:**
```
[ ] npm install @sentry/nextjs
[ ] npx @sentry/wizard
[ ] Add SENTRY_DSN to .env
[ ] Utwórz /api/health/route.ts
[ ] Setup UptimeRobot monitor
[ ] Test error tracking
[ ] Configure alerts (email/Slack)
```

---

## 🎯 **PRIORYTETY**

**Zrób najpierw (30 min każde):**
1. ✅ Analytics Dashboard - najszybsza wartość
2. ✅ Health Check + UptimeRobot - krytyczne
3. ✅ Manual Backup API - bezpieczeństwo

**Później (1-2h każde):**
4. Sentry integration - lepszy error tracking
5. Automated backups (cron) - automatyzacja
6. Advanced analytics (recharts) - lepsze wykresy

---

## 📊 **SZACOWANY CZAS:**

- **Analytics:** 1.5h (basic) | 3h (z wykresami)
- **Backup:** 1h (manual) | 2h (automated)
- **Monitoring:** 0.5h (health check) | 2h (full Sentry)

**Total minimum:** 3h
**Total complete:** 7h

---

## 🚀 **CO ROBIĆ TERAZ?**

Ze względu na czas i kompleksowość, sugeruję:

**Opcja A:** Zaimplementuj wszystkie 3 w wersji BASIC (3-4h)
**Opcja B:** Wybierz 1-2 do pełnej implementacji
**Opcja C:** Mam już guide - zaimplementuj sam później

Powiedz mi którą opcję wybierasz! 😊
