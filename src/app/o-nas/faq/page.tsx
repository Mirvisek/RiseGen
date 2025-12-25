
import { prisma } from "@/lib/prisma";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HelpCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ - Pytania i Odpowiedzi | RiseGen",
    description: "Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące działalności Stowarzyszenia RiseGen.",
};

export default async function faqPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <HelpCircle size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Baza Wiedzy
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Często zadawane <br />
                        <span className="text-indigo-200">pytania</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Tutaj znajdziesz odpowiedzi na najczęściej zadawane pytania dotyczące naszej organizacji, projektów i możliwości zaangażowania się.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-4xl -mt-10 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <FaqAccordion faqs={faqs} />

                    <div className="text-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400">
                            Nie znalazłeś odpowiedzi? <a href="/kontakt" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Napisz do nas.</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
