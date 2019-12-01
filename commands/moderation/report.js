const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { orange } = require('../../colours.json')
const moment = require('moment')

module.exports = {
    config: {
        name: 'report',
        category: 'moderation',
        description: 'Report the specified user!',
        usage: '<user | id> <reason>',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.reply("Couldn't find that person?").then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("Can't report that member").then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send("Please provide a reason for the report").then(m => m.delete(5000));
        
        const channel = message.guild.channels.find(c => c.name === "reports")
            
        if (!channel)
            return message.channel.send("Couldn't find a `#reports` channel").then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor(orange)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported member", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**❯ User:** ${rMember.user.tag} (${rMember.user.id})
            **❯ Reported by:** ${message.member.user.tag}
            **❯ Reported in:** ${message.channel}
            **❯ Reported at:** ${moment(message.createdAt).format('ddd, DD MMMM YYYY HH:mm')}
            **❯ Reason:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}