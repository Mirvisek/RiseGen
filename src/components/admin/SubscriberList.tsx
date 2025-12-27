"use client";

import { deleteSubscriber } from "@/app/admin/newsletter/actions";
import { ExportSubscribersButton } from "./ExportSubscribersButton";
import { Trash2, UserCheck, Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    dripStep: number;
}

export function SubscriberList({ subscribers }: { subscribers: Subscriber[] }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (email: string) => {
        if (!confirm("Czy na pewno chcesz usunąć tego subskrybenta?")) return;

        setDeletingId(email);
        const res = await deleteSubscriber(email);
        setDeletingId(null);

        if (res.success) {
            toast.success("Usunięto subskrybenta");
            // Optimistic update handled by revalidatePath in action, but we trigger router.refresh just in case
            router.refresh();
        } else {
            toast.error("Błąd usuwania");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Subskrybenci ({subscribers.length})
                </h2>
                <ExportSubscribersButton subscribers={subscribers} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Imię</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Data zapisu</th>
                                <th className="px-6 py-3 text-right">Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.length > 0 ? (
                                subscribers.map((sub) => (
                                    <tr key={sub.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {sub.name || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {sub.isActive ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    Aktywny
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                    Nieaktywny
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {new Date(sub.createdAt).toLocaleDateString("pl-PL")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub.email)}
                                                disabled={deletingId === sub.email}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition"
                                                title="Usuń"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        Brak subskrybentów
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
