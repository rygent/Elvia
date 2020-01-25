const { RichEmbed, version: discordVersion } = require('discord.js');
const { Access, Client } = require('../../utils/settings');
const { version } = require('../../package.json');
const { stripIndents } = require("common-tags");

module.exports = {
    config: {
        name: 'info',
        aliases: ['botinfo'],
        category: 'core',
        description: 'Shows some information about the running instance!',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        const Owner = bot.users.get(Access.OWNERS) || await bot.fetchUser(Access.OWNERS);

        const roleColor = message.guild.me.highestRole.hexColor;

        const embed = new RichEmbed()
        .setTitle(`__Information About ${bot.user.username} __`)
        .setDescription(`Hiya, I'm ${bot.user.username}... I'll be your server assistant & multipurpose bot!\nYou can use \`${Client.PREFIX}help\` to get all my commands.`)
        .setThumbnail(bot.user.displayAvatarURL)
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
        .addField('General Information', stripIndents`**❯ Username:** ${bot.user.tag}
        **❯ ID:** ${bot.user.id}
        **❯ Creator:** ${Owner.tag}
        **❯ Status:** ${bot.user.presence.status}
        **❯ Version:** v${version}
        **❯ Node:** [${process.version}](https://nodejs.org/)
        **❯ Library:** [Discord.js v${discordVersion}](https://discord.js.org/)
        **❯ Discord Join Date:** ${bot.user.createdAt}`)
        .addField('Statistics', stripIndents`**❯ Guild Count:** ${bot.guilds.size}
        **❯ Member Count:** ${bot.users.size}
        **❯ Channels Count:** ${bot.channels.size}
        **❯ Command Count:** ${bot.commands.size}`)
        .setFooter(`©2020 ${message.guild.me.displayName} | Powered by Heroku`, bot.user.displayAvatarURL)
        .setTimestamp();

        message.channel.send(embed);
    }
}
