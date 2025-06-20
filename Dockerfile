FROM node:20

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências primeiro
COPY package*.json ./
RUN npm install --omit=dev

# Copia os arquivos do Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do projeto
COPY . .

# Faz o build da aplicação NestJS
RUN npm run build

# Limita o uso de memória do Node para 128MB
ENV NODE_OPTIONS="--max-old-space-size=128"

# Comando de start em modo produção
CMD ["npm", "run", "start:prod"]
