/*
  Warnings:

  - The `dedata` column on the `problemas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "problemas" DROP COLUMN "dedata",
ADD COLUMN     "dedata" TIMESTAMP(3);
