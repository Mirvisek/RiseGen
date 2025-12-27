"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generateCSV, downloadCSV, formatDateForExport } from "@/lib/export";
import type { Subscriber } from "@prisma/client";

interface ExportSubscribersButtonProps {
    subscribers: Subscriber[];
}

export function ExportSubscribersButton({ subscribers }: ExportSubscribersButtonProps) {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);

        try {
            const csvData = generateCSV(subscribers, [
                { key: "email", label: "Email" },
                { key: "name", label: "Imię" },
                {
                    key: "isActive",
                    label: "Aktywny",
                    formatter: (val) => val ? "Tak" : "Nie"
                },
                {
                    key: "dripStep",
                    label: "Etap kampanii",
                    formatter: (val) => {
                        const step = val as number;
                        if (step === 0) return "Powitanie";
                        if (step === 1) return "Dzień 2";
                        if (step === 2) return "Dzień 5";
                        return "Zakończone";
                    }
                },
                {
                    key: "createdAt",
                    label: "Data zapisu",
                    formatter: (val) => formatDateForExport(val as Date)
                },
            ]);

            const filename = `newsletter_${new Date().toISOString().split('T')[0]}.csv`;
            downloadCSV(filename, csvData);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Wystąpił błąd podczas eksportu danych");
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={exporting || subscribers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {exporting ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Eksportowanie...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4" />
                    Eksportuj do CSV ({subscribers.length})
                </>
            )}
        </button>
    );
}
