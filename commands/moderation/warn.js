const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { Colors } = require('../../settings');
const fs = require("fs");
const moment = require('moment');
let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));

module.exports = {
    config: {
        name: "warn",
        aliases: ["w"],
        category: "moderation",
        description: "Warn a user on the discord server with a certain reason",
        usage: "<user> <reason>",
        accessableby: "Moderators"
    },
    run: async (bot, message, args) => {
        if(!message.member.hasPermission(['MANAGE_ROLES', 'ADMINISTRATOR'])) 
            return message.channel.send('You do not have permission to perform this command!')
        
        let wuser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1])
        if(!wuser) return message.reply("This user was not found on this Discord server!")
        
        let reason = args.slice(1).join(" ");
        if(!reason) reason = 'You must supply a reason for the warn!'

        if(!message.guild.me.hasPermission(['MANAGE_ROLES', 'ADMINISTRATOR'])) 
            return message.channel.send('I dont have permission to perform this command!')
        
        if(!warns[wuser.id]) warns[wuser.id] = {
            warns: 0
        };
        
        warns[wuser.id].warns++;
        
        fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {
            if(err){
                console.log(err)
            }
        });
        if(warns[wuser.id].warns == 3){
            let muteerle = message.guild.roles.find(r => r.name === 'Muted');
            wuser.addRole(muteerle);
            wuser.send(`Hello, you have been muted in ${message.guild.name} because you have 3 warns! If you want the staff to clear the warns you need to contact them!`)
        }
        wuser.send(`Hello, you have been warned in ${message.guild.name} for: ${reason}`)
        
        let wnrembed = new RichEmbed()
            .setColor(Colors.ORANGE)
            .setAuthor('Warned Member', wuser.user.displayAvatarURL)
            .setDescription(stripIndents`**Warned By:** ${message.author.tag} (${message.author.id})
            **Warned User:** ${wuser.user.tag} (${wuser.user.id})
            **Reason:** ${reason}
            **Warns:** ${warns[wuser.id].warns}
            **Date & Time:** ${moment(message.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`)
            .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL)
            .setTimestamp();
        
        let sChannel = message.guild.channels.find(c => c.name === "incident-log")
        sChannel.send(wnrembed)
    }    
}