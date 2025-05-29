-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastSubmission" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "YearlyGrid" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YearlyGrid_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "YearlyGrid" ADD CONSTRAINT "YearlyGrid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
