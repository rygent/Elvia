# We're using Alpine
FROM node:lts-alpine3.15

# Installing packages
RUN apk add --no-cache=true --update \
        bash curl git yarn sudo zip \
        neofetch chromium chromium-chromedriver

# Create working directory
RUN mkdir /home/app

# Copy files & prepare working directory
COPY . /home/app
WORKDIR /home/app

# Copies config (if it exists)
COPY .env.example .env

# Installing required dependencies
RUN yarn install --frozen-lockfile

CMD ["node", "."]