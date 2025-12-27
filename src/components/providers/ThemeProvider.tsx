"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "light" | "dark" | undefined;
};

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
    resolvedTheme: undefined,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "risegen-ui-theme",
}: ThemeProviderProps) {
    // Initialize theme from localStorage
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey) as Theme | null;
            return saved || defaultTheme;
        }
        return defaultTheme;
    });
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark" | undefined>(undefined);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

            const applySystemTheme = () => {
                const systemTheme = mediaQuery.matches ? "dark" : "light";
                root.classList.add(systemTheme);
                setResolvedTheme(systemTheme);
            };

            applySystemTheme();

            mediaQuery.addEventListener("change", applySystemTheme);
            return () => mediaQuery.removeEventListener("change", applySystemTheme);
        } else {
            root.classList.add(theme);
            setResolvedTheme(theme);
        }
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
        resolvedTheme,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
