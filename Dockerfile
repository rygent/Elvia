# We're using Alpine
FROM alpine:latest

# Installing Packages
RUN apk add --no-cache=true --update \
        curl \
        sudo \
        git \
        nodejs \
        npm \
        yarn \
        zip

# Clone repo and prepare working directory
RUN git clone -b alpha https://github.com/XRzky/RivenBot /root/RivenBot
RUN mkdir /root/RivenBot/bin/
WORKDIR /root/RivenBot/

# Copies session and config (if it exists)
COPY ./example.env ./.env

# Install requirements
RUN yarn install

CMD ["npm", "start"]