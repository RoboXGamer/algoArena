/*
  Warnings:

  - The `xp` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `level` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "xp",
ADD COLUMN     "xp" INTEGER DEFAULT 0,
DROP COLUMN "level",
ADD COLUMN     "level" INTEGER DEFAULT 0;
