/*
  Warnings:

  - The `visibility` column on the `Sheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('Public', 'Private');

-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'Public';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "level" TEXT DEFAULT '0';
