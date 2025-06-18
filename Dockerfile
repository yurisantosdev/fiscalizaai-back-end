FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY .env ./.env

RUN npx prisma generate

COPY . .

CMD ["npm", "run", "start"]