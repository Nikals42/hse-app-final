/*
  Warnings:

  - You are about to drop the column `LTI` on the `Lagging_Indicators` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HSE_Report" ALTER COLUMN "projectId" SET DEFAULT 0,
ALTER COLUMN "HSEAudits" SET DEFAULT 0,
ALTER COLUMN "safetyWalks" SET DEFAULT 0,
ALTER COLUMN "toolboxTalks" SET DEFAULT 0,
ALTER COLUMN "workingHours" SET DEFAULT 0,
ALTER COLUMN "trainingHours" SET DEFAULT 0,
ALTER COLUMN "jobSafetyAnalysis" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Lagging_Indicators" DROP COLUMN "LTI",
ADD COLUMN     "LWC" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "FA" SET DEFAULT 0,
ALTER COLUMN "MTI" SET DEFAULT 0,
ALTER COLUMN "RTW" SET DEFAULT 0,
ALTER COLUMN "Fatality" SET DEFAULT 0,
ALTER COLUMN "PPD" SET DEFAULT 0,
ALTER COLUMN "PTD" SET DEFAULT 0;
