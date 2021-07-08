const Command = require('../../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['reboot'],
			description: 'If running under PM2, the bot will restart.',
			category: 'Developer',
			ownerOnly: true
		});
	}
    async run(message) {
        this.client.utils.loadCommands()
        .then(() => message.channel.send(`Reloaded all the commands!`))
        .catch(err => message.channel.send(`There was a error trying to load the commands!\n**Error:**\`\`\`xl\n${err}\n\`\`\``));
    }
    
};
