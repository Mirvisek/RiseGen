
import { prisma } from "./src/lib/prisma";

async function fixCaptcha() {
    await prisma.siteConfig.update({
        where: { id: "main" },
        data: {
            recaptchaVersion: "v2"
        }
    });
    console.log("Recaptcha version reset to v2");
}

fixCaptcha()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
