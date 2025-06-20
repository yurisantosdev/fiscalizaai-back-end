FROM node:20

WORKDIR /app

# Instalar tudo (incluindo devDependencies) só durante o build
COPY package*.json ./
RUN npm install

# Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copiar o restante
COPY . .

# Fazer o build (precisa do Nest CLI)
RUN npm run build

# Agora, remover as devDependencies para reduzir o tamanho da imagem
RUN npm prune --production

# Limitar memória
ENV NODE_OPTIONS="--max-old-space-size=128"

CMD ["npm", "run", "start:prod"]
