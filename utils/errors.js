const { RichEmbed } = require("discord.js");
const { Colors } = require('../utils/settings');

module.exports.OWNER = (message) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle('You\'re not Bot owners')
        .setDescription(`💢 **${message.author.tag}** Only Bot owners can use this **Commands**.`)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(30000));
}

module.exports.NSFW = (message) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle('NSFW!')
        .setDescription(`💢 **${message.author.tag}** Here it's not on the NSFW channel.`)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(30000));
}

module.exports.noPerms = (message, perm) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle('Insufficient Permission.')
        .setDescription(`💢 **${message.author.tag}** You don't have Permissions ${perm} to do that.`)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(30000));
}

module.exports.botPerms = (message, perm) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle('Insufficient Permission.')
        .setDescription(`💢 **${message.author.tag}** I don't have Permissions ${perm} to do that.`)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(30000));
}