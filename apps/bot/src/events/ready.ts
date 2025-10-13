import { CoreEvent, type CoreClient } from '@elvia/core';
import { Events } from 'discord.js';
import { isExtendedSettings } from '@/lib/settings.js';
import { prisma } from '@elvia/database';
import { logger } from '@elvia/logger';
import { redBright, underline } from 'colorette';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: Events.ClientReady,
			once: true
		});
	}

	public async run() {
		if (isExtendedSettings(this.client.settings) && this.client.settings.presence) {
			this.client.user.setPresence(this.client.settings.presence);
		}

		const guilds = await this.client.guilds.fetch();
		for (const guildId of guilds.keys()) {
			const exists = await prisma.guild.findUnique({ where: { id: guildId } });
			if (exists) continue;

			await prisma.guild.create({ data: { id: guildId } });
		}

		logger.info(`${redBright(underline(`${this.client.user.username}`))} is ready!`);
	}
}
