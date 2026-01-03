-- CreateTable
CREATE TABLE "TestData" (
    "id" SERIAL NOT NULL,
    "projectid" INTEGER NOT NULL,
    "projectname" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "TestData_pkey" PRIMARY KEY ("id")
);
