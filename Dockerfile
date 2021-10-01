FROM node:12.16.2-alpine

RUN apk update && apk upgrade || : && apk add --update-cache \
    python \
    python-dev \
    py-pip \
    build-base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 9400

CMD [ "make", "run" ]
