import type BaseClient from '../lib/BaseClient.js';
import Event from '../lib/structures/Event.js';
import { formatNumber } from '../lib/utils/Function.js';
import { prisma } from '../lib/utils/Prisma.js';
import { redBright, underline } from 'colorette';

export default class extends Event {
	public constructor(client: BaseClient) {
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
				where: { id: guild.id },
				create: { id: guild.id },
				update: {}
			});
		}
	}
}
