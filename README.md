<img width="160" height="160" align="left" style="float: left; margin: 0 10px 10px 0;" alt="Evora" src="https://i.imgur.com/IYZqpUi.jpg">

# Evora

[![Support](https://img.shields.io/discord/708659047057981451?color=7289da&label=discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/nW6x9EN)
[![Build](https://img.shields.io/travis/XRzky/Evora/stable?style=for-the-badge)](https://travis-ci.com/XRzky/Evora)
[![Codacy grade](https://img.shields.io/codacy/grade/f7c237153ea545059c7d0521e59def69/stable?logo=codacy&style=for-the-badge)](https://app.codacy.com/gh/XRzky/Evora/dashboard)
[![License](https://img.shields.io/github/license/XRzky/Evora?style=for-the-badge)](https://github.com/XRzky/Evora/blob/stable/LICENSE)
[![Version](https://img.shields.io/github/package-json/v/XRzky/Evora/stable?label=version&style=for-the-badge)](https://github.com/XRzky/Evora/blob/stable/package.json)
[![Issues](https://img.shields.io/github/issues/XRzky/Evora.svg?color=37f149&style=for-the-badge)](https://github.com/XRzky/Evora/issues)
[![Pull Request](https://img.shields.io/github/issues-pr/XRzky/Evora.svg?color=37f149&style=for-the-badge)](https://github.com/XRzky/Evora/pulls)

<p align="center">
  <a href="#features">Features</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#configuration">Configuration</a>
  •
  <a href="#contributing">Contributing</a>
  •
  <a href="#credits">Credits</a>
</p>

---

<i>Evora is an open source, multipurpose Discord bot that is intended to be able to perform various tasks, ranging from simple server moderation (ban, kick, etc.)
and also other functions such as the ability to search, weather forecasts, and much more.

this bot was made in
[Node.JS](https://nodejs.org),
using the [Discord.js](https://discord.js.org/#/) library.

If you liked or enjoyed this repository, feel free to leave a star ⭐ to help promote Evora!
</i>

---

## Features
* Moderation commands (ban, kick, etc.)
* General/utility commands.
* Searches commands (anime, spotify, youtube, etc.)
* Weather forecast.
* Custom prefix.
* and much more...

## Installation
```dosini
# Clone this repository
$ git clone -b stable https://github.com/XRzky/Evora.git

# Install Node dependencies
$ npm install

# Copy example.env to .env and replace it with your value
$ cp example.env .env

# Run the bot!
$ node src/index
```

## Configuration
You can find all the settings in the **Configuration.js** file, without filling in all the details,
some features may not function as expected. Below you can find a quick summary of all the settings in the **.env** file.

```dosini
TOKEN=Input here your Discord bot token
PREFIX=Input here the prefix for your bot. To use before the command is carried out. Example: ?
OWNER=Input here your ID as the bot owner
YOUTUBE_API_KEY=Input here your YouTube API. Otherwise the youtube command does not work
IMDB_API_KEY=Input here your IMDb API. Otherwise the imdb command does not work
OPEN_WEATHER_APPID=Input here your OpenWeather AppID. Otherwise the weather command does not work
SPOTIFY_CLIENT_ID=Input here your Spotify Client ID. Otherwise the spotify command does not work
SPOTIFY_CLIENT_SECRET=Input here your Spotify Client Secret. Otherwise the spotify command does not work
```

## Contributing
Want to contribute?

Evora is open-source on our GitHub repository so everyone can contribute to the growth of the bot.
Whether it is from reporting issues, requesting features, or straight-up requesting to add some new code, it can all be done on our GitHub repo!

Evora is written in Discord.js. If you want to add a feature or work on the code, feel free make a pull request. 
We review all pull requests even if we don't reply to them.

## Credits
* Made using <i>[Discord.js](https://github.com/discordjs/discord.js)</i>.
* Bot based on <i>[Discord.js-v12-Tutorials](https://github.com/MenuDocs/Discord.js-v12-Tutorials)</i> by **MenuDocs**.
* The bot moderation part is based on <i>[Amaterasu](https://github.com/t41y0u/Amaterasu)</i> by **t41y0u**.
* The bot database part is based on <i>[AtlantaBot](https://github.com/Androz2091/AtlantaBot)</i> by **Androz**.

---
<i>"Discord", "Discord App", and any associated logos are registered trademarks of Discord, inc.</i>