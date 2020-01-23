const { RichEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'datefact',
        aliases: [''],
        category: 'fun',
        description: 'Gives a random Date Fact.',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        require("request")("http://numbersapi.com/random/date?json",
        function(err, res, body) {
            const data = JSON.parse(body);
            const fact = new RichEmbed()
                .setColor(message.guild.me.displayColor)
                .setTitle(`Date Fact #${data.number}`)
                .setURL('http://numbersapi.com/random/math?json')
                .setDescription(data.text || 'None')
                .setFooter('Powered by numbersapi.com')
                .setTimestamp();
            message.channel.send(fact);
        });
    }
}