-- DropForeignKey
ALTER TABLE "demandas" DROP CONSTRAINT "demandas_dmresponsavel_fkey";

-- AlterTable
ALTER TABLE "demandas" ALTER COLUMN "dmresponsavel" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "demandas" ADD CONSTRAINT "demandas_dmresponsavel_fkey" FOREIGN KEY ("dmresponsavel") REFERENCES "usuarios"("uscodigo") ON DELETE SET NULL ON UPDATE CASCADE;
