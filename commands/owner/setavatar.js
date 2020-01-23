const { RichEmbed } = require('discord.js');
const { Access } = require('../../settings');
const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'setavatar',
        aliases: ['sa', 'setav'],
        category: 'owner',
        description: 'Sets the avatar of the Bots Account',
        usage: '<attachment image>',
        example: 'send image',
        accessableby: 'Owner'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if(message.author.id != Access.OWNERS) return Errors.OWNER(message);

        let image = message.attachments.first().url;
        bot.user.setAvatar(image);

        const roleColor = message.guild.me.highestRole.hexColor;

        let embed = new RichEmbed()
            .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
            .setDescription(`Profile Photo Changed!`)
            .setImage(image)
        
        let sChannel = message.guild.channels.find(c => c.name === "log-channels")
        sChannel.send(embed)
    }
}