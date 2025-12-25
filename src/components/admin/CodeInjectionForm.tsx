"use client";

import { useActionState, useState, useEffect } from "react";
import { updateCodeInjection } from "@/app/admin/wyglad/actions";
import { verifyRecaptchaConfigAction } from "@/app/admin/wyglad/verify-recaptcha";
import { Loader2, Save, Code, CheckCircle, XCircle, ChevronRight, ExternalLink, ArrowLeft, Shield, BarChart3, HelpCircle, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";

interface Props {
    config: any;
}

type WizardStep =
    | "DASHBOARD"
    | "SELECT_SERVICE"
    | "RECAPTCHA_INTRO"
    | "RECAPTCHA_PROJECT"
    | "RECAPTCHA_API_ENABLE"
    | "RECAPTCHA_SITE_KEY"
    | "RECAPTCHA_API_KEY"
    | "RECAPTCHA_TEST"
    | "RECAPTCHA_REVIEW"
    | "GA4_INPUT";

export function CodeInjectionForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateCodeInjection, null);
    const router = useRouter();
    const [step, setStep] = useState<WizardStep>("DASHBOARD");

    // Local state for inputs to persist across steps before saving
    const [formData, setFormData] = useState({
        recaptchaVersion: config?.recaptchaVersion || "v3",
        recaptchaSiteKey: config?.recaptchaSiteKey || "",
        recaptchaSecretKey: config?.recaptchaSecretKey || "",
        recaptchaProjectId: config?.recaptchaProjectId || "risegen-1765937398889",
        googleAnalyticsId: config?.googleAnalyticsId || "",
    });

    // Test phase state
    const [isTestLoading, setIsTestLoading] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                router.refresh();
                setStep("DASHBOARD"); // Return to dashboard on success
            } else {
                toast.error(state.message);
            }
        }
    }, [state, router]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Reset test result on change
        if (field === "recaptchaSiteKey" || field === "recaptchaSecretKey" || field === "recaptchaProjectId") {
            setTestResult(null);
        }
    };

    const isRecaptchaConfigured = !!config?.recaptchaSiteKey && !!config?.recaptchaSecretKey && !!config?.recaptchaProjectId;
    const isGa4Configured = !!config?.googleAnalyticsId;

    // --- LOGIC: Dynamic Script Loading for Test ---
    const loadRecaptchaScript = (siteKey: string): Promise<boolean> => {
        return new Promise((resolve) => {
            // Remove existing if any
            const existing = document.getElementById("recaptcha-test-script");
            if (existing) existing.remove();
            // Remove badge if any
            const badge = document.querySelector('.grecaptcha-badge');
            if (badge) badge.remove();

            const script = document.createElement("script");
            script.id = "recaptcha-test-script";
            script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
            script.async = true;
            script.onload = () => {
                if (window.grecaptcha && window.grecaptcha.enterprise) {
                    window.grecaptcha.enterprise.ready(() => resolve(true));
                } else {
                    resolve(false);
                }
            };
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });
    };

    const runRecaptchaTest = async () => {
        setIsTestLoading(true);
        setTestResult(null);

        try {
            // 1. Load Script
            const scriptLoaded = await loadRecaptchaScript(formData.recaptchaSiteKey);
            if (!scriptLoaded) {
                setTestResult({ success: false, message: "Nie udało się załadować skryptu reCAPTCHA. Sprawdź Site Key." });
                setIsTestLoading(false);
                return;
            }

            // 2. Execute to get token
            const token = await window.grecaptcha.enterprise.execute(formData.recaptchaSiteKey, { action: 'config_test' });
            if (!token) {
                setTestResult({ success: false, message: "Nie udało się wygenerować tokenu (grecaptcha error)." });
                setIsTestLoading(false);
                return;
            }

            // 3. Verify on server
            const result = await verifyRecaptchaConfigAction(formData.recaptchaSiteKey, formData.recaptchaSecretKey, token, formData.recaptchaProjectId);
            setTestResult(result);

        } catch (error) {
            console.error(error);
            setTestResult({ success: false, message: "Wystąpił błąd techniczny podczas testu lub problem z kluczem." });
        } finally {
            setIsTestLoading(false);
        }
    };


    // --- RENDER HELPERS ---

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="border-b dark:border-gray-800 pb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Integracje i Kody
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* reCAPTCHA Status Card */}
                <div className={clsx(
                    "p-6 rounded-xl border transition-all",
                    isRecaptchaConfigured
                        ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30"
                        : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                )}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={clsx("p-2 rounded-lg", isRecaptchaConfigured ? "bg-green-100 text-green-600" : "bg-white text-gray-400")}>
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Google reCAPTCHA</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {isRecaptchaConfigured ? "Aktywna (Enterprise)" : "Nie skonfigurowano"}
                                </p>
                            </div>
                        </div>
                        {isRecaptchaConfigured ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-gray-400" />}
                    </div>
                </div>

                {/* GA4 Status Card */}
                <div className={clsx(
                    "p-6 rounded-xl border transition-all",
                    isGa4Configured
                        ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30"
                        : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                )}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={clsx("p-2 rounded-lg", isGa4Configured ? "bg-orange-100 text-orange-600" : "bg-white text-gray-400")}>
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Google Analytics 4</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {isGa4Configured ? "Aktywne" : "Nie skonfigurowano"}
                                </p>
                            </div>
                        </div>
                        {isGa4Configured ? <CheckCircle className="h-5 w-5 text-orange-500" /> : <XCircle className="h-5 w-5 text-gray-400" />}
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-center">
                <button
                    onClick={() => setStep("SELECT_SERVICE")}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/20 font-medium text-lg"
                >
                    <Code className="h-5 w-5" />
                    Konfiguruj Integracje
                </button>
            </div>
        </div>
    );

    const renderHeader = (title: string, subtitle?: string) => (
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            {subtitle && <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{subtitle}</p>}
        </div>
    );

    // --- WIZARD STEPS ---

    const WizardWrapper = ({ children, onBack }: { children: React.ReactNode, onBack?: () => void }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                    <button onClick={onBack || (() => setStep("DASHBOARD"))} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kreator Konfiguracji</span>
                    <div className="w-9" /> {/* Spacer */}
                </div>
                <div className="p-8 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );

    if (step === "DASHBOARD") return renderDashboard();

    if (step === "SELECT_SERVICE") return (
        <WizardWrapper>
            {renderHeader("Co chcesz skonfigurować?", "Wybierz usługę, którą chcesz dodać lub zaktualizować.")}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => setStep("RECAPTCHA_INTRO")}
                    className="p-6 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition group text-left"
                >
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                        <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Google reCAPTCHA</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Zabezpiecz formularze przed spamem. Pomożemy Ci utworzyć klucze Enterprise.</p>
                </button>

                <button
                    onClick={() => setStep("GA4_INPUT")}
                    className="p-6 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition group text-left"
                >
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Google Analytics</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Podłącz statystyki odwiedzin strony w kilka sekund.</p>
                </button>
            </div>
        </WizardWrapper>
    );

    // --- RECAPTCHA STEPS ---

    if (step === "RECAPTCHA_INTRO") return (
        <WizardWrapper onBack={() => setStep("SELECT_SERVICE")}>
            <div className="flex flex-col items-center text-center space-y-6">
                <Shield className="h-16 w-16 text-indigo-600 mb-2" />
                {renderHeader("Konfiguracja reCAPTCHA Enterprise", "Będziemy potrzebować dostępu do Google Cloud Console. To zajmie około 3 minuty.")}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 text-left w-full max-w-lg">
                    <p className="font-semibold mb-2 flex items-center gap-2"><HelpCircle className="h-4 w-4" /> Dlaczego Enterprise?</p>
                    <p>Wersja Enterprise działa w tle (niewidoczna dla użytkownika) i korzysta z zaawansowanej analizy ryzyka. Wymaga nieco innej konfiguracji niż stara wersja v2.</p>
                </div>

                <button
                    onClick={() => setStep("RECAPTCHA_PROJECT")}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 font-medium"
                >
                    Zaczynamy <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </WizardWrapper>
    );

    if (step === "RECAPTCHA_PROJECT") return (
        <WizardWrapper onBack={() => setStep("RECAPTCHA_INTRO")}>
            {renderHeader("Krok 1: Projekt Google Cloud", "Musisz posiadać projekt w chmurze Google.")}

            <div className="space-y-6 max-w-lg mx-auto">
                <ol className="list-decimal list-outside ml-5 space-y-4 text-gray-700 dark:text-gray-300">
                    <li>
                        Otwórz <a href="https://console.cloud.google.com/security/recaptcha" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium inline-flex items-center gap-1">
                            Google Cloud Console <ExternalLink className="h-3 w-3" />
                        </a> w nowej karcie.
                    </li>
                    <li>
                        Jeśli nie masz projektu, kliknij <strong>"Create Project"</strong> (Utwórz Projekt).
                    </li>
                    <li>
                        Skopiuj <strong>Project ID</strong> (nie nazwę!) ze szczegółów projektu.
                    </li>
                </ol>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Podaj Project ID
                    </label>
                    <input
                        type="text"
                        value={formData.recaptchaProjectId}
                        onChange={(e) => handleInputChange("recaptchaProjectId", e.target.value)}
                        placeholder="np. mojasuperstrona-123456"
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-white dark:bg-gray-800 font-mono text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        To ID jest wymagane do weryfikacji tokenów Enterprise.
                    </p>
                </div>

                <div className="pt-6 flex justify-center">
                    <button
                        disabled={!formData.recaptchaProjectId}
                        onClick={() => setStep("RECAPTCHA_API_ENABLE")}
                        className="bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        Dalej <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </WizardWrapper>
    );

    if (step === "RECAPTCHA_API_ENABLE") return (
        <WizardWrapper onBack={() => setStep("RECAPTCHA_PROJECT")}>
            {renderHeader("Krok 2: Włącz API", "Projekt musi mieć włączoną obsługę reCAPTCHA.")}

            <div className="space-y-6 max-w-lg mx-auto">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm text-center">
                    reCAPTCHA Enterprise API
                </div>

                <ol className="list-decimal list-outside ml-5 space-y-4 text-gray-700 dark:text-gray-300">
                    <li>
                        Na stronie reCAPTCHA w konsoli Google, powinna pojawić się opcja <strong>"Enable API"</strong> (Włącz API).
                    </li>
                    <li>
                        Kliknij ją i poczekaj chwilę, aż usługa zostanie aktywowana.
                    </li>
                    <li>
                        Jeśli widzisz już pulpit statystyk, API jest włączone.
                    </li>
                </ol>

                <div className="pt-6 flex justify-center">
                    <button
                        onClick={() => setStep("RECAPTCHA_SITE_KEY")}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        API jest włączone <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </WizardWrapper>
    );

    if (step === "RECAPTCHA_SITE_KEY") return (
        <WizardWrapper onBack={() => setStep("RECAPTCHA_API_ENABLE")}>
            {renderHeader("Krok 3: Utwórz Klucz Witryny (Site Key)", "Ten klucz będzie publiczny i widoczny w kodzie strony.")}

            <div className="space-y-6 max-w-lg mx-auto">
                <ol className="list-decimal list-outside ml-5 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li>Przejdź do zakładki <strong>Keys</strong> (Klucze) w panelu reCAPTCHA.</li>
                    <li>Kliknij <strong>Create Key</strong>.</li>
                    <li>Wpisz nazwę (np. "Strona Główna").</li>
                    <li>Wybierz typ: <strong>Score-based (V3)</strong> - <u>To bardzo ważne!</u></li>
                    <li>
                        W sekcji "Domains" dodaj swoje domeny (np. <code>twojadomena.pl</code> oraz <code>localhost</code> do testów).
                    </li>
                    <li>Kliknij <strong>Create</strong> i skopiuj wygenerowany ID klucza.</li>
                </ol>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Wklej tutaj Site Key
                    </label>
                    <input
                        type="text"
                        value={formData.recaptchaSiteKey}
                        onChange={(e) => handleInputChange("recaptchaSiteKey", e.target.value)}
                        placeholder="np. 6Lc..."
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-white dark:bg-gray-800 font-mono text-lg"
                    />
                </div>

                <div className="pt-4 flex justify-center">
                    <button
                        disabled={!formData.recaptchaSiteKey}
                        onClick={() => setStep("RECAPTCHA_API_KEY")}
                        className="bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        Dalej <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </WizardWrapper>
    );

    if (step === "RECAPTCHA_API_KEY") return (
        <WizardWrapper onBack={() => setStep("RECAPTCHA_SITE_KEY")}>
            {renderHeader("Krok 4: Utwórz Klucz API", "Tu najczęściej popełniany jest błąd. Potrzebujesz API Key, nie Legacy Secret.")}

            <div className="space-y-6 max-w-lg mx-auto">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-orange-800 dark:text-orange-300 text-sm border border-orange-100 dark:border-orange-800/30">
                    <strong>Uwaga:</strong> W wersji Enterprise nie używamy "reCAPTCHA Secret Key". Używamy ogólnego <strong>Google Cloud API Key</strong>.
                </div>

                <ol className="list-decimal list-outside ml-5 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li>W menu Google Cloud (lewy górny róg) wejdź w <strong>APIs & Services</strong> {'>'} <strong>Credentials</strong>.</li>
                    <li>Kliknij <strong>+ Create Credentials</strong> i wybierz <strong>API Key</strong>.</li>
                    <li>Skopiuj wygenerowany klucz (np. <code>AIza...</code>).</li>
                </ol>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Wklej tutaj API Key
                    </label>
                    <input
                        type="text"
                        value={formData.recaptchaSecretKey}
                        onChange={(e) => handleInputChange("recaptchaSecretKey", e.target.value)}
                        placeholder="np. AIzaSy..."
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-white dark:bg-gray-800 font-mono text-lg"
                    />
                </div>

                <div className="pt-4 flex justify-center">
                    <button
                        disabled={!formData.recaptchaSecretKey}
                        onClick={() => setStep("RECAPTCHA_TEST")}
                        className="bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        Przejdź do testu <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </WizardWrapper>
    );

    if (step === "RECAPTCHA_TEST") return (
        <WizardWrapper onBack={() => setStep("RECAPTCHA_API_KEY")}>
            {renderHeader("Test Konfiguracji", "Sprawdźmy, czy Twoje klucze działają poprawnie, zanim je zapiszemy.")}

            <div className="space-y-8 max-w-lg mx-auto bg-white dark:bg-gray-800/50 rounded-xl">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left text-sm text-blue-800 dark:text-blue-200">
                    Ten test spróbuje połączyć się z usługą reCAPTCHA, wygenerować próbny token i zweryfikować go na serwerze Google.
                </div>

                <div className="text-center">
                    {!testResult && !isTestLoading && (
                        <button
                            onClick={runRecaptchaTest}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 mx-auto font-medium"
                        >
                            <Activity className="h-5 w-5" />
                            Uruchom Test Połączenia
                        </button>
                    )}

                    {isTestLoading && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                            <p className="text-gray-500 animate-pulse">Weryfikowanie w Google...</p>
                        </div>
                    )}

                    {testResult && (
                        <div className={clsx("p-6 rounded-xl border mt-4 text-left animate-in fade-in zoom-in-95 duration-300",
                            testResult.success
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                        )}>
                            <div className="flex items-start gap-4">
                                {testResult.success
                                    ? <CheckCircle className="h-6 w-6 shrink-0 text-green-600" />
                                    : <XCircle className="h-6 w-6 shrink-0 text-red-600" />
                                }
                                <div>
                                    <h4 className="font-bold text-lg mb-1">{testResult.success ? "Sukces!" : "Błąd weryfikacji"}</h4>
                                    <p className="opacity-90">{testResult.message}</p>
                                    {!testResult.success && (
                                        <div className="mt-4">
                                            <p className="text-xs font-semibold uppercase opacity-70 mb-1">Możliwe przyczyny:</p>
                                            <ul className="list-disc list-inside text-sm space-y-1 opacity-80">
                                                <li>API Key jest niepoprawny (sprawdź kopiowanie).</li>
                                                <li>API "reCAPTCHA Enterprise API" nie jest włączone w Google Cloud.</li>
                                                <li>Projekt w Google Cloud jest inny niż podany <strong>{formData.recaptchaProjectId}</strong>.</li>
                                                <li>Site Key nie ma dodanej domeny (localhost).</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-4 border-t dark:border-gray-700">
                    <button
                        onClick={() => setStep("RECAPTCHA_API_KEY")}
                        className="text-gray-500 hover:text-gray-700 px-4 py-2"
                    >
                        Wróć do edycji
                    </button>

                    <button
                        disabled={!testResult?.success}
                        onClick={() => setStep("RECAPTCHA_REVIEW")}
                        className="bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition flex items-center gap-2"
                    >
                        Zatwierdź i Podsumuj <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </WizardWrapper>
    );

    if (step === "RECAPTCHA_REVIEW") return (
        <WizardWrapper onBack={() => setStep("RECAPTCHA_TEST")}>
            {renderHeader("Podsumowanie reCAPTCHA", "Sprawdź poprawność danych przed zapisaniem.")}

            <div className="space-y-6 max-w-lg mx-auto bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Project ID</span>
                    <code className="block bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-800 font-mono text-sm break-all">
                        {formData.recaptchaProjectId}
                    </code>
                </div>
                <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Site Key</span>
                    <code className="block bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-800 font-mono text-sm break-all">
                        {formData.recaptchaSiteKey}
                    </code>
                </div>
                <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">API Key (Secret)</span>
                    <code className="block bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-800 font-mono text-sm break-all">
                        {formData.recaptchaSecretKey}
                    </code>
                </div>
            </div>

            <form action={formAction} className="pt-8 flex justify-center">
                <input type="hidden" name="recaptchaVersion" value="v3" />
                <input type="hidden" name="recaptchaProjectId" value={formData.recaptchaProjectId} />
                <input type="hidden" name="recaptchaSiteKey" value={formData.recaptchaSiteKey} />
                <input type="hidden" name="recaptchaSecretKey" value={formData.recaptchaSecretKey} />
                <input type="hidden" name="googleAnalyticsId" value={formData.googleAnalyticsId} />

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-lg hover:shadow-green-500/20"
                >
                    {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                    Zapisz Konfigurację
                </button>
            </form>
        </WizardWrapper>
    );

    // --- GA4 STEPS ---

    if (step === "GA4_INPUT") return (
        <WizardWrapper onBack={() => setStep("SELECT_SERVICE")}>
            {renderHeader("Konfiguracja Google Analytics 4", "Wklej identyfikator pomiaru, aby śledzić ruch.")}

            <div className="space-y-6 max-w-lg mx-auto">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                    <p>Identyfikator znajdziesz w: <strong>Administracja</strong> {'>'} <strong>Strumienie danych</strong>.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Measurement ID (Identyfikator Pomiaru)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400 font-mono">G-</span>
                        <input
                            type="text"
                            value={formData.googleAnalyticsId.replace(/^G-/, '')}
                            onChange={(e) => handleInputChange("googleAnalyticsId", "G-" + e.target.value.replace(/^G-/, ''))}
                            placeholder="XXXXXXXXXX"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 pl-9 bg-white dark:bg-gray-800 font-mono text-lg"
                        />
                    </div>
                </div>

                <form action={formAction} className="pt-8 flex justify-center">
                    {/* Preserve existing reCAPTCHA settings when saving GA4 */}
                    <input type="hidden" name="recaptchaVersion" value={formData.recaptchaVersion} />
                    <input type="hidden" name="recaptchaProjectId" value={formData.recaptchaProjectId} />
                    <input type="hidden" name="recaptchaSiteKey" value={formData.recaptchaSiteKey} />
                    <input type="hidden" name="recaptchaSecretKey" value={formData.recaptchaSecretKey} />

                    <input type="hidden" name="googleAnalyticsId" value={formData.googleAnalyticsId} />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-lg hover:shadow-green-500/20"
                    >
                        {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                        Zapisz
                    </button>
                </form>
            </div>
        </WizardWrapper>
    );

    return null;
}
