/*
  Warnings:

  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HomeHeroSlide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Partner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AuditLog";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Document";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FAQ";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HomeHeroSlide";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Partner";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Stat";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TeamMember";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "orgName" TEXT,
    "orgAddress" TEXT,
    "orgNip" TEXT,
    "orgRegon" TEXT,
    "orgBankAccount" TEXT,
    "siteName" TEXT,
    "logoUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "showBoard" BOOLEAN NOT NULL DEFAULT true,
    "showOffice" BOOLEAN NOT NULL DEFAULT true,
    "showCoordinators" BOOLEAN NOT NULL DEFAULT true,
    "showCollaborators" BOOLEAN NOT NULL DEFAULT true,
    "showHero" BOOLEAN NOT NULL DEFAULT true,
    "showNews" BOOLEAN NOT NULL DEFAULT true,
    "showProjects" BOOLEAN NOT NULL DEFAULT true,
    "showPartners" BOOLEAN NOT NULL DEFAULT true,
    "enableHeroSlider" BOOLEAN NOT NULL DEFAULT true,
    "staticHeroTitle" TEXT,
    "staticHeroSubtitle" TEXT,
    "staticHeroImage" TEXT,
    "staticHeroAlignment" TEXT NOT NULL DEFAULT 'center',
    "staticHeroAuthor" TEXT,
    "aboutUsText" TEXT,
    "aboutUsGoals" TEXT,
    "aboutUsJoinText" TEXT,
    "smtpHost" TEXT,
    "smtpPort" INTEGER,
    "smtpUser" TEXT,
    "smtpPassword" TEXT,
    "smtpFrom" TEXT,
    "emailForApplications" TEXT,
    "emailForContact" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "seoAuthor" TEXT,
    "seoRobots" TEXT,
    "faviconUrl" TEXT,
    "ogImageUrl" TEXT,
    "aboutUsSublinks" TEXT,
    "headCode" TEXT,
    "footerCode" TEXT,
    "accessibilityInfo" TEXT,
    "accessibilityDeclarationContent" TEXT,
    "privacyPolicyContent" TEXT,
    "cookiePolicyContent" TEXT,
    "recaptchaSiteKey" TEXT,
    "recaptchaSecretKey" TEXT,
    "recaptchaVersion" TEXT DEFAULT 'v2',
    "googleAnalyticsId" TEXT,
    "googleCalendarId" TEXT,
    "showEvents" BOOLEAN NOT NULL DEFAULT true,
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "isMaintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "enableNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "resendApiKey" TEXT,
    "newsletterWelcomeSubject" TEXT,
    "newsletterWelcomeContent" TEXT,
    "dripDay2Delay" INTEGER NOT NULL DEFAULT 2,
    "dripDay2Subject" TEXT,
    "dripDay2Content" TEXT,
    "dripDay5Delay" INTEGER NOT NULL DEFAULT 5,
    "dripDay5Subject" TEXT,
    "dripDay5Content" TEXT,
    "lastDripRun" DATETIME
);
INSERT INTO "new_SiteConfig" ("aboutUsGoals", "aboutUsJoinText", "aboutUsSublinks", "aboutUsText", "accessibilityDeclarationContent", "accessibilityInfo", "cookiePolicyContent", "email", "emailForApplications", "emailForContact", "enableHeroSlider", "enableNewsletter", "facebookUrl", "faviconUrl", "footerCode", "googleAnalyticsId", "googleCalendarId", "headCode", "id", "instagramUrl", "isMaintenanceMode", "logoUrl", "maintenanceMessage", "ogImageUrl", "orgAddress", "orgBankAccount", "orgName", "orgNip", "orgRegon", "phone", "privacyPolicyContent", "recaptchaSecretKey", "recaptchaSiteKey", "recaptchaVersion", "resendApiKey", "seoAuthor", "seoDescription", "seoKeywords", "seoRobots", "seoTitle", "showBoard", "showCollaborators", "showCoordinators", "showEvents", "showHero", "showNews", "showOffice", "showPartners", "showProjects", "showStats", "siteName", "smtpFrom", "smtpHost", "smtpPassword", "smtpPort", "smtpUser", "staticHeroAlignment", "staticHeroAuthor", "staticHeroImage", "staticHeroSubtitle", "staticHeroTitle", "tiktokUrl", "updatedAt") SELECT "aboutUsGoals", "aboutUsJoinText", "aboutUsSublinks", "aboutUsText", "accessibilityDeclarationContent", "accessibilityInfo", "cookiePolicyContent", "email", "emailForApplications", "emailForContact", "enableHeroSlider", "enableNewsletter", "facebookUrl", "faviconUrl", "footerCode", "googleAnalyticsId", "googleCalendarId", "headCode", "id", "instagramUrl", "isMaintenanceMode", "logoUrl", "maintenanceMessage", "ogImageUrl", "orgAddress", "orgBankAccount", "orgName", "orgNip", "orgRegon", "phone", "privacyPolicyContent", "recaptchaSecretKey", "recaptchaSiteKey", "recaptchaVersion", "resendApiKey", "seoAuthor", "seoDescription", "seoKeywords", "seoRobots", "seoTitle", "showBoard", "showCollaborators", "showCoordinators", "showEvents", "showHero", "showNews", "showOffice", "showPartners", "showProjects", "showStats", "siteName", "smtpFrom", "smtpHost", "smtpPassword", "smtpPort", "smtpUser", "staticHeroAlignment", "staticHeroAuthor", "staticHeroImage", "staticHeroSubtitle", "staticHeroTitle", "tiktokUrl", "updatedAt" FROM "SiteConfig";
DROP TABLE "SiteConfig";
ALTER TABLE "new_SiteConfig" RENAME TO "SiteConfig";
CREATE TABLE "new_Subscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT,
    "dripStep" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Subscriber" ("createdAt", "email", "id", "isActive", "name", "updatedAt") SELECT "createdAt", "email", "id", "isActive", "name", "updatedAt" FROM "Subscriber";
DROP TABLE "Subscriber";
ALTER TABLE "new_Subscriber" RENAME TO "Subscriber";
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
