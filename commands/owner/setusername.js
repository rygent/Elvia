const { RichEmbed } = require('discord.js');
const { Access } = require('../../utils/settings');
const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'setusername',
        aliases: [''],
        category: 'owner',
        description: 'Changes the username of the bot.',
        usage: '<username>',
        example: 'Ahri',
        accessableby: 'Owner'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if(message.author.id != Access.OWNERS) return Errors.OWNER(message);

        let nick = args.join(" ");
        if(!nick) return message.reply("Please specify a name.");

        await(bot.user.setUsername(nick));

        const roleColor = message.guild.me.highestRole.hexColor;

        let embed = new RichEmbed()
            .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
            .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
            .setDescription(`Successfully change username to ${nick}`)
            .setFooter(`ID: ${bot.user.id}`)
            .setTimestamp();
        
        let sChannel = message.guild.channels.find(c => c.name === "log-channels")
        sChannel.send(embed)
    }
}