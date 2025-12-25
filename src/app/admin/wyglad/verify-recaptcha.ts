"use server";

import { verifyCaptcha } from "@/lib/recaptcha";

export async function verifyRecaptchaConfigAction(siteKey: string, apiKey: string, token: string, projectId: string) {
    try {
        console.log("Verifying reCAPTCHA config:", { siteKey, apiKey: apiKey ? "***" : "missing", projectId, token: token ? "present" : "missing" });

        // We act as if this is the "config_test" or "verify" action.
        // Frontend must generate token with action 'config_test' to be safe, or just 'contact' for simplicity.
        // Let's assume frontend sends 'config_test'.
        const isValid = await verifyCaptcha(token, "config_test", {
            apiKey,
            siteKey,
            projectId
        });

        if (isValid) {
            return { success: true, message: "Konfiguracja poprawna! Połączono z Google reCAPTCHA Enterprise." };
        } else {
            return { success: false, message: "Weryfikacja nie powiodła się. Sprawdź Site Key i API Key oraz Project ID." };
        }
    } catch (error) {
        console.error("Verification error:", error);
        return { success: false, message: "Wystąpił błąd serwera podczas weryfikacji." };
    }
}
