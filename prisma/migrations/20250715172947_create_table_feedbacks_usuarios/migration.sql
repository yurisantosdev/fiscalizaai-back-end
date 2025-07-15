-- CreateTable
CREATE TABLE "feedbacksUsuarios" (
    "fucodigo" TEXT NOT NULL,
    "fumelhoria" TEXT NOT NULL,
    "fuquando" TIMESTAMP(3) NOT NULL,
    "fulido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacksUsuarios_pkey" PRIMARY KEY ("fucodigo")
);
