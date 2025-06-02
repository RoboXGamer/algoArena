-- AlterTable
ALTER TABLE "User" ADD COLUMN     "achievements" JSONB DEFAULT '{}',
ADD COLUMN     "badges" JSONB DEFAULT '{}',
ADD COLUMN     "companyTags" JSONB;

-- CreateTable
CREATE TABLE "Potd" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "problemId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "solvedUsers" TEXT[],

    CONSTRAINT "Potd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Potd_date_key" ON "Potd"("date");

-- AddForeignKey
ALTER TABLE "Potd" ADD CONSTRAINT "Potd_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
