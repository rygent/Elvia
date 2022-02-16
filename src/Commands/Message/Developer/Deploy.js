const Command = require('../../../Structures/Command');
const ChatInput = require('../../../Utils/ChatInputInteraction');
const ContextMenu = require('../../../Utils/ContextMenuInteraction');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Deploy the Slash Commands of this bot.',
			category: 'Developer',
			usage: '(guildId)',
			ownerOnly: true
		});
	}

	async run(message, [guildId]) {
		const InteractionData = [...ChatInput, ...ContextMenu];

		if (guildId) {
			const guild = await this.client.guilds.cache.get(guildId);
			return message.reply({ content: `Attempting to set the Guild Slash Commands in \`${guild.name}\`...` }).then(async (m) => {
				await guild?.commands.set(InteractionData).then(data => {
					m.edit({ content: `\`${data.size.toLocaleString()}\` Commands (\`${data.map(i => i.options).flat().length.toLocaleString()}\` Subcommands) loaded for **${guild.name}**` });
				}).catch(error => {
					this.client.logger.log({ content: error.stack, type: 'error' });
					m.edit({ content: `Could not load the Slash Commands for ${guild.name}` });
				});
			});
		} else {
			return message.reply({ content: `Attempting to set the Global Slash Commands in \`${this.client.guilds.cache.size.toLocaleString()} guilds\`...` }).then(async (m) => {
				await this.client.application?.commands.set(InteractionData).then(data => {
					m.edit({ content: `\`${data.size.toLocaleString()}\` Commands (\`${data.map(i => i.options).flat().length.toLocaleString()}\` Subcommands) loaded for all possible Guilds` });
				}).catch(() => {});
			});
		}
	}

};
