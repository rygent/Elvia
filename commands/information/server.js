const { RichEmbed } = require('discord.js');
const moment = require('moment');

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
        let region = {
            "brazil": ":flag_br: Brazil",
            "europe": ":flag_eu: Europe",
            "hongkong": ":flag_hk: Hong Kong",
            "india": ":flag_in: India",
            "japan": ":flag_jp: Japan",
            "russia": ":flag_ru: Russia",
            "singapore": ":flag_sg: Singapore",
            "southafrica": ":flag_za: South Africa",
            "sydney": ":flag_au: Sydney",
            "us-central": ":flag_us: U.S. Central",
            "us-east": ":flag_us: U.S. East",
            "us-south": ":flag_us: U.S. South",
            "us-west": ":flag_us: U.S. West"
        };
        
        const roleColor = message.guild.me.highestRole.hexColor;

        const online = message.guild.members.filter(member => member.user.presence.status == 'online').size;
        const voicecount = message.guild.channels.filter(channel => channel.type == 'voice').size;
        const textcount = message.guild.channels.filter(channel => channel.type == 'text').size;
        
        let sEmbed = new RichEmbed()
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setThumbnail(message.guild.iconURL)
        .addField('Users (Online/Unique)', `${online}/${message.guild.memberCount}`, true)
        .addField('Creation Date', `${moment(message.guild.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`, true)
        .addField('Voice/Text Channels', `${voicecount}/${textcount}`, true)
        .addField('Owner', `${message.guild.owner.user.tag}`, true)
        .addField('Region', `${region[message.guild.region]}`, true)
        .addField(`Roles [${message.guild.roles.filter(f => f.name !== '@everyone').size}]`, message.guild.roles.sort((a, b) => b.position - a.position).map(r => r).filter(f => f.name !== '@everyone').join(", "))
        .setFooter(`ID: ${message.guild.id}`)
        .setTimestamp();
        
        message.channel.send({embed: sEmbed});
    }
}
