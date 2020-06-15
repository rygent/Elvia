<h1 align="center">Riven</h1>

<p align="center">
<a href="https://discord.gg/nW6x9EN">
    <img src="https://img.shields.io/discord/708659047057981451?color=7289da&label=Support&logo=discord&logoColor=white&style=for-the-badge" alt="Support">
</a>
<a href="https://travis-ci.com/XRzky/RivenBot">
    <img src="https://img.shields.io/travis/com/XRzky/RivenBot/alpha.svg?style=for-the-badge" alt="Build">
</a>
<a>
    <img src="https://img.shields.io/github/languages/top/XRzky/RivenBot.svg?color=f0db4f&style=for-the-badge" alt="Languages">
</a>
<a>
    <img src="https://img.shields.io/github/license/XRzky/RivenBot?color=blue&style=for-the-badge" alt="License">
</a>
<br>
<a href="https://github.com/XRzky/RivenBot/tree/alpha">
    <img src="https://img.shields.io/github/package-json/v/XRzky/RivenBot/alpha.svg?label=Version&style=for-the-badge" alt="Version">
</a>
<a href="https://github.com/XRzky/RivenBot/issues">
    <img src="https://img.shields.io/github/issues/XRzky/RivenBot.svg?color=37f149&style=for-the-badge" alt="Issues">
</a>
<a href="https://github.com/XRzky/RivenBot/pulls">
    <img src="https://img.shields.io/github/issues-pr/XRzky/RivenBot.svg?color=37f149&style=for-the-badge" alt="Pull Request">
</a>
</p>

---

<i>Riven is a Multipurpose Discord bot that is intended to be able to perform various tasks, ranging from simple server
moderation (ban, kick, etc.) to other functions such as the ability to search, weather forecasts, and many more in 
upcoming updates. [             ](https://heroku.com/deploy?template=https://github.com/XRzky/RivenBot/tree/alpha)

this bot was made in
[Node.JS](https://nodejs.org),
using the [Discord.js](https://discord.js.org/#/) library.
</i>

---

## Features
- Search for anime on MyAnimeList.
- Search for YouTube videos.
- And many more...

## Installation
```dosini
# Clone this repository
$ git clone -b alpha https://github.com/XRzky/RivenBot.git

# Install Node dependencies
$ npm install

# Copy example.env to .env and replace it with your value
$ cp example.env .env

# Run the bot!
$ node src/index.js
```

## Configuration
You can find all the settings in the **Configuration.js** file, without filling in all the details, some features may not function as expected. Below you can find a quick summary of all the settings in the **.env** file.

```dosini
TOKEN=Input here your Discord bot token
PREFIX=Input here the prefix for your bot. To use before the command is carried out. Example: ?
OWNER=Input here your ID as the bot owner
```
