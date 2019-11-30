const { RichEmbed } = require('discord.js')
const { purple_medium } = require('../../colours.json')

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
        
        let embed = new RichEmbed()
        
        .setAuthor(target.tag, target.displayAvatarURL)
        .setTitle('Avatar')
        .setColor(purple_medium)
        .setImage(target.displayAvatarURL)
        .setTimestamp()

        message.channel.send(embed)
    }
}