/*
  Warnings:

  - You are about to drop the column `fumelhoria` on the `feedbacksUsuarios` table. All the data in the column will be lost.
  - Added the required column `fufeedback` to the `feedbacksUsuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feedbacksUsuarios" DROP COLUMN "fumelhoria",
ADD COLUMN     "fufeedback" TEXT NOT NULL;
