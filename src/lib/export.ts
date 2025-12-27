/**
 * Export utilities for generating CSV/Excel files from database data
 */

export interface ExportColumn {
    key: string;
    label: string;
    formatter?: (value: unknown) => string;
}

/**
 * Convert data to CSV format
 */
export function generateCSV<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn[]
): string {
    if (!data || data.length === 0) {
        return "";
    }

    // CSV Header
    const headers = columns.map(col => `"${col.label}"`).join(",");

    // CSV Rows
    const rows = data.map(row => {
        return columns.map(col => {
            const value = row[col.key];
            const formattedValue = col.formatter ? col.formatter(value) : String(value ?? "");
            // Escape quotes and wrap in quotes
            const escaped = String(formattedValue).replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(",");
    });

    return [headers, ...rows].join("\n");
}

/**
 * Trigger browser download of CSV file
 */
export function downloadCSV(filename: string, csvContent: string): void {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

/**
 * Format Date for export
 */
export function formatDateForExport(date: Date | string | null | undefined): string {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Format Date only (no time)
 */
export function formatDateOnlyForExport(date: Date | string | null | undefined): string {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pl-PL");
}

/**
 * Clean HTML tags from content
 */
export function stripHTML(html: string | null | undefined): string {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
}
