import { BackupManager } from "@/components/admin/BackupManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Backup - Panel Admina",
};

export default async function BackupPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.includes("SUPERADMIN")) {
        redirect("/admin/dashboard");
    }

    return (
        <div>
            <BackupManager />
        </div>
    );
}
