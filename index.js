const { Client, Collection } = require('discord.js');
const bot = new Client();
const { config } = require('dotenv');

config({
    path: __dirname + '/.env'
});

['aliases', 'commands'].forEach(x => bot[x] = new Collection());
['command', 'event'].forEach(x => require(`./handlers/${x}`)(bot));

bot.login(process.env.TOKEN);
