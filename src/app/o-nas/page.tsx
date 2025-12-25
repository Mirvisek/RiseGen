
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import { Users, Target, Globe } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "O Nas - Historia i Misja | RiseGen",
    description: "Poznaj nasze stowarzyszenie. Dowiedz się, skąd się wzięliśmy, jaka jest nasza misja i jakie cele nam przyświecają.",
};

export default async function AboutPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

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
                        Poznaj naszą <br />
                        <span className="text-indigo-200">misję i cele</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Jesteśmy grupą pasjonatów, którzy wierzą w siłę lokalnej społeczności. Zobacz, co nas napędza.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-4xl -mt-10 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="prose prose-lg mx-auto text-gray-600 dark:text-gray-400 dark:prose-invert">
                        {config?.aboutUsText ? (
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b pb-4 border-gray-100 dark:border-gray-800" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 marker:text-indigo-500" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 marker:text-indigo-500" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 py-2 pr-2 rounded-r" {...props} />
                                }}
                            >
                                {config.aboutUsText}
                            </ReactMarkdown>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-indigo-500" />
                                    Kim jesteśmy?
                                </h3>
                                <p>
                                    Stowarzyszenie <strong>RiseGen</strong> to inicjatywa zrodzona z potrzeby działania.
                                    Jesteśmy grupą młodych, ambitnych ludzi, którym zależy na rozwoju naszego regionu.
                                    Wierzymy, że poprzez współpracę i zaangażowanie możemy realnie wpływać na otaczającą nas rzeczywistość.
                                </p>
                                <p>
                                    Naszą misją jest łączenie pokoleń. Chcemy, aby młodzi ludzie czerpali wiedzę i inspirację
                                    od doświadczonych członków społeczności, jednocześnie wnosząc swoją energię,
                                    nowoczesne spojrzenie i znajomość nowych technologii.
                                </p>
                            </>
                        )}

                        <div className="my-12 border-t border-gray-100 dark:border-gray-800"></div>

                        <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6 flex items-center gap-2">
                            <Target className="w-6 h-6 text-indigo-500" />
                            Nasze Cele
                        </h3>
                        {config?.aboutUsGoals ? (
                            <ReactMarkdown
                                components={{
                                    ul: ({ node, ...props }) => <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
                                    li: ({ node, ...props }) => (
                                        <li className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-sm font-medium flex items-start gap-2" {...props}>
                                            <span className="w-2 h-2 mt-1.5 bg-indigo-500 rounded-full shrink-0"></span>
                                            {props.children}
                                        </li>
                                    ),
                                    p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                                }}
                            >
                                {config.aboutUsGoals}
                            </ReactMarkdown>
                        ) : (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                                <li className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                    Integracja społeczności lokalnej
                                </li>
                                <li className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                    Wspieranie rozwoju młodzieży
                                </li>
                                <li className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                    Współpraca międzypokoleniowa
                                </li>
                                <li className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                    Organizacja wydarzeń kulturalnych
                                </li>
                            </ul>
                        )}

                        <div className="my-12 border-t border-gray-100 dark:border-gray-800"></div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                            <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mt-0 mb-4">Dołącz do nas</h3>
                            {config?.aboutUsJoinText ? (
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-2 text-sm text-indigo-800 dark:text-indigo-200" {...props} />,
                                    }}
                                >
                                    {config.aboutUsJoinText}
                                </ReactMarkdown>
                            ) : (
                                <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-0">
                                    Jesteśmy otwarci na każdego, kto chce działać. Jeśli masz pomysł na projekt, chcesz pomóc w organizacji wydarzeń, lub po prostu poznać ciekawych ludzi – RiseGen jest miejscem dla Ciebie.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
