const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const moment = require('moment');
const ostb = require('os-toolbox');
const os = require('os');

module.exports = {
    config: {
        name: 'stats',
        aliases: ['specs'],
        category: 'core',
        description: 'Displays the bots current uptime!',
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

        const cpuLoad = await ostb.cpuLoad();
        const memoryUsage = await ostb.memoryUsage();

        const roleColor = message.guild.me.highestRole.hexColor;
    
        const embed = new RichEmbed()
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
        .setTitle(`${bot.user.username}'s usage information`)
        .addField('Hardware and usage information.', stripIndents`**Bot Uptime:** ${duration(bot.uptime)}
        **Host Uptime:** ${Math.round(100 * (os.uptime / 86400) / 100)} Days
        **CPU Core:** ${os.cpus().length} Cores
        **CPU Usage:** ${cpuLoad}%
        **Assigned Memory:** ${Math.round(100 * (os.totalmem / 1000000000) / 100)}GBs
        **Memory:** ${Math.round(100 * (os.freemem / 1000000000) / 100)}GBs / ${Math.round(100 * (os.totalmem / 1000000000) / 100)}GBs
        **Memory Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${memoryUsage}%
        **Operating System:** ${os.type} ${os.release} ${os.arch}`)
        .setFooter(`Last started on ${moment(bot.readyAt).format('ddd, MMMM DD, YYYY HH:mm')}`);

        message.channel.send(embed);
    }
}
