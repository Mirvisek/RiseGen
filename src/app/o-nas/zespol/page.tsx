
import { prisma } from "@/lib/prisma";
import { TeamList } from "@/components/TeamList";
import { Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Zespół | RiseGen",
    description: "Poznaj ludzi tworzących RiseGen. Zarząd, koordynatorzy i współpracownicy.",
};

export default async function TeamPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
    const members = await prisma.teamMember.findMany({
        orderBy: [
            { order: "asc" },
        ],
    });

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Users size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        O Nas
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Nasz <br />
                        <span className="text-indigo-200">Zespół</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Ludzie z pasją, którzy każdego dnia pracują na rzecz rozwoju regionu. Poznaj osoby stojące za naszymi działaniami.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-7xl -mt-10 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Struktura Organizacji</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Działamy dzięki zaangażowaniu wielu osób. Oto struktura naszego stowarzyszenia.
                        </p>
                    </div>

                    <TeamList
                        members={members}
                        showBoard={config?.showBoard ?? true}
                        showOffice={config?.showOffice ?? true}
                        showCoordinators={config?.showCoordinators ?? true}
                        showCollaborators={config?.showCollaborators ?? true}
                    />
                </div>
            </div>
        </div>
    );
}
