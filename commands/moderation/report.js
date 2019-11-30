module.exports = {
    config: {
        name: 'report',
        category: 'moderation',
        description: 'Report a user of the guild',
        usage: '<@user> <reason>',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        message.delete()

        let target = message.mentions.members.first() || message.guild.members.get(args[0])
        if(!target) return message.channel.send('Please provide a valid user').then(m => m.delete(15000))
    
        let reason = args.slice(1).join (' ')
        if(!reason) return message.channel.send(`Please provide a reason for reporting **${target.user.tag}**`).then(m => m.delete(15000))
    
        let sChannel = message.guild.channels.find(x => x.name === 'reports')
    
        message.channel.send('Your report has been filled to the staff team. Thank you.').then(m => m.delete(15000))
        sChannel.send(`**${message.author.tag}** has reported **${target.user.tag}** for **${reason}**.`).then(async msg => {
            await msg.react('✅')
            await msg.react('❌')
        })
    }
}