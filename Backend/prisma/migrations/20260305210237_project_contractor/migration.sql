-- CreateTable
CREATE TABLE "ProjectContractor" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "contractorId" INTEGER NOT NULL,

    CONSTRAINT "ProjectContractor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectContractor" ADD CONSTRAINT "ProjectContractor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContractor" ADD CONSTRAINT "ProjectContractor_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
