FROM node:16.10.0-alpine

RUN apk add --no-cache bash

# Install dockerize
RUN apk add --no-cache openssl
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ENV HOME=/home/node/app
WORKDIR $HOME

COPY package*.json ./

RUN npm install pm2 -g
RUN npm install

RUN chown -R root:root $HOME/*

COPY . .

EXPOSE 3333