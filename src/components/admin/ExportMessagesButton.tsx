"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generateCSV, downloadCSV, formatDateForExport } from "@/lib/export";
import type { ContactMessage } from "@prisma/client";

interface ExportMessagesButtonProps {
    messages: ContactMessage[];
}

export function ExportMessagesButton({ messages }: ExportMessagesButtonProps) {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);

        try {
            const csvData = generateCSV(messages, [
                { key: "number", label: "Nr" },
                { key: "name", label: "Imię i nazwisko" },
                { key: "email", label: "Email" },
                { key: "subject", label: "Temat" },
                { key: "message", label: "Wiadomość" },
                { key: "status", label: "Status" },
                {
                    key: "createdAt",
                    label: "Data",
                    formatter: (val) => formatDateForExport(val as Date)
                },
            ]);

            const filename = `wiadomosci_${new Date().toISOString().split('T')[0]}.csv`;
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
            disabled={exporting || messages.length === 0}
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
                    Eksportuj do CSV ({messages.length})
                </>
            )}
        </button>
    );
}
