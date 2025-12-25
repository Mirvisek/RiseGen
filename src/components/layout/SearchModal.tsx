"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Assuming standard shadcn Dialog
import { Search, Loader2, FileText, Calendar, Newspaper, ArrowRight, Layout } from "lucide-react";
import { searchContent, SearchResult } from "@/app/search-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

interface SearchModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function SearchModal({ open, setOpen }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await searchContent(debouncedQuery);
                setResults(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // Clear query when closed
    useEffect(() => {
        if (!open) {
            setQuery("");
            setResults([]);
        }
    }, [open]);

    // Handle navigation
    const handleSelect = (url: string) => {
        setOpen(false);
        router.push(url);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DialogTitle className="sr-only">Wyszukiwarka</DialogTitle>
                <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                    <Search className="mr-3 h-5 w-5 text-gray-400" />
                    <input
                        className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                        placeholder="Szukaj..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />}
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {results.length === 0 && query.length >= 2 && !loading && (
                        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            Nie znaleziono wyników dla "{query}".
                        </div>
                    )}

                    {results.length === 0 && query.length < 2 && (
                        <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                            Wpisz co najmniej 2 znaki, aby wyszukać.
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="space-y-1">
                            {results.map((result) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleSelect(result.url)}
                                    className="w-full flex items-start gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                >
                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        {result.type === "news" && <Newspaper className="h-4 w-4" />}
                                        {result.type === "project" && <FileText className="h-4 w-4" />}
                                        {result.type === "event" && <Calendar className="h-4 w-4" />}
                                        {result.type === "page" && <Layout className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                                            {result.title}
                                        </div>
                                        {result.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                                {result.description}
                                            </div>
                                        )}
                                    </div>
                                    <ArrowRight className="mt-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 text-xs text-center text-gray-400 dark:text-gray-500">
                    RiseGen Search
                </div>
            </DialogContent>
        </Dialog>
    );
}
