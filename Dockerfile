FROM node:16-alpine3.16

RUN apk add --no-cache=true --update \
        bash curl git yarn

RUN mkdir /home/app

COPY . /home/app
WORKDIR /home/app

RUN yarn --immutable

CMD ["node", "."]