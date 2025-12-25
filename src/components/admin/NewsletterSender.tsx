"use client";

import { useActionState, useState } from "react";
import { sendNewsletter } from "@/app/admin/newsletter/actions";
import { Loader2, Send, Users } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export function NewsletterSender() {
    const initialState = { success: false, message: "" };
    const [state, formAction, isPending] = useActionState(sendNewsletter, initialState);
    const [content, setContent] = useState("");

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-600" />
                Wyślij Newsletter
            </h2>

            <form action={formAction} className="space-y-6">
                {state?.message && (
                    <div className={`p-4 rounded-md ${state.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}>
                        {state.message}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Temat wiadomości</label>
                    <input
                        type="text"
                        name="subject"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        placeholder="Wpisz temat..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treść wiadomości</label>
                    <input type="hidden" name="content" value={content} />
                    <div className="prose-editor">
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Możesz używać formatowania, ale pamiętaj, że klienty pocztowe mają ograniczone możliwości renderowania HTML.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isPending || !content}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    {isPending ? "Wysyłanie..." : "Wyślij do wszystkich subskrybentów"}
                </button>
            </form>
        </div>
    );
}
