const { RichEmbed } = require('discord.js')
const { gold } = require('../../colours.json')

module.exports = {
    config: {
        name: 'poll',
        aliases: ['p', 'question'],
        category: 'moderation',
        description: 'Allows people to make polls',
        usage: '<question>',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if(!message.member.hasPermission(['ADD_REACTIONS', 'ADMINISTRATOR'])) return message.channel.send('⛔ *You cannot execute that command due to invaild permissions.*')
        
        if(!message.guild.me.hasPermission(['ADD_REACTIONS', 'ADMINISTRATOR'])) return message.channel.send('⛔ *I cannot execute the command due to invaild permissions.*')
        
        let pollQuestion = args.slice(0).join(' ')
        if(!pollQuestion) return message.channel.send('You need a question to ask.')
        
        message.delete()
        
        let newPollEmbed = new RichEmbed()
        .setColor(gold)
        .setAuthor(`${message.author.tag}'s Poll.`, message.author.displayAvatarURL)
        .setDescription(`**POLL:** ${pollQuestion}`)
        .setTimestamp()
        
        message.channel.send({embed: newPollEmbed})
        .then(message => {
            message.react('🤷')
            message.react('❌')
            message.react('✅')
        })
    }    
}