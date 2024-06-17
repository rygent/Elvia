import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Event } from '@/lib/structures/Event.js';
import { formatNumber } from '@/lib/utils/Functions.js';
import { prisma } from '@elvia/database';
import { redBright, underline } from 'colorette';

export default class extends Event {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'ready',
			once: true
		});
	}

	public async run() {
		this.client.logger.log(`Logged in as ${redBright(underline(`${this.client.user.tag}`))}`);
		this.client.logger.log(
			`Loaded ${formatNumber(this.client.commands.size + this.client.interactions.size)} commands & ${formatNumber(
				this.client.events.size
			)} events!`
		);

		const guilds = await this.client.guilds.fetch();
		for (const [, guild] of guilds) {
			await prisma.guild.upsert({
				where: { guildId: guild.id },
				create: { guildId: guild.id },
				update: {}
			});
		}
	}
}
