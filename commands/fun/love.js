const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { getMember } = require('../../utils/functions');

module.exports = {
    config: {
        name: 'love',
        aliases: ['affinity'],
        category: 'fun',
        description: 'Calculates the love affinity you have for another person.',
        usage: '[mention | id]',
        example: '@Ryevi',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        let person = getMember(message, args[0]);

        if (!person || message.author.id === person.id) {
            person = message.guild.members
                .filter(m => m.id !== message.author.id)
                .random();
        }

        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

        const embed = new RichEmbed()
            .setColor('#ffb6c1')
            .setTitle(`☁ **${person.displayName}** loves **${message.member.displayName}** this much:`)
            .setDescription(stripIndents`💟 ${Math.floor(love)}%
            ${loveLevel}`)

        message.channel.send(embed);
    }
}
