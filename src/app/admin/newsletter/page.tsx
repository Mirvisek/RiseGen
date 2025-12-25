import { prisma } from "@/lib/prisma";
import { NewsletterSender } from "@/components/admin/NewsletterSender";
import { SubscriberList } from "@/components/admin/SubscriberList";

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
    const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: "desc" }
    });

    const activeCount = subscribers.filter(s => s.isActive).length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter</h1>
                    <p className="text-gray-500 dark:text-gray-400">Zarządzaj listą mailingową i wysyłaj wiadomości.</p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                    <span className="text-gray-500 dark:text-gray-400">Wszyscy: {subscribers.length}</span>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                    <span className="text-green-600 dark:text-green-400">Aktywni: {activeCount}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Send Newsletter Column */}
                <div>
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Nowa Wiadomość</h2>
                    <NewsletterSender />

                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 text-sm">Wskazówki</h3>
                        <ul className="text-sm text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
                            <li>Wiadomości są wysyłane do wszystkich <strong>aktywnych</strong> subskrybentów.</li>
                            <li>Używaj prostego formatowania, aby uniknąć problemów z wyświetlaniem w poczcie.</li>
                            <li>Link do wypisania się jest dodawany automatycznie na dole wiadomości.</li>
                        </ul>
                    </div>
                </div>

                {/* Subscribers List Column */}
                <div>
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Lista Subskrybentów</h2>
                    <SubscriberList subscribers={subscribers} />
                </div>
            </div>
        </div>
    );
}
