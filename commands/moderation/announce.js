const { RichEmbed } = require('discord.js');
const { Client } = require('../../settings');
const { Colors } = require('../../settings');

module.exports = {
    config: {
        name: 'announce',
        aliases: ['bc', 'broadcast'],
        category: 'moderation',
        description: 'Send an announcement using the bot.',
        usage: '<title> | <description> | <channelname>',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if(!message.member.hasPermission(['MANAGE_MESSAGES', 'ADMINISTRATOR'])) 
            return message.channel.send('You dont have the required permissions to use this command.').then(m => m.delete(5000));

        if (!args.length) return message.channel.send(
            new RichEmbed().setTitle("Attention!").setColor(Colors.ORANGE).setDescription("You must include a valid title and description").setFooter(message.author.tag, message.author.displayAvatarURL)
        );

        const roleColor = message.guild.me.highestRole.hexColor;
    
        const data = args.join(" ").split(/(\||;)/).map(i => i.trim());
        const m = await message.channel.send("Proccessing...");
    
        const title = data[0];
        const desc = data[2];
        const annchannel = message.guild.channels.find(channel => channel.name === data[4]);
        if (!title || !desc || !annchannel) return m.edit(new RichEmbed().setTitle("Attention!").setColor(Colors.ORANGE).setDescription(`Incorrect usage. Run \`${Client.PREFIX}help announce\` for usage.`).setFooter(message.author.tag, message.author.displayAvatarURL));
    
        const ann = new RichEmbed()
            .setTitle(title)
            .setDescription(desc)
            .setColor(roleColor === '#000000' ? '#ffffff' : roleColor);
    
        const done = new RichEmbed()
            .setTitle("Attention!")
            .setDescription("Your message has successfully been announced!")
            .setColor(Colors.GREEN)
            .setFooter(message.author.tag, message.author.displayAvatarURL)
            .setTimestamp();
    
        annchannel.send(ann);
        m.edit(done);
    }
}
