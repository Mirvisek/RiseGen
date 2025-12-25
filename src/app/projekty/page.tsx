
import { prisma } from "@/lib/prisma";
import { ProjectList } from "@/components/ProjectList";
import { Rocket } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projekty - Nasze realizacje | RiseGen",
    description: "Zobacz, co udało nam się zrealizować i nad czym obecnie pracujemy. Nasze projekty zmieniają rzeczywistość.",
};

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Rocket size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Nasze Działania
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Projekty, które <br />
                        <span className="text-indigo-200">zmieniają świat</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Zobacz nasze realizacje. Od małych inicjatyw lokalnych po duże projekty społeczne.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-6xl -mt-10 relative z-20">
                <ProjectList projects={projects} />
            </div>
        </div>
    );
}
