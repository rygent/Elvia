const { RichEmbed } = require("discord.js");
const client = require('nekos.life');
const neko = new client();

module.exports = {
    config: {
        name: 'foxgirl',
        aliases: [''],
        category: 'anime',
        description: 'Posts a random foxgirl picture..',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        neko.sfw.foxGirl().then(foxGirl => {
            let embed = new RichEmbed()
                .setColor(message.guild.me.displayColor)
                .setImage(foxGirl.url)
                .setFooter('Powered by nekos.life')
                .setTimestamp();
            message.channel.send(embed);
        })
    }
}