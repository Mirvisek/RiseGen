"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram } from "lucide-react";
import { NewsletterForm } from "../NewsletterForm";

interface FooterProps {
    config?: {
        orgName?: string | null;
        orgAddress?: string | null;
        orgNip?: string | null;
        orgRegon?: string | null;
        orgBankAccount?: string | null;
        email?: string | null;
        phone?: string | null;
        facebookUrl?: string | null;
        instagramUrl?: string | null;
        tiktokUrl?: string | null;
        discordUrl?: string | null;
        footerDocuments?: string | null;
        enableNewsletter?: boolean;
    } | null;
}

function PhoneNumber({ phone }: { phone: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <span>{phone}</span>;
    }

    return (
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-indigo-600 transition">
            {phone}
        </a>
    );
}

export default function Footer({ config }: FooterProps) {
    const pathname = usePathname();

    // Hide footer on admin and auth pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
        return null;
    }

    return (
        <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Newsletter Section - Moved to Top */}
                {config?.enableNewsletter && (
                    <div className="border-b border-gray-200 dark:border-gray-800 mb-12 pb-12 flex justify-center">
                        <div className="w-full max-w-lg">
                            <NewsletterForm variant="footer" />
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">

                    {/* LEFT: Copyright */}
                    <div className="text-sm text-gray-500 dark:text-gray-400 order-3 md:order-1 whitespace-nowrap">
                        &copy; {new Date().getFullYear()} Stowarzyszenie RiseGen
                    </div>

                    {/* CENTER: Organization Details */}
                    {config && (
                        <div className="flex flex-col items-center text-center text-xs text-gray-500 dark:text-gray-400 space-y-1 order-1 md:order-2">
                            {config.orgName && <p className="font-semibold text-gray-900 dark:text-gray-100">{config.orgName}</p>}

                            <div className="flex flex-col items-center gap-1">
                                {config.orgAddress && <span>{config.orgAddress}</span>}
                                {config.orgNip && <span>NIP: {config.orgNip}</span>}
                                {config.orgRegon && <span>REGON: {config.orgRegon}</span>}
                            </div>

                            <div className="flex flex-col items-center gap-1 pt-1">
                                {config.email && <a href={`mailto:${config.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{config.email}</a>}
                                {config.phone && (
                                    <PhoneNumber phone={config.phone} />
                                )}
                            </div>

                            {config.orgBankAccount && (
                                <div className="text-gray-500 dark:text-gray-400 font-medium pt-1">
                                    Numer konta: {config.orgBankAccount}
                                </div>
                            )}
                        </div>
                    )}

                    {/* RIGHT: Social Media */}
                    <div className="flex gap-4 order-2 md:order-3">
                        {config?.facebookUrl && (
                            <Link href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                        )}
                        {config?.instagramUrl && (
                            <Link href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                        )}
                        {config?.tiktokUrl && (
                            <Link href={config.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                                <span className="sr-only">TikTok</span>
                            </Link>
                        )}
                        {config?.discordUrl && (
                            <Link href={config.discordUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                                <span className="sr-only">Discord</span>
                            </Link>
                        )}
                    </div>

                </div>

                {/* BOTTOM: Footer Documents */}
                <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-8 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">

                    {/* Important Actions */}
                    <Link
                        href="/wesprzyj-nas"
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded"
                    >
                        Wesprzyj nas
                    </Link>
                    <Link
                        href="/zgloszenia"
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4 font-medium"
                    >
                        Dołącz do nas
                    </Link>

                    <span className="text-gray-300 dark:text-gray-700">|</span>

                    {/* Always show Accessibility Declaration */}
                    <Link
                        href="/deklaracja-dostepnosci"
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4"
                    >
                        Deklaracja Dostępności
                    </Link>

                    {/* Always show Privacy Policy */}
                    <Link
                        href="/polityka-prywatnosci"
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4"
                    >
                        Polityka Prywatności
                    </Link>

                    {/* Always show Cookie Policy */}
                    <Link
                        href="/polityka-cookies"
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4"
                    >
                        Polityka Cookies
                    </Link>

                    {/* Additional documents from config */}
                    {config?.footerDocuments && (() => {
                        try {
                            const docs = JSON.parse(config.footerDocuments);
                            return Array.isArray(docs) ? docs.map((doc: any, i: number) => (
                                <a
                                    key={i}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4"
                                >
                                    {doc.name}
                                </a>
                            )) : null;
                        } catch (e) {
                            return null;
                        }
                    })()}
                </div>
            </div>
        </footer>
    );
}
