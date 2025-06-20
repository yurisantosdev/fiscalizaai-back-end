FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# Agora imagem final
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV NODE_OPTIONS="--max-old-space-size=128"

CMD ["npm", "run", "start:prod"]
