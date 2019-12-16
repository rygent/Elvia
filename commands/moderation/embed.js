const { RichEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'embed',
        aliases: [''],
        category: 'moderation',
        description: 'Creates an embed for you with any text.',
        usage: '<text>',
        accessableby: 'Moderations'
    },
    run: async (bot, message, args) => {
        message.delete();

        if (!message.member.hasPermission('MANAGE_MESSAGES'))
            return message.reply(`You don't have the required permissions to use this command.`).then(m => m.delete(5000));

        const input = args.slice();
        if (!input || input.length === 0) 
            return message.reply('You forgot to enter what you would like to include in your embed').then(m => m.delete(5000));

        const roleColor = message.guild.me.highestRole.hexColor;
        
        const embedinput = input.join(' ');
        const embed = new RichEmbed()
        .setDescription(embedinput)
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor);
        
        message.channel.send({
            embed
        });
    }
}