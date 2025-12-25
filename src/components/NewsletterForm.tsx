"use client";

import { useState } from "react";
import { Loader2, Mail, CheckCircle, Zap, BookOpen, Users } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
    variant?: "footer" | "standalone";
}

export function NewsletterForm({ variant = "footer" }: NewsletterFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === "Newsletter disabled") {
                    toast.info("Zapisy na newsletter są obecnie wyłączone.");
                    return;
                }
                throw new Error(data.error || "Wystąpił błąd");
            }

            setSuccess(true);
            toast.success("Dziękujemy za zapisanie się do newslettera!");
            setName("");
            setEmail("");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={cn(
                "rounded-xl border p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300",
                variant === "footer"
                    ? "bg-white/5 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 backdrop-blur-sm"
                    : "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
            )}>
                <div className={cn(
                    "p-4 rounded-full shadow-lg mb-2",
                    variant === "footer" ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300" : "bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400"
                )}>
                    <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="font-bold text-2xl tracking-tight">Jesteś na liście! 🚀</h3>
                    <p className="text-sm opacity-80 mt-2 max-w-[250px] mx-auto leading-relaxed">
                        Sprawdź swoją skrzynkę mailową. Czeka tam na Ciebie małe powitanie.
                    </p>
                </div>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-xs font-medium underline underline-offset-4 hover:opacity-80 mt-4 transition-opacity"
                >
                    Zapisz inny adres
                </button>
            </div>
        );
    }

    return (
        <div className={cn(
            "transition-all duration-300",
            variant === "footer" ? "" : "rounded-3xl p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl"
        )}>
            {/* Header / Value Prop Section */}
            <div className={cn("mb-6", variant === "footer" ? "text-left" : "text-center")}>
                {variant === "footer" ? (
                    <>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-900 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
                            Chcesz być na bieżąco?
                        </h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                <span className={cn(
                                    "p-1.5 rounded-lg shrink-0 mt-0.5",
                                    "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                )}>
                                    <Zap className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-sm leading-tight">Pierwszeństwo zapisów na wydarzenia i warsztaty.</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                <span className={cn(
                                    "p-1.5 rounded-lg shrink-0 mt-0.5",
                                    "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                )}>
                                    <BookOpen className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-sm leading-tight">Dostęp do unikalnych raportów i podsumowań.</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                <span className={cn(
                                    "p-1.5 rounded-lg shrink-0 mt-0.5",
                                    "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                )}>
                                    <Users className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-sm leading-tight">Realny wpływ na kierunek rozwoju RiseGen.</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="inline-flex p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-4">
                            <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Dołącz do społeczności</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Zyskaj dostęp do zamkniętych materiałów i bądź pierwszą osobą, która dowie się o naszych nowych inicjatywach.
                        </p>
                    </>
                )}
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="relative group">
                {/* Decorative glow for footer - subtle in light mode, prominent in dark */}
                {variant === 'footer' && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
                )}

                <div className={cn(
                    "relative space-y-3",
                    variant === 'footer' ? "bg-white/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm" : ""
                )}>
                    <div>
                        <input
                            type="text"
                            placeholder="Twoje imię"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none",
                                variant === "footer"
                                    ? "bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            )}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Twój adres email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cn(
                                "w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none",
                                variant === "footer"
                                    ? "bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            )}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.98]",
                            variant === "footer"
                                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                                : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/20"
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Dołączanie...
                            </>
                        ) : (
                            <>
                                Dołączam! <span className="opacity-70 font-normal ml-1">🚀</span>
                            </>
                        )}
                    </button>
                    <p className={cn(
                        "text-[10px] text-center",
                        variant === "footer" ? "text-gray-500 dark:text-gray-400" : "text-gray-400"
                    )}>
                        Szanujemy Twoją prywatność. Żadnego spamu.
                        <br />
                        <Link href="/polityka-prywatnosci" className="underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Polityka Prywatności
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
