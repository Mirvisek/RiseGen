
import { prisma } from "@/lib/prisma";
import { Mail, Phone, Accessibility } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Deklaracja Dostępności - RiseGen",
    description: "Deklaracja dostępności cyfrowej zgodnie z ustawą o dostępności cyfrowej stron internetowych i aplikacji mobilnych.",
};

export default async function DeklaracjaDostepnosciPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Accessibility size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Ważne informacje
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Deklaracja <br />
                        <span className="text-indigo-200">Dostępności</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Zobowiązujemy się zapewnić dostępność naszej strony internetowej zgodnie z obowiązującymi przepisami.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 max-w-4xl -mt-10 relative z-20">
                <div className="mb-6">
                    <Breadcrumbs items={[{ label: "Deklaracja Dostępności" }]} />
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <section className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 dark:prose-invert">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                            <strong>{config?.orgName || "Stowarzyszenie RiseGen"}</strong> zobowiązuje się
                            zapewnić dostępność swojej strony internetowej zgodnie z ustawą z dnia 4 kwietnia 2019 r.
                            o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">Data publikacji i aktualizacji</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Data publikacji strony internetowej:</strong> 2024</li>
                            <li><strong>Data ostatniej istotnej aktualizacji:</strong> {new Date().toLocaleDateString('pl-PL')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">Status zgodności z ustawą</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Strona internetowa jest <strong>częściowo zgodna</strong> z ustawą o dostępności cyfrowej
                            z powodu niezgodności lub wyłączeń wymienionych poniżej.
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Treści niedostępne</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Niektóre materiały wideo mogą nie posiadać napisów lub audiodeskrypcji</li>
                            <li>Dokumenty PDF publikowane przed wdrożeniem standardów dostępności</li>
                            <li>Niektóre treści osadzone z serwisów zewnętrznych (Facebook, Instagram)</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">Przygotowanie deklaracji dostępności</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Data sporządzenia deklaracji:</strong> {new Date().toLocaleDateString('pl-PL')}</li>
                            <li><strong>Metoda przygotowania deklaracji:</strong> Samoocena przeprowadzona przez podmiot publiczny.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">Informacje zwrotne i dane kontaktowe</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            W przypadku problemów z dostępnością strony internetowej prosimy o kontakt.
                            Osobą odpowiedzialną jest {config?.orgName || "Administrator strony"}.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 my-8 shadow-sm">
                            <div className="space-y-4">
                                {config?.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                            <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <a
                                            href={`mailto:${config.email}`}
                                            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
                                        >
                                            {config.email}
                                        </a>
                                    </div>
                                )}
                                {config?.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                            <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <a
                                            href={`tel:${config.phone.replace(/\s/g, '')}`}
                                            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
                                        >
                                            {config.phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Tą samą drogą można składać wnioski o udostępnienie informacji niedostępnej
                            oraz składać żądania zapewnienia dostępności.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">Procedura wnioskowo-skargowa</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Każdy ma prawo do wystąpienia z żądaniem zapewnienia dostępności cyfrowej strony internetowej,
                            aplikacji mobilnej lub jakiegoś ich elementu. Można także zażądać udostępnienia informacji
                            w formach alternatywnych.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">Dostępność architektoniczna</h2>
                        {config?.accessibilityInfo ? (
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-xl p-6">
                                <p className="text-indigo-900 dark:text-indigo-200 whitespace-pre-wrap leading-relaxed">
                                    {config.accessibilityInfo}
                                </p>
                            </div>
                        ) : config?.orgAddress ? (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Siedziba organizacji znajduje się pod adresem: <strong>{config.orgAddress}</strong>.
                            </p>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                Informacje o dostępności architektonicznej siedziby zostaną udostępnione w najbliższym czasie.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
