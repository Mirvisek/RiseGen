import { prisma } from "@/lib/prisma";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Analytics - Panel Admina",
};

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (!session || (!session.user.roles.includes("SUPERADMIN") && !session.user.roles.includes("ADMIN"))) {
        redirect("/admin/dashboard");
    }

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

    // Visits over time (daily) - raw SQL for SQLite
    const visitsOverTime = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
    SELECT 
      DATE(createdAt) as date,
      COUNT(*) as count
    FROM VisitLog
    WHERE createdAt >= ${thirtyDaysAgo.toISOString()}
    GROUP BY DATE(createdAt)
    ORDER BY date ASC
  `;

    // Convert BigInt to Number for JSON serialization
    const visitsOverTimeFormatted = visitsOverTime.map(v => ({
        date: v.date,
        count: Number(v.count)
    }));

    return (
        <div>
            <AnalyticsDashboard
                totalVisits={totalVisits}
                uniqueVisitors={uniqueVisitors}
                pageViews={pageViews}
                applications={applications}
                messages={messages}
                subscribers={subscribers}
                visitsOverTime={visitsOverTimeFormatted}
            />
        </div>
    );
}
