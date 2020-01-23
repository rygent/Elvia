const { stripIndents } = require('common-tags');

module.exports = {
    config: {
        name: 'ping',
        aliases: ['pong'],
        category: 'core',
        description: 'Get the ping of the bot',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        const msg = await message.channel.send('Pinging...');
        const ping = Math.round(msg.createdTimestamp - message.createdTimestamp);
    
        if (ping <= 0) {
            return msg.edit('Please try again...');
        }
    
        return msg.edit(
            stripIndents`
            🏓 Pong: \`${ping}ms\`
            💓 Heartbeat: \`${Math.round(message.client.ping)}ms\`
            `,
        );
    }
}