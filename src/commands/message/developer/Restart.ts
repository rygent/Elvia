import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Command.js';
import type { Message } from 'discord.js';
import { italic, underscore } from '@discordjs/formatters';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'restart',
			aliases: ['reboot'],
			description: 'Restart the bot.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	public async execute(message: Message<false>, args: string[]) {
		const replies = [
			'The bot will restart in 5 seconds.',
			`${underscore(italic('it may take a few minutes for it to boot up again'))}`
		].join('\n');

		const reply = await message.reply({ content: replies });

		setTimeout(async () => {
			if (args.includes('--force')) {
				await ((await reply.delete()) && message.delete());
				return process.exit();
			}

			await this.client.destroy();
			await this.client.login(process.env.DISCORD_TOKEN);

			return reply
				.edit({ content: 'Restart complete!' })
				.then((m) => setTimeout(async () => (await m.delete()) && message.delete(), 3e3));
		}, 5e3);
	}
}
