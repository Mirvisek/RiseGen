
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Newspaper, Calendar } from "lucide-react";
import { ProjectGallery } from "@/components/ProjectGallery";
import { AttachmentsList } from "@/components/AttachmentsList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShareButtons } from "@/components/ShareButtons";

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const news = await prisma.news.findUnique({
        where: { slug: params.slug },
    });

    if (!news) return { title: "Nie znaleziono" };
    return { title: `${news.title} - Aktualności` };
}

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const news = await prisma.news.findUnique({
        where: { slug: params.slug },
    });

    if (!news) notFound();

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Newspaper size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <Link href="/aktualnosci" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do aktualności
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        {news.title}
                    </h1>
                    <div className="flex justify-center items-center gap-2 text-indigo-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(news.createdAt).toLocaleDateString("pl-PL")}</span>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-4xl -mt-10 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="mb-8">
                        <Breadcrumbs
                            items={[
                                { label: "Aktualności", href: "/aktualnosci" },
                                { label: news.title }
                            ]}
                        />
                    </div>

                    {/* Images */}
                    {(() => {
                        let images: string[] = [];
                        try {
                            images = JSON.parse(news.images);
                        } catch (e) { }

                        return (
                            <div className="mb-10">
                                <ProjectGallery images={images} title={news.title} />
                            </div>
                        );
                    })()}

                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-300 dark:prose-invert">
                        <div dangerouslySetInnerHTML={{ __html: news.content }} />
                    </article>

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-8">
                        <AttachmentsList documents={news.documents} />
                        <ShareButtons title={news.title} />
                    </div>
                </div>
            </div>
        </div>
    );
}
