FROM node:10-alpine

WORKDIR /app

COPY package*.json ./
COPY compliments.json .
COPY index.js .

RUN npm install --only=production

CMD ["node", "index.js"]
