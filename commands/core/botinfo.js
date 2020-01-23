const { RichEmbed } = require('discord.js');
const { Access, Client } = require('../../settings');
const { version } = require('../../package.json');
const { stripIndents } = require("common-tags");
const ostb = require('os-toolbox');

module.exports = {
    config: {
        name: 'botinfo',
        aliases: ['stats', 'botstats'],
        category: 'core',
        description: 'Shows some information about the running instance!',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        function duration(ms) {
            const sec = Math.floor((ms / 1000) % 60).toString();
            const min = Math.floor((ms / (1000 * 60)) % 60).toString();
            const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
            const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
            return `${days.padStart(1, '0')} days, ${hrs.padStart(1, '0')} hrs, ${min.padStart(1, '0')} mins, ${sec.padStart(1, '0')} secs`;
        }

        const Owner = bot.users.get(Access.OWNERS) || await bot.fetchUser(Access.OWNERS);

        const roleColor = message.guild.me.highestRole.hexColor;

        const cpuLoad = await ostb.cpuLoad();
        const memoryUsage = await ostb.memoryUsage();

        const embed = new RichEmbed()
        .setAuthor('About me')
        .setDescription(`Hello, my name is ${message.guild.me.displayName}! I'm a bot moderation & settings discord.  If you wish to check out the commands I have please do \`${Client.PREFIX}help\`. You'll find any and all information about me below!`)
        .setThumbnail(bot.user.displayAvatarURL)
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
        .addField('General Information', stripIndents`**❯ Username:** ${bot.user.tag}
        **❯ ID:** ${bot.user.id}
        **❯ Creator:** ${Owner.tag}
        **❯ Guild Prefix:** ${Client.PREFIX}
        **❯ Status:** ${bot.user.presence.status}
        **❯ Version:** ${version}
        **❯ Language:** JavaScript (discord.js)`)
        .addField('Statistics', stripIndents`**❯ Guild Count:** ${bot.guilds.size}
        **❯ Member Count:** ${bot.users.size}
        **❯ Command Count:** ${bot.commands.size}
        **❯ Uptime:** ${duration(bot.uptime)}`)
        .addField('System', stripIndents`**❯ CPU Usage:** ${cpuLoad}%
        **❯ Memory Usage:** ${memoryUsage}%
        **❯ Heap:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
        .setFooter(`©2020 ${message.guild.me.displayName} | Powered by Heroku`, bot.user.displayAvatarURL)
        .setTimestamp();

        message.channel.send(embed);
    }
}
