const { RichEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
    config: {
        name: 'server',
        aliases: ['sinfo', 'guild'],
        category: 'information',
        description: 'Get server info/stats.',
        usage: '[server]',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        const roleColor = message.guild.me.highestRole.hexColor
        
        let sEmbed = new RichEmbed()

        .setColor(roleColor === "#000000" ? "#ffffff" : roleColor)
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setThumbnail(message.guild.iconURL)
        .addField('**❯ Owner**', `${message.guild.owner.user.tag}`, true)
        .addField('**❯ Region**', `${message.guild.region.toString()}`, true)
        .addField('**❯ Categories**', `${message.guild.channels.filter(channel => channel.type == 'category').size}`, true)
        .addField('**❯ Text Channels**', `${message.guild.channels.filter(channel => channel.type == 'text').size}`, true)
        .addField('**❯ Voice Channels**', `${message.guild.channels.filter(channel => channel.type == 'voice').size}`, true)
        .addField('**❯ Members**', `${message.guild.memberCount}`, true)
        .addField('**❯ Humans**', `**${message.guild.members.filter(member => !member.user.bot).size}**`, true)
        .addField('**❯ Bots**', `**${message.guild.members.filter(member => member.user.bot).size}**`, true)
        .addField('**❯ Roles**', message.guild.roles.filter(f => f.name !== '@everyone').size, true)
        .addField('**❯ Role List**', message.guild.roles.filter(r => r.id !== message.guild.id).map(r => r).join(', '))
        .setFooter(`ID: ${message.guild.id} | Server Created • ${moment(message.guild.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`)
        
        message.channel.send({embed: sEmbed})
    }
}
