
import { prisma } from "@/lib/prisma";
import { EventsView } from "@/components/EventsView";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wydarzenia - Kalendarz spotkań | RiseGen",
    description: "Sprawdź nadchodzące wydarzenia i spotkania organizowane przez Stowarzyszenie RiseGen.",
};

export default async function EventsPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    // If events are disabled globally
    if (config?.showEvents === false) {
        notFound();
    }

    const events = await prisma.event.findMany({
        orderBy: { date: 'desc' }
    });

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <CalendarDays size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Kalendarz
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Spotkajmy się <br />
                        <span className="text-indigo-200">na żywo</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Sprawdź co planujemy. Warsztaty, spotkania otwarte i akcje społeczne w Twojej okolicy.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-7xl -mt-10 relative z-20">
                <EventsView events={events as any} googleCalendarId={config?.googleCalendarId} />
            </div>
        </div>
    );
}
