const { RichEmbed } = require('discord.js');
const { Access, Colors } = require('../../utils/settings');
const Errors = require('../../utils/Errors');

module.exports = {
    config: {
        name: 'feedback',
        aliases: [],
        category: 'core',
        description: 'Allows the user to provide feedback about the bot.',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args, suffix) => {
        if (args.length < 1) return Errors.noText(message, 'feedback')

        let f1 = new RichEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle('Feedback Sent')
            .setDescription(`**${message.author.tag}** Your feedback has been received! The developer will get back to you as soon as possible.`)
            .setFooter(`${bot.user.tag}`, bot.user.avatarURL)
            .setTimestamp();
        message.channel.send(f1).then(m => m.delete(20000));
        
        let owner = bot.users.get(Access.OWNERS);

        let f = new RichEmbed()
            .setColor(Colors.BLUE)
            .setAuthor(`${message.author.username} (${message.author.id})`, message.author.avatarURL)
            .setTitle('Feedback Recieved')
            .setDescription(`**${message.author.tag}** ${suffix}`)
            .setFooter(`${bot.user.tag}`, bot.user.avatarURL)
            .setTimestamp();
        owner.send(f);
    }
}