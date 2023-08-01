FROM node:18

SHELL ["/bin/bash", "-c"]

WORKDIR /app

COPY package.json /app/package.json
COPY .build /app/.build
COPY web/package.json /app/web/package.json

COPY . /app

RUN npm run bootstrap

