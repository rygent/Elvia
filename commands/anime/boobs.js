const { RichEmbed } = require("discord.js");
const Errors = require('../../utils/errors');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    config: {
        name: 'boobs',
        aliases: [''],
        category: 'anime',
        description: 'Posts a random boobs picture. Warning this commands for 18+',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if (!message.channel.nsfw) return Errors.NSFW(message);
        
        neko.nsfw.boobs().then(boobs => {
            const embed = new RichEmbed()
                .setColor(message.guild.me.displayColor)
                .setImage(boobs.url)
                .setFooter('Powered by nekos.life')
                .setTimestamp();
            message.channel.send(embed);
        })
    }
}