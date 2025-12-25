
import { prisma } from "./src/lib/prisma";

async function checkConfig() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
    console.log("Current Config:", {
        recaptchaVersion: config?.recaptchaVersion,
        siteKey: config?.recaptchaSiteKey,
        secretKey: config?.recaptchaSecretKey ? "***" : "missing"
    });
}

checkConfig()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
