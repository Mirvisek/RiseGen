"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generateCSV, downloadCSV, formatDateForExport, formatDateOnlyForExport } from "@/lib/export";
import type { Application } from "@prisma/client";

interface ExportApplicationsButtonProps {
    applications: Application[];
}

export function ExportApplicationsButton({ applications }: ExportApplicationsButtonProps) {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);

        try {
            const csvData = generateCSV(applications, [
                { key: "number", label: "Nr" },
                { key: "firstName", label: "Imię" },
                { key: "lastName", label: "Nazwisko" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Telefon" },
                { key: "instagram", label: "Instagram" },
                { key: "type", label: "Typ zgłoszenia" },
                { key: "status", label: "Status" },
                {
                    key: "birthDate",
                    label: "Data urodzenia",
                    formatter: (val) => formatDateOnlyForExport(val as Date)
                },
                {
                    key: "createdAt",
                    label: "Data zgłoszenia",
                    formatter: (val) => formatDateForExport(val as Date)
                },
                { key: "description", label: "Opis/Motywacja" },
                { key: "assignedUserId", label: "Przypisany do" },
                { key: "deletionReason", label: "Przyczyna odrzucenia" },
            ]);

            const filename = `zgloszenia_${new Date().toISOString().split('T')[0]}.csv`;
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
            disabled={exporting || applications.length === 0}
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
                    Eksportuj do CSV ({applications.length})
                </>
            )}
        </button>
    );
}
