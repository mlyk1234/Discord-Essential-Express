FROM node:18.12.1-alpine

RUN npm install -g ts-node typescript

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
