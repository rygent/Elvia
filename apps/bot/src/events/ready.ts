import { CoreEvent, type CoreClient } from '@elvia/core';
import { Events } from 'discord.js';
import { redBright, underline } from 'colorette';
import { prisma } from '@elvia/database';
import { logger } from '@elvia/logger';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: Events.ClientReady,
			once: true
		});
	}

	public async run() {
		const guilds = await this.client.guilds.fetch();
		for (const [, guild] of guilds) {
			await prisma.guild.upsert({
				where: { id: guild.id },
				create: { id: guild.id },
				update: {}
			});
		}

		logger.info(`${redBright(underline(`${this.client.user.username}`))} is ready!`);
	}
}
