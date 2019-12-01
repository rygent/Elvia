const { RichEmbed } = require('discord.js')
const { red_light } = require('../../colours.json')

module.exports = {
    config: {
        name: 'mute',
        aliases: ['m', 'nospeak'],
        category: 'moderation',
        description: 'Mutes the specified user!!',
        usage: '<mention> <reason>',
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
        if(!muterole) {
            try{
                muterole = await message.guild.createRole({
                    name: 'Muted',
                    color: '#514F48',
                    permissions: []
                })
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SEND_TTS_MESSAGES: false,
                        ATTACH_FILES: false,
                        SPEAK: false
                    })
                })
            } catch(e) {
                console.log(e.stack)
            }
        }
    
        mutee.addRole(muterole.id).then(() => {
            message.delete()
            mutee.send(`Hello, you have been muted in ${message.guild.name} for: ${reason}`)
            message.channel.send(`${mutee.user.username} was successfully muted.`)
        })
    
        let embed = new RichEmbed()
        .setColor(red_light)
        .setAuthor(`${message.guild.name} | Moderation logs`, message.guild.iconURL)
        .addField('Moderation:', 'Mute')
        .addField('Muted:', mutee.user.username)
        .addField('Moderator:', message.author.username)
        .addField('Reason:', reason)
        .addField('Date:', message.createdAt.toLocaleString())
    
        let sChannel = message.guild.channels.find(c => c.name === 'modlogs')
        sChannel.send(embed)
    }
}