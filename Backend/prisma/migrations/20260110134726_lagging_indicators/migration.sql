-- CreateTable
CREATE TABLE "LaggingIndicators" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "LTI" INTEGER NOT NULL,
    "FA" INTEGER NOT NULL,
    "MTI" INTEGER NOT NULL,
    "RTW" INTEGER NOT NULL,
    "Fatality" INTEGER NOT NULL,
    "PPD" INTEGER NOT NULL,
    "PTD" INTEGER NOT NULL,

    CONSTRAINT "LaggingIndicators_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LaggingIndicators" ADD CONSTRAINT "LaggingIndicators_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
