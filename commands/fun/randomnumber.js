const { RichEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'random',
        aliases: ['rn', 'rnum'],
        category: 'fun',
        description: 'Gives a random number between 1-100',
        usage: '[random]',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        let number = Math.ceil(Math.random()*100);
        // message.channel.send(`The number is **${number}**`)
        let randembed = new RichEmbed()
        .setColor('GREEN')
        .setDescription(`Random picked number is\n**${number}**`)
        message.channel.send(randembed);
  }
}