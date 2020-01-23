const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { Colors } = require('../../settings');
const fs = require("fs");
const moment = require('moment');
let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));

module.exports = {
    config: {
        name: "unwarn",
        aliases: ["unw"],
        category: "moderation",
        description: "Warn a user on the discord server with a certain reason",
        usage: "<user> <reason>",
        example: '@Ryevi Don\'t repeat it',
        accessableby: "Moderators"
    },
    run: async (bot, message, args) => {
        if(!message.member.hasPermission(['MANAGE_ROLES', 'MANAGE_MESSAGES'])) 
            return message.channel.send('You do not have permission to perform this command!')
        
        let wuser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1])
        if(!wuser) return message.reply("This user was not found on this Discord server!")
        
        let reason = args.slice(1).join(" ");
        if(!reason) reason = 'You must supply a reason for the warn!'

        if(!message.guild.me.hasPermission(['MANAGE_ROLES', 'MANAGE_MESSAGES'])) 
            return message.channel.send('I dont have permission to perform this command!')
        
        warns[wuser.id].warns--;
        
        fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {
            if(err){
                console.log(err)
            }
        });
        
        wuser.send(`Hello, you have been unwarned in ${message.guild.name} for: ${reason}`)
        
        let wnrembed = new RichEmbed()
            .setColor(Colors.GREEN)
            .setAuthor('Unwarned Member', wuser.user.displayAvatarURL)
            .setDescription(stripIndents`**Unwarned By:** ${message.author.tag} (${message.author.id})
            **Unwarned User:** ${wuser.user.tag} (${wuser.user.id})
            **Reason:** ${reason}
            **Warns:** ${warns[wuser.id].warns}
            **Date & Time:** ${moment(message.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`)
            .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL)
            .setTimestamp();
        
        let sChannel = message.guild.channels.find(c => c.name === "incident-log")
        sChannel.send(wnrembed)
    }    
}