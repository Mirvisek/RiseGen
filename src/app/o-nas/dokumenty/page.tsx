
import { prisma } from "@/lib/prisma";
import { DocumentList } from "@/components/DocumentList";
import { FileText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dokumenty | RiseGen",
    description: "Przejrzystość to nasza podstawa. Znajdziesz tutaj nasze sprawozdania, statut i inne ważne dokumenty.",
};

export default async function DocumentsPage() {
    const documents = await prisma.document.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <FileText size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Transparentność
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Ważne <br />
                        <span className="text-indigo-200">Dokumenty</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Przejrzystość to nasza podstawa. Poniżej znajdziesz statut, regulaminy oraz sprawozdania z naszej działalności.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-4xl -mt-10 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pliki do pobrania</h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Kliknij w wybrany dokument, aby go pobrać lub otworzyć.
                        </p>
                    </div>

                    <DocumentList initialDocuments={documents} />
                </div>
            </div>
        </div>
    );
}
