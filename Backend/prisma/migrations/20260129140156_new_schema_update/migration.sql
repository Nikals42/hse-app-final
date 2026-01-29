/*
  Warnings:

  - Added the required column `timeStamp` to the `Lagging_Indicators` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HSE_Report" ALTER COLUMN "timeStamp" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Lagging_Indicators" ADD COLUMN     "timeStamp" TIMESTAMP(3) NOT NULL;
