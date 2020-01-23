const { RichEmbed } = require('discord.js');
const replies = require('../../assets/json/8ball');

module.exports = {
    config: {
        name: '8ball',
        aliases: ['8b'],
        category: 'fun',
        description: 'Retrieves an answer from the almighty 8ball.',
        usage: '<question>',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (!args[1]) return message.reply('Plase ask a full question!');
        
        let result = Math.floor(Math.random() * replies.length);
        let question = args.slice(0).join(' ');

        const roleColor = message.guild.me.highestRole.hexColor;
        
        let ballembed = new RichEmbed()
        .setAuthor(message.author.tag)
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
        .addField('Question', question)
        .addField('Answer', replies[result]);
        
        message.channel.send(ballembed);
    }
}