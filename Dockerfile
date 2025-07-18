FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma migrate
RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
