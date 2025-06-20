FROM node:20

WORKDIR /app

# Copie apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instale apenas dependências de produção
RUN npm ci --omit=dev

# Copie os arquivos do Prisma e gere o client
COPY prisma ./prisma
ENV NODE_ENV=production
# O DATABASE_URL pode ser passado no docker-compose.yml
RUN npx prisma generate

# Copie o restante do código da aplicação
COPY . .

# Compile o projeto
RUN npm run build

# Remova dependências de desenvolvimento (garantia extra)
RUN npm prune --omit=dev

EXPOSE 8000

CMD ["npm", "run", "start"]