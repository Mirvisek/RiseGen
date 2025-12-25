"use client";

import { useEffect } from "react";

export function DripWorker() {
    useEffect(() => {
        // Run only once on mount
        const runDrip = async () => {
            try {
                // Fire and forget - don't wait for response, don't block main thread
                // Use beacon or simple fetch without await needed for UI
                fetch("/api/cron/drip", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                    keepalive: true // Ensures request survives page navigation
                }).catch(() => { }); // Ignore errors in background worker
            } catch (e) {
                // Ignore
            }
        };

        // Small delay to prioritize main content loading
        const timer = setTimeout(runDrip, 2000); // 2s delay

        return () => clearTimeout(timer);
    }, []);

    return null;
}
