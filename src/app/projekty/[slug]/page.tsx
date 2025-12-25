
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Rocket, Calendar } from "lucide-react";
import { ProjectGallery } from "@/components/ProjectGallery";
import { AttachmentsList } from "@/components/AttachmentsList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShareButtons } from "@/components/ShareButtons";
import ReactMarkdown from "react-markdown";

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const project = await prisma.project.findUnique({
        where: { slug: params.slug },
    });

    if (!project) notFound();

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Rocket size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <Link href="/projekty" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do listy
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        {project.title}
                    </h1>
                    <div className="flex justify-center items-center gap-2 text-indigo-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(project.createdAt).toLocaleDateString("pl-PL")}</span>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-4xl -mt-10 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="mb-8">
                        <Breadcrumbs
                            items={[
                                { label: "Projekty", href: "/projekty" },
                                { label: project.title }
                            ]}
                        />
                    </div>

                    {/* Images */}
                    {(() => {
                        let images: string[] = [];
                        try {
                            images = JSON.parse(project.images);
                        } catch (e) { }

                        return (
                            <div className="mb-10">
                                <ProjectGallery images={images} title={project.title} />
                            </div>
                        );
                    })()}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-300 dark:prose-invert">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                                a: ({ node, ...props }) => <a className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4" {...props} />,
                            }}
                        >
                            {project.content}
                        </ReactMarkdown>
                    </article>

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-8">
                        <AttachmentsList documents={project.documents} />
                        <ShareButtons title={project.title} />
                    </div>
                </div>
            </div>
        </div>
    );
}
