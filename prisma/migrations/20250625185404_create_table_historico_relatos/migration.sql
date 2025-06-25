-- CreateTable
CREATE TABLE "historicoRelatos" (
    "hrcodigo" TEXT NOT NULL,
    "hrrelato" TEXT NOT NULL,
    "hrtratativa" TEXT NOT NULL,
    "hrusuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historicoRelatos_pkey" PRIMARY KEY ("hrcodigo")
);

-- AddForeignKey
ALTER TABLE "historicoRelatos" ADD CONSTRAINT "historicoRelatos_hrusuario_fkey" FOREIGN KEY ("hrusuario") REFERENCES "usuarios"("uscodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicoRelatos" ADD CONSTRAINT "historicoRelatos_hrrelato_fkey" FOREIGN KEY ("hrrelato") REFERENCES "problemas"("decodigo") ON DELETE RESTRICT ON UPDATE CASCADE;
