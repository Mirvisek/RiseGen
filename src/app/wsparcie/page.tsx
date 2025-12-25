
import { Metadata } from 'next';
import { prisma } from "@/lib/prisma";
import { Heart, CreditCard, Wallet, ArrowRight, Target, Users, Sparkles } from "lucide-react";
import CopyButton from "./CopyButton";
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Wsparcie - Wesprzyj nasze działania | RiseGen',
    description: 'Twoja pomoc ma znaczenie. Wesprzyj finansowo nasze stowarzyszenie i pomóż nam realizować ambitne projekty dla lokalnej społeczności.',
};

export default async function SupportPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    const bankAccount = config?.orgBankAccount || "00 0000 0000 0000 0000 0000 0000";
    const bankAccountFormatted = bankAccount.replace(/(.{4})/g, '$1 ').trim();
    const orgName = config?.orgName || "Stowarzyszenie RiseGen";
    const orgAddress = config?.orgAddress || "Adres Stowarzyszenia";

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Heart size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Wspieraj Rozwój
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Twoja pomoc <br />
                        <span className="text-indigo-200">zmienia rzeczywistość</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Dzięki Twojemu wsparciu możemy organizować warsztaty, wydarzenia i projekty, które rozwijają talenty i integrują społeczność. Każda wpłata ma znaczenie.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-6xl -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Donation Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-10 animate-in slide-in-from-left duration-700 delay-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                <Wallet size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dane do przelewu</h2>
                                <p className="text-gray-500 dark:text-gray-400">Przelew tradycyjny na konto bankowe</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Numer Rachunku</span>
                                    <CopyButton text={bankAccount.replace(/\s/g, '')} label="Kopiuj numer" />
                                </div>
                                <div className="font-mono text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 break-all">
                                    {bankAccount}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Odbiorca</span>
                                        <CopyButton text={orgName} />
                                    </div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {orgName}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 whitespace-pre-line">
                                        {orgAddress}
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Tytuł przelewu</span>
                                        <CopyButton text="Darowizna na cele statutowe" />
                                    </div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        Darowizna na cele statutowe
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Dziękujemy za każdą wpłatę! Jesteśmy organizacją non-profit.
                            </p>
                        </div>
                    </div>

                    {/* Info & Tax */}
                    <div className="space-y-8 lg:pl-10 lg:pt-8 animate-in slide-in-from-right duration-700 delay-500">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Na co przeznaczamy środki?</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1 w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-400">
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Organizacja wydarzeń</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                            Tworzymy spotkania, konferencje i warsztaty otwarte dla wszystkich, bezpłatnie lub za symboliczną opłatą.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Inwestycja w młodzież</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                            Finansujemy materiały edukacyjne, nagrody w konkursach i stypendia dla najzdolniejszych podopiecznych.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Rozwój społeczności</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                            Budujemy narzędzia i platformy, które pomagają ludziom się łączyć, wymieniać wiedzą i wspierać nawzajem.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* 1.5% Tax Section - Placeholder / Future feature */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                            <h3 className="text-xl font-bold mb-2 relative z-10">Przekaż 1.5% podatku</h3>
                            <p className="text-gray-300 text-sm mb-6 max-w-md relative z-10">
                                Podczas rozliczania PIT możesz przekazać 1.5% swojego podatku na rzecz naszej organizacji. To nic Cię nie kosztuje!
                            </p>

                            {/* Placeholder logic for KRS */}
                            {false ? (
                                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm inline-block border border-white/20">
                                    <p className="text-xs uppercase tracking-wider text-gray-300 mb-1">Numer KRS</p>
                                    <p className="text-2xl font-mono font-bold flex items-center gap-3">
                                        0000000000
                                        <CopyButton text="0000000000" label="" />
                                    </p>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-lg">
                                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                                    Opcja w trakcie konfiguracji
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <section className="container mx-auto px-4 pb-20 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Masz pytania dotyczące darowizn?</h3>
                <div className="flex justify-center gap-4">
                    <Link href="/kontakt" className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
                        Skontaktuj się z nami
                    </Link>
                </div>
            </section>
        </div>
    );
}
