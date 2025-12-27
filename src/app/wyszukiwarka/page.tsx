import { advancedSearch, SearchType } from "@/app/advanced-search-actions";
import { Search, FileText, Calendar, Newspaper, Layout, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "Wyszukiwarka - RiseGen",
    description: "Przeszukuj aktualności, projekty i wydarzenia",
};

const SEARCH_TYPES: { value: SearchType; label: string }[] = [
    { value: "all", label: "Wszystko" },
    { value: "news", label: "Aktualności" },
    { value: "projects", label: "Projekty" },
    { value: "events", label: "Wydarzenia" },
    { value: "pages", label: "Strony" },
];

export default async function SearchPage(props: {
    searchParams: Promise<{ q?: string; type?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams.q || "";
    const type = (searchParams.type as SearchType) || "all";

    // Perform search
    const results = query.length >= 2
        ? await advancedSearch({ query, type, limit: 50 })
        : [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Wyszukiwarka
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Znajdź aktualności, projekty, wydarzenia i więcej
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
                    <form method="GET" action="/wyszukiwarka" className="space-y-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="q"
                                defaultValue={query}
                                placeholder="Wpisz szukaną frazę..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>

                        {/* Type Filters */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                                {SEARCH_TYPES.map(t => {
                                    const isActive = type === t.value;
                                    return (
                                        <Link
                                            key={t.value}
                                            href={`/wyszukiwarka?q=${encodeURIComponent(query)}&type=${t.value}`}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                                isActive
                                                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            )}
                                        >
                                            {t.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Szukaj
                        </button>
                    </form>
                </div>

                {/* Results */}
                {query.length >= 2 ? (
                    <div>
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Znaleziono <span className="font-semibold text-gray-900 dark:text-white">{results.length}</span> wyników
                            {type !== "all" && ` w kategorii "${SEARCH_TYPES.find(t => t.value === type)?.label}"`}
                            {query && ` dla "${query}"`}
                        </div>

                        {results.length > 0 ? (
                            <div className="space-y-4">
                                {results.map(result => (
                                    <Link
                                        key={`${result.type}-${result.id}`}
                                        href={result.url}
                                        className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {result.type === "news" && <Newspaper className="h-5 w-5" />}
                                                {result.type === "project" && <FileText className="h-5 w-5" />}
                                                {result.type === "event" && <Calendar className="h-5 w-5" />}
                                                {result.type === "page" && <Layout className="h-5 w-5" />}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                {/* Type Badge */}
                                                <div className="mb-2">
                                                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                        {result.type === "news" && "Aktualność"}
                                                        {result.type === "project" && "Projekt"}
                                                        {result.type === "event" && "Wydarzenie"}
                                                        {result.type === "page" && "Strona"}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {result.title}
                                                </h3>

                                                {/* Description */}
                                                {result.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                                        {result.description}
                                                    </p>
                                                )}

                                                {/* Meta */}
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                                    {result.date && (
                                                        <span>
                                                            {new Date(result.date).toLocaleDateString("pl-PL", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric"
                                                            })}
                                                        </span>
                                                    )}
                                                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline">
                                                        Czytaj więcej →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                                <Search className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Brak wyników
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Nie znaleziono wyników dla &quot;{query}&quot;
                                    {type !== "all" && ` w kategorii "${SEARCH_TYPES.find(t => t.value === type)?.label}"`}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    Spróbuj użyć innych słów kluczowych lub zmień kategorię
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                        <Search className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Rozpocznij wyszukiwanie
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Wpisz co najmniej 2 znaki, aby wyszukać treści
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
