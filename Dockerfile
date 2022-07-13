FROM node:14.18.0

WORKDIR /app

RUN npm install -g dotenv-cli

COPY package.json .

RUN yarn install

COPY . .

RUN npx prisma generate

EXPOSE 3000

# Prisma Studio
EXPOSE 5555

CMD ["yarn", "dev"]