"use client";

import {
    TrendingUp,
    Users,
    FileText,
    Mail,
    Bell,
    Eye,
    BarChart3,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { cn } from "@/lib/utils";

interface AnalyticsDashboardProps {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: Array<{ path: string; _count: number }>;
    applications: number;
    messages: number;
    subscribers: number;
    visitsOverTime: Array<{ date: string | Date; count: number | bigint }>;
}

export function AnalyticsDashboard(props: AnalyticsDashboardProps) {
    const stats = [
        {
            label: "Suma wizyt",
            value: props.totalVisits,
            trend: "+12.5%",
            isPositive: true,
            icon: Eye,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/30",
            chartColor: "#2563eb"
        },
        {
            label: "Unikalni goście",
            value: props.uniqueVisitors,
            trend: "+5.2%",
            isPositive: true,
            icon: Users,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-900/30",
            chartColor: "#16a34a"
        },
        {
            label: "Zgłoszenia",
            value: props.applications,
            trend: "-2.1%",
            isPositive: false,
            icon: FileText,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-900/30",
            chartColor: "#9333ea"
        },
        {
            label: "Wiadomości",
            value: props.messages,
            trend: "+18.7%",
            isPositive: true,
            icon: Mail,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-50 dark:bg-orange-900/30",
            chartColor: "#ea580c"
        },
        {
            label: "Newsletter",
            value: props.subscribers,
            trend: "+3.4%",
            isPositive: true,
            icon: Bell,
            color: "text-pink-600 dark:text-pink-400",
            bgColor: "bg-pink-50 dark:bg-pink-900/30",
            chartColor: "#db2777"
        },
    ];

    // Data for charts
    const chartData = props.visitsOverTime.map(day => ({
        date: new Date(day.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }),
        visits: Number(day.count),
    }));

    const topPagesData = props.pageViews.slice(0, 5).map(page => ({
        name: page.path === '/' ? '/ (Home)' : page.path,
        views: page._count,
    }));

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Panel Analityczny
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        Przegląd aktywności z ostatnich 30 dni
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <button className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                        Ostatnie 30 dni
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Ostatnie 7 dni
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(stat.bgColor, "p-3 rounded-xl transition-transform group-hover:scale-110")}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
                                stat.isPositive ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            )}>
                                {stat.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                                {stat.value.toLocaleString()}
                            </p>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 px-0.5">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Area Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-500" />
                                Trendy Odwiedzin
                            </h2>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Liczba odsłon dzień po dniu</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Pages Pie/Bar Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            Najpopularniejsze
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Top 5 podstron serwisu</p>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topPagesData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                                />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="views" radius={[0, 4, 4, 0]} barSize={20}>
                                    {topPagesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 space-y-3">
                        {topPagesData.map((page, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400 font-medium truncate max-w-[150px]">
                                    {page.name}
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {page.views} odesłań
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row - User Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-600 rounded-2xl p-6 text-white overflow-hidden relative group">
                    <Activity className="absolute -right-8 -bottom-8 h-48 w-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                    <h3 className="text-lg font-bold mb-2">Wskaźnik Konwersji</h3>
                    <div className="text-4xl font-black mb-4">
                        {props.uniqueVisitors > 0 ? ((props.applications / props.uniqueVisitors) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-indigo-100 max-w-[200px]">
                        Stosunek wysłanych zgłoszeń do unikalnych odwiedzających.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Efektywność Newslettera</h3>
                    <div className="flex items-center gap-8">
                        <div className="flex-1">
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
                                <div
                                    className="h-full bg-pink-500 rounded-full"
                                    style={{ width: `${props.subscribers > 0 ? (props.subscribers / 500) * 100 : 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-pink-600 dark:text-pink-400">Cel: 500 subskrybentów</span>
                                <span className="text-gray-400">{props.subscribers}/500</span>
                            </div>
                        </div>
                        <div className="h-16 w-16 rounded-full border-4 border-pink-500 flex flex-col items-center justify-center text-xs font-bold text-pink-600 dark:text-pink-400">
                            <span>{props.subscribers > 0 ? ((props.subscribers / 500) * 100).toFixed(0) : 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
