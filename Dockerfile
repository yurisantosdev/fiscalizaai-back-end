FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build
RUN npm prune --production

ENV NODE_OPTIONS="--max-old-space-size=128"

CMD ["npm", "run", "start:prod"]
