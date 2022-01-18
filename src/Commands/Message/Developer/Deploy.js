const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [''],
			description: 'Deploy the Slash Commands of this bot.',
			category: 'Developer',
			usage: '(guild_id)',
			ownerOnly: true
		});
	}

	async run(message, [guildId]) {
		const data = require('../../../../assets/json/InteractionData.json');

		if (guildId) {
			const guild = await this.client.guilds.cache.get(guildId);
			return message.reply({ content: `Attempting to set the Guild Slash Commands in \`${guild.name}\`...` }).then(async (m) => {
				await guild?.commands.set(data).then((slashData) => { // eslint-disable-next-line id-length
					m.edit({ content: `\`${slashData.size.formatNumber()}\` Commands (\`${slashData.map(d => d.options).flat().length}\` Subcommands) loaded for **${guild.name}**` });
				}).catch((error) => {
					this.client.logger.log({ content: error.stack, type: 'error' });
					m.edit({ content: `Could not load the Slash Commands for ${guild.name}` });
				});
			});
		} else {
			return message.reply({ content: `Attempting to set the Global Slash Commands in \`${this.client.guilds.cache.size.formatNumber()} guilds\`...` }).then(async (m) => {
				await this.client.application?.commands.set(data).then((slashData) => { // eslint-disable-next-line id-length
					m.edit({ content: `\`${slashData.size.formatNumber()}\` Commands (\`${slashData.map(d => d.options).flat().length}\` Subcommands) loaded for all possible Guilds` });
				}).catch(() => {});
			});
		}
	}

};
