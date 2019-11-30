const { RichEmbed } = require('discord.js')
const { Version } = require('../../botconfig.json')
const { purple_medium } = require('../../colours.json')
const moment = require('moment')

module.exports = {
    config: {
        name: 'info',
        aliases: ['botinfo', 'binfo'],
        category: 'information',
        description: 'Get bot information.',
        usage: '[info]',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        function duration(ms) {
            const sec = Math.floor((ms / 1000) % 60).toString()
            const min = Math.floor((ms / (1000 * 60)) % 60).toString()
            const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
            const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
            return `${days.padStart(1, '0')} days, ${hrs.padStart(1, '0')} hrs, ${min.padStart(1, '0')} mins, ${sec.padStart(1, '0')} secs`
        }

        const Owner = bot.users.get('427560082142920707') || await bot.fetchUser('427560082142920707')

        const embed = new RichEmbed()
        .setFooter(`ID: ${bot.user.id} | Uptime ${duration(bot.uptime)}`)
        .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
        .setThumbnail(bot.user.displayAvatarURL)
        .setColor(purple_medium)

        .addField('**❯ Version**', Version, true)
        .addField('**❯ Language**', 'JavaScript - Discord.Js', true)
        .addField('**❯ Creator**', Owner.tag, true)
        .addField('**❯ Registered**', `${moment(bot.user.createdAt).format('ddd, DD MMMM YYYY HH:mm UTCZ')}`, true)
        .addField('**❯ Servers**', bot.guilds.size, true)
        .addField('**❯ Users**', bot.users.size, true)

        message.channel.send(embed)
    }
}
