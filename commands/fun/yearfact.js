const { RichEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'yearfact',
        aliases: [''],
        category: 'fun',
        description: 'Gives a random Year Fact.',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        require("request")("http://numbersapi.com/random/year?json",
        function(err, res, body) {
            const data = JSON.parse(body);
            const fact = new RichEmbed()
                .setColor(message.guild.me.displayColor)
                .setTitle(`Year Fact #${data.number}`)
                .setURL('http://numbersapi.com/random/year?json')
                .setDescription(data.text || 'None')
                .setFooter('Powered by numbersapi.com')
                .setTimestamp();
            message.channel.send(fact);
        });
    }
}