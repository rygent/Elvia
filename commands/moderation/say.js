const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'say',
        aliases: ['talk'],
        category: 'moderation',
        description: 'Says your input via the bot',
        usage: '<channelname> <input>',
        example: '#general Hello World',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if(!message.member.hasPermission(['MANAGE_MESSAGES' || 'ADMINISTRATOR'])) 
            return Errors.noPerms(message, 'MANAGE_MESSAGES')
    
        let argsresult
        let mChannel = message.mentions.channels.first()
        if(!mChannel) return message.channel.send('Please select channel first!').then(m => m.delete(5000))
        
        message.delete()
        if(mChannel) {
            argsresult = args.slice(1).join(' ')
            mChannel.send(argsresult)
        } else {
            argsresult = args.join(' ')
            message.channel.send(argsresult)
        }
    }
}
