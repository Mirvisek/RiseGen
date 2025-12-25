"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CopyButton({ text, label = "Skopiuj" }: { text: string, label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Skopiowano do schowka!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Nie udało się skopiować");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            title="Kliknij aby skopiować"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Skopiowano</span>
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}
