
import { Metadata } from 'next';
import { prisma } from "@/lib/prisma";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: 'Dołącz do nas - Zgłoszenia | RiseGen',
    description: 'Chcesz dołączyć do zespołu RiseGen? Wypełnij formularz zgłoszeniowy i stań się częścią naszej społeczności.',
};

export default async function ApplicationPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Sparkles size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Rekrutacja
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Dołącz do <br />
                        <span className="text-indigo-200">RiseGen</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Szukamy ludzi z pasją, którzy chcą zmieniać otoczenie na lepsze. Wypełnij krótki formularz, a odezwiemy się do Ciebie.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-2xl -mt-10 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Formularz Zgłoszeniowy</h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Wypełnienie formularza zajmie Ci ok. 5 minut.
                        </p>
                    </div>

                    <ApplicationForm
                        recaptchaSiteKey={config?.recaptchaSiteKey}
                        recaptchaVersion={config?.recaptchaVersion}
                    />

                    <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
                        Masz pytania przed aplikacją? <a href="/kontakt" className="text-indigo-600 dark:text-indigo-400 hover:underline">Skontaktuj się z nami</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}
