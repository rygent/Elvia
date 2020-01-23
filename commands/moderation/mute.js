const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { Colors } = require('../../utils/settings');
const moment = require('moment');
const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'mute',
        aliases: ['m', 'nospeak'],
        category: 'moderation',
        description: 'Mutes the specified user!!',
        usage: '<mention> <reason>',
        example: '@Ryevi Break the rules',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if(!message.member.hasPermission(['MANAGE_ROLES' || 'ADMINISTRATOR'])) 
            return Errors.noPerms(message, 'MANAGE_ROLES');

        if(!message.guild.me.hasPermission(['MANAGE_ROLES' || 'ADMINISTRATOR'])) 
            return Errors.botPerms(message, 'MANAGE_ROLES');
    
        let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!mutee) return message.channel.send('Please supply a user to be muted!');
    
        let reason = args.slice(1).join(' ');
        if(!reason) reason = 'You must specify a reason for mute!';
    
        let muterole = message.guild.roles.find(r => r.name === 'Muted');
        if(!muterole) {
            try{
                muterole = await message.guild.createRole({
                    name: 'Muted',
                    color: '#514F48',
                    permissions: []
                });
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SEND_TTS_MESSAGES: false,
                        ATTACH_FILES: false,
                        SPEAK: false
                    });
                });
            } catch(e) {
                console.log(e.stack);
            }
        };
    
        mutee.addRole(muterole.id).then(() => {
            message.delete();
            mutee.send(`Hello, you have been muted in ${message.guild.name} for: ${reason}`);
            message.channel.send(`${mutee.user.username} was successfully muted.`);
        });
    
        let embed = new RichEmbed()
            .setColor(Colors.GREY)
            .setAuthor('Muted Member', mutee.user.displayAvatarURL)
            .setDescription(stripIndents`**Muted By:** ${message.author.tag} (${message.author.id})
            **Muted User:** ${mutee.user.tag} (${mutee.user.id})
            **Reason:** ${reason}
            **Date & Time:** ${moment(message.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`)
            .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL)
            .setTimestamp();
    
        let sChannel = message.guild.channels.find(c => c.name === 'incident-log');
        sChannel.send(embed);
    }
}