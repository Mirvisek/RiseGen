
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LimitSelector } from "@/components/LimitSelector";
import { NewsList } from "@/components/NewsList";
import { Newspaper } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aktualności - Co u nas słychać | RiseGen",
    description: "Bądź na bieżąco z życiem naszego stowarzyszenia. Najnowsze informacje, relacje z wydarzeń i komunikaty.",
};

export default async function NewsPage(props: { searchParams: Promise<{ page?: string; limit?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const take = Number(searchParams.limit) || 10;
    const skip = (page - 1) * take;

    const [news, total] = await Promise.all([
        prisma.news.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        prisma.news.count(),
    ]);

    const totalPages = Math.ceil(total / take);

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Newspaper size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Bądź na bieżąco
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Aktualności <br />
                        <span className="text-indigo-200">z życia stowarzyszenia</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Dowiedz się co u nas słychać. Publikujemy relacje, zapowiedzi i ważne ogłoszenia.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-6xl -mt-10 relative z-20">
                <div className="mb-8 flex justify-end animate-in fade-in slide-in-from-right-5 duration-700">
                    <div className="bg-white dark:bg-gray-900 p-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                        <LimitSelector currentLimit={take} />
                    </div>
                </div>

                {news.length > 0 ? (
                    <>
                        <NewsList news={news} />

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 mt-12 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                                {page > 1 && (
                                    <Link
                                        href={`/aktualnosci?page=${page - 1}&limit=${take}`}
                                        className="px-6 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium transition shadow-sm"
                                    >
                                        &larr; Poprzednia
                                    </Link>
                                )}
                                <span className="px-4 py-2 text-gray-500 dark:text-gray-400 flex items-center bg-white/50 dark:bg-gray-900/50 rounded-full">
                                    Strona {page} z {totalPages}
                                </span>
                                {page < totalPages && (
                                    <Link
                                        href={`/aktualnosci?page=${page + 1}&limit=${take}`}
                                        className="px-6 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium transition shadow-sm"
                                    >
                                        Następna &rarr;
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 shadow-sm animate-in zoom-in-95 duration-500">
                        <p className="text-lg text-gray-500 dark:text-gray-400">Brak aktualności do wyświetlenia.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
