const { RichEmbed } = require('discord.js')
const { green_light } = require('../../colours.json')

module.exports = {
    config: {
        name: 'unmute',
        aliases: ['unm', 'speak'],
        category: 'moderation',
        description: 'Unmutes a member in the discord!',
        usage: '<@user> <reason>',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if(!message.member.hasPermission('MANAGE_ROLES') || !message.guild.owner) return message.channel.send('You dont have permission to use this command.')

        if(!message.guild.me.hasPermission(['MANAGE_ROLES', 'ADMINISTRATOR'])) return message.channel.send('I dont have permission to add roles!')
    
        let mutee = message.mentions.members.first() || message.guild.members.get(args[0])
        if(!mutee) return message.channel.send('Please supply a user to be muted!')
    
        let reason = args.slice(1).join(' ')
        if(!reason) reason = 'No reason given'
    
        let muterole = message.guild.roles.find(r => r.name === 'Muted')
        if(!muterole) return message.channel.send('There is no mute role to remove!')
    
        mutee.removeRole(muterole.id).then(() => {
            message.delete()
            mutee.send(`Hello, you have been unmuted in ${message.guild.name} for: ${reason}`).catch(err => console.log(err))
            message.channel.send(`${mutee.user.username} was unmuted!`)
        })
    
        let embed = new RichEmbed()
        .setColor(green_light)
        .setAuthor(`${message.guild.name} | Moderation logs`, message.guild.iconURL)
        .addField('Moderation:', 'Unmute')
        .addField('Unmuted:', mutee.user.username)
        .addField('Moderator:', message.author.username)
        .addField('Reason:', reason)
        .addField('Date:', message.createdAt.toLocaleString())
    
        let sChannel = message.guild.channels.find(c => c.name === 'modlogs')
        sChannel.send(embed)
    }
}