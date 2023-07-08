FROM node:18-alpine

RUN apk update

RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ 

WORKDIR /home/app

COPY package.json  .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD [ "npm", "start" ]