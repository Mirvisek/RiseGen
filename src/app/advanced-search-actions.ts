"use server";

import { prisma } from "@/lib/prisma";

export type SearchType = "all" | "news" | "projects" | "events" | "pages";

export type AdvancedSearchResult = {
    id: string;
    type: "news" | "project" | "event" | "page";
    title: string;
    url: string;
    date?: Date;
    description?: string;
    excerpt?: string;
    highlights?: string[];
};

export type SearchFilters = {
    query: string;
    type?: SearchType;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
};

/**
 * Advanced search with filters
 */
export async function advancedSearch(filters: SearchFilters): Promise<AdvancedSearchResult[]> {
    const { query, type = "all", dateFrom, dateTo, limit = 20 } = filters;

    if (!query || query.length < 2) return [];

    const results: AdvancedSearchResult[] = [];

    // Search News
    if (type === "all" || type === "news") {
        const whereClause: any = {
            OR: [
                { title: { contains: query } },
                { content: { contains: query } }
            ]
        };

        if (dateFrom || dateTo) {
            whereClause.createdAt = {};
            if (dateFrom) whereClause.createdAt.gte = dateFrom;
            if (dateTo) whereClause.createdAt.lte = dateTo;
        }

        const news = await prisma.news.findMany({
            where: whereClause,
            take: type === "news" ? limit : 5,
            orderBy: { createdAt: "desc" }
        });

        news.forEach(n => {
            const content = n.content.replace(/<[^>]*>/g, ''); // Strip HTML
            const queryIndex = content.toLowerCase().indexOf(query.toLowerCase());
            const excerpt = queryIndex !== -1
                ? "..." + content.substring(Math.max(0, queryIndex - 50), queryIndex + 150) + "..."
                : content.substring(0, 150) + "...";

            results.push({
                id: n.id,
                type: "news",
                title: n.title,
                url: `/aktualnosci/${n.slug}`,
                date: n.createdAt,
                description: excerpt,
                excerpt,
                highlights: extractHighlights(content, query)
            });
        });
    }

    // Search Projects
    if (type === "all" || type === "projects") {
        const whereClause: any = {
            OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                { content: { contains: query } }
            ]
        };

        if (dateFrom || dateTo) {
            whereClause.createdAt = {};
            if (dateFrom) whereClause.createdAt.gte = dateFrom;
            if (dateTo) whereClause.createdAt.lte = dateTo;
        }

        const projects = await prisma.project.findMany({
            where: whereClause,
            take: type === "projects" ? limit : 5,
            orderBy: { createdAt: "desc" }
        });

        projects.forEach(p => {
            const content = (p.description || "") + " " + p.content.replace(/<[^>]*>/g, '');
            const queryIndex = content.toLowerCase().indexOf(query.toLowerCase());
            const excerpt = queryIndex !== -1
                ? "..." + content.substring(Math.max(0, queryIndex - 50), queryIndex + 150) + "..."
                : (p.description || content.substring(0, 150)) + "...";

            results.push({
                id: p.id,
                type: "project",
                title: p.title,
                url: `/projekty/${p.slug}`,
                date: p.createdAt,
                description: p.description || excerpt,
                excerpt,
                highlights: extractHighlights(content, query)
            });
        });
    }

    // Search Events
    if (type === "all" || type === "events") {
        const whereClause: any = {
            OR: [
                { title: { contains: query } },
                { content: { contains: query } },
                { location: { contains: query } }
            ]
        };

        if (dateFrom || dateTo) {
            whereClause.date = {};
            if (dateFrom) whereClause.date.gte = dateFrom;
            if (dateTo) whereClause.date.lte = dateTo;
        }

        const events = await prisma.event.findMany({
            where: whereClause,
            take: type === "events" ? limit : 5,
            orderBy: { date: "desc" }
        });

        events.forEach(e => {
            const content = e.content.replace(/<[^>]*>/g, '');
            const queryIndex = content.toLowerCase().indexOf(query.toLowerCase());
            const excerpt = queryIndex !== -1
                ? "..." + content.substring(Math.max(0, queryIndex - 50), queryIndex + 150) + "..."
                : content.substring(0, 150) + "...";

            results.push({
                id: e.id,
                type: "event",
                title: e.title,
                url: `/wydarzenia/${e.slug}`,
                date: e.date,
                description: e.location || excerpt,
                excerpt,
                highlights: extractHighlights(content, query)
            });
        });
    }

    // Search Pages
    if (type === "all" || type === "pages") {
        const staticPages = [
            { title: "O Nas", url: "/o-nas", keywords: ["o nas", "zespół", "stowarzyszenie", "misja", "współpraca"] },
            { title: "Kontakt", url: "/kontakt", keywords: ["kontakt", "adres", "telefon", "email", "napisz"] },
            { title: "Wsparcie / Darowizna", url: "/wesprzyj-nas", keywords: ["wsparcie", "darowizna", "przelew", "konto", "1.5%", "podatek"] },
            { title: "Zgłoszenia", url: "/zgloszenia", keywords: ["rekrutacja", "zgłoszenie", "dołącz", "członkostwo", "wolontariat"] },
            { title: "FAQ", url: "/o-nas/faq", keywords: ["pytania", "faq", "pomoc", "często zadawane"] },
            { title: "Dokumenty", url: "/o-nas/dokumenty", keywords: ["dokumenty", "statut", "uchwały", "sprawozdania"] },
        ];

        const lowerQuery = query.toLowerCase();
        staticPages.forEach(page => {
            if (page.title.toLowerCase().includes(lowerQuery) ||
                page.keywords.some(k => k.includes(lowerQuery))) {
                results.push({
                    id: page.url,
                    type: "page",
                    title: page.title,
                    url: page.url,
                    description: "Strona statyczna",
                    highlights: page.keywords.filter(k => k.includes(lowerQuery))
                });
            }
        });
    }

    // Sort by relevance (simple: date desc)
    results.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.getTime() - a.date.getTime();
    });

    return results.slice(0, limit);
}

/**
 * Extract context snippets with the search query
 */
function extractHighlights(content: string, query: string): string[] {
    const highlights: string[] = [];
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();

    let index = lowerContent.indexOf(lowerQuery);
    let count = 0;

    while (index !== -1 && count < 3) {
        const start = Math.max(0, index - 40);
        const end = Math.min(content.length, index + query.length + 40);
        highlights.push(content.substring(start, end));
        index = lowerContent.indexOf(lowerQuery, index + 1);
        count++;
    }

    return highlights;
}

/**
 * Save recent search (client-side will handle localStorage)
 */
export type RecentSearch = {
    query: string;
    timestamp: number;
    resultsCount: number;
};
