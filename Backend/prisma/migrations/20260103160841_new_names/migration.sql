/*
  Warnings:

  - You are about to drop the `TestData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestData" DROP CONSTRAINT "TestData_projectid_fkey";

-- DropTable
DROP TABLE "TestData";

-- CreateTable
CREATE TABLE "HSE_Report" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "projectName" TEXT NOT NULL,
    "HSEAudits" INTEGER NOT NULL,
    "safetyWalks" INTEGER NOT NULL,
    "toolboxTalks" INTEGER NOT NULL,
    "workingHours" INTEGER NOT NULL,
    "trainingHours" INTEGER NOT NULL,
    "jobSafetyAnalysis" INTEGER NOT NULL,

    CONSTRAINT "HSE_Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HSE_Report" ADD CONSTRAINT "HSE_Report_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
