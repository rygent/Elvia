const { Access } = require('../../settings');
const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'setstatus',
        aliases: [''],
        category: 'owner',
        description: 'Set the bots status',
        usage: '<status>',
        example: 'idle',
        accessableby: 'Owner'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if(message.author.id !== Access.OWNERS) return Errors.OWNER(message);

        if(args == "") {
            message.channel.send(`Make sure it is either **dnd**, **online**, **idle**, **invisible**`).then(m => m.delete(30000));
        };

        if(args[0] === 'dnd') {
            bot.user.setStatus('dnd');
            message.channel.send(` Successfully changed the bots status to **Do Not Disturb**`).then(m => m.delete(30000));
        };

        if(args[0] === 'idle') {
            bot.user.setStatus('idle');
            message.channel.send(` Successfully changed the bots status to **idle**`).then(m => m.delete(30000));
        };

        if(args[0] === 'online') {
            bot.user.setStatus('online');
            message.channel.send(` Successfully changed the bots status to default -> **online**`).then(m => m.delete(30000));
        };

        if(args[0] === 'invisible') {
            bot.user.setStatus('invisible');
            message.channel.send(` Successfully changed the bots status to **invisible**`).then(m => m.delete(30000));
        };

        if(args[0] === 'offline') {
            bot.user.setStatus('invisible');
            message.channel.send(` Successfully changed the bots status to **invisible**`).then(m => m.delete(30000));
        }
    }
}