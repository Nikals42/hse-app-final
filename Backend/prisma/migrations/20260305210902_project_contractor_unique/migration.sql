/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `ProjectContractor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contractorId]` on the table `ProjectContractor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectContractor_projectId_key" ON "ProjectContractor"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectContractor_contractorId_key" ON "ProjectContractor"("contractorId");
