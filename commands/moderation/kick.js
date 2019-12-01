const { RichEmbed } = require('discord.js')
const { red_light } = require('../../colours.json')

module.exports = {
    config: {
        name: 'kick',
        aliases: ['kek'],
        category: 'moderation',
        description: 'Kicks the mentioned user.',
        usage: '<user> <reason>',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if(!message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('You dont have permission to perform this command!')

        let kickMember = message.mentions.members.first() || message.guild.members.get(args[0])
        if(!kickMember) return message.channel.send('Please provide a user to kick!')
    
        let reason = args.slice(1).join(' ')
        if(!reason) reason = 'No reason given!'
    
        if(!message.guild.me.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('I dont have permission to perform this command!')
    
        kickMember.send(`Hello, you have been kicked from ${message.guild.name} for: ${reason}`).then(() => 
        kickMember.kick()).catch(err => console.log(err))
    
        message.channel.send(`${kickMember.user.tag} has been kicked`).then(m => m.delete(5000))
    
        let embed = new RichEmbed()
        .setColor(red_light)
        .setAuthor(`${message.guild.name} | Moderation logs`, message.guild.iconURL)
        .addField('Moderation:', 'Kick')
        .addField('Kicked:', kickMember.user.username)
        .addField('Moderator:', message.author.username)
        .addField('Reason:', reason)
        .addField('Date:', message.createdAt.toLocaleString())
    
        let sChannel = message.guild.channels.find(c => c.name === 'modlogs')
        sChannel.send(embed)
    }
}