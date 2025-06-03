/*
  Warnings:

  - You are about to drop the column `companyTags` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "likes" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyTags",
ADD COLUMN     "editorialUsed" TEXT[],
ADD COLUMN     "hintsUsed" TEXT[],
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'Bronze',
ADD COLUMN     "xp" TEXT DEFAULT '0';
