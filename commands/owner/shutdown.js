const { Access } = require('../../settings');
const Errors = require('../../utils/errors');

module.exports = {
    config: {
        name: 'shutdown',
        aliases: ['botstop', 'turnoff'],
        category: 'owner',
        description: 'Shuts down the bot!',
        usage: '',
        example: '',
        accessableby: 'Owner'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };

        if(message.author.id !== Access.OWNERS) return Errors.OWNER(message);

        try{
            await message.channel.send('Bot is shutting down...');
            process.exit(0);
        } catch(e) {
            message.channel.send(`ERROR: ${e.message}`);
        }
    }
}