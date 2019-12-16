module.exports = {
    config: {
        name: 'clear',
        aliases: ['purge', 'nuke'],
        category: 'moderation',
        description: 'Clears the chat',
        usage: '<number deleted>',
        accessableby: 'Moderators'
	},
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };
    
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.reply('You cant delete messages....').then(m => m.delete(5000))
        };

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply('Yeah.... Thats not a number? I also cant delete 0 messages by the way.').then(m => m.delete(5000))
        };

        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
            return message.reply('Sorry... I cant delete messages.').then(m => m.delete(5000))
        };

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100
        } else {
            deleteAmount = parseInt(args[0])
        };

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`I deleted \`${deleted.size}\` messages.`)).then(m => m.delete(5000))
            .catch(err => message.reply(`Something went wrong... ${err}`));
    }
}
