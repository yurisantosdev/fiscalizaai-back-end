-- CreateTable
CREATE TABLE "features" (
    "ftcodigo" TEXT NOT NULL,
    "fttitulo" TEXT NOT NULL,
    "ftdescricao" TEXT NOT NULL,
    "ftquando" TEXT NOT NULL,
    "ftusuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "features_pkey" PRIMARY KEY ("ftcodigo")
);

-- CreateTable
CREATE TABLE "fotosFeatures" (
    "ffcodigo" TEXT NOT NULL,
    "fffoto" TEXT NOT NULL,
    "fffeature" TEXT NOT NULL,
    "ffdescricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fotosFeatures_pkey" PRIMARY KEY ("ffcodigo")
);

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_ftusuario_fkey" FOREIGN KEY ("ftusuario") REFERENCES "usuarios"("uscodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotosFeatures" ADD CONSTRAINT "fotosFeatures_fffeature_fkey" FOREIGN KEY ("fffeature") REFERENCES "features"("ftcodigo") ON DELETE RESTRICT ON UPDATE CASCADE;
