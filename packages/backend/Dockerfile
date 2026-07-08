FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY src ./src
COPY .env.example .env

EXPOSE 5000

CMD ["npm", "start"]