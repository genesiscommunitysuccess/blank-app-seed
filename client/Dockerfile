FROM node:16

SHELL ["/bin/bash", "-c"]

WORKDIR /app

COPY package.json /app/package.json
COPY .build /app/.build
COPY web/package.json /app/web/package.json
COPY lerna.json /app/lerna.json

COPY . /app

RUN npm run bootstrap

