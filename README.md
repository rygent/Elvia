<h1 align="center">
  Riven Discord Bot
</h1>

<div align="center">
<a href="https://discord.gg/nW6x9EN">
    <img src="https://img.shields.io/discord/708659047057981451?color=7289da&label=discord&logo=discord&logoColor=white&style=for-the-badge" alt="Support">
</a>
<a href="https://travis-ci.com/XRzky/RivenBot">
    <img src="https://img.shields.io/travis/XRzky/RivenBot/stable?style=for-the-badge" alt="Build">
</a>
<a>
    <img src="https://img.shields.io/github/languages/top/XRzky/RivenBot?color=f0db4f&style=for-the-badge" alt="Languages">
</a>
<a href="https://github.com/XRzky/RivenBot/blob/stable/LICENSE">
    <img src="https://img.shields.io/github/license/XRzky/RivenBot?color=blue&style=for-the-badge" alt="License">
</a>
<br>
<a href="https://github.com/XRzky/RivenBot/blob/stable/package.json">
    <img src="https://img.shields.io/github/package-json/v/XRzky/RivenBot/stable?color=orange&label=version&logoColor=white&style=for-the-badge" alt="Version">
</a>
<a href="https://github.com/XRzky/RivenBot/issues">
    <img src="https://img.shields.io/github/issues/XRzky/RivenBot.svg?color=37f149&style=for-the-badge" alt="Issues">
</a>
<a href="https://github.com/XRzky/RivenBot/pulls">
    <img src="https://img.shields.io/github/issues-pr/XRzky/RivenBot.svg?color=37f149&style=for-the-badge" alt="Pull Request">
</a>
<a>
    <img src="http://img.shields.io/badge/Built%20with-❤-e31b23?&style=for-the-badge" alt="Support">
</a>
</div>

<p align="center">
  <a href="#features">Features</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#configuration">Configuration</a>
  •
  <a href="#credits">Credits</a>
</p>

---

<i>Riven is an open source, multipurpose Discord bot that is intended to be able to perform various tasks, ranging from simple server moderation (ban, kick, etc.)
and also other functions such as the ability to search, weather forecasts, and much more. 
You can invite her to your Discord server using [this](https://discordapp.com/oauth2/authorize?client_id=614645495779819551&scope=bot&permissions=268528727) link!
Also, join the official [Riven Support Server](https://discord.gg/nW6x9EN) for all questions, suggestions, and assistance!

this bot was made in
[Node.JS](https://nodejs.org),
using the [Discord.js](https://discord.js.org/#/) library.

If you liked or enjoyed this repository, feel free to leave a star ⭐ to help promote Riven!
</i>

---

## Features
* Moderation commands (ban, kick, etc.).
* General/utility commands.
* Search for anime on MyAnimeList.
* Search for YouTube videos.
* Weather forecast.
* and much more...

## Installation
```dosini
# Clone this repository
$ git clone -b stable https://github.com/XRzky/RivenBot.git

# Install Node dependencies
$ yarn install

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

## Credits
* **MenuDocs** - <i>[Discord.js-v12-Tutorials](https://github.com/MenuDocs/Discord.js-v12-Tutorials)</i>
* **An Idiot's Guide** - <i>[discordjs-bot-guide](https://github.com/AnIdiotsGuide/discordjs-bot-guide)</i>
* **t41y0u** - <i>[Amaterasu](https://github.com/t41y0u/Amaterasu)</i>
* **Tenpi** - <i>[Kisaragi](https://github.com/Tenpi/Kisaragi)</i>
* **Androz** - <i>[AtlantaBot](https://github.com/Androz2091/AtlantaBot)</i>