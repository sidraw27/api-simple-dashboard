FROM node:16.14-alpine

WORKDIR /app

RUN apk --no-cache add yarn

RUN chown -R node:node /app

USER node

COPY package*.json ./

RUN yarn

COPY --chown=node:node . ./

EXPOSE 3000
