const { RichEmbed } = require('discord.js');
const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'setnick',
        aliases: ['nick'],
        category: 'moderation',
        description: 'Set a user or bot\'s nickname',
        usage: '<@user> <nickname>',
        example: '@Ryevi Ryu',
        accessableby: 'Moderations'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };
        
        if(!message.member.hasPermission(['MANAGE_NICKNAMES' || 'ADMINISTRATOR'])) 
            return Errors.noPerms(message, 'MANAGE_NICKNAMES');
        
        if(!message.guild.me.hasPermission(['MANAGE_NICKNAMES' || 'ADMINISTRATOR'])) 
            return Errors.botPerms(message, 'MANAGE_NICKNAMES');
        
        let nUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!nUser) return message.channel.send(`**${message.author.username}**, Please specify a user that is on this server.`);
        
        let nick = args.join(" ").slice(22);
        if(!nick) return message.reply("Please specify a name.");
        
        if(nUser.hasPermission('MANAGE_NICKNAMES')) return message.channel.send("That person can't have their name changed.");
            
        message.delete();
        
        await(nUser.setNickname(nick));

        const roleColor = message.guild.me.highestRole.hexColor;

        let nembed = new RichEmbed()
            .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
            .setAuthor(nUser.user.tag, nUser.user.displayAvatarURL)
            .setDescription(`Successfully change nickname to ${nick}`)
            .setFooter(`ID: ${nUser.user.id}`)
            .setTimestamp();
        
        let sChannel = message.guild.channels.find(c => c.name === "incident-log")
        sChannel.send(nembed);
    }    
}