import type BaseClient from '../../lib/BaseClient.js';
import Event from '../../lib/structures/Event.js';
import type { AutocompleteInteraction } from 'discord.js';
import { resolveCommandName } from '../../lib/utils/Function.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'interactionCreate',
			once: false
		});
	}

	public async run(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		if (!interaction.isAutocomplete()) return;

		const command = this.client.interactions.get(resolveCommandName(interaction));
		if (command) {
			try {
				await command.autocomplete(interaction);
			} catch (e: unknown) {
				this.client.logger.error(`${(e as Error).name}: ${(e as Error).message}`, (e as Error), true);
			}
		}
	}
}
