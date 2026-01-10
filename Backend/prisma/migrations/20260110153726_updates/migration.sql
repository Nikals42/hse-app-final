/*
  Warnings:

  - You are about to drop the `LaggingIndicators` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LaggingIndicators" DROP CONSTRAINT "LaggingIndicators_projectId_fkey";

-- AlterTable
CREATE SEQUENCE project_id_seq;
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT nextval('project_id_seq');
ALTER SEQUENCE project_id_seq OWNED BY "Project"."id";

-- DropTable
DROP TABLE "LaggingIndicators";

-- CreateTable
CREATE TABLE "Lagging_Indicators" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "LTI" INTEGER NOT NULL,
    "FA" INTEGER NOT NULL,
    "MTI" INTEGER NOT NULL,
    "RTW" INTEGER NOT NULL,
    "Fatality" INTEGER NOT NULL,
    "PPD" INTEGER NOT NULL,
    "PTD" INTEGER NOT NULL,

    CONSTRAINT "Lagging_Indicators_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lagging_Indicators" ADD CONSTRAINT "Lagging_Indicators_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
