FROM node:19-alpine3.16

RUN apk add --no-cache=true --update \
        bash curl git yarn

RUN mkdir /home/container

COPY . /home/container
WORKDIR /home/container

RUN yarn --immutable

CMD ["node", "src/index.js"]
