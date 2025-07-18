-- CreateEnum
CREATE TYPE "StatusDemandasEnum" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO');

-- CreateTable
CREATE TABLE "demandas" (
    "dmcodigo" TEXT NOT NULL,
    "dmtitle" TEXT NOT NULL,
    "dmregistrado" TEXT NOT NULL,
    "dmstatus" "StatusDemandasEnum" NOT NULL,
    "dmresponsavel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demandas_pkey" PRIMARY KEY ("dmcodigo")
);

-- CreateTable
CREATE TABLE "relatosDemandas" (
    "rdcodigo" TEXT NOT NULL,
    "rddemanda" TEXT NOT NULL,
    "rdrelato" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatosDemandas_pkey" PRIMARY KEY ("rdcodigo")
);

-- AddForeignKey
ALTER TABLE "demandas" ADD CONSTRAINT "demandas_dmresponsavel_fkey" FOREIGN KEY ("dmresponsavel") REFERENCES "usuarios"("uscodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatosDemandas" ADD CONSTRAINT "relatosDemandas_rddemanda_fkey" FOREIGN KEY ("rddemanda") REFERENCES "demandas"("dmcodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatosDemandas" ADD CONSTRAINT "relatosDemandas_rdrelato_fkey" FOREIGN KEY ("rdrelato") REFERENCES "problemas"("decodigo") ON DELETE RESTRICT ON UPDATE CASCADE;
