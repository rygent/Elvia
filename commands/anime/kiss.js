const { RichEmbed } = require("discord.js");
const Errors = require('../../utils/errors');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    config: {
        name: 'kiss',
        aliases: [''],
        category: 'anime',
        description: 'Give a kiss to someone.',
        usage: '<mention>',
        example: '@hnxtasia',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        let member = message.mentions.users.array()[0];
        if (!member) return Errors.noUser(message, 'kiss');
        
        else if (member === message.author) {
            return Errors.noUser2(message, 'kiss');
        }
        
        neko.sfw.kiss().then(kiss => {
            let embed = new RichEmbed()
                .setColor(message.guild.me.displayColor)
                .setDescription(`${member} You got a kiss from ${message.author.username}`)
                .setImage(kiss.url)
                .setFooter('Powered by nekos.life')
                .setTimestamp();
            message.channel.send(embed);
        })
    }
}