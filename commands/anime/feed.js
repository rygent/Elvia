const { RichEmbed } = require("discord.js");
const Errors = require('../../utils/errors');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    config: {
        name: 'feed',
        aliases: [''],
        category: 'anime',
        description: 'Give a feed to someone.',
        usage: '<mention>',
        example: '@hnxtasia',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        let member = message.mentions.users.array()[0];
        if (!member) return Errors.noUser(message, 'feed');
        
        else if (member === message.author) {
            return Errors.noUser2(message, 'feed');
        }
        
        neko.sfw.feed().then(feed => {
            let embed = new RichEmbed()
                .setColor(message.guild.me.displayColor)
                .setDescription(`${member} You got a feed from ${message.author.username}`)
                .setImage(feed.url)
                .setFooter('Powered by nekos.life')
                .setTimestamp();
            message.channel.send(embed);
        })
    }
}