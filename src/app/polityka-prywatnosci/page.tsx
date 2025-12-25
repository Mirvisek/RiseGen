
import { prisma } from "@/lib/prisma";
import { Mail, Phone, Lock, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Polityka Prywatności - RiseGen",
    description: "Polityka prywatności i ochrony danych osobowych. Dowiedz się, jak przetwarzamy Twoje dane.",
};

export default async function PolitykaPrywatnosciPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    const defaultContent = `
# Polityka Prywatności

## 1. Informacje ogólne

Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem ze strony internetowej ${config?.orgName || "RiseGen"}.

## 2. Administrator danych

Administratorem danych osobowych zbieranych za pośrednictwem strony internetowej jest:

**${config?.orgName || "Stowarzyszenie RiseGen"}**
${config?.orgAddress ? `Adres: ${config.orgAddress}` : ""}
${config?.email ? `Email: ${config.email}` : ""}
${config?.phone ? `Telefon: ${config.phone}` : ""}

## 3. Rodzaje zbieranych danych

W związku z korzystaniem ze strony internetowej możemy zbierać następujące dane:
- Imię i nazwisko
- Adres e-mail
- Numer telefonu
- Treść wiadomości/zgłoszenia
- Dane techniczne (adres IP, przeglądarka, system operacyjny)

## 4. Cele przetwarzania danych

Dane osobowe są przetwarzane w następujących celach:
- Obsługa formularzy kontaktowych i zgłoszeniowych
- Komunikacja z użytkownikami
- Realizacja celów statutowych organizacji
- Prowadzenie statystyk odwiedzin strony

## 5. Podstawa prawna

Przetwarzanie danych osobowych odbywa się na podstawie:
- Zgody użytkownika (art. 6 ust. 1 lit. a RODO)
- Realizacji umowy lub działań przedumownych (art. 6 ust. 1 lit. b RODO)
- Uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO)

## 6. Okres przechowywania danych

Dane osobowe przechowywane są przez okres niezbędny do realizacji celów, dla których zostały zebrane, a następnie przez okres wymagany przepisami prawa.

## 7. Prawa użytkowników

Użytkownikom przysługują następujące prawa:
- Prawo dostępu do swoich danych
- Prawo do sprostowania danych
- Prawo do usunięcia danych
- Prawo do ograniczenia przetwarzania
- Prawo do przenoszenia danych
- Prawo do wniesienia sprzeciwu
- Prawo do cofnięcia zgody

## 8. Cookies

Strona wykorzystuje pliki cookies w celach:
- Zapewnienia prawidłowego działania strony
- Analizy ruchu i statystyk
- Dostosowania treści do preferencji użytkownika

Użytkownik może w każdej chwili zmienić ustawienia cookies w swojej przeglądarce.

## 9. Bezpieczeństwo danych

Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę przetwarzanych danych osobowych odpowiednią do zagrożeń oraz kategorii danych objętych ochroną.

## 10. Kontakt

W sprawach dotyczących przetwarzania danych osobowych prosimy o kontakt:
${config?.email ? `Email: ${config.email}` : ""}
${config?.phone ? `Telefon: ${config.phone}` : ""}

## 11. Zmiany polityki prywatności

Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności. Aktualna wersja Polityki jest zawsze dostępna na tej stronie.

**Data ostatniej aktualizacji: ${new Date().toLocaleDateString('pl-PL')}**
`;

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <ShieldCheck size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Ochrona Danych
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Polityka <br />
                        <span className="text-indigo-200">Prywatności</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Twoja prywatność jest dla nas priorytetem. Zobacz jak dbamy o Twoje dane.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 max-w-4xl -mt-10 relative z-20">
                <div className="mb-6">
                    <Breadcrumbs items={[{ label: "Polityka Prywatności" }]} />
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <section className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 dark:prose-invert">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b dark:border-gray-700 pb-2" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                            }}
                        >
                            {config?.privacyPolicyContent || defaultContent}
                        </ReactMarkdown>
                    </section>
                </div>
            </div>
        </div>
    );
}
