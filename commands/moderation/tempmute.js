const { RichEmbed } = require('discord.js')
const { red_light } = require('../../colours.json')
const ms = require("ms")

module.exports = {
    config: {
        name: 'tempmute',
        aliases: ['tmute'],
        category: 'moderation',
        description: 'Temporarily mutes the specified user!',
        usage: '<mention> <duration> <reason>',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if(!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return message.channel.send("You dont have permission to use this command.");
        
        if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("I don't have permission to add roles!")
        
        let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!mutee) return message.channel.send("Please supply a user to be warned!");

        let reason = args.slice(2).join(" ");
        if(!reason) reason = "No reason given"
        
        let muterole = message.guild.roles.find(r => r.name === "Muted")
        if(!muterole) {
            try{
                muterole = await message.guild.createRole({
                    name: "Muted",
                    color: "#514f48",
                    permissions: []
                })
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SEND_TTS_MESSAGES: false,
                        ATTACH_FILES: false,
                        SPEAK: false
                    })
                })
            } catch(e) {
                console.log(e.stack);
            }
        }

        // let time = args.slice(2).join(" ");
        // if(!time) return message.channel.send("Please input a time while typing the command!")
        
        let mutetime = args[1];
        if(!mutetime) return message.channel.send("Please input a time while typing the command!")
        
        message.delete().catch(O_o=>{});
        
        try{
            await mutee.send(`You have been muted for ${mutetime}.`)
        }catch(e){
            message.channel.send(`${mutee.user.username} was successfully muted for ${mutetime}`)
        }
        
        let embed = new RichEmbed()
        .setColor(red_light)
        .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
        .addField("Moderation:", "Tempmute")
        .addField("User:", mutee.user.username)
        .addField("Moderator:", message.author.username)
        .addField("Reason:", reason)
        .addField("Date:", message.createdAt.toLocaleString())
        .addField("Lenght:", `${mutetime}`)
        
        let sChannel = message.guild.channels.find(c => c.name === "modlogs")
        sChannel.send(embed)
        
        await(mutee.addRole(muterole.id));
        
        setTimeout(function(){
            mutee.removeRole(muterole.id);
            message.channel.send(`${mutee.user.tag} have been unmute!`);
        }, ms(mutetime));
    }
}