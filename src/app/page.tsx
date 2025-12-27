import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Rocket } from "lucide-react";
import dynamic from "next/dynamic";
import { PartnersSection } from "@/components/sections/PartnersSection";

const HomeHeroCarousel = dynamic(() => import("@/components/HomeHeroCarousel").then(mod => mod.HomeHeroCarousel));
const ImpactCounter = dynamic(() => import("@/components/ImpactCounter").then(mod => mod.ImpactCounter));
const ActionCenter = dynamic(() => import("@/components/ActionCenter").then(mod => mod.ActionCenter));

export default async function Home() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
  const slides = await prisma.homeHeroSlide.findMany({ orderBy: { order: "asc" } });
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });

  const featuredProjects = await prisma.project.findMany({
    where: { isHighlight: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const latestNews = await prisma.news.findMany({
    where: { isHighlight: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const showHero = config?.showHero ?? true;
  const showNews = config?.showNews ?? true;
  const showProjects = config?.showProjects ?? true;
  const showPartners = config?.showPartners ?? true;
  const showStats = config?.showStats ?? true;
  const showActionCenter = config?.showActionCenter ?? true;
  const showUpcomingEvents = config?.showUpcomingEvents ?? true;

  const upcomingEvents = showUpcomingEvents ? await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    take: 3,
    orderBy: { date: "asc" },
  }) : [];

  const homepageOrder = (config?.homepageOrder || "hero,stats,action,news,events,projects,partners").split(",");

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "hero":
        return showHero && (
          <div key="hero" className="animate-in fade-in duration-1000">
            {slides.length > 0 ? (
              <HomeHeroCarousel slides={slides} config={config} />
            ) : (
              <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                  <Rocket size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                  <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg">
                    Witaj w RiseGen
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 drop-shadow-xl">
                    Twoja przestrzeń <br />
                    <span className="text-indigo-200">do działania</span>
                  </h1>
                  <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 drop-shadow-md">
                    Budujemy społeczność młodych ludzi z regionu, łącząc pokolenia, wspierając rozwój i realizując ambitne projekty.
                  </p>
                  <div className="pt-4 animate-in fade-in zoom-in-95 duration-1000 delay-300">
                    <Link
                      href="/zgloszenia"
                      className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition shadow-lg inline-flex items-center gap-2"
                    >
                      Dołącz do nas <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </div>
        );
      case "stats":
        return showStats && <ImpactCounter key="stats" stats={stats} />;
      case "action":
        return showActionCenter && <ActionCenter key="action" />;
      case "news":
        return showNews && (
          <section key="news" className="container mx-auto px-4 max-w-6xl py-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Aktualności</h2>
                <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-400">Bądź na bieżąco z życiem naszego stowarzyszenia.</p>
              </div>

              {latestNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {latestNews.map((news) => {
                    let imageUrl = null;
                    try {
                      const images = JSON.parse(news.images);
                      if (Array.isArray(images) && images.length > 0) {
                        imageUrl = images[0];
                      }
                    } catch { /* ignore parse errors */ }

                    return (
                      <div key={news.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full transform hover:-translate-y-1">
                        <div className="h-56 bg-gray-200 dark:bg-gray-800 w-full relative">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={news.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">Brak zdjęcia</div>
                          )}
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-3 bg-indigo-50 dark:bg-indigo-900/30 inline-block px-3 py-1 rounded-full w-fit">
                            {new Date(news.createdAt).toLocaleDateString("pl-PL")}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{news.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-grow text-sm leading-relaxed">
                            {news.content.replace(/<[^>]*>?/gm, '').replace(/[*_~#\[\]`>]/g, '').substring(0, 150)}...
                          </p>
                          <Link href={`/aktualnosci/${news.slug}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 mt-auto inline-flex items-center group/link transition-colors">
                            Czytaj więcej <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">Brak aktualności. Wkrótce coś dodamy!</p>
                </div>
              )}
            </div>
          </section>
        );
      case "events":
        return showUpcomingEvents && (
          <section key="events" className="container mx-auto px-4 max-w-6xl py-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nadchodzące Wydarzenia</h2>
                <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-400">Dołącz do nas i weź udział w naszych inicjatywach.</p>
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-800 flex flex-col group relative overflow-hidden">
                      {/* Date Badge */}
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-2 rounded-bl-2xl font-bold text-sm shadow-sm z-10">
                        {new Date(event.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}
                      </div>

                      <div className="mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                          {event.location || "Online / Lokalne"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        <Link href={`/wydarzenia`} className="hover:underline decoration-indigo-500/30 underline-offset-4">
                          {event.title}
                        </Link>
                      </h3>

                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {event.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          ⏰ {new Date(event.date).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <Link href="/wydarzenia" className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline flex items-center">
                          Szczegóły <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">Brak nadchodzących wydarzeń w kalendarzu. Sprawdź później!</p>
                </div>
              )}

              {upcomingEvents.length > 0 && (
                <div className="text-center pt-4">
                  <Link href="/wydarzenia" className="inline-flex items-center justify-center px-6 py-3 border border-indigo-200 dark:border-indigo-800 text-base font-medium rounded-full text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                    Zobacz pełny kalendarz
                  </Link>
                </div>
              )}
            </div>
          </section>
        );
      case "projects":
        return showProjects && (
          <section key="projects" className="container mx-auto px-4 max-w-6xl py-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nasze Projekty</h2>
                <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-400">Działamy aktywnie, realizując inicjatywy ważne dla regionu.</p>
              </div>

              {featuredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredProjects.map((project) => {
                    let imageUrl = null;
                    try {
                      const images = JSON.parse(project.images);
                      if (Array.isArray(images) && images.length > 0) {
                        imageUrl = images[0];
                      }
                    } catch { /* ignore parse errors */ }

                    return (
                      <div key={project.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full transform hover:-translate-y-1">
                        <div className="h-56 bg-gray-200 dark:bg-gray-800 w-full relative">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium">Projekt RiseGen</div>
                          )}
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-grow leading-relaxed font-light">{project.description ? project.description.replace(/<[^>]*>?/gm, '').replace(/[*_~#\[\]`>]/g, '').substring(0, 150) + "..." : ''}</p>
                          <Link href={`/projekty/${project.slug}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 mt-auto inline-flex items-center group/link transition-colors">
                            Zobacz szczegóły <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">Na razie nie wyróżniliśmy żadnych projektów. Wkrótce się pojawią!</p>
                </div>
              )}
            </div>
          </section>
        );
      case "partners":
        return showPartners && <PartnersSection key="partners" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col pb-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      {homepageOrder.map((sectionId) => renderSection(sectionId.trim()))}
    </div>
  );
}
