/*
  Warnings:

  - A unique constraint covering the columns `[projectId,contractorId]` on the table `ProjectContractor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProjectContractor_contractorId_key";

-- DropIndex
DROP INDEX "ProjectContractor_projectId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectContractor_projectId_contractorId_key" ON "ProjectContractor"("projectId", "contractorId");
