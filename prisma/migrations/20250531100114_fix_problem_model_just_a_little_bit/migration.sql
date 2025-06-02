/*
  Warnings:

  - The `hints` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `editorial` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "companyTags" JSONB,
DROP COLUMN "hints",
ADD COLUMN     "hints" JSONB,
DROP COLUMN "editorial",
ADD COLUMN     "editorial" JSONB;
