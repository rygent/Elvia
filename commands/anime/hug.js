const { RichEmbed } = require("discord.js");
const Errors = require('../../utils/errors');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    config: {
        name: 'hug',
        aliases: [''],
        category: 'anime',
        description: 'Give a hug to someone.',
        usage: '<mention>',
        example: '@hnxtasia',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        let member = message.mentions.users.array()[0];
        if (!member) return Errors.noUser(message, 'hug');
        
        else if (member === message.author) {
            return Errors.noUser2(message, 'hug');
        }
        
        neko.sfw.hug().then(hug => {
            let embed = new RichEmbed()
                .setColor(message.guild.me.displayColor)
                .setDescription(`${member} You got a hug from ${message.author.username}`)
                .setImage(hug.url)
                .setFooter('Powered by nekos.life')
                .setTimestamp();
            message.channel.send(embed);
        })
    }
}