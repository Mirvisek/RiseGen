"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, Loader2, FileText, Calendar, Newspaper, ArrowRight, Layout, Filter, Clock } from "lucide-react";
import { advancedSearch, AdvancedSearchResult, SearchType } from "@/app/advanced-search-actions";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";

interface AdvancedSearchModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SEARCH_TYPES: { value: SearchType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "all", label: "Wszystko", icon: Search },
    { value: "news", label: "Aktualności", icon: Newspaper },
    { value: "projects", label: "Projekty", icon: FileText },
    { value: "events", label: "Wydarzenia", icon: Calendar },
    { value: "pages", label: "Strony", icon: Layout },
];

const RECENT_SEARCHES_KEY = "risegen_recent_searches";
const MAX_RECENT = 5;

export function AdvancedSearchModal({ open, setOpen }: AdvancedSearchModalProps) {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const [results, setResults] = useState<AdvancedSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<SearchType>("all");
    const [showFilters, setShowFilters] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const router = useRouter();

    // Load recent searches
    useEffect(() => {
        if (open) {
            const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (stored) {
                try {
                    setRecentSearches(JSON.parse(stored));
                } catch { /* ignore */ }
            }
        }
    }, [open]);

    // Save to recent searches
    const saveRecentSearch = (searchQuery: string) => {
        if (!searchQuery || searchQuery.length < 2) return;

        const updated = [
            searchQuery,
            ...recentSearches.filter(q => q !== searchQuery)
        ].slice(0, MAX_RECENT);

        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await advancedSearch({
                    query: debouncedQuery,
                    type: selectedType,
                    limit: 15
                });
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery, selectedType]);

    // Clear state when closed
    useEffect(() => {
        if (!open) {
            setQuery("");
            setResults([]);
            setShowFilters(false);
        }
    }, [open]);

    // Handle navigation
    const handleSelect = (url: string) => {
        saveRecentSearch(query);
        setOpen(false);
        router.push(url);
    };

    // Handle recent search click
    const handleRecentClick = (searchQuery: string) => {
        setQuery(searchQuery);
    };

    // View all results
    const viewAllResults = () => {
        saveRecentSearch(query);
        setOpen(false);
        router.push(`/wyszukiwarka?q=${encodeURIComponent(query)}&type=${selectedType}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DialogTitle className="sr-only">Wyszukiwarka zaawansowana</DialogTitle>

                {/* Search Input */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center px-4 py-3">
                        <Search className="mr-3 h-5 w-5 text-gray-400" />
                        <input
                            className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                            placeholder="Szukaj aktualności, projektów, wydarzeń..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "ml-2 p-2 rounded-lg transition-colors",
                                showFilters
                                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                            )}
                            title="Filtry"
                        >
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Type Filters */}
                    {(showFilters || selectedType !== "all") && (
                        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
                            {SEARCH_TYPES.map(type => {
                                const Icon = type.icon;
                                const isActive = selectedType === type.value;

                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => setSelectedType(type.value)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
                                            isActive
                                                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {/* Recent Searches */}
                    {query.length < 2 && recentSearches.length > 0 && (
                        <div className="px-2 py-3">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Ostatnie wyszukiwania
                            </div>
                            <div className="space-y-1">
                                {recentSearches.map((recent, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleRecentClick(recent)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        <Search className="h-3.5 w-3.5 text-gray-400" />
                                        {recent}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {results.length === 0 && query.length >= 2 && !loading && (
                        <div className="py-12 text-center">
                            <Search className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Nie znaleziono wyników dla <span className="font-medium">&quot;{query}&quot;</span>
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Spróbuj użyć innych słów kluczowych
                            </div>
                        </div>
                    )}

                    {results.length === 0 && query.length < 2 && recentSearches.length === 0 && (
                        <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                            Wpisz co najmniej 2 znaki, aby wyszukać
                        </div>
                    )}

                    {/* Results List */}
                    {results.length > 0 && (
                        <div className="space-y-1">
                            {results.map((result) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleSelect(result.url)}
                                    className="w-full flex items-start gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                >
                                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {result.type === "news" && <Newspaper className="h-4 w-4" />}
                                        {result.type === "project" && <FileText className="h-4 w-4" />}
                                        {result.type === "event" && <Calendar className="h-4 w-4" />}
                                        {result.type === "page" && <Layout className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 overflow-hidden min-w-0">
                                        <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate transition-colors">
                                            {result.title}
                                        </div>
                                        {result.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                                                {result.description}
                                            </div>
                                        )}
                                        {result.date && (
                                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                {new Date(result.date).toLocaleDateString("pl-PL")}
                                            </div>
                                        )}
                                    </div>
                                    <ArrowRight className="mt-2.5 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 flex items-center justify-between">
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                        {results.length > 0 && (
                            <span>Znaleziono {results.length} wyników</span>
                        )}
                    </div>
                    {results.length > 0 && query.length >= 2 && (
                        <button
                            onClick={viewAllResults}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                        >
                            Zobacz wszystkie wyniki →
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
