FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

RUN npx prisma migrate

COPY . .

CMD ["npm", "run", "start"]