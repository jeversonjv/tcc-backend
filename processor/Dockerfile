FROM node:lts-alpine

ENV HOME=/home/node/app
WORKDIR $HOME

COPY package*.json ./

RUN npm install pm2 -g
RUN npm install

RUN chown -R root:root $HOME/*

COPY . .

EXPOSE 3333