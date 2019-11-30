const { RichEmbed } = require('discord.js')
const { purple_medium } = require('../../colours.json')
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
        let sEmbed = new RichEmbed()

        .setColor(purple_medium)
        .setThumbnail(message.guild.iconURL)
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField('**❯ Owner**', `${message.guild.owner.user.tag}`, true)
        .addField('**❯ Region**', `${message.guild.region.toString()}`, true)
        .addField('**❯ Channel**', `${message.guild.channels.filter(channel => channel.type !== 'category').size}`, true)
        .addField('**❯ Member**', `${message.guild.memberCount}`, true)
        .addField('**❯ Roles**', message.guild.roles.size)
        .setFooter(`ID: ${message.guild.id} | Server Created | ${moment(message.guild.createdAt).format('ddd, DD MMMM YYYY HH:mm UTCZ')}`)
        
        message.channel.send({embed: sEmbed})
    }
}
