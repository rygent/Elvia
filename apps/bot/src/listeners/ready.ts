import { Client, Listener } from '@elvia/tesseract';
import { Events } from 'discord.js';
import { prisma } from '@elvia/database';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.ClientReady,
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
