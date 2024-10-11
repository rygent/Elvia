import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Event } from '@/lib/structures/Event.js';
import { prisma } from '@elvia/database';

export default class extends Event {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'ready',
			once: true
		});
	}

	public async run() {
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
