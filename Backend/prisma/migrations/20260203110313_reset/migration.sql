-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HSE_Report" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL DEFAULT 0,
    "HSEAudits" INTEGER NOT NULL DEFAULT 0,
    "safetyWalks" INTEGER NOT NULL DEFAULT 0,
    "toolboxTalks" INTEGER NOT NULL DEFAULT 0,
    "workingHours" INTEGER NOT NULL DEFAULT 0,
    "trainingHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jobSafetyAnalysis" INTEGER NOT NULL DEFAULT 0,
    "timeStamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HSE_Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lagging_Indicators" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL DEFAULT 0,
    "subcontractorId" INTEGER NOT NULL DEFAULT 0,
    "LWC" INTEGER NOT NULL DEFAULT 0,
    "FA" INTEGER NOT NULL DEFAULT 0,
    "MTI" INTEGER NOT NULL DEFAULT 0,
    "RTW" INTEGER NOT NULL DEFAULT 0,
    "Fatality" INTEGER NOT NULL DEFAULT 0,
    "PPD" INTEGER NOT NULL DEFAULT 0,
    "PTD" INTEGER NOT NULL DEFAULT 0,
    "timeStamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lagging_Indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcontractors" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subcontractors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_username_key" ON "Accounts"("username");

-- AddForeignKey
ALTER TABLE "HSE_Report" ADD CONSTRAINT "HSE_Report_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lagging_Indicators" ADD CONSTRAINT "Lagging_Indicators_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lagging_Indicators" ADD CONSTRAINT "Lagging_Indicators_subcontractorId_fkey" FOREIGN KEY ("subcontractorId") REFERENCES "Subcontractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcontractors" ADD CONSTRAINT "Subcontractors_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
