const { RichEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'avatar',
        aliases: ['av'],
        category: 'miscellaneous',
        description: 'Get a users avatar.',
        usage: '[user | mention]',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        let msg = await message.channel.send('Generating...')
        let target = message.mentions.users.first() || message.author
        
        msg.delete()

        const roleColor = message.guild.me.highestRole.hexColor
        
        let embed = new RichEmbed()
        
        .setAuthor(target.tag, target.displayAvatarURL)
        .setTitle('Avatar')
        .setColor(roleColor === "#000000" ? "#ffffff" : roleColor)
        .setImage(target.displayAvatarURL)
        .setTimestamp()

        message.channel.send(embed)
    }
}