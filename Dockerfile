FROM node:alpine

LABEL Karthik Chejerla

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "start"]