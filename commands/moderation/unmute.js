const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { Colors } = require('../../utils/settings');
const Errors = require('../../utils/errors');
const moment = require('moment');

module.exports = {
    config: {
        name: 'unmute',
        aliases: ['unm', 'speak'],
        category: 'moderation',
        description: 'Unmutes the specified user!',
        usage: '<user> <reason>',
        example: '@Ryevi This account can send anything',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };
        
        if(!message.member.hasPermission(['MANAGE_ROLES' || 'ADMINISTRATOR'])) 
            return Errors.noPerms(message, 'MANAGE_ROLES');

        if(!message.guild.me.hasPermission(['MANAGE_ROLES' || 'ADMINISTRATOR'])) 
            return Errors.botPerms(message, 'MANAGE_ROLES');
    
        let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!mutee) return message.channel.send('Please supply a user to be muted!');
    
        let reason = args.slice(1).join(' ');
        if(!reason) reason = 'You must specify a reason for unmute!';
    
        let muterole = message.guild.roles.find(r => r.name === 'Muted');
        if(!muterole) return message.channel.send('There is no mute role to remove!');
    
        mutee.removeRole(muterole.id).then(() => {
            message.delete();
            mutee.send(`Hello, you have been unmuted in ${message.guild.name} for: ${reason}`).catch(err => console.log(err));
            message.channel.send(`${mutee.user.username} was unmuted!`);
        });
    
        let embed = new RichEmbed()
            .setColor(Colors.GREEN)
            .setAuthor('Unmuted Member', mutee.user.displayAvatarURL)
            .setDescription(stripIndents`**Unmuted By:** ${message.author.tag} (${message.author.id})
            **Unmuted User:** ${mutee.user.tag} (${mutee.user.id})
            **Reason:** ${reason}
            **Date & Time:** ${moment(message.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`)
            .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL)
            .setTimestamp();
    
        let sChannel = message.guild.channels.find(c => c.name === 'incident-log');
        sChannel.send(embed);
    }
}