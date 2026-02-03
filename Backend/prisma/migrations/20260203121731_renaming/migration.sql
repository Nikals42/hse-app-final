/*
  Warnings:

  - You are about to drop the `Subcontractor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lagging_Indicators" DROP CONSTRAINT "Lagging_Indicators_subcontractorId_fkey";

-- DropTable
DROP TABLE "Subcontractor";

-- CreateTable
CREATE TABLE "ProjectOrganization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProjectOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectOrganization_name_key" ON "ProjectOrganization"("name");

-- AddForeignKey
ALTER TABLE "Lagging_Indicators" ADD CONSTRAINT "Lagging_Indicators_subcontractorId_fkey" FOREIGN KEY ("subcontractorId") REFERENCES "ProjectOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
