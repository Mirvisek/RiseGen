"use server";
import { PrevActionState } from "@/types/actions";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

export async function sendNewsletter(_prevState: PrevActionState, formData: FormData) {
    try {
        const subject = formData.get("subject") as string;
        const content = formData.get("content") as string;

        if (!subject || !content) {
            return { success: false, message: "Temat i treść są wymagane." };
        }

        const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

        if (!config?.enableNewsletter) {
            return { success: false, message: "Newsletter jest wyłączony w ustawieniach." };
        }

        const apiKey = process.env.RESEND_API_KEY || config.resendApiKey;

        if (!apiKey) {
            return { success: false, message: "Brak klucza API Resend." };
        }

        // Fetch active subscribers
        const subscribers = await prisma.subscriber.findMany({
            where: { isActive: true },
        });

        if (subscribers.length === 0) {
            return { success: false, message: "Brak aktywnych subskrybentów." };
        }

        const resend = new Resend(apiKey);
        const fromEmail = config.smtpFrom || 'kontakt@risegen.pl'; // Fallback or strict config?
        // Ideally use the domain verified in Resend. usually "kontakt@risegen.pl" or similar.
        // The previous code used 'RiseGen <kontakt@risegen.pl>' hardcoded. Let's try to stick to that pattern or allow config.

        const from = `RiseGen <${fromEmail}>`;

        // Send in batches or individual?
        // Resend batch API allows up to 100 emails. 
        // For simplicity and personalization (unsubscribe link per user), let's loop or use batching if we don't personalise.

        // We will send individually to include unsubscribe link (if we implemented it) or just use BCC for bulk?
        // Resend recommends sending individually or using 'bcc' if generic.
        // However, standard newsletter practice is individual emails.
        // Let's optimize: Resend supports batch sending.

        // Construct batch
        // Note: Resend Free tier has limits. Check docs? 
        // Assuming we have a reasonable number.

        // Simply loop for now. It's slower but safer for simple impl.
        let successCount = 0;
        let failCount = 0;

        // Parallelize requests in chunks of 10 to avoid rate limits
        const chunkSize = 10;
        for (let i = 0; i < subscribers.length; i += chunkSize) {
            const chunk = subscribers.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async (sub) => {
                try {
                    // Determine unsubscribe link (mock for now or real if we had the route)
                    // We don't have a direct unsubscribe route yet visible, but we can assume /api/newsletter/unsubscribe logic exists or will exist.
                    // For now, simple text.

                    await resend.emails.send({
                        from,
                        to: sub.email,
                        subject,
                        html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            ${content}
                            <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px 0;" />
                            <p style="font-size: 11px; color: #999; text-align: center;">
                                Otrzymujesz tę wiadomość, ponieważ zapisałeś się na newsletter Stowarzyszenia RiseGen.
                                <br/>
                                <a href="https://risegen.pl/kontakt" style="color: #999;">Skontaktuj się</a> jeśli chcesz się wypisać.
                            </p>
                        </div>
                    `,
                    });
                    successCount++;
                } catch (_e) {
                    console.error(`Failed to email ${sub.email}`, _e);
                    failCount++;
                }
            }));
        }

        return {
            success: true,
            message: `Wysłano ${successCount} wiadomości. Błędy: ${failCount}.`
        };

    } catch (_e) {
        console.error(_e);
        return { success: false, message: "Wystąpił błąd podczas wysyłania." };
    }
}

export async function deleteSubscriber(email: string) {
    try {
        await prisma.subscriber.delete({ where: { email } });
        revalidatePath("/admin/newsletter");
        return { success: true };
    } catch {
        return { success: false, message: "Błąd usuwania" };
    }
}
