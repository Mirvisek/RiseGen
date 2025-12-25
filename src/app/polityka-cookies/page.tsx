
import { prisma } from "@/lib/prisma";
import { Mail, Phone, Cookie } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Polityka Cookies - RiseGen",
    description: "Informacje o wykorzystaniu plików cookies.",
};

export default async function PolitykaCookiesPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    const defaultContent = `
# Polityka Cookies

## 1. Czym są pliki cookies?

Pliki cookies (ciasteczka) to małe pliki tekstowe zapisywane na Twoim urządzeniu (komputerze, tablecie, smartfonie) podczas odwiedzania stron internetowych. Cookies pozwalają stronie rozpoznać Twoje urządzenie przy kolejnych wizytach.

## 2. Jakie cookies używamy?

Na naszej stronie wykorzystujemy następujące rodzaje plików cookies:

### Cookies niezbędne (sesyjne)
- **Cel**: Zapewnienie prawidłowego działania strony internetowej
- **Typ**: Sesyjne (usuwane po zamknięciu przeglądarki)
- **Przykłady**: Przechowywanie sesji logowania w panelu administracyjnym

### Cookies funkcjonalne
- **Cel**: Zapamiętywanie Twoich preferencji i ustawień
- **Typ**: Trwałe (przechowywane przez określony czas)
- **Przykłady**: Ustawienia językowe, preferencje wyświetlania

${config?.googleAnalyticsId ? `
### Cookies analityczne (Google Analytics)
- **Cel**: Analiza ruchu na stronie i statystyki odwiedzin
- **Typ**: Trwałe
- **Dostawca**: Google Analytics
- **Identyfikator**: ${config.googleAnalyticsId}
- **Funkcje**: 
  - Zliczanie liczby odwiedzin
  - Źródła ruchu
  - Analiza zachowań użytkowników
  - Dane demograficzne (jeśli włączone)
` : ''}

## 3. Podstawa prawna

Stosowanie plików cookies odbywa się na podstawie:
- Zgody użytkownika (art. 6 ust. 1 lit. a RODO)
- Uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO)
- Realizacji umowy (art. 6 ust. 1 lit. b RODO)

## 4. Jak zarządzać cookies?

Możesz w każdej chwili zmienić ustawienia dotyczące plików cookies w swojej przeglądarce:

### Google Chrome
1. Kliknij ikonę menu (trzy kropki) → Ustawienia
2. Prywatność i bezpieczeństwo → Pliki cookie i inne dane witryn
3. Wybierz odpowiednią opcję

### Mozilla Firefox
1. Kliknij menu (trzy linie) → Ustawienia
2. Prywatność i bezpieczeństwo
3. Ciasteczka i dane stron

### Safari
1. Preferencje → Prywatność
2. Zarządzaj danami witryn

### Microsoft Edge
1. Ustawienia → Pliki cookie i uprawnienia witryny
2. Zarządzaj i usuń pliki cookie

## 5. Konsekwencje wyłączenia cookies

Wyłączenie plików cookies może wpłynąć na funkcjonalność strony:
- Niemożność zalogowania się do panelu administracyjnego
- Brak zapamiętywania preferencji użytkownika
- Ograniczona funkcjonalność niektórych elementów strony

## 6. Cookies osób trzecich

Nasza strona może wykorzystywać cookies osób trzecich:
${config?.googleAnalyticsId ? '- **Google Analytics** - analiza ruchu i statystyki' : ''}
${config?.facebookUrl ? '- **Facebook** - wtyczki społecznościowe' : ''}
${config?.instagramUrl ? '- **Instagram** - osadzone treści' : ''}

Cookies osób trzecich są zarządzane przez odpowiednich dostawców zgodnie z ich politykami prywatności.

## 7. Aktualizacja polityki cookies

Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Cookies. Zmiany wchodzą w życie z chwilą opublikowania na stronie.

## 8. Kontakt

W sprawach dotyczących polityki cookies prosimy o kontakt:
${config?.email ? `**Email**: ${config.email}` : ""}
${config?.phone ? `**Telefon**: ${config.phone}` : ""}

---

**Data ostatniej aktualizacji**: ${new Date().toLocaleDateString('pl-PL')}
`;

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Cookie size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Cookies
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Polityka <br />
                        <span className="text-indigo-200">Plików Cookies</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Dowiedz się jak i dlaczego wykorzystujemy pliki cookies na naszej stronie.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 max-w-4xl -mt-10 relative z-20">
                <div className="mb-6">
                    <Breadcrumbs items={[{ label: "Polityka Cookies" }]} />
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
                            {config?.cookiePolicyContent || defaultContent}
                        </ReactMarkdown>
                    </section>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/50 mt-8">
                        <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                            Zarządzanie preferencjami
                        </h3>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-3 leading-relaxed">
                            Możesz w każdej chwili zmienić swoje preferencje dotyczące plików cookies w ustawieniach przeglądarki.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
