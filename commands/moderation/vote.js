const { RichEmbed } = require('discord.js');
const { Colors } = require('../../utils/settings');
const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'vote',
        aliases: ['v', 'question'],
        category: 'moderation',
        description: 'Allows people to make votes',
        usage: '<question>',
        example: 'Create new feature',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if(!message.member.hasPermission('ADD_REACTIONS')) 
            return Errors.noPerms(message, 'ADD_REACTIONS');
        
        if(!message.guild.me.hasPermission('ADD_REACTIONS')) 
            return Errors.botPerms(message, 'ADD_REACTIONS');
        
        let pollQuestion = args.slice(0).join(' ');
        if(!pollQuestion) return message.channel.send('You need a question to ask.');
        
        message.delete();
        
        let newPollEmbed = new RichEmbed()
            .setColor(Colors.GOLD)
            .setAuthor(`${message.author.tag}'s Poll.`, message.author.displayAvatarURL)
            .setDescription(`${pollQuestion}`)
            .setFooter('React to vote')
            .setTimestamp();
        
        message.channel.send({embed: newPollEmbed})
        .then(message => {
            message.react('✅')
            message.react('❌')
            message.react('🤷');
        });
    }    
}