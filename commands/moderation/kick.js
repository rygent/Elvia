const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { Colors } = require('../../utils/settings');
const moment = require('moment');

module.exports = {
    config: {
        name: 'kick',
        aliases: ['kek'],
        category: 'moderation',
        description: 'Kick a user from the discord server with a certain reason',
        usage: '<user> <reason>',
        example: '@Ryevi Break the rules',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };
        
        if(!message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) 
            return message.channel.send('You dont have permission to perform this command!');

        let kickMember = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!kickMember) return message.channel.send('Please provide a user to kick!');
    
        let reason = args.slice(1).join(' ');
        if(!reason) reason = 'You must specify a reason for the kick!';
    
        if(!message.guild.me.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) 
            return message.channel.send('I dont have permission to perform this command!');
    
        kickMember.send(`Hello, you have been kicked from ${message.guild.name} for: ${reason}`).then(() => 
        kickMember.kick()).catch(err => console.log(err));
    
        message.channel.send(`${kickMember.user.tag} has been kicked`).then(m => m.delete(5000));
    
        let embed = new RichEmbed()
            .setColor(Colors.ORANGE)
            .setAuthor('Kicked Member', kickMember.user.displayAvatarURL)
            .setDescription(stripIndents`**Kicked By:** ${message.author.tag} (${message.author.id})
            **Kicked User:** ${kickMember.user.tag} (${kickMember.user.id})
            **Reason:** ${reason}
            **Date & Time:** ${moment(message.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`)
            .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL)
            .setTimestamp();
    
        let sChannel = message.guild.channels.find(c => c.name === 'incident-log');
        sChannel.send(embed);
    }
}