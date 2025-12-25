
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/ContactForm";
import { ContactMap } from "@/components/ContactMap";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kontakt - Skontaktuj się z nami | RiseGen",
    description: "Masz pytania? Skontaktuj się z nami telefonicznie, mailowo lub odwiedź naszą siedzibę.",
};

export default async function ContactPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <MessageCircle size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Kontakt
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Jesteśmy tu <br />
                        <span className="text-indigo-200">dla Ciebie</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Masz pytania dotyczące naszej działalności? Chcesz nawiązać współpracę? Napisz do nas lub zadzwoń.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-6xl -mt-10 relative z-20">

                {/* Top Section: Info & Map (Moved back to top but pushed down viamargin) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    {/* Contact Info Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-10 h-full">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                            <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <MapPin size={24} />
                            </span>
                            Dane kontaktowe
                        </h2>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                                    {config?.email ? (
                                        <a href={`mailto:${config.email}`} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition block break-all">
                                            {config.email}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Brak adresu email</span>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Telefon</h3>
                                    {config?.phone ? (
                                        <a href={`tel:${config.phone.replace(/\s/g, '')}`} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition block">
                                            {config.phone}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Brak telefonu</span>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Siedziba</h3>
                                    {config?.orgAddress ? (
                                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                                            {config.orgAddress}
                                        </p>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Brak adresu</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 lg:p-2 h-[500px] lg:h-auto overflow-hidden relative z-0">
                        {config?.contactMapUrl ? (
                            <ContactMap coords={config.contactMapUrl} pinUrl={config.contactMapPin} />
                        ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 text-gray-400 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center p-6">
                                <MapPin size={48} className="mb-4 opacity-50" />
                                <p className="font-medium">Mapa nie została skonfigurowana.</p>
                                <p className="text-sm mt-2">Dodaj współrzędne w panelu administratora.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Form Section (Below) */}
                <div className="mt-12 animate-in slide-in-from-bottom-8 duration-700 delay-500">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 max-w-4xl mx-auto">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                                <Send className="w-8 h-8 text-indigo-500" />
                                Formularz Kontaktowy
                            </h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                Masz inne pytania lub propozycje? Wypełnij poniższy formularz, a nasz zespół skontaktuje się z Tobą najszybciej jak to możliwe.
                            </p>
                        </div>

                        <ContactForm
                            recaptchaSiteKey={config?.recaptchaSiteKey}
                            recaptchaVersion={config?.recaptchaVersion}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
