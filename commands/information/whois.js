const { RichEmbed } = require('discord.js');
const { getMember } = require('../../functions.js');
const moment = require('moment');

module.exports = {
    config: {
        name: 'whois',
        aliases: ['who', 'user', 'info'],
        category: 'information',
        description: 'Get user information.',
        usage: '[mention | id]',
        example: '@Ryevi',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        const member = getMember(message, args.join(' '));

        // Member variables
        const roles = member.roles
            .sort((a, b) => b.position - a.position)
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(', ') || 'None';

        const embed = new RichEmbed()
            .setFooter(`ID: ${member.user.id}`)
            .setAuthor(member.user.tag, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('**❯ Joined**', `${moment(member.joinedAt).format('ddd, MMMM DD, YYYY HH:mm')}`, true)
            .addField('**❯ Nickname**', `${member.nickname || 'None'}`, true)
            .addField("**❯ Status**", member.user.presence.status, true)
            .addField('**❯ Registered**', `${moment(member.user.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`, true)
            .addField(`**❯ Roles [${member.roles.filter(f => f.name !== '@everyone').size}]**`, `${roles}`)
            
            .setTimestamp();

        if (member.user.presence.game) 
            embed.addField('**❯ Currently playing**', `${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}
