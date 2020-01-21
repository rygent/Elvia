const { RichEmbed } = require('discord.js');
const { Access } = require('../../settings');

module.exports = {
    config: {
        name: 'setavatar',
        aliases: ['sa', 'setav'],
        category: 'owner',
        description: 'Sets the avatar of the Bots Account',
        usage: '<attachment image>',
        accessableby: 'Owner'
    },
    run: async (bot, message, args) => {
        if(message.author.id != Access.OWNERS) return message.channel.send(`You're not the bot the owner!`);

        let image = message.attachments.first().url;
        bot.user.setAvatar(image);

        const roleColor = message.guild.me.highestRole.hexColor;

        let embed = new RichEmbed()
            .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
            .setDescription(`Profile Photo Changed!\n\n **Old Profile Photo --->**\n\n**New Profile Photo**`)
            .setImage(image)
            .setThumbnail(bot.user.avatarURL)
        
        let sChannel = message.guild.channels.find(c => c.name === "log-channels")
        sChannel.send(embed)
    }
}