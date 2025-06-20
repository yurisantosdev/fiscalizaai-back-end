FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

ENV NODE_OPTIONS="--max-old-space-size=256"

CMD ["npm", "run", "start:prod"]
