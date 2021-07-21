# We're using Alpine
FROM node:lts-alpine3.13

# Installing packages
RUN apk add --no-cache=true --update \
        bash curl git yarn sudo python3 \
        ffmpeg neofetch zlib-dev chromium \
        chromium-chromedriver zip

# Create working directory
RUN mkdir /home/app

# Copy files & prepare working directory
COPY . /home/app
WORKDIR /home/app

# Copies session & config (if it exists)
COPY .env.example .env

# Installing required & optional dependencies
RUN yarn install
RUN yarn add bufferutil utf-8-validate

CMD ["node", "."]