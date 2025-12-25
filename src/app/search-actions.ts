"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
    id: string;
    type: "news" | "project" | "event" | "page";
    title: string;
    url: string;
    date?: Date;
    description?: string;
};

export async function searchContent(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();

    // Parallelize queries
    const [news, projects, events] = await Promise.all([
        prisma.news.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { content: { contains: query } }
                ]
            },
            take: 3,
            orderBy: { createdAt: "desc" }
        }),
        prisma.project.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } }
                ]
            },
            take: 3,
            orderBy: { createdAt: "desc" }
        }),
        prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { content: { contains: query } },
                    { location: { contains: query } }
                ]
            },
            take: 3,
            orderBy: { date: "desc" }
        })
    ]);

    const results: SearchResult[] = [];

    // Map News
    news.forEach(n => {
        results.push({
            id: n.id,
            type: "news",
            title: n.title,
            url: `/aktualnosci/${n.slug}`,
            date: n.createdAt,
            description: n.content.substring(0, 100).replace(/<[^>]*>?/gm, '') // Simple strip HTML
        });
    });

    // Map Projects
    projects.forEach(p => {
        results.push({
            id: p.id,
            type: "project",
            title: p.title,
            url: `/projekty/${p.slug}`,
            date: p.createdAt,
            description: p.description || ""
        });
    });

    // Map Events
    events.forEach(e => {
        results.push({
            id: e.id,
            type: "event",
            title: e.title,
            url: `/wydarzenia/${e.slug}`,
            date: e.date,
            description: e.location || ""
        });
    });

    // Add static pages simple match
    const staticPages = [
        { title: "O Nas", url: "/o-nas", keywords: ["o nas", "zespół", "stowarzyszenie", "misja"] },
        { title: "Kontakt", url: "/kontakt", keywords: ["kontakt", "adres", "telefon", "email"] },
        { title: "Wsparcie / Darowizna", url: "/wesprzyj-nas", keywords: ["wsparcie", "darowizna", "przelew", "konto"] },
        { title: "Zgłoszenia", url: "/zgloszenia", keywords: ["rekrutacja", "zgłoszenie", "dołącz"] },
    ];

    staticPages.forEach(page => {
        if (page.title.toLowerCase().includes(lowerQuery) || page.keywords.some(k => k.includes(lowerQuery))) {
            results.push({
                id: page.url,
                type: "page",
                title: page.title,
                url: page.url,
                description: "Strona"
            });
        }
    });

    return results;
}
