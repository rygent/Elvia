const { RichEmbed } = require("discord.js");
const { Colors, Client } = require('../utils/settings');

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

    message.channel.send(embed).then(m => m.delete(20000));
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

    message.channel.send(embed).then(m => m.delete(20000));
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

    message.channel.send(embed).then(m => m.delete(20000));
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

    message.channel.send(embed).then(m => m.delete(20000));
}

module.exports.noText = (message, cmd) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle('Can\`t read that.')
        .setDescription(`💢 **${message.author.tag}** Please enter something or read on \`${Client.PREFIX}help ${cmd}\``)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(20000));
}

// module.exports.noText2 = (message, cmd) => {
//     let embed = new RichEmbed()
//         .setColor(Colors.RED)
//         .setTitle(`${res} not found.`)
//         .setDescription(`💢 **${message.author.tag}** Use \`${Client.PREFIX}help ${cmd}\` for more details`)
//         .setFooter(message.author.tag)
//         .setTimestamp();

//     if (message.author.avatarURL != null) {
//         embed.setFooter(message.author.tag, message.author.avatarURL)   
//     }

//     message.channel.send(embed).then(m => m.delete(20000));
// }

module.exports.noUser = (message, cmd) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle('Couldn\'t find a user.')
        .setDescription(`💢 **${message.author.tag}** Please mention a user to ${cmd}`)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(20000));
}

module.exports.noUser2 = (message, cmd) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle(`Cant't ${cmd}`)
        .setDescription(`💢 **${message.author.tag}** You can't ${cmd} yourself.`)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(20000));
}

module.exports.resBody = (message, res, cmd) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle(`${res} not found.`)
        .setDescription(`💢 **${message.author.tag}** Use \`${Client.PREFIX}help ${cmd}\` for more details`)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(20000));
}

module.exports.resStatus = (message, code) => {
    let embed = new RichEmbed()
        .setColor(Colors.RED)
        .setTitle(`Error code ${code}`)
        .setDescription(`💢 **${message.author.tag}** Your request cannot be found.`)
        .setFooter(message.author.tag)
        .setTimestamp();

    if (message.author.avatarURL != null) {
        embed.setFooter(message.author.tag, message.author.avatarURL)   
    }

    message.channel.send(embed).then(m => m.delete(20000));
}