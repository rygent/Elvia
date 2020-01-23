const { RichEmbed } = require('discord.js');
const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'embed',
        aliases: [''],
        category: 'moderation',
        description: 'Creates an embed for you with any text.',
        usage: '<text>',
        example: 'Hello World',
        accessableby: 'Moderations'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if (!message.member.hasPermission(['MANAGE_MESSAGES' || 'ADMINISTRATOR']))
            return Errors.noPerms(message, 'MANAGE_MESSAGES');

        const input = args.slice();
        if (!input || input.length === 0) 
            return message.reply('You forgot to enter what you would like to include in your embed').then(m => m.delete(5000));
        
        if(!message.guild.me.hasPermission(['MANAGE_MESSAGES' || 'ADMINISTRATOR'])) 
            return Errors.botPerms(message, 'MANAGE_MESSAGES');

        const roleColor = message.guild.me.highestRole.hexColor;
        
        const embedinput = input.join(' ');
        const embed = new RichEmbed()
        .setDescription(embedinput)
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor);
        
        message.channel.send(embed);
    }
}