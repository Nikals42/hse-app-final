/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `HSE_Report` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `Lagging_Indicators` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HSE_Report_projectId_key" ON "HSE_Report"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Lagging_Indicators_projectId_key" ON "Lagging_Indicators"("projectId");
