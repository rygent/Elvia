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
        .setThumbnail(message.guild.iconURL)
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField('**❯ Owner**', `${message.guild.owner.user.tag}`, true)
        .addField('**❯ Region**', `${message.guild.region.toString()}`, true)
        .addField('**❯ Channel**', `${message.guild.channels.filter(channel => channel.type !== 'category').size}`, true)
        .addField('**❯ Member**', `${message.guild.memberCount}`, true)
        .addField('**❯ Roles**', message.guild.roles.size)
        .setFooter(`ID: ${message.guild.id} | Server Created | ${moment(message.guild.createdAt).format('ddd, DD MMMM YYYY HH:mm')}`)
        
        message.channel.send({embed: sEmbed})
    }
}
