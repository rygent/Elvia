const { RichEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'announce',
        aliases: ['bc', 'broadcast'],
        category: 'moderation',
        description: 'Send an announcement using the bot.',
        usage: '<input>',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        message.delete();

        if (!message.member.hasPermission('MANAGE_MESSAGES'))
            return message.reply(`You don't have the required permissions to use this command.`).then(m => m.delete(5000));

        const roleColor = message.guild.me.highestRole.hexColor;

        const embed = new RichEmbed()
        .setDescription(args.join(' '))
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)

        message.channel.send(embed)
    }
}
