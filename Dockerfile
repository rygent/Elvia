FROM node:current-alpine3.15

RUN apk add --no-cache=true --update \
        bash curl git yarn sudo zip \
        neofetch chromium chromium-chromedriver

RUN mkdir /home/container

COPY . /home/container
WORKDIR /home/container

RUN yarn --immutable

CMD ["node", "."]