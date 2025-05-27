/*
  Warnings:

  - You are about to drop the column `testcases` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "testcases",
ADD COLUMN     "privateTestcases" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "publicTestcases" JSONB NOT NULL DEFAULT '[]';
