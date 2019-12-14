const { OwnerID } = require('../../botconfig.json');

module.exports = {
    config: {
        name: 'shutdown',
        aliases: ['botstop', 'turnoff'],
        category: 'owner',
        description: 'Shuts down the bot!',
        usage: '[shutdown]',
        accessableby: 'Owner'
    },
    run: async (bot, message, args) => {
        if(message.author.id != OwnerID) return message.channel.send('You are not my owner!');

        try{
            await message.channel.send('Bot is shutting down...');
            process.exit();
        } catch(e) {
            message.channel.send(`ERROR: ${e.message}`);
        };
    }
}