"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function VisitTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname) return;

        // Don't track admin pages or auth pages
        if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return;

        const logVisit = async () => {
            try {
                await fetch('/api/visit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: pathname }),
                    // use keepalive to ensure request completes if user navigates away quickly
                    keepalive: true
                });
            } catch (e) {
                // Silent error
            }
        };

        logVisit();
    }, [pathname]);

    return null;
}
