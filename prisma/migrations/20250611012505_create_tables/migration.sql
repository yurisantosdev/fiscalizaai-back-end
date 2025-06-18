-- CreateEnum
CREATE TYPE "StatusProblemasEnum" AS ENUM ('EM_ANALISE', 'RESOLVIDO', 'PENDENTE', 'EM_ANDAMENTO', 'CORRIGIR');

-- CreateTable
CREATE TABLE "estados" (
    "escodigo" TEXT NOT NULL,
    "essigla" TEXT,
    "esestado" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("escodigo")
);

-- CreateTable
CREATE TABLE "municipios" (
    "mccodigo" TEXT NOT NULL,
    "mcmunicipio" TEXT NOT NULL,
    "mcestado" TEXT NOT NULL,
    "mclatitude" DOUBLE PRECISION,
    "mclongitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("mccodigo")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "edcodigo" TEXT NOT NULL,
    "edrua" TEXT NOT NULL,
    "edestado" TEXT NOT NULL,
    "edmunicipio" TEXT NOT NULL,
    "ednumero" TEXT NOT NULL,
    "edcomplemento" TEXT,
    "edpontoreferencia" TEXT,
    "edcep" TEXT NOT NULL,
    "edbairro" TEXT NOT NULL,
    "edlatitude" TEXT,
    "edlongitude" TEXT,
    "edproblema" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("edcodigo")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "uscodigo" TEXT NOT NULL,
    "usnome" TEXT NOT NULL,
    "usemail" TEXT NOT NULL,
    "ussenha" TEXT NOT NULL,
    "usendereco" TEXT NOT NULL,
    "usmaster" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("uscodigo")
);

-- CreateTable
CREATE TABLE "categoriasProblemas" (
    "cacodigo" TEXT NOT NULL,
    "cacategoria" TEXT NOT NULL,
    "cadescricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoriasProblemas_pkey" PRIMARY KEY ("cacodigo")
);

-- CreateTable
CREATE TABLE "problemas" (
    "decodigo" TEXT NOT NULL,
    "decategoria" TEXT NOT NULL,
    "dedescricao" TEXT NOT NULL,
    "deusuario" TEXT,
    "delocalizacao" TEXT NOT NULL,
    "dedata" TEXT NOT NULL,
    "destatus" "StatusProblemasEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problemas_pkey" PRIMARY KEY ("decodigo")
);

-- CreateTable
CREATE TABLE "contatosMunicipio" (
    "cmcodigo" TEXT NOT NULL,
    "cmcontato" TEXT NOT NULL,
    "cmdescricao" TEXT NOT NULL,
    "cmmunicipio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contatosMunicipio_pkey" PRIMARY KEY ("cmcodigo")
);

-- CreateTable
CREATE TABLE "fotosProblemas" (
    "fdcodigo" TEXT NOT NULL,
    "fdfoto" TEXT NOT NULL,
    "fdproblema" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fotosProblemas_pkey" PRIMARY KEY ("fdcodigo")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "ntcodigo" TEXT NOT NULL,
    "ntlida" BOOLEAN NOT NULL DEFAULT false,
    "ntusuario" TEXT NOT NULL,
    "ntnotificacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("ntcodigo")
);

-- CreateTable
CREATE TABLE "codigosRecuperacaoSenhas" (
    "crscodigo" TEXT NOT NULL,
    "crsusuario" TEXT NOT NULL,
    "crscodigorecuperacao" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codigosRecuperacaoSenhas_pkey" PRIMARY KEY ("crscodigo")
);

-- CreateTable
CREATE TABLE "historicoCorrecoesProblemas" (
    "hcpcodigo" TEXT NOT NULL,
    "hcpproblema" TEXT NOT NULL,
    "hcpmotivo" TEXT NOT NULL,
    "hcpquando" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historicoCorrecoesProblemas_pkey" PRIMARY KEY ("hcpcodigo")
);

-- CreateIndex
CREATE UNIQUE INDEX "estados_essigla_key" ON "estados"("essigla");

-- CreateIndex
CREATE UNIQUE INDEX "estados_esestado_key" ON "estados"("esestado");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usemail_key" ON "usuarios"("usemail");

-- CreateIndex
CREATE UNIQUE INDEX "categoriasProblemas_cacategoria_key" ON "categoriasProblemas"("cacategoria");

-- CreateIndex
CREATE UNIQUE INDEX "contatosMunicipio_cmcontato_key" ON "contatosMunicipio"("cmcontato");

-- AddForeignKey
ALTER TABLE "municipios" ADD CONSTRAINT "municipios_mcestado_fkey" FOREIGN KEY ("mcestado") REFERENCES "estados"("escodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_edmunicipio_fkey" FOREIGN KEY ("edmunicipio") REFERENCES "municipios"("mccodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_edestado_fkey" FOREIGN KEY ("edestado") REFERENCES "estados"("escodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_usendereco_fkey" FOREIGN KEY ("usendereco") REFERENCES "enderecos"("edcodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemas" ADD CONSTRAINT "problemas_decategoria_fkey" FOREIGN KEY ("decategoria") REFERENCES "categoriasProblemas"("cacodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemas" ADD CONSTRAINT "problemas_deusuario_fkey" FOREIGN KEY ("deusuario") REFERENCES "usuarios"("uscodigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemas" ADD CONSTRAINT "problemas_delocalizacao_fkey" FOREIGN KEY ("delocalizacao") REFERENCES "enderecos"("edcodigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contatosMunicipio" ADD CONSTRAINT "contatosMunicipio_cmmunicipio_fkey" FOREIGN KEY ("cmmunicipio") REFERENCES "municipios"("mccodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotosProblemas" ADD CONSTRAINT "fotosProblemas_fdproblema_fkey" FOREIGN KEY ("fdproblema") REFERENCES "problemas"("decodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_ntusuario_fkey" FOREIGN KEY ("ntusuario") REFERENCES "usuarios"("uscodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codigosRecuperacaoSenhas" ADD CONSTRAINT "codigosRecuperacaoSenhas_crsusuario_fkey" FOREIGN KEY ("crsusuario") REFERENCES "usuarios"("uscodigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicoCorrecoesProblemas" ADD CONSTRAINT "historicoCorrecoesProblemas_hcpproblema_fkey" FOREIGN KEY ("hcpproblema") REFERENCES "problemas"("decodigo") ON DELETE RESTRICT ON UPDATE CASCADE;
