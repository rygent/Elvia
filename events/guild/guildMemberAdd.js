const { RichEmbed } = require("discord.js");
const { Colors } = require('../../settings');

module.exports = async (bot, member) => {
    let sChannel = member.guild.channels.find(x => x.name === 'join-leave')

    let embed = new RichEmbed()
        .setAuthor("Member Joined", member.user.displayAvatarURL)
        .setDescription(`${member} ${member.user.tag}`)
        .setThumbnail(member.user.displayAvatarURL)
        .setColor(Colors.GREEN)
        .setFooter(`ID: ${member.user.id}`)
        .setTimestamp();

    sChannel.send(embed);
}