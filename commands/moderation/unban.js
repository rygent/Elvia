const { RichEmbed } = require('discord.js')
const { green_light } = require('../../colours.json')

module.exports = {
    config: {
        name: 'unban',
        aliases: ['uban'],
        category: 'moderation',
        description: 'Unbans a user from guild!',
        usage: '<@user> <reason>',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if(!message.member.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('You dont have permission to perform this command!')

        let bannedMember = await bot.fetchUser(args[0])
        if(!bannedMember) return message.channel.send('Please provide a user id to unban someone!')
    
        let reason = args.slice(1).join(' ')
        if(!reason) reason = 'No reason given!'
    
        if(!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('I dont have permission to perform this command!')
    
        message.delete()
        try {
            message.guild.unban(bannedMember, {reason: reason})
            message.channel.send(`${bannedMember.tag} has been unbanned from the guild!`)
        } catch(e) {
            console.log(e.message)
        }
    
        let embed = new RichEmbed()
        .setColor(green_light)
        .setAuthor(`${message.guild.name} | Moderation logs`, message.guild.iconURL)
        .addField('Moderation:', 'Unban')
        .addField('Moderated on:', `${bannedMember.username} (${bannedMember.id})`)
        .addField('Moderator:', message.author.username)
        .addField('Reason:', reason)
        .addField('Date:', message.createdAt.toLocaleString())
    
        let sChannel = message.guild.channels.find(c => c.name === 'modlogs')
        sChannel.send(embed)
    }
}