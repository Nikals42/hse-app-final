/*
  Warnings:

  - You are about to drop the column `data` on the `TestData` table. All the data in the column will be lost.
  - Added the required column `HSEAudits` to the `TestData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobSafetyAnalysis` to the `TestData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `safetyWalks` to the `TestData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toolboxTalks` to the `TestData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingHours` to the `TestData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingHours` to the `TestData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestData" DROP COLUMN "data",
ADD COLUMN     "HSEAudits" INTEGER NOT NULL,
ADD COLUMN     "jobSafetyAnalysis" INTEGER NOT NULL,
ADD COLUMN     "safetyWalks" INTEGER NOT NULL,
ADD COLUMN     "toolboxTalks" INTEGER NOT NULL,
ADD COLUMN     "trainingHours" INTEGER NOT NULL,
ADD COLUMN     "workingHours" INTEGER NOT NULL;
